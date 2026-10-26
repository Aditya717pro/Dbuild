import { query } from '../db/pool.js';
import { writeAudit } from '../utils/audit.js';
import { httpError } from '../utils/httpError.js';

const SELECT_SQL = `
  SELECT a.id, a.title, a.body, a.audience, a.department_id, a.course_id,
         a.posted_by, a.created_at,
         u.name AS posted_by_name,
         d.name AS department_name,
         c.code AS course_code, c.name AS course_name
  FROM announcements a
  LEFT JOIN users u ON u.id = a.posted_by
  LEFT JOIN departments d ON d.id = a.department_id
  LEFT JOIN courses c ON c.id = a.course_id`;

const ANNOUNCEMENT_COLUMNS = `
  id, title, body, audience, department_id, course_id, posted_by, created_at`;

export async function list(req, res) {
  let rows;

  if (req.user.role === 'admin') {
    ({ rows } = await query(`${SELECT_SQL} ORDER BY a.created_at DESC LIMIT 200`));
  } else if (req.user.role === 'faculty') {
    ({ rows } = await query(
      `${SELECT_SQL}
       WHERE a.audience = 'all'
          OR (a.audience = 'department'
              AND a.department_id = (SELECT department_id FROM faculty WHERE user_id = ?))
          OR (a.audience = 'course'
              AND a.course_id IN (SELECT id FROM courses WHERE faculty_id = ?))
       ORDER BY a.created_at DESC
       LIMIT 200`,
      [req.user.id, req.user.id],
    ));
  } else {
    ({ rows } = await query(
      `${SELECT_SQL}
       WHERE a.audience = 'all'
          OR (a.audience = 'department'
              AND a.department_id = (SELECT department_id FROM students WHERE user_id = ?))
          OR (a.audience = 'course'
              AND a.course_id IN (SELECT course_id FROM enrollments WHERE student_id = ?))
       ORDER BY a.created_at DESC
       LIMIT 200`,
      [req.user.id, req.user.id],
    ));
  }

  return res.json({ announcements: rows });
}

export async function create(req, res) {
  const {
    title, body, audience,
    department_id: departmentId, course_id: courseId,
  } = req.body;

  if (req.user.role === 'faculty') {
    if (audience === 'all') {
      throw httpError(403, 'Faculty can only post to their department or their courses');
    }
    if (audience === 'department') {
      const { rows } = await query('SELECT department_id FROM faculty WHERE user_id = ?', [req.user.id]);
      if (!rows[0]?.department_id || rows[0].department_id !== departmentId) {
        throw httpError(403, 'You can only post announcements to your own department');
      }
    }
    if (audience === 'course') {
      const { rows } = await query('SELECT id FROM courses WHERE id = ? AND faculty_id = ?', [
        courseId, req.user.id,
      ]);
      if (!rows[0]) {
        throw httpError(403, 'You can only post announcements to courses you teach');
      }
    }
  }

  const { insertId } = await query(
    `INSERT INTO announcements (title, body, posted_by, audience, department_id, course_id)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      title,
      body,
      req.user.id,
      audience,
      audience === 'department' ? departmentId ?? null : null,
      audience === 'course' ? courseId ?? null : null,
    ],
  );

  const { rows } = await query(
    `SELECT ${ANNOUNCEMENT_COLUMNS} FROM announcements WHERE id = ?`,
    [insertId],
  );

  await writeAudit(null, req.user.id, 'announcement.create', 'announcements', rows[0].id);
  return res.status(201).json({ announcement: rows[0] });
}

export async function remove(req, res) {
  const { id } = req.params;
  const { rows } = await query('SELECT posted_by FROM announcements WHERE id = ?', [id]);
  const announcement = rows[0];

  if (!announcement) {
    throw httpError(404, 'Announcement not found');
  }
  if (req.user.role !== 'admin' && announcement.posted_by !== req.user.id) {
    throw httpError(403, 'You can only delete your own announcements');
  }

  await query('DELETE FROM announcements WHERE id = ?', [id]);
  await writeAudit(null, req.user.id, 'announcement.delete', 'announcements', id);
  return res.json({ message: 'Announcement deleted' });
}
