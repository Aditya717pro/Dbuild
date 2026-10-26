import bcrypt from 'bcryptjs';
import { query, withTransaction } from '../db/pool.js';
import { writeAudit } from '../utils/audit.js';
import { httpError } from '../utils/httpError.js';

const BCRYPT_ROUNDS = 10;

const SELECT_SQL = `
  SELECT s.user_id, u.name, u.email, u.is_active,
         s.roll_no, s.department_id, d.name AS department_name,
         s.year, s.created_at
  FROM students s
  JOIN users u ON u.id = s.user_id
  LEFT JOIN departments d ON d.id = s.department_id`;

const FILTERS = `
  WHERE (? = '' OR u.name LIKE CONCAT('%', ?, '%')
         OR u.email LIKE CONCAT('%', ?, '%')
         OR s.roll_no LIKE CONCAT('%', ?, '%'))
    AND (? IS NULL OR s.department_id = ?)
    AND (? IS NULL OR s.year = ?)`;

export async function list(req, res) {
  const search = req.query.search || '';
  const departmentId = req.query.department_id ? Number(req.query.department_id) : null;
  const year = req.query.year ? Number(req.query.year) : null;
  const filterParams = [
    search, search, search, search,
    departmentId, departmentId,
    year, year,
  ];
  let rows;

  if (req.user.role === 'admin') {
    ({ rows } = await query(
      `${SELECT_SQL} ${FILTERS} ORDER BY s.roll_no`,
      filterParams,
    ));
  } else if (req.user.role === 'faculty') {
    ({ rows } = await query(
      `${SELECT_SQL} ${FILTERS}
         AND s.department_id = (SELECT department_id FROM faculty WHERE user_id = ?)
       ORDER BY s.roll_no`,
      [...filterParams, req.user.id],
    ));
  } else {
    ({ rows } = await query(
      `${SELECT_SQL}
       WHERE s.user_id = ?
         AND (? = '' OR u.name LIKE CONCAT('%', ?, '%') OR s.roll_no LIKE CONCAT('%', ?, '%'))
       ORDER BY s.roll_no`,
      [req.user.id, search, search, search],
    ));
  }

  return res.json({ students: rows });
}

export async function create(req, res) {
  const {
    name, email, password, roll_no: rollNo,
    department_id: departmentId, year,
  } = req.body;

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

  const student = await withTransaction(async (client) => {
    const userResult = await client.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES (?, ?, ?, 'student')`,
      [name, email, passwordHash],
    );
    const userId = userResult.insertId;

    const user = (await client.query(
      `SELECT id, name, email, role, is_active, created_at FROM users WHERE id = ?`,
      [userId],
    )).rows[0];

    await client.query(
      `INSERT INTO students (user_id, roll_no, department_id, year)
       VALUES (?, ?, ?, ?)`,
      [userId, rollNo, departmentId ?? null, year],
    );

    const profile = (await client.query(
      `SELECT user_id, roll_no, department_id, year, created_at FROM students WHERE user_id = ?`,
      [userId],
    )).rows[0];

    await writeAudit(client, req.user.id, 'student.create', 'students', userId);
    return { ...user, ...profile };
  });

  return res.status(201).json({ student });
}

export async function update(req, res) {
  const { id } = req.params;
  const {
    name, email, password, roll_no: rollNo,
    department_id: departmentId, year, is_active: isActive,
  } = req.body;

  const student = await withTransaction(async (client) => {
    const existing = await client.query('SELECT role FROM users WHERE id = ?', [id]);
    if (!existing.rows[0] || existing.rows[0].role !== 'student') {
      throw httpError(404, 'Student not found');
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
      `UPDATE students SET roll_no = ?, department_id = ?, year = ?
       WHERE user_id = ?`,
      [rollNo, departmentId ?? null, year, id],
    );

    const profile = (await client.query(
      `SELECT user_id, roll_no, department_id, year, created_at FROM students WHERE user_id = ?`,
      [id],
    )).rows[0] ?? {};

    await writeAudit(client, req.user.id, 'student.update', 'students', id);
    return { ...user, ...profile };
  });

  return res.json({ student });
}

export async function remove(req, res) {
  const { id } = req.params;
  const existing = await query('SELECT role FROM users WHERE id = ?', [id]);
  if (!existing.rows[0] || existing.rows[0].role !== 'student') {
    throw httpError(404, 'Student not found');
  }

  await query('DELETE FROM users WHERE id = ? AND role = ?', [id, 'student']);
  await writeAudit(null, req.user.id, 'student.delete', 'students', id);
  return res.json({ message: 'Student deleted' });
}
