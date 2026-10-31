import { query } from '../../db/pool.js';
import { httpError } from '../../utils/httpError.js';
import { notifyAudience, parsePositiveId } from './common.js';

const MEDIA_TABLES = {
  idea: 'innovation_idea_attachments',
  project: 'innovation_project_media',
};

async function count(sql, params = []) {
  const { rows } = await query(sql, params);
  return Number(rows[0]?.total || 0);
}

function ideaScope(user) {
  if (user.role === 'student') {
    return { where: 'WHERE i.submitted_by = ?', params: [user.id] };
  }
  if (user.role === 'faculty') {
    return { where: 'WHERE i.mentor_id = ?', params: [user.id] };
  }
  return { where: '', params: [] };
}

export async function dashboard(req, res) {
  const { user } = req;
  const isAdmin = user.role === 'admin';
  const isStudent = user.role === 'student';
  const scope = ideaScope(user);

  const counts = {
    ideas: isAdmin
      ? count('SELECT COUNT(*) AS total FROM innovation_ideas')
      : count(
        isStudent
          ? 'SELECT COUNT(*) AS total FROM innovation_ideas WHERE submitted_by = ?'
          : 'SELECT COUNT(*) AS total FROM innovation_ideas WHERE mentor_id = ?',
        [user.id],
      ),
    approved_ideas: isAdmin
      ? count("SELECT COUNT(*) AS total FROM innovation_ideas WHERE status IN ('approved', 'prototype_development', 'completed')")
      : count(
        `SELECT COUNT(*) AS total FROM innovation_ideas
         WHERE status IN ('approved', 'prototype_development', 'completed')
           AND ${isStudent ? 'submitted_by' : 'mentor_id'} = ?`,
        [user.id],
      ),
    projects: isAdmin
      ? count('SELECT COUNT(*) AS total FROM innovation_projects')
      : count(
        `SELECT COUNT(*) AS total FROM innovation_projects
         WHERE ${isStudent ? 'owner_id' : 'mentor_id'} = ?`,
        [user.id],
      ),
    active_projects: isAdmin
      ? count("SELECT COUNT(*) AS total FROM innovation_projects WHERE status NOT IN ('completed', 'on_hold')")
      : count(
        `SELECT COUNT(*) AS total FROM innovation_projects
         WHERE status NOT IN ('completed', 'on_hold')
           AND ${isStudent ? 'owner_id' : 'mentor_id'} = ?`,
        [user.id],
      ),
    startups: isAdmin
      ? count('SELECT COUNT(*) AS total FROM innovation_startups')
      : count(
        isStudent
          ? 'SELECT COUNT(*) AS total FROM innovation_startups WHERE founder_id = ?'
          : "SELECT COUNT(*) AS total FROM innovation_startups WHERE application_status = 'approved'",
        isStudent ? [user.id] : [],
      ),
    approved_startups: count("SELECT COUNT(*) AS total FROM innovation_startups WHERE application_status = 'approved'"),
    upcoming_events: count(
      "SELECT COUNT(*) AS total FROM innovation_events WHERE event_date >= CURDATE() AND status <> 'cancelled'",
    ),
    pending_mentor_requests: isAdmin
      ? count("SELECT COUNT(*) AS total FROM innovation_mentor_requests WHERE status = 'pending'")
      : count(
        `SELECT COUNT(*) AS total FROM innovation_mentor_requests
         WHERE status = 'pending' AND ${isStudent ? 'student_id' : 'mentor_id'} = ?`,
        [user.id],
      ),
    pending_lab_bookings: count(
      `SELECT COUNT(*) AS total FROM innovation_lab_bookings
       WHERE status = 'pending' ${isAdmin ? '' : 'AND user_id = ?'}`,
      isAdmin ? [] : [user.id],
    ),
    mentors: count(
      'SELECT COUNT(*) AS total FROM innovation_mentor_profiles mp JOIN users u ON u.id = mp.user_id WHERE u.is_active = 1',
    ),
    research: count('SELECT COUNT(*) AS total FROM innovation_research_records'),
    patents: count('SELECT COUNT(*) AS total FROM innovation_patents'),
    unread_notifications: count(
      'SELECT COUNT(*) AS total FROM innovation_notifications WHERE user_id = ? AND is_read = 0',
      [user.id],
    ),
  };

  const [recentIdeas, upcomingEvents, breakdown, notifications] = await Promise.all([
    query(
      `SELECT i.id, i.title, i.category, i.status, i.created_at, i.updated_at,
              d.code AS department_code, u.name AS owner_name,
              (SELECT COUNT(*) FROM innovation_idea_attachments a WHERE a.idea_id = i.id) AS attachment_count
       FROM innovation_ideas i
       JOIN users u ON u.id = i.submitted_by
       LEFT JOIN departments d ON d.id = i.department_id
       ${scope.where}
       ORDER BY i.updated_at DESC
       LIMIT 5`,
      scope.params,
    ),
    query(
      `SELECT e.id, e.title, e.type, e.event_date, e.venue, e.status,
              (SELECT COUNT(*) FROM innovation_event_registrations r
               WHERE r.event_id = e.id AND r.status IN ('registered', 'attended')) AS registration_count
       FROM innovation_events e
       WHERE e.event_date >= CURDATE() AND e.status <> 'cancelled'
       ORDER BY e.event_date ASC
       LIMIT 4`,
    ),
    query(
      `SELECT i.status, COUNT(*) AS total
       FROM innovation_ideas i
       ${scope.where}
       GROUP BY i.status`,
      scope.params,
    ),
    query(
      `SELECT id, title, message, type, link, is_read, created_at
       FROM innovation_notifications
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT 5`,
      [user.id],
    ),
  ]);

  const statEntries = [];
  for (const [key, value] of Object.entries(counts)) {
    statEntries.push([key, await value]);
  }
  const stats = Object.fromEntries(statEntries);

  const statusBreakdown = Object.fromEntries(
    breakdown.rows.map((row) => [row.status, Number(row.total)]),
  );

  return res.json({
    stats,
    recent_ideas: recentIdeas.rows,
    upcoming_events: upcomingEvents.rows,
    status_breakdown: statusBreakdown,
    notifications: notifications.rows,
  });
}

export async function notifications(req, res) {
  const { rows } = await query(
    `SELECT id, title, message, type, link, is_read, created_at
     FROM innovation_notifications
     WHERE user_id = ?
     ORDER BY created_at DESC
     LIMIT 50`,
    [req.user.id],
  );
  return res.json({ notifications: rows });
}

export async function markNotificationRead(req, res) {
  const id = parsePositiveId(req.params.id, 'notification id');
  const { rowCount } = await query(
    'UPDATE innovation_notifications SET is_read = 1 WHERE id = ? AND user_id = ?',
    [id, req.user.id],
  );
  if (!rowCount) throw httpError(404, 'Notification not found');
  return res.json({ message: 'Notification marked as read' });
}

export async function markAllNotificationsRead(req, res) {
  await query(
    'UPDATE innovation_notifications SET is_read = 1 WHERE user_id = ? AND is_read = 0',
    [req.user.id],
  );
  return res.json({ message: 'All notifications marked as read' });
}

export async function broadcastNotification(req, res) {
  const { audience = 'all', title, message } = req.body;
  await notifyAudience(null, audience, {
    title,
    message,
    type: 'system',
    link: '/innovation/portal',
  });
  return res.status(201).json({ message: 'Notification sent' });
}

export async function media(req, res) {
  const kind = req.params.kind;
  const table = MEDIA_TABLES[kind];
  if (!table) throw httpError(400, 'Invalid media type');

  const id = parsePositiveId(req.params.id, 'media id');
  const { rows } = await query(
    `SELECT kind, file_name, mime, data FROM ${table} WHERE id = ?`,
    [id],
  );
  const file = rows[0];
  if (!file) throw httpError(404, 'File not found');

  const buffer = Buffer.isBuffer(file.data) ? file.data : Buffer.from(file.data);
  const safeName = String(file.file_name || 'attachment').replace(/["\r\n]/g, '_');
  res.set({
    'Content-Type': file.mime,
    'Content-Length': buffer.length,
    'Cache-Control': 'public, max-age=86400',
    'X-Content-Type-Options': 'nosniff',
    'Content-Disposition': `${file.kind === 'image' ? 'inline' : 'attachment'}; filename="${safeName}"`,
  });
  return res.send(buffer);
}

export async function publicShowcase(_req, res) {
  const [projects, startups, events, mentors] = await Promise.all([
    query(
      `SELECT p.id, p.title, p.description, p.technology, p.status, p.progress, p.is_featured,
              p.created_at, d.code AS department_code, u.name AS owner_name,
              (SELECT COUNT(*) FROM innovation_project_media m WHERE m.project_id = p.id AND m.kind = 'image') AS image_count,
              (SELECT m.id FROM innovation_project_media m
                WHERE m.project_id = p.id AND m.kind = 'image'
                ORDER BY m.id ASC LIMIT 1) AS cover_media_id
       FROM innovation_projects p
       JOIN users u ON u.id = p.owner_id
       LEFT JOIN departments d ON d.id = p.department_id
       ORDER BY p.is_featured DESC, p.created_at DESC
       LIMIT 12`,
    ),
    query(
      `SELECT id, name, tagline, stage, funding_required, created_at
       FROM innovation_startups
       WHERE application_status = 'approved'
       ORDER BY created_at DESC
       LIMIT 8`,
    ),
    query(
      `SELECT id, title, type, description, event_date, venue, status
       FROM innovation_events
       WHERE event_date >= CURDATE() AND status <> 'cancelled'
       ORDER BY event_date ASC
       LIMIT 6`,
    ),
    query(
      `SELECT COUNT(*) AS total
       FROM innovation_mentor_profiles mp
       JOIN users u ON u.id = mp.user_id
       WHERE u.is_active = 1 AND mp.is_available = 1`,
    ),
  ]);

  return res.json({
    projects: projects.rows,
    startups: startups.rows,
    events: events.rows,
    mentor_count: Number(mentors.rows[0]?.total || 0),
  });
}
