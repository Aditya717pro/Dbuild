import bcrypt from 'bcryptjs';
import { query } from '../db/pool.js';
import { signToken } from '../utils/jwt.js';
import { writeAudit } from '../utils/audit.js';
import { httpError } from '../utils/httpError.js';

const BCRYPT_ROUNDS = 10;

export async function login(req, res) {
  const { email, password } = req.body;

  const { rows } = await query(
    `SELECT u.id, u.name, u.email, u.password_hash, u.role, u.is_active
     FROM users u
     LEFT JOIN students s ON s.user_id = u.id
     WHERE u.email = ? OR s.roll_no = ?
     LIMIT 1`,
    [email, email],
  );
  const user = rows[0];
  const passwordOk = user ? await bcrypt.compare(password, user.password_hash) : false;

  if (!user || !passwordOk) {
    throw httpError(401, 'Invalid email or password');
  }
  if (!user.is_active) {
    throw httpError(403, 'This account has been deactivated. Contact an administrator.');
  }

  await query('UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);
  await writeAudit(null, user.id, 'auth.login', 'users', user.id);

  const token = signToken(user);
  return res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
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
      `SELECT f.department_id, f.designation, d.name AS department_name
       FROM faculty f LEFT JOIN departments d ON d.id = f.department_id
       WHERE f.user_id = ?`,
      [user.id],
    );
    profile = rows[0] || null;
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
