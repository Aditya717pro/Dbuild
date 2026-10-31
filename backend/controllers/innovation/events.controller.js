import { query, withTransaction } from '../../db/pool.js';
import { writeAudit } from '../../utils/audit.js';
import { httpError } from '../../utils/httpError.js';
import {
  notify,
  notifyAudience,
  parsePositiveId,
} from './common.js';

const EVENT_SELECT = `
  SELECT e.id, e.title, e.type, e.description,
         DATE_FORMAT(e.event_date, '%Y-%m-%d') AS event_date,
         e.start_time, e.end_time, e.venue,
         DATE_FORMAT(e.registration_deadline, '%Y-%m-%d') AS registration_deadline,
         e.max_participants, e.team_size_min,
         e.team_size_max, e.status, e.created_by, e.created_at, e.updated_at,
         creator.name AS created_by_name,
         (SELECT COUNT(*) FROM innovation_event_registrations r
          WHERE r.event_id = e.id AND r.status IN ('registered', 'attended')) AS registration_count,
         EXISTS(SELECT 1 FROM innovation_event_registrations r2
                WHERE r2.event_id = e.id AND r2.user_id = ? AND r2.status <> 'cancelled') AS is_registered
  FROM innovation_events e
  LEFT JOIN users creator ON creator.id = e.created_by`;

export async function listEvents(req, res) {
  const { rows } = await query(
    `${EVENT_SELECT}
     ORDER BY FIELD(e.status, 'ongoing', 'upcoming', 'completed', 'cancelled'),
              e.event_date ASC, e.created_at DESC
     LIMIT 200`,
    [req.user.id],
  );
  return res.json({ events: rows });
}

export async function createEvent(req, res) {
  const {
    title, type, description, event_date: eventDate, start_time: startTime,
    end_time: endTime, venue, registration_deadline: registrationDeadline,
    max_participants: maxParticipants, team_size_min: teamSizeMin = 1,
    team_size_max: teamSizeMax = 1, status = 'upcoming',
  } = req.body;

  if (registrationDeadline && registrationDeadline > eventDate) {
    throw httpError(400, 'Registration deadline cannot be after the event date');
  }

  const event = await withTransaction(async (client) => {
    const { insertId } = await client.query(
      `INSERT INTO innovation_events
         (title, type, description, event_date, start_time, end_time, venue,
          registration_deadline, max_participants, team_size_min, team_size_max,
          status, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        type,
        description,
        eventDate,
        startTime || null,
        endTime || null,
        venue,
        registrationDeadline || null,
        maxParticipants ?? null,
        teamSizeMin,
        teamSizeMax,
        status,
        req.user.id,
      ],
    );

    await notifyAudience(client, 'student', {
      title: 'New innovation event',
      message: `${title} is scheduled for ${eventDate} at ${venue}.`,
      type: 'event',
      link: '/innovation/portal/events',
    });

    await writeAudit(client, req.user.id, 'innovation_event.create', 'innovation_events', insertId);
    const { rows } = await client.query(`${EVENT_SELECT} WHERE e.id = ?`, [req.user.id, insertId]);
    return rows[0];
  });

  return res.status(201).json({ event });
}

export async function updateEvent(req, res) {
  const id = parsePositiveId(req.params.id, 'event id');
  const {
    title, type, description, event_date: eventDate, start_time: startTime,
    end_time: endTime, venue, registration_deadline: registrationDeadline,
    max_participants: maxParticipants, team_size_min: teamSizeMin,
    team_size_max: teamSizeMax, status,
  } = req.body;

  if (registrationDeadline && registrationDeadline > eventDate) {
    throw httpError(400, 'Registration deadline cannot be after the event date');
  }

  const { rowCount } = await query(
    `UPDATE innovation_events
     SET title = ?, type = ?, description = ?, event_date = ?, start_time = ?,
         end_time = ?, venue = ?, registration_deadline = ?, max_participants = ?,
         team_size_min = ?, team_size_max = ?, status = ?
     WHERE id = ?`,
    [
      title,
      type,
      description,
      eventDate,
      startTime || null,
      endTime || null,
      venue,
      registrationDeadline || null,
      maxParticipants ?? null,
      teamSizeMin,
      teamSizeMax,
      status,
      id,
    ],
  );
  if (!rowCount) throw httpError(404, 'Event not found');

  await writeAudit(null, req.user.id, 'innovation_event.update', 'innovation_events', id);
  const { rows } = await query(`${EVENT_SELECT} WHERE e.id = ?`, [req.user.id, id]);
  return res.json({ event: rows[0] });
}

export async function deleteEvent(req, res) {
  const id = parsePositiveId(req.params.id, 'event id');
  const { rowCount } = await query('DELETE FROM innovation_events WHERE id = ?', [id]);
  if (!rowCount) throw httpError(404, 'Event not found');
  await writeAudit(null, req.user.id, 'innovation_event.delete', 'innovation_events', id);
  return res.json({ message: 'Event deleted' });
}

export async function registerForEvent(req, res) {
  const id = parsePositiveId(req.params.id, 'event id');
  const { team_name: teamName, team_members: teamMembers } = req.body;

  const eventResult = await query(
    `SELECT id, title, event_date, registration_deadline, max_participants,
            team_size_min, team_size_max, status,
            (SELECT COUNT(*) FROM innovation_event_registrations r
             WHERE r.event_id = innovation_events.id
               AND r.status IN ('registered', 'attended')) AS registration_count
     FROM innovation_events WHERE id = ?`,
    [id],
  );
  const event = eventResult.rows[0];
  if (!event) throw httpError(404, 'Event not found');
  if (['completed', 'cancelled'].includes(event.status)) {
    throw httpError(400, 'Registration is closed for this event');
  }

  const today = new Date().toISOString().slice(0, 10);
  if (event.registration_deadline && event.registration_deadline < today) {
    throw httpError(400, 'The registration deadline has passed');
  }
  if (event.team_size_max > 1 && !teamName) {
    throw httpError(400, 'Enter your team name');
  }

  const existing = await query(
    'SELECT id FROM innovation_event_registrations WHERE event_id = ? AND user_id = ?',
    [id, req.user.id],
  );
  if (existing.rows[0]) throw httpError(409, 'You are already registered for this event');

  const isFull = event.max_participants != null
    && Number(event.registration_count) >= Number(event.max_participants);
  const status = isFull ? 'waitlisted' : 'registered';

  const registration = await withTransaction(async (client) => {
    const { insertId } = await client.query(
      `INSERT INTO innovation_event_registrations
         (event_id, user_id, team_name, team_members, status)
       VALUES (?, ?, ?, ?, ?)`,
      [id, req.user.id, teamName || null, teamMembers || null, status],
    );

    await notify(client, req.user.id, {
      title: status === 'waitlisted' ? 'Event waitlist confirmation' : 'Event registration confirmed',
      message: status === 'waitlisted'
        ? `You are on the waitlist for "${event.title}".`
        : `You are registered for "${event.title}".`,
      type: 'event',
      link: '/innovation/portal/events',
    });

    await writeAudit(client, req.user.id, 'innovation_event.register', 'innovation_event_registrations', insertId);
    const { rows } = await client.query(
      `SELECT r.id, r.event_id, r.user_id, r.team_name, r.team_members, r.status,
              r.created_at, u.name AS user_name, u.email AS user_email
       FROM innovation_event_registrations r
       JOIN users u ON u.id = r.user_id
       WHERE r.id = ?`,
      [insertId],
    );
    return rows[0];
  });

  return res.status(201).json({ registration });
}

export async function listEventRegistrations(req, res) {
  const id = parsePositiveId(req.params.id, 'event id');
  const { rows } = await query(
    `SELECT r.id, r.event_id, r.user_id, r.team_name, r.team_members, r.status,
            r.created_at, u.name AS user_name, u.email AS user_email
     FROM innovation_event_registrations r
     JOIN users u ON u.id = r.user_id
     WHERE r.event_id = ?
     ORDER BY r.created_at ASC`,
    [id],
  );
  return res.json({ registrations: rows });
}

export async function updateEventRegistration(req, res) {
  const id = parsePositiveId(req.params.id, 'event id');
  const registrationId = parsePositiveId(req.params.registrationId, 'registration id');
  const { status } = req.body;

  const { rowCount } = await query(
    'UPDATE innovation_event_registrations SET status = ? WHERE id = ? AND event_id = ?',
    [status, registrationId, id],
  );
  if (!rowCount) throw httpError(404, 'Registration not found');

  await writeAudit(null, req.user.id, 'innovation_event.registration_update', 'innovation_event_registrations', registrationId);
  return res.json({ message: 'Registration updated' });
}
