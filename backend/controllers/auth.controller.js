import bcrypt from 'bcryptjs';
import { query } from '../db/pool.js';
import { signToken } from '../utils/jwt.js';
import { writeAudit } from '../utils/audit.js';
import { httpError } from '../utils/httpError.js';

const BCRYPT_ROUNDS = 10;

export async function login(req, res) {
  const rawIdentifier = req.body.name ?? req.body.identifier ?? req.body.email ?? '';
  const identifier = typeof rawIdentifier === 'string' ? rawIdentifier.trim() : String(rawIdentifier).trim();
  const { password } = req.body;
  const isStudentId = /^\d+$/.test(identifier);

  let rows;
  if (isStudentId) {
    // Students sign in with their numeric student_id (users.id).
    ({ rows } = await query(
      `SELECT id, name, email, password_hash, role, is_active
       FROM users
       WHERE id = ? AND role = 'student'
       LIMIT 1`,
      [Number(identifier)],
    ));
  } else {
    // Admin and faculty accounts sign in with their name (or email).
    ({ rows } = await query(
      `SELECT u.id, u.name, u.email, u.password_hash, u.role, u.is_active,
              COALESCE(f.is_cdc, 0) AS is_cdc
       FROM users u
       LEFT JOIN faculty f ON f.user_id = u.id
       WHERE (LOWER(TRIM(u.name)) = LOWER(TRIM(?)) OR LOWER(TRIM(u.email)) = LOWER(TRIM(?)))
         AND u.role <> 'student'
       LIMIT 1`,
      [identifier, identifier],
    ));
  }

  const user = rows[0];
  const passwordOk = user ? await bcrypt.compare(password, user.password_hash) : false;

  if (!user || !passwordOk) {
    throw httpError(
      401,
      isStudentId ? 'Invalid student ID or password' : 'Invalid name or password',
    );
  }
  if (!user.is_active) {
    throw httpError(403, 'This account has been deactivated. Contact an administrator.');
  }

  await query('UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);
  await writeAudit(null, user.id, 'auth.login', 'users', user.id);

  const token = signToken(user);
  return res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      is_cdc: Boolean(user.is_cdc),
    },
  });
}

export async function me(req, res) {
  const user = { ...req.user };
  let profile = null;

  if (user.role === 'student') {
    const { rows } = await query(
      `SELECT s.roll_no, s.department_id, s.year, d.name AS department_name
       FROM students s LEFT JOIN departments d ON d.id = s.department_id
       WHERE s.user_id = ?`,
      [user.id],
    );
    profile = rows[0] || null;
  } else if (user.role === 'faculty') {
    const { rows } = await query(
      `SELECT f.department_id, f.designation, f.is_cdc, d.name AS department_name
       FROM faculty f LEFT JOIN departments d ON d.id = f.department_id
       WHERE f.user_id = ?`,
      [user.id],
    );
    profile = rows[0] ? { ...rows[0], is_cdc: Boolean(rows[0].is_cdc) } : null;
  }

  return res.json({ user: { ...user, profile } });
}

export async function changePassword(req, res) {
  const { current_password: currentPassword, new_password: newPassword } = req.body;

  const { rows } = await query('SELECT password_hash FROM users WHERE id = ?', [req.user.id]);
  const stored = rows[0];
  if (!stored) {
    throw httpError(404, 'User not found');
  }

  const ok = await bcrypt.compare(currentPassword, stored.password_hash);
  if (!ok) {
    throw httpError(400, 'Current password is incorrect');
  }
  if (currentPassword === newPassword) {
    throw httpError(400, 'New password must be different from the current password');
  }

  const hash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
  await query('UPDATE users SET password_hash = ? WHERE id = ?', [hash, req.user.id]);
  await writeAudit(null, req.user.id, 'auth.change_password', 'users', req.user.id);

  return res.json({ message: 'Password updated' });
}
