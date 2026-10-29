import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { resolveDemoPassword } from '../config/demo.js';
import getPool, { query } from '../db/pool.js';

const ACCOUNTS = [
  { name: 'Admin', email: 'admin@example.com', passwordRole: 'admin' },
  { name: 'Harry Potter', email: 'harry.potter@example.com', passwordRole: 'student' },
  { name: 'Ron Weasley', email: 'ron.weasley@example.com', passwordRole: 'student' },
  { name: 'Hermione Granger', email: 'hermione.granger@example.com', passwordRole: 'student' },
  { name: 'Severus Snape', email: 'severus.snape@example.com', passwordRole: 'faculty' },
  { name: 'Albus Dumbledore', email: 'albus.dumbledore@example.com', passwordRole: 'faculty' },
];

let failures = 0;

try {
  for (const account of ACCOUNTS) {
    const password = resolveDemoPassword(account.passwordRole);

    const { rows } = await query(
      'SELECT id, name, email, role, password_hash FROM users WHERE email = ?',
      [account.email],
    );
    const user = rows[0];

    if (!user) {
      console.error(`FAIL ${account.name}: account not found (${account.email})`);
      failures += 1;
      continue;
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    console.log(
      `${ok ? 'PASS' : 'FAIL'} ${user.role.padEnd(7)} ${user.name} (${user.email}, id ${user.id})`,
    );
    if (!ok) failures += 1;
  }
} finally {
  await getPool().end();
}

if (failures > 0) {
  console.error(`${failures} demo account check(s) failed.`);
  process.exitCode = 1;
} else {
  console.log('All six demo passwords match the stored bcrypt hashes.');
}
