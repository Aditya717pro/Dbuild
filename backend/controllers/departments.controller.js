import { query } from '../db/pool.js';
import { writeAudit } from '../utils/audit.js';
import { httpError } from '../utils/httpError.js';

const LIST_SQL = `
  SELECT d.id, d.name, d.code, d.created_at,
    (SELECT count(*)::int FROM students s WHERE s.department_id = d.id) AS student_count,
    (SELECT count(*)::int FROM faculty f WHERE f.department_id = d.id) AS faculty_count,
    (SELECT count(*)::int FROM courses c WHERE c.department_id = d.id) AS course_count
  FROM departments d
  WHERE ($1 = '' OR d.name ILIKE '%' || $1 || '%' OR d.code ILIKE '%' || $1 || '%')
  ORDER BY d.name`;

export async function list(req, res) {
  const search = req.query.search || '';
  const { rows } = await query(LIST_SQL, [search]);
  return res.json({ departments: rows });
}

export async function create(req, res) {
  const { name, code } = req.body;
  const { rows } = await query(
    'INSERT INTO departments (name, code) VALUES ($1, $2) RETURNING id, name, code, created_at',
    [name, code.toUpperCase()],
  );
  await writeAudit(null, req.user.id, 'department.create', 'departments', rows[0].id);
  return res.status(201).json({ department: rows[0] });
}

export async function update(req, res) {
  const { id } = req.params;
  const { name, code } = req.body;
  const { rows } = await query(
    'UPDATE departments SET name = $1, code = $2 WHERE id = $3 RETURNING id, name, code, created_at',
    [name, code.toUpperCase(), id],
  );
  if (!rows[0]) {
    throw httpError(404, 'Department not found');
  }
  await writeAudit(null, req.user.id, 'department.update', 'departments', id);
  return res.json({ department: rows[0] });
}

export async function remove(req, res) {
  const { id } = req.params;
  const { rowCount } = await query('DELETE FROM departments WHERE id = $1', [id]);
  if (!rowCount) {
    throw httpError(404, 'Department not found');
  }
  await writeAudit(null, req.user.id, 'department.delete', 'departments', id);
  return res.json({ message: 'Department deleted' });
}
