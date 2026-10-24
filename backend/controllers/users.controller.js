import bcrypt from 'bcryptjs';
import { query } from '../db/pool.js';
import { writeAudit } from '../utils/audit.js';

const BCRYPT_ROUNDS = 10;

export async function list(req, res) {
  const role = req.query.role || '';
  const { rows } = await query(
    `SELECT id, name, email, role, is_active, last_login_at, created_at
     FROM users
     WHERE ($1 = '' OR role = $1)
     ORDER BY created_at DESC`,
    [role],
  );
  return res.json({ users: rows });
}

export async function createAdmin(req, res) {
  const { name, email, password } = req.body;
  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

  const { rows } = await query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ($1, $2, $3, 'admin')
     RETURNING id, name, email, role, is_active, created_at`,
    [name, email, passwordHash],
  );

  await writeAudit(null, req.user.id, 'user.create_admin', 'users', rows[0].id);
  return res.status(201).json({ user: rows[0] });
}
