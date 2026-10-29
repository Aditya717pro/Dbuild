import 'dotenv/config';
import bcrypt from 'bcryptjs';
import getPool, { withTransaction } from '../db/pool.js';

const name = process.env.STUDENT_NAME;
const email = process.env.STUDENT_EMAIL;
const password = process.env.STUDENT_PASSWORD;
const rollNo = process.env.STUDENT_ROLL_NO;
const departmentId = process.env.STUDENT_DEPARTMENT_ID
  ? Number(process.env.STUDENT_DEPARTMENT_ID)
  : null;
const year = Number(process.env.STUDENT_YEAR || 1);

if (!name || !email || !password || !rollNo) {
  console.error(
    'Set STUDENT_NAME, STUDENT_EMAIL, STUDENT_PASSWORD and STUDENT_ROLL_NO before running this script.',
  );
  process.exit(1);
}
if (password.length < 8) {
  console.error('STUDENT_PASSWORD must be at least 8 characters.');
  process.exit(1);
}

const hash = await bcrypt.hash(password, 10);
const normalizedEmail = email.toLowerCase();

try {
  const student = await withTransaction(async (client) => {
    const userResult = await client.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES (?, ?, ?, 'student')`,
      [name, normalizedEmail, hash],
    );
    const userId = userResult.insertId;

    await client.query(
      `INSERT INTO students (user_id, roll_no, department_id, year)
       VALUES (?, ?, ?, ?)`,
      [userId, rollNo, departmentId, year],
    );

    const { rows } = await client.query(
      `SELECT u.id AS student_id, u.name, u.email, s.roll_no, s.department_id, s.year
       FROM users u
       JOIN students s ON s.user_id = u.id
       WHERE u.id = ?`,
      [userId],
    );
    return rows[0];
  });

  console.log('Student account ready:');
  console.log(`  student_id: ${student.student_id}`);
  console.log(`  name:       ${student.name}`);
  console.log(`  email:      ${student.email}`);
  console.log(`  roll_no:    ${student.roll_no}`);
  console.log(`  year:       ${student.year}`);
} catch (err) {
  console.error('Failed to create student:', err.message);
  process.exitCode = 1;
} finally {
  await getPool().end();
}
