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
  WHERE (? IS NULL OR e.course_id = ?)
    AND (? IS NULL OR e.student_id = ?)
    AND (? = '' OR u.name LIKE CONCAT('%', ?, '%')
         OR s.roll_no LIKE CONCAT('%', ?, '%')
         OR c.code LIKE CONCAT('%', ?, '%')
         OR c.name LIKE CONCAT('%', ?, '%'))`;

export async function list(req, res) {
  const courseId = req.query.course_id ? Number(req.query.course_id) : null;
  const studentId = req.query.student_id ? Number(req.query.student_id) : null;
  const search = req.query.search || '';
  const filterParams = [
    courseId, courseId,
    studentId, studentId,
    search, search, search, search, search,
  ];
  let rows;

  if (req.user.role === 'admin') {
    ({ rows } = await query(
      `${SELECT_SQL} ${FILTERS} ORDER BY c.code, s.roll_no`,
      filterParams,
    ));
  } else if (req.user.role === 'faculty') {
    ({ rows } = await query(
      `${SELECT_SQL} ${FILTERS}
         AND c.faculty_id = ?
       ORDER BY c.code, s.roll_no`,
      [...filterParams, req.user.id],
    ));
  } else {
    ({ rows } = await query(
      `${SELECT_SQL} ${FILTERS}
         AND e.student_id = ?
       ORDER BY c.code`,
      [...filterParams, req.user.id],
    ));
  }

  return res.json({ enrollments: rows });
}

export async function create(req, res) {
  const { student_id: studentId, course_id: courseId } = req.body;

  const student = await query(
    'SELECT s.user_id FROM students s JOIN users u ON u.id = s.user_id WHERE s.user_id = ? AND u.is_active',
    [studentId],
  );
  if (!student.rows[0]) {
    throw httpError(400, 'Student does not exist or is inactive');
  }

  const course = await query('SELECT id FROM courses WHERE id = ?', [courseId]);
  if (!course.rows[0]) {
    throw httpError(400, 'Course does not exist');
  }

  const { insertId } = await query(
    `INSERT INTO enrollments (student_id, course_id)
     VALUES (?, ?)`,
    [studentId, courseId],
  );
  const { rows } = await query(
    'SELECT id, student_id, course_id, created_at FROM enrollments WHERE id = ?',
    [insertId],
  );
  await writeAudit(null, req.user.id, 'enrollment.create', 'enrollments', rows[0].id);

  return res.status(201).json({ enrollment: rows[0] });
}

export async function remove(req, res) {
  const { id } = req.params;
  const { rowCount } = await query('DELETE FROM enrollments WHERE id = ?', [id]);
  if (!rowCount) {
    throw httpError(404, 'Enrollment not found');
  }
  await writeAudit(null, req.user.id, 'enrollment.delete', 'enrollments', id);
  return res.json({ message: 'Enrollment removed' });
}
