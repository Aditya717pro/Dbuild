import { query, withTransaction } from '../../db/pool.js';
import { writeAudit } from '../../utils/audit.js';
import { httpError } from '../../utils/httpError.js';
import {
  isAdmin,
  normalizeDateTime,
  notify,
  parsePositiveId,
} from './common.js';

const MENTOR_SELECT = `
  SELECT mp.user_id, mp.expertise, mp.bio, mp.availability, mp.max_mentees,
         mp.is_available, mp.created_at, mp.updated_at,
         u.name, u.email, f.designation, f.department_id,
         d.name AS department_name, d.code AS department_code,
         (SELECT COUNT(*) FROM innovation_mentor_requests r
          WHERE r.mentor_id = mp.user_id AND r.status IN ('pending', 'accepted')) AS active_requests,
         (SELECT COUNT(*) FROM innovation_ideas i
          WHERE i.mentor_id = mp.user_id AND i.status NOT IN ('completed', 'rejected')) AS active_mentees
  FROM innovation_mentor_profiles mp
  JOIN users u ON u.id = mp.user_id
  LEFT JOIN faculty f ON f.user_id = u.id
  LEFT JOIN departments d ON d.id = f.department_id`;

const REQUEST_SELECT = `
  SELECT r.id, r.student_id, r.mentor_id, r.idea_id, r.project_id, r.message,
         r.status, r.scheduled_at, r.mentor_notes, r.responded_at, r.created_at,
         r.updated_at,
         student.name AS student_name, student.email AS student_email,
         mentor.name AS mentor_name, mentor.email AS mentor_email,
         i.title AS idea_title, p.title AS project_title
  FROM innovation_mentor_requests r
  JOIN users student ON student.id = r.student_id
  JOIN users mentor ON mentor.id = r.mentor_id
  LEFT JOIN innovation_ideas i ON i.id = r.idea_id
  LEFT JOIN innovation_projects p ON p.id = r.project_id`;

export async function listMentors(_req, res) {
  const { rows } = await query(`${MENTOR_SELECT} ORDER BY mp.is_available DESC, u.name ASC`);
  return res.json({ mentors: rows });
}

export async function saveMentor(req, res) {
  const userId = parsePositiveId(req.body.user_id, 'faculty member');
  const {
    expertise, bio, availability, max_mentees: maxMentees = 5,
    is_available: isAvailable = true,
  } = req.body;

  const faculty = await query(
    "SELECT u.id FROM users u JOIN faculty f ON f.user_id = u.id WHERE u.id = ? AND u.is_active = 1",
    [userId],
  );
  if (!faculty.rows[0]) throw httpError(400, 'Select an active faculty member');

  await query(
    `INSERT INTO innovation_mentor_profiles
       (user_id, expertise, bio, availability, max_mentees, is_available)
     VALUES (?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       expertise = VALUES(expertise), bio = VALUES(bio), availability = VALUES(availability),
       max_mentees = VALUES(max_mentees), is_available = VALUES(is_available)`,
    [userId, expertise, bio || null, availability || null, maxMentees, isAvailable ? 1 : 0],
  );

  await writeAudit(null, req.user.id, 'innovation_mentor.save', 'innovation_mentor_profiles', userId);
  const { rows } = await query(`${MENTOR_SELECT} WHERE mp.user_id = ?`, [userId]);
  return res.status(201).json({ mentor: rows[0] });
}

export async function updateMentor(req, res) {
  const userId = parsePositiveId(req.params.id, 'mentor id');
  if (!isAdmin(req.user) && req.user.id !== userId) {
    throw httpError(403, 'You can only update your own mentor profile');
  }

  const {
    expertise, bio, availability, max_mentees: maxMentees,
    is_available: isAvailable,
  } = req.body;

  const existing = await query('SELECT user_id FROM innovation_mentor_profiles WHERE user_id = ?', [userId]);
  if (!existing.rows[0]) throw httpError(404, 'Mentor profile not found');

  await query(
    `UPDATE innovation_mentor_profiles
     SET expertise = ?, bio = ?, availability = ?, max_mentees = ?, is_available = ?
     WHERE user_id = ?`,
    [expertise, bio || null, availability || null, maxMentees, isAvailable ? 1 : 0, userId],
  );

  await writeAudit(null, req.user.id, 'innovation_mentor.update', 'innovation_mentor_profiles', userId);
  const { rows } = await query(`${MENTOR_SELECT} WHERE mp.user_id = ?`, [userId]);
  return res.json({ mentor: rows[0] });
}

export async function deleteMentor(req, res) {
  const userId = parsePositiveId(req.params.id, 'mentor id');
  await query('DELETE FROM innovation_mentor_profiles WHERE user_id = ?', [userId]);
  await writeAudit(null, req.user.id, 'innovation_mentor.delete', 'innovation_mentor_profiles', userId);
  return res.json({ message: 'Mentor profile removed' });
}

export async function listMentorRequests(req, res) {
  let where = '';
  let params = [];

  if (req.user.role === 'student') {
    where = 'WHERE r.student_id = ?';
    params = [req.user.id];
  } else if (req.user.role === 'faculty') {
    where = 'WHERE r.mentor_id = ?';
    params = [req.user.id];
  }

  const { rows } = await query(
    `${REQUEST_SELECT}
     ${where}
     ORDER BY FIELD(r.status, 'pending', 'accepted', 'completed', 'rejected', 'cancelled'),
              r.created_at DESC
     LIMIT 300`,
    params,
  );
  return res.json({ requests: rows });
}

export async function createMentorRequest(req, res) {
  if (req.user.role !== 'student') {
    throw httpError(403, 'Only students can request a mentor');
  }

  const {
    mentor_id: mentorId, idea_id: ideaId, project_id: projectId, message,
  } = req.body;

  const mentor = await query(
    `SELECT mp.user_id, mp.max_mentees, mp.is_available, u.is_active,
            (SELECT COUNT(*) FROM innovation_mentor_requests r
             WHERE r.mentor_id = mp.user_id AND r.status IN ('pending', 'accepted')) AS active_requests
     FROM innovation_mentor_profiles mp
     JOIN users u ON u.id = mp.user_id
     WHERE mp.user_id = ?`,
    [mentorId],
  );
  const profile = mentor.rows[0];
  if (!profile || !profile.is_active) throw httpError(404, 'Mentor not found');
  if (!profile.is_available) throw httpError(400, 'This mentor is not currently accepting requests');
  if (Number(profile.active_requests) >= Number(profile.max_mentees)) {
    throw httpError(400, 'This mentor has reached the maximum number of active mentees');
  }

  const duplicate = await query(
    `SELECT id FROM innovation_mentor_requests
     WHERE student_id = ? AND mentor_id = ? AND status IN ('pending', 'accepted')
     LIMIT 1`,
    [req.user.id, mentorId],
  );
  if (duplicate.rows[0]) {
    throw httpError(409, 'You already have an active request with this mentor');
  }

  if (ideaId) {
    const idea = await query(
      'SELECT id, submitted_by FROM innovation_ideas WHERE id = ?',
      [ideaId],
    );
    if (!idea.rows[0] || idea.rows[0].submitted_by !== req.user.id) {
      throw httpError(400, 'Selected idea is not available to you');
    }
  }

  if (projectId) {
    const project = await query(
      'SELECT id, owner_id FROM innovation_projects WHERE id = ?',
      [projectId],
    );
    if (!project.rows[0] || project.rows[0].owner_id !== req.user.id) {
      throw httpError(400, 'Selected project is not available to you');
    }
  }

  const request = await withTransaction(async (client) => {
    const { insertId } = await client.query(
      `INSERT INTO innovation_mentor_requests
         (student_id, mentor_id, idea_id, project_id, message)
       VALUES (?, ?, ?, ?, ?)`,
      [req.user.id, mentorId, ideaId ?? null, projectId ?? null, message],
    );

    await notify(client, mentorId, {
      title: 'New mentoring request',
      message: `${req.user.name} requested mentoring support.`,
      type: 'mentor',
      link: '/innovation/portal/mentors',
    });

    await writeAudit(client, req.user.id, 'innovation_mentor_request.create', 'innovation_mentor_requests', insertId);
    const { rows } = await client.query(`${REQUEST_SELECT} WHERE r.id = ?`, [insertId]);
    return rows[0];
  });

  return res.status(201).json({ request });
}

export async function updateMentorRequest(req, res) {
  const id = parsePositiveId(req.params.id, 'mentor request id');
  const { status, scheduled_at: scheduledAt, mentor_notes: mentorNotes } = req.body;

  const existing = await query(
    'SELECT id, student_id, mentor_id, idea_id, project_id, status FROM innovation_mentor_requests WHERE id = ?',
    [id],
  );
  const request = existing.rows[0];
  if (!request) throw httpError(404, 'Mentoring request not found');

  const isMentor = request.mentor_id === req.user.id;
  const isStudent = request.student_id === req.user.id;
  if (!isAdmin(req.user) && !isMentor && !(isStudent && status === 'cancelled')) {
    throw httpError(403, 'You cannot update this mentoring request');
  }
  if (isStudent && !isMentor && !isAdmin(req.user) && status !== 'cancelled') {
    throw httpError(403, 'Students can only cancel their own requests');
  }

  const finalScheduledAt = normalizeDateTime(scheduledAt);

  await withTransaction(async (client) => {
    await client.query(
      `UPDATE innovation_mentor_requests
       SET status = ?, scheduled_at = ?, mentor_notes = ?,
           responded_at = CASE WHEN ? IN ('accepted', 'rejected', 'completed')
                               THEN CURRENT_TIMESTAMP ELSE responded_at END
       WHERE id = ?`,
      [status, finalScheduledAt, mentorNotes || null, status, id],
    );

    if (status === 'accepted') {
      if (request.idea_id) {
        await client.query(
          'UPDATE innovation_ideas SET mentor_id = ? WHERE id = ?',
          [request.mentor_id, request.idea_id],
        );
      }
      if (request.project_id) {
        await client.query(
          'UPDATE innovation_projects SET mentor_id = ? WHERE id = ?',
          [request.mentor_id, request.project_id],
        );
      }
    }

    const statusMessage = {
      accepted: 'Your mentoring request was accepted.',
      rejected: 'Your mentoring request was declined.',
      completed: 'Your mentoring session was marked complete.',
      cancelled: 'Your mentoring request was cancelled.',
      pending: 'Your mentoring request is pending.',
    }[status] || `Your mentoring request is now ${status}.`;

    await notify(client, request.student_id, {
      title: 'Mentoring request updated',
      message: mentorNotes || statusMessage,
      type: 'mentor',
      link: '/innovation/portal/mentors',
    });

    if (status === 'cancelled' && request.student_id !== req.user.id) {
      await notify(client, request.mentor_id, {
        title: 'Mentoring request cancelled',
        message: 'A student cancelled an active mentoring request.',
        type: 'mentor',
        link: '/innovation/portal/mentors',
      });
    }

    await writeAudit(client, req.user.id, 'innovation_mentor_request.update', 'innovation_mentor_requests', id);
  });

  const { rows } = await query(`${REQUEST_SELECT} WHERE r.id = ?`, [id]);
  return res.json({ request: rows[0] });
}
