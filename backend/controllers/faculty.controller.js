import bcrypt from 'bcryptjs';
import { query, withTransaction } from '../db/pool.js';
import { writeAudit } from '../utils/audit.js';
import { httpError } from '../utils/httpError.js';

const BCRYPT_ROUNDS = 10;

const SELECT_SQL = `
  SELECT f.user_id, u.name, u.email, u.is_active,
         f.department_id, d.name AS department_name,
         f.designation, f.created_at
  FROM faculty f
  JOIN users u ON u.id = f.user_id
  LEFT JOIN departments d ON d.id = f.department_id`;

const FILTERS = `
  WHERE ($1 = '' OR u.name ILIKE '%' || $1 || '%'
         OR u.email ILIKE '%' || $1 || '%'
         OR f.designation ILIKE '%' || $1 || '%')
    AND ($2::int IS NULL OR f.department_id = $2)`;

export async function list(req, res) {
  const search = req.query.search || '';
  const departmentId = req.query.department_id ? Number(req.query.department_id) : null;
  let rows;

  if (req.user.role === 'admin') {
    ({ rows } = await query(`${SELECT_SQL} ${FILTERS} ORDER BY u.name`, [search, departmentId]));
  } else {
    ({ rows } = await query(
      `${SELECT_SQL} ${FILTERS}
         AND f.department_id = (SELECT department_id FROM faculty WHERE user_id = $3)
       ORDER BY u.name`,
      [search, departmentId, req.user.id],
    ));
  }

  return res.json({ faculty: rows });
}

export async function create(req, res) {
  const {
    name, email, password, designation, department_id: departmentId,
  } = req.body;

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

  const member = await withTransaction(async (client) => {
    const userResult = await client.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, 'faculty')
       RETURNING id, name, email, role, is_active, created_at`,
      [name, email, passwordHash],
    );
    const user = userResult.rows[0];

    const facultyResult = await client.query(
      `INSERT INTO faculty (user_id, department_id, designation)
       VALUES ($1, $2, $3)
       RETURNING user_id, department_id, designation, created_at`,
      [user.id, departmentId ?? null, designation ?? null],
    );

    await writeAudit(client, req.user.id, 'faculty.create', 'faculty', user.id);
    return { ...user, ...facultyResult.rows[0] };
  });

  return res.status(201).json({ faculty: member });
}

export async function update(req, res) {
  const { id } = req.params;
  const {
    name, email, password, designation, department_id: departmentId, is_active: isActive,
  } = req.body;

  const member = await withTransaction(async (client) => {
    const existing = await client.query('SELECT role FROM users WHERE id = $1', [id]);
    if (!existing.rows[0] || existing.rows[0].role !== 'faculty') {
      throw httpError(404, 'Faculty member not found');
    }

    const userResult = await client.query(
      `UPDATE users SET name = $1, email = $2, is_active = $3 WHERE id = $4
       RETURNING id, name, email, role, is_active`,
      [name, email, isActive, id],
    );

    if (password) {
      const hash = await bcrypt.hash(password, BCRYPT_ROUNDS);
      await client.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hash, id]);
    }

    const facultyResult = await client.query(
      `UPDATE faculty SET department_id = $1, designation = $2
       WHERE user_id = $3
       RETURNING user_id, department_id, designation, created_at`,
      [departmentId ?? null, designation ?? null, id],
    );

    await writeAudit(client, req.user.id, 'faculty.update', 'faculty', id);
    return { ...userResult.rows[0], ...facultyResult.rows[0] };
  });

  return res.json({ faculty: member });
}

export async function remove(req, res) {
  const { id } = req.params;
  const existing = await query('SELECT role FROM users WHERE id = $1', [id]);
  if (!existing.rows[0] || existing.rows[0].role !== 'faculty') {
    throw httpError(404, 'Faculty member not found');
  }

  await query('DELETE FROM users WHERE id = $1 AND role = $2', [id, 'faculty']);
  await writeAudit(null, req.user.id, 'faculty.delete', 'faculty', id);
  return res.json({ message: 'Faculty member deleted' });
}

export async function roster(req, res) {
  let departmentId;
  if (req.user.role === 'admin') {
    departmentId = req.query.department_id ? Number(req.query.department_id) : null;
    if (!departmentId) {
      throw httpError(400, 'department_id is required');
    }
  } else {
    const { rows } = await query('SELECT department_id FROM faculty WHERE user_id = $1', [req.user.id]);
    departmentId = rows[0]?.department_id ?? null;
    if (!departmentId) {
      return res.json({ students: [], department: null });
    }
  }

  const { rows } = await query(
    `SELECT s.user_id, u.name, u.email, u.is_active,
            s.roll_no, s.year, s.department_id, d.name AS department_name
     FROM students s
     JOIN users u ON u.id = s.user_id
     LEFT JOIN departments d ON d.id = s.department_id
     WHERE s.department_id = $1
     ORDER BY s.year, s.roll_no`,
    [departmentId],
  );

  const dept = await query('SELECT id, name, code FROM departments WHERE id = $1', [departmentId]);
  return res.json({ students: rows, department: dept.rows[0] || null });
}
