import { query } from '../db/pool.js';
import { httpError } from '../utils/httpError.js';

export async function publicAnnouncements(req, res) {
  const { rows } = await query(
    `SELECT id, title, body, created_at
     FROM announcements
     WHERE audience = 'all'
     ORDER BY created_at DESC
     LIMIT 10`,
  );
  return res.json({ announcements: rows });
}

export async function publicDepartmentFaculty(req, res) {
  const { code } = req.params;

  const deptResult = await query(
    'SELECT id, name, code FROM departments WHERE code = ?',
    [code.toUpperCase()],
  );
  const dept = deptResult.rows[0];
  if (!dept) {
    throw httpError(404, 'Department not found');
  }

  const { rows } = await query(
    `SELECT u.name, u.email, f.designation, f.created_at
     FROM faculty f
     JOIN users u ON u.id = f.user_id
     WHERE f.department_id = ? AND u.is_active = 1
     ORDER BY
       CASE
         WHEN f.designation LIKE '%Head%' THEN 0
         WHEN f.designation LIKE '%Professor and%' THEN 0
         WHEN f.designation LIKE 'Professor%' THEN 1
         WHEN f.designation LIKE 'Associate%' THEN 2
         WHEN f.designation LIKE 'Assistant%' THEN 3
         ELSE 4
       END,
       u.name ASC`,
    [dept.id],
  );

  return res.json({ department: dept, faculty: rows });
}
