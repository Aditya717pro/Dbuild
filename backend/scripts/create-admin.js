import 'dotenv/config';
import bcrypt from 'bcryptjs';
import getPool, { query } from '../db/pool.js';

const name = process.env.ADMIN_NAME;
const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

if (!name || !email || !password) {
  console.error(
    'Set ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD environment variables before running this script.',
  );
  process.exit(1);
}
if (password.length < 8) {
  console.error('ADMIN_PASSWORD must be at least 8 characters.');
  process.exit(1);
}

const hash = await bcrypt.hash(password, 10);
const normalizedEmail = email.toLowerCase();

try {
  await query(
    `INSERT INTO users (name, email, password_hash, role, is_active)
     VALUES (?, ?, ?, 'admin', 1)
     ON DUPLICATE KEY UPDATE name = VALUES(name), password_hash = VALUES(password_hash),
                   role = 'admin', is_active = 1`,
    [name, normalizedEmail, hash],
  );

  const { rows } = await query(
    'SELECT id, name, email, role FROM users WHERE email = ?',
    [normalizedEmail],
  );
  console.log('Admin user ready:', rows[0].email, `(id ${rows[0].id})`);
} catch (err) {
  console.error('Failed to create admin user:', err.message);
  process.exitCode = 1;
} finally {
  await getPool().end();
}
