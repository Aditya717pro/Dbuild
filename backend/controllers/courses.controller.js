import { query } from '../db/pool.js';
import { writeAudit } from '../utils/audit.js';
import { httpError } from '../utils/httpError.js';

const BASE_SELECT = `
  SELECT c.id, c.code, c.name, c.semester, c.department_id,
         d.name AS department_name,
         c.faculty_id, u.name AS faculty_name,
         (SELECT count(*)::int FROM enrollments e WHERE e.course_id = c.id) AS enrolled_count
  FROM courses c
  LEFT JOIN departments d ON d.id = c.department_id
  LEFT JOIN users u ON u.id = c.faculty_id`;

const FILTERS = `
  WHERE ($1 = '' OR c.code ILIKE '%' || $1 || '%' OR c.name ILIKE '%' || $1 || '%')
    AND ($2::int IS NULL OR c.department_id = $2)`;

export async function list(req, res) {
  const search = req.query.search || '';
  const departmentId = req.query.department_id ? Number(req.query.department_id) : null;
  let rows;

  if (req.user.role === 'admin') {
    ({ rows } = await query(`${BASE_SELECT} ${FILTERS} ORDER BY c.code`, [search, departmentId]));
  } else if (req.user.role === 'faculty') {
    ({ rows } = await query(
      `${BASE_SELECT} ${FILTERS}
         AND (c.faculty_id = $3
              OR c.department_id = (SELECT department_id FROM faculty WHERE user_id = $3))
       ORDER BY c.code`,
      [search, departmentId, req.user.id],
    ));
  } else {
    ({ rows } = await query(
      `${BASE_SELECT}
       JOIN enrollments e2 ON e2.course_id = c.id AND e2.student_id = $3
       ${FILTERS}
       ORDER BY c.code`,
      [search, departmentId, req.user.id],
    ));
  }

  return res.json({ courses: rows });
}

export async function create(req, res) {
  const { code, name, department_id: departmentId, faculty_id: facultyId, semester } = req.body;

  if (facultyId) {
    const { rows } = await query("SELECT id FROM users WHERE id = $1 AND role = 'faculty'", [facultyId]);
    if (!rows[0]) {
      throw httpError(400, 'Selected faculty member does not exist');
    }
  }

  const { rows } = await query(
    `INSERT INTO courses (code, name, department_id, faculty_id, semester)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, code, name, department_id, faculty_id, semester, created_at`,
    [code.toUpperCase(), name, departmentId ?? null, facultyId ?? null, semester ?? null],
  );
  await writeAudit(null, req.user.id, 'course.create', 'courses', rows[0].id);
  return res.status(201).json({ course: rows[0] });
}

export async function update(req, res) {
  const { id } = req.params;
  const { code, name, department_id: departmentId, faculty_id: facultyId, semester } = req.body;

  if (facultyId) {
    const { rows } = await query("SELECT id FROM users WHERE id = $1 AND role = 'faculty'", [facultyId]);
    if (!rows[0]) {
      throw httpError(400, 'Selected faculty member does not exist');
    }
  }

  const { rows } = await query(
    `UPDATE courses
     SET code = $1, name = $2, department_id = $3, faculty_id = $4, semester = $5
     WHERE id = $6
     RETURNING id, code, name, department_id, faculty_id, semester, created_at`,
    [code.toUpperCase(), name, departmentId ?? null, facultyId ?? null, semester ?? null, id],
  );
  if (!rows[0]) {
    throw httpError(404, 'Course not found');
  }
  await writeAudit(null, req.user.id, 'course.update', 'courses', id);
  return res.json({ course: rows[0] });
}

export async function remove(req, res) {
  const { id } = req.params;
  const { rowCount } = await query('DELETE FROM courses WHERE id = $1', [id]);
  if (!rowCount) {
    throw httpError(404, 'Course not found');
  }
  await writeAudit(null, req.user.id, 'course.delete', 'courses', id);
  return res.json({ message: 'Course deleted' });
}
