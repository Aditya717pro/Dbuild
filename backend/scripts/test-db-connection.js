import 'dotenv/config';
import getPool, { query } from '../db/pool.js';

const REQUIRED_TABLES = [
  'users',
  'departments',
  'students',
  'faculty',
  'courses',
  'enrollments',
  'attendance',
  'announcements',
  'audit_logs',
];

function sanitizeErrorMessage(msg) {
  if (!msg) return 'Unknown error';
  // Strip out any accidental user:pass URI strings or password values
  return msg
    .replace(/(mysql:\/\/[^:]+:)[^@]+(@)/i, '$1***$2')
    .replace(/password: [^\s,)]+/gi, 'password: [REDACTED]');
}

async function runTest() {
  console.log('--------------------------------------------------');
  console.log('Testing MySQL Connection');
  console.log('--------------------------------------------------');

  const host = process.env.DB_HOST || process.env.MYSQL_HOST || '(not set)';
  const port = process.env.DB_PORT || process.env.MYSQL_PORT || '3306';
  const user = process.env.DB_USER || process.env.MYSQL_USER || '(not set)';
  const db = process.env.DB_NAME || process.env.MYSQL_DATABASE || '(not set)';
  const sslMode = process.env.MYSQL_SSL || '(unset)';

  console.log(`Target Host: ${host}`);
  console.log(`Target Port: ${port}`);
  console.log(`Target User: ${user}`);
  console.log(`Database:    ${db}`);
  console.log(`SSL Mode:    ${sslMode}`);

  console.log('\nAttempting database handshake and query...');

  const pool = getPool();
  try {
    const { rows: testRows } = await query(
      'SELECT VERSION() AS version, CURRENT_USER() AS currentUser, DATABASE() AS currentDb',
    );
    const { rows: sslRows } = await query(
      "SHOW SESSION STATUS WHERE Variable_name = 'Ssl_cipher' OR Variable_name = 'Ssl_version'",
    );

    const sslMap = Object.fromEntries(sslRows.map((r) => [r.Variable_name, r.Value]));
    const sslCipher = sslMap.Ssl_cipher || null;
    const sslVersion = sslMap.Ssl_version || null;

    const info = testRows[0] || {};
    console.log('[SUCCESS] Successfully connected to MySQL server!');
    console.log(`- MySQL Version: ${info.version || 'unknown'}`);
    console.log(`- Authenticated User: ${info.currentUser || 'unknown'}`);
    console.log(`- Connected Database: ${info.currentDb || 'unknown'}`);
    console.log(`- TLS Version: ${sslVersion || 'None'}`);
    console.log(`- TLS Cipher in use: ${sslCipher || 'None (plain)'}`);

    if (sslCipher) {
      console.log('[PASS] Secure encrypted TLS connection verified.');
    } else {
      console.log('[INFO] Connected without TLS (expected when MYSQL_SSL=disable).');
    }

    console.log('\nChecking application schema tables in database...');
    const { rows: tableRows } = await query(
      `SELECT table_name AS tableName
       FROM information_schema.tables
       WHERE table_schema = DATABASE()`,
    );

    const existingTables = new Set(tableRows.map((r) => r.tableName.toLowerCase()));
    const missingTables = REQUIRED_TABLES.filter((t) => !existingTables.has(t));

    console.log(`Existing tables in '${info.currentDb}': ${[...existingTables].join(', ') || '(none)'}`);

    if (missingTables.length === 0) {
      console.log('[PASS] All 9 required application tables are present.');
    } else {
      console.warn(`[NOTICE] Missing tables: ${missingTables.join(', ')}`);
      console.log(
        'To initialize or update the tables, run npm run db:update from backend/ (or import database.sql for a fresh database).',
      );
    }

    // Check row counts on users table if it exists
    if (existingTables.has('users')) {
      const { rows: countRows } = await query('SELECT COUNT(*) AS total FROM users');
      console.log(`- Registered users in database: ${countRows[0]?.total ?? 0}`);
    }

    console.log('--------------------------------------------------');
    console.log('Test completed successfully.');
    console.log('--------------------------------------------------');
  } catch (err) {
    console.error('\n[ERROR] Connection test failed:');
    console.error(sanitizeErrorMessage(err.message));
    if (err.code) {
      console.error(`Error Code: ${err.code}`);
    }
    process.exitCode = 1;
  } finally {
    try {
      await pool.end();
    } catch {
      // ignore close errors
    }
  }
}

runTest();
