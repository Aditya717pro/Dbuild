import bcrypt from 'bcryptjs';
import { query, withTransaction } from '../db/pool.js';
import { writeAudit } from '../utils/audit.js';
import { httpError } from '../utils/httpError.js';

const BCRYPT_ROUNDS = 10;

const SELECT_SQL = `
  SELECT f.user_id, u.name, u.email, u.is_active,
         f.department_id, d.name AS department_name,
         f.designation, f.is_cdc, f.created_at
  FROM faculty f
  JOIN users u ON u.id = f.user_id
  LEFT JOIN departments d ON d.id = f.department_id`;

const FILTERS = `
  WHERE (? = '' OR u.name LIKE CONCAT('%', ?, '%')
         OR u.email LIKE CONCAT('%', ?, '%')
         OR f.designation LIKE CONCAT('%', ?, '%'))
    AND (? IS NULL OR f.department_id = ?)`;

export async function list(req, res) {
  const search = req.query.search || '';
  const departmentId = req.query.department_id ? Number(req.query.department_id) : null;
  let rows;

  if (req.user.role === 'admin') {
    ({ rows } = await query(
      `${SELECT_SQL} ${FILTERS} ORDER BY u.name`,
      [search, search, search, search, departmentId, departmentId],
    ));
  } else {
    ({ rows } = await query(
      `${SELECT_SQL} ${FILTERS}
         AND f.department_id = (SELECT department_id FROM faculty WHERE user_id = ?)
       ORDER BY u.name`,
      [search, search, search, search, departmentId, departmentId, req.user.id],
    ));
  }

  return res.json({ faculty: rows });
}

export async function create(req, res) {
  const {
    name, email, password, designation, department_id: departmentId, is_cdc: isCdc,
  } = req.body;

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

  const member = await withTransaction(async (client) => {
    const userResult = await client.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES (?, ?, ?, 'faculty')`,
      [name, email, passwordHash],
    );
    const userId = userResult.insertId;

    const user = (await client.query(
      `SELECT id, name, email, role, is_active, created_at FROM users WHERE id = ?`,
      [userId],
    )).rows[0];

    await client.query(
      `INSERT INTO faculty (user_id, department_id, designation, is_cdc)
       VALUES (?, ?, ?, ?)`,
      [userId, departmentId ?? null, designation ?? null, isCdc ? 1 : 0],
    );

    const profile = (await client.query(
      `SELECT user_id, department_id, designation, is_cdc, created_at FROM faculty WHERE user_id = ?`,
      [userId],
    )).rows[0];

    await writeAudit(client, req.user.id, 'faculty.create', 'faculty', userId);
    return { ...user, ...profile };
  });

  return res.status(201).json({ faculty: member });
}

export async function update(req, res) {
  const { id } = req.params;
  const {
    name, email, password, designation, department_id: departmentId,
    is_active: isActive, is_cdc: isCdc,
  } = req.body;

  const member = await withTransaction(async (client) => {
    const existing = await client.query('SELECT role FROM users WHERE id = ?', [id]);
    if (!existing.rows[0] || existing.rows[0].role !== 'faculty') {
      throw httpError(404, 'Faculty member not found');
    }

    await client.query(
      `UPDATE users SET name = ?, email = ?, is_active = ? WHERE id = ?`,
      [name, email, isActive, id],
    );

    const user = (await client.query(
      `SELECT id, name, email, role, is_active FROM users WHERE id = ?`,
      [id],
    )).rows[0];

    if (password) {
      const hash = await bcrypt.hash(password, BCRYPT_ROUNDS);
      await client.query('UPDATE users SET password_hash = ? WHERE id = ?', [hash, id]);
    }

    await client.query(
      `UPDATE faculty SET department_id = ?, designation = ?, is_cdc = COALESCE(?, is_cdc)
       WHERE user_id = ?`,
      [departmentId ?? null, designation ?? null, isCdc === undefined ? null : (isCdc ? 1 : 0), id],
    );

    const profile = (await client.query(
      `SELECT user_id, department_id, designation, is_cdc, created_at FROM faculty WHERE user_id = ?`,
      [id],
    )).rows[0] ?? {};

    await writeAudit(client, req.user.id, 'faculty.update', 'faculty', id);
    return { ...user, ...profile };
  });

  return res.json({ faculty: member });
}

export async function remove(req, res) {
  const { id } = req.params;
  const existing = await query('SELECT role FROM users WHERE id = ?', [id]);
  if (!existing.rows[0] || existing.rows[0].role !== 'faculty') {
    throw httpError(404, 'Faculty member not found');
  }

  await query('DELETE FROM users WHERE id = ? AND role = ?', [id, 'faculty']);
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
    const { rows } = await query('SELECT department_id FROM faculty WHERE user_id = ?', [req.user.id]);
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
     WHERE s.department_id = ?
     ORDER BY s.year, s.roll_no`,
    [departmentId],
  );

  const dept = await query('SELECT id, name, code FROM departments WHERE id = ?', [departmentId]);
  return res.json({ students: rows, department: dept.rows[0] || null });
}
