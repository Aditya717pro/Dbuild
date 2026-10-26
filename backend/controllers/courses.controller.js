import { query } from '../db/pool.js';
import { writeAudit } from '../utils/audit.js';
import { httpError } from '../utils/httpError.js';

const BASE_SELECT = `
  SELECT c.id, c.code, c.name, c.semester, c.department_id,
         d.name AS department_name,
         c.faculty_id, u.name AS faculty_name,
         CAST((SELECT COUNT(*) FROM enrollments e WHERE e.course_id = c.id) AS UNSIGNED) AS enrolled_count
  FROM courses c
  LEFT JOIN departments d ON d.id = c.department_id
  LEFT JOIN users u ON u.id = c.faculty_id`;

const FILTERS = `
  WHERE (? = '' OR c.code LIKE CONCAT('%', ?, '%') OR c.name LIKE CONCAT('%', ?, '%'))
    AND (? IS NULL OR c.department_id = ?)`;

const COURSE_COLUMNS = 'id, code, name, department_id, faculty_id, semester, created_at';

export async function list(req, res) {
  const search = req.query.search || '';
  const departmentId = req.query.department_id ? Number(req.query.department_id) : null;
  const filterParams = [search, search, search, departmentId, departmentId];
  let rows;

  if (req.user.role === 'admin') {
    ({ rows } = await query(
      `${BASE_SELECT} ${FILTERS} ORDER BY c.code`,
      filterParams,
    ));
  } else if (req.user.role === 'faculty') {
    ({ rows } = await query(
      `${BASE_SELECT} ${FILTERS}
         AND (c.faculty_id = ?
              OR c.department_id = (SELECT department_id FROM faculty WHERE user_id = ?))
       ORDER BY c.code`,
      [...filterParams, req.user.id, req.user.id],
    ));
  } else {
    ({ rows } = await query(
      `${BASE_SELECT}
       JOIN enrollments e2 ON e2.course_id = c.id AND e2.student_id = ?
       ${FILTERS}
       ORDER BY c.code`,
      [req.user.id, ...filterParams],
    ));
  }

  return res.json({ courses: rows });
}

export async function create(req, res) {
  const { code, name, department_id: departmentId, faculty_id: facultyId, semester } = req.body;

  if (facultyId) {
    const { rows } = await query("SELECT id FROM users WHERE id = ? AND role = 'faculty'", [facultyId]);
    if (!rows[0]) {
      throw httpError(400, 'Selected faculty member does not exist');
    }
  }

  const { insertId } = await query(
    `INSERT INTO courses (code, name, department_id, faculty_id, semester)
     VALUES (?, ?, ?, ?, ?)`,
    [code.toUpperCase(), name, departmentId ?? null, facultyId ?? null, semester ?? null],
  );
  const { rows } = await query(
    `SELECT ${COURSE_COLUMNS} FROM courses WHERE id = ?`,
    [insertId],
  );
  await writeAudit(null, req.user.id, 'course.create', 'courses', rows[0].id);
  return res.status(201).json({ course: rows[0] });
}

export async function update(req, res) {
  const { id } = req.params;
  const { code, name, department_id: departmentId, faculty_id: facultyId, semester } = req.body;

  if (facultyId) {
    const { rows } = await query("SELECT id FROM users WHERE id = ? AND role = 'faculty'", [facultyId]);
    if (!rows[0]) {
      throw httpError(400, 'Selected faculty member does not exist');
    }
  }

  const { rowCount } = await query(
    `UPDATE courses
     SET code = ?, name = ?, department_id = ?, faculty_id = ?, semester = ?
     WHERE id = ?`,
    [code.toUpperCase(), name, departmentId ?? null, facultyId ?? null, semester ?? null, id],
  );
  if (!rowCount) {
    throw httpError(404, 'Course not found');
  }
  const { rows } = await query(
    `SELECT ${COURSE_COLUMNS} FROM courses WHERE id = ?`,
    [id],
  );
  await writeAudit(null, req.user.id, 'course.update', 'courses', id);
  return res.json({ course: rows[0] });
}

export async function remove(req, res) {
  const { id } = req.params;
  const { rowCount } = await query('DELETE FROM courses WHERE id = ?', [id]);
  if (!rowCount) {
    throw httpError(404, 'Course not found');
  }
  await writeAudit(null, req.user.id, 'course.delete', 'courses', id);
  return res.json({ message: 'Course deleted' });
}
