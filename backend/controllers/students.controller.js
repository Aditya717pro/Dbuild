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
  WHERE ($1 = '' OR u.name ILIKE '%' || $1 || '%'
         OR u.email ILIKE '%' || $1 || '%'
         OR s.roll_no ILIKE '%' || $1 || '%')
    AND ($2::int IS NULL OR s.department_id = $2)
    AND ($3::smallint IS NULL OR s.year = $3)`;

export async function list(req, res) {
  const search = req.query.search || '';
  const departmentId = req.query.department_id ? Number(req.query.department_id) : null;
  const year = req.query.year ? Number(req.query.year) : null;
  let rows;

  if (req.user.role === 'admin') {
    ({ rows } = await query(`${SELECT_SQL} ${FILTERS} ORDER BY s.roll_no`, [search, departmentId, year]));
  } else if (req.user.role === 'faculty') {
    ({ rows } = await query(
      `${SELECT_SQL} ${FILTERS}
         AND s.department_id = (SELECT department_id FROM faculty WHERE user_id = $4)
       ORDER BY s.roll_no`,
      [search, departmentId, year, req.user.id],
    ));
  } else {
    ({ rows } = await query(
      `${SELECT_SQL}
       WHERE s.user_id = $4
         AND ($1 = '' OR u.name ILIKE '%' || $1 || '%' OR s.roll_no ILIKE '%' || $1 || '%')
       ORDER BY s.roll_no`,
      [search, departmentId, year, req.user.id],
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
       VALUES ($1, $2, $3, 'student')
       RETURNING id, name, email, role, is_active, created_at`,
      [name, email, passwordHash],
    );
    const user = userResult.rows[0];

    const studentResult = await client.query(
      `INSERT INTO students (user_id, roll_no, department_id, year)
       VALUES ($1, $2, $3, $4)
       RETURNING user_id, roll_no, department_id, year, created_at`,
      [user.id, rollNo, departmentId ?? null, year],
    );

    await writeAudit(client, req.user.id, 'student.create', 'students', user.id);
    return { ...user, ...studentResult.rows[0] };
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
    const existing = await client.query('SELECT role FROM users WHERE id = $1', [id]);
    if (!existing.rows[0] || existing.rows[0].role !== 'student') {
      throw httpError(404, 'Student not found');
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

    const studentResult = await client.query(
      `UPDATE students SET roll_no = $1, department_id = $2, year = $3
       WHERE user_id = $4
       RETURNING user_id, roll_no, department_id, year, created_at`,
      [rollNo, departmentId ?? null, year, id],
    );

    await writeAudit(client, req.user.id, 'student.update', 'students', id);
    return { ...userResult.rows[0], ...studentResult.rows[0] };
  });

  return res.json({ student });
}

export async function remove(req, res) {
  const { id } = req.params;
  const existing = await query('SELECT role FROM users WHERE id = $1', [id]);
  if (!existing.rows[0] || existing.rows[0].role !== 'student') {
    throw httpError(404, 'Student not found');
  }

  await query('DELETE FROM users WHERE id = $1 AND role = $2', [id, 'student']);
  await writeAudit(null, req.user.id, 'student.delete', 'students', id);
  return res.json({ message: 'Student deleted' });
}
