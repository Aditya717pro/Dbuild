import { query } from '../db/pool.js';
import { writeAudit } from '../utils/audit.js';
import { httpError } from '../utils/httpError.js';

const LIST_SQL = `
  SELECT d.id, d.name, d.code, d.created_at,
    CAST((SELECT COUNT(*) FROM students s WHERE s.department_id = d.id) AS UNSIGNED) AS student_count,
    CAST((SELECT COUNT(*) FROM faculty f WHERE f.department_id = d.id) AS UNSIGNED) AS faculty_count,
    CAST((SELECT COUNT(*) FROM courses c WHERE c.department_id = d.id) AS UNSIGNED) AS course_count
  FROM departments d
  WHERE (? = '' OR d.name LIKE CONCAT('%', ?, '%') OR d.code LIKE CONCAT('%', ?, '%'))
  ORDER BY d.name`;

export async function list(req, res) {
  const search = req.query.search || '';
  const { rows } = await query(LIST_SQL, [search, search, search]);
  return res.json({ departments: rows });
}

export async function create(req, res) {
  const { name, code } = req.body;
  const { insertId } = await query(
    'INSERT INTO departments (name, code) VALUES (?, ?)',
    [name, code.toUpperCase()],
  );
  const { rows } = await query(
    'SELECT id, name, code, created_at FROM departments WHERE id = ?',
    [insertId],
  );
  await writeAudit(null, req.user.id, 'department.create', 'departments', rows[0].id);
  return res.status(201).json({ department: rows[0] });
}

export async function update(req, res) {
  const { id } = req.params;
  const { name, code } = req.body;
  const { rowCount } = await query(
    'UPDATE departments SET name = ?, code = ? WHERE id = ?',
    [name, code.toUpperCase(), id],
  );
  if (!rowCount) {
    throw httpError(404, 'Department not found');
  }
  const { rows } = await query(
    'SELECT id, name, code, created_at FROM departments WHERE id = ?',
    [id],
  );
  await writeAudit(null, req.user.id, 'department.update', 'departments', id);
  return res.json({ department: rows[0] });
}

export async function remove(req, res) {
  const { id } = req.params;
  const { rowCount } = await query('DELETE FROM departments WHERE id = ?', [id]);
  if (!rowCount) {
    throw httpError(404, 'Department not found');
  }
  await writeAudit(null, req.user.id, 'department.delete', 'departments', id);
  return res.json({ message: 'Department deleted' });
}
