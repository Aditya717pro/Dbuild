import { query } from '../db/pool.js';
import { writeAudit } from '../utils/audit.js';
import { httpError } from '../utils/httpError.js';

const SELECT_SQL = `
  SELECT e.id, e.student_id, s.roll_no, u.name AS student_name, u.email AS student_email,
         e.course_id, c.code AS course_code, c.name AS course_name,
         c.department_id, d.name AS department_name, e.created_at
  FROM enrollments e
  JOIN students s ON s.user_id = e.student_id
  JOIN users u ON u.id = s.user_id
  JOIN courses c ON c.id = e.course_id
  LEFT JOIN departments d ON d.id = c.department_id`;

const FILTERS = `
  WHERE ($1::int IS NULL OR e.course_id = $1)
    AND ($2::int IS NULL OR e.student_id = $2)
    AND ($3 = '' OR u.name ILIKE '%' || $3 || '%'
         OR s.roll_no ILIKE '%' || $3 || '%'
         OR c.code ILIKE '%' || $3 || '%'
         OR c.name ILIKE '%' || $3 || '%')`;

export async function list(req, res) {
  const courseId = req.query.course_id ? Number(req.query.course_id) : null;
  const studentId = req.query.student_id ? Number(req.query.student_id) : null;
  const search = req.query.search || '';
  let rows;

  if (req.user.role === 'admin') {
    ({ rows } = await query(
      `${SELECT_SQL} ${FILTERS} ORDER BY c.code, s.roll_no`,
      [courseId, studentId, search],
    ));
  } else if (req.user.role === 'faculty') {
    ({ rows } = await query(
      `${SELECT_SQL} ${FILTERS}
         AND c.faculty_id = $4
       ORDER BY c.code, s.roll_no`,
      [courseId, studentId, search, req.user.id],
    ));
  } else {
    ({ rows } = await query(
      `${SELECT_SQL} ${FILTERS}
         AND e.student_id = $4
       ORDER BY c.code`,
      [courseId, studentId, search, req.user.id],
    ));
  }

  return res.json({ enrollments: rows });
}

export async function create(req, res) {
  const { student_id: studentId, course_id: courseId } = req.body;

  const student = await query(
    "SELECT s.user_id FROM students s JOIN users u ON u.id = s.user_id WHERE s.user_id = $1 AND u.is_active",
    [studentId],
  );
  if (!student.rows[0]) {
    throw httpError(400, 'Student does not exist or is inactive');
  }

  const course = await query('SELECT id FROM courses WHERE id = $1', [courseId]);
  if (!course.rows[0]) {
    throw httpError(400, 'Course does not exist');
  }

  const { rows } = await query(
    `INSERT INTO enrollments (student_id, course_id)
     VALUES ($1, $2)
     RETURNING id, student_id, course_id, created_at`,
    [studentId, courseId],
  );
  await writeAudit(null, req.user.id, 'enrollment.create', 'enrollments', rows[0].id);

  return res.status(201).json({ enrollment: rows[0] });
}

export async function remove(req, res) {
  const { id } = req.params;
  const { rowCount } = await query('DELETE FROM enrollments WHERE id = $1', [id]);
  if (!rowCount) {
    throw httpError(404, 'Enrollment not found');
  }
  await writeAudit(null, req.user.id, 'enrollment.delete', 'enrollments', id);
  return res.json({ message: 'Enrollment removed' });
}
