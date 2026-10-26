import { query, withTransaction } from '../db/pool.js';
import { writeAudit } from '../utils/audit.js';
import { httpError } from '../utils/httpError.js';

async function getAccessibleCourse(user, courseId) {
  const { rows } = await query('SELECT id, code, name, faculty_id FROM courses WHERE id = ?', [courseId]);
  const course = rows[0];
  if (!course) {
    throw httpError(404, 'Course not found');
  }
  if (user.role === 'faculty' && course.faculty_id !== user.id) {
    throw httpError(403, 'You can only manage attendance for courses assigned to you');
  }
  return course;
}

export async function session(req, res) {
  const courseId = Number(req.query.course_id);
  const date = req.query.date;

  const course = await getAccessibleCourse(req.user, courseId);

  const { rows } = await query(
    `SELECT s.user_id AS student_id, s.roll_no, u.name,
            a.id AS attendance_id, a.status
     FROM enrollments e
     JOIN students s ON s.user_id = e.student_id
     JOIN users u ON u.id = s.user_id
     LEFT JOIN attendance a
       ON a.student_id = e.student_id AND a.course_id = e.course_id AND a.\`date\` = ?
     WHERE e.course_id = ?
     ORDER BY s.roll_no`,
    [date, courseId],
  );

  return res.json({ course, date, students: rows });
}

export async function submit(req, res) {
  const { course_id: courseId, date, records } = req.body;
  const course = await getAccessibleCourse(req.user, courseId);

  const byStudent = new Map();
  for (const record of records) {
    byStudent.set(record.student_id, record.status);
  }
  const studentIds = [...byStudent.keys()];
  const placeholders = studentIds.map(() => '?').join(', ');

  const enrolled = await query(
    `SELECT student_id FROM enrollments WHERE course_id = ? AND student_id IN (${placeholders})`,
    [courseId, ...studentIds],
  );
  if (enrolled.rows.length !== studentIds.length) {
    throw httpError(400, 'One or more students are not enrolled in this course');
  }

  await withTransaction(async (client) => {
    for (const [studentId, status] of byStudent) {
      await client.query(
        `INSERT INTO attendance (student_id, course_id, \`date\`, status, marked_by)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE status = VALUES(status), marked_by = VALUES(marked_by)`,
        [studentId, courseId, date, status, req.user.id],
      );
    }
    await writeAudit(
      client,
      req.user.id,
      'attendance.mark',
      'attendance',
      `${courseId}:${date}`,
    );
  });

  return res.json({
    message: 'Attendance saved',
    course_id: courseId,
    date,
    count: studentIds.length,
    course_code: course.code,
  });
}

export async function myAttendance(req, res) {
  const { rows } = await query(
    `SELECT c.id AS course_id, c.code, c.name,
            CAST(COALESCE(SUM(a.status = 'present'), 0) AS UNSIGNED) AS present,
            CAST(COUNT(a.id) AS UNSIGNED) AS total
     FROM enrollments e
     JOIN courses c ON c.id = e.course_id
     LEFT JOIN attendance a ON a.course_id = e.course_id AND a.student_id = e.student_id
     WHERE e.student_id = ?
     GROUP BY c.id, c.code, c.name
     ORDER BY c.code`,
    [req.user.id],
  );

  const courses = rows.map((row) => ({
    ...row,
    percentage: row.total === 0 ? null : Math.round((row.present / row.total) * 100),
  }));

  return res.json({ courses });
}

export async function courseSummary(req, res) {
  const courseId = Number(req.params.courseId);
  const course = await getAccessibleCourse(req.user, courseId);

  const { rows } = await query(
    `SELECT s.user_id AS student_id, s.roll_no, u.name,
            CAST(COALESCE(SUM(a.status = 'present'), 0) AS UNSIGNED) AS present,
            CAST(COUNT(a.id) AS UNSIGNED) AS total
     FROM enrollments e
     JOIN students s ON s.user_id = e.student_id
     JOIN users u ON u.id = s.user_id
     LEFT JOIN attendance a ON a.course_id = e.course_id AND a.student_id = e.student_id
     WHERE e.course_id = ?
     GROUP BY s.user_id, s.roll_no, u.name
     ORDER BY s.roll_no`,
    [courseId],
  );

  return res.json({
    course,
    students: rows.map((row) => ({
      ...row,
      percentage: row.total === 0 ? null : Math.round((row.present / row.total) * 100),
    })),
  });
}
