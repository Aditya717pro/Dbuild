import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mysql from 'mysql2/promise';
import { buildSslConfig, parseConnectionConfig } from '../db/pool.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATABASE_SQL_PATH = path.resolve(__dirname, '../../database.sql');
const MIGRATIONS_DIR = path.resolve(__dirname, '../db/migrations');
const BASELINE_FILENAME = '000_baseline';

const CREATE_MIGRATIONS_TABLE = `
  CREATE TABLE IF NOT EXISTS schema_migrations (
    filename   VARCHAR(255) NOT NULL PRIMARY KEY,
    applied_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
`;

function splitSqlStatements(sql) {
  return sql
    .replace(/^\s*--.*$/gm, '')
    .split(';')
    .map((statement) => statement.trim())
    .filter(Boolean);
}

async function applySqlFile(connection, filePath) {
  const sql = await fs.readFile(filePath, 'utf8');
  const statements = splitSqlStatements(sql);

  for (const statement of statements) {
    await connection.query(statement);
  }

  return statements.length;
}

async function readMigrationFiles() {
  try {
    const entries = await fs.readdir(MIGRATIONS_DIR);
    return entries.filter((file) => file.endsWith('.sql')).sort();
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

function migrationConnectionConfig() {
  const base = parseConnectionConfig();
  const ssl = buildSslConfig();

  return {
    ...base,
    user: process.env.DB_MIGRATION_USER || base.user,
    password: process.env.DB_MIGRATION_PASSWORD || base.password,
    charset: 'utf8mb4',
    timezone: 'Z',
    ...(ssl ? { ssl } : {}),
  };
}

async function main() {
  let connection;

  try {
    connection = await mysql.createConnection(migrationConnectionConfig());
    await connection.query(CREATE_MIGRATIONS_TABLE);

    const [rows] = await connection.query('SELECT filename FROM schema_migrations');
    const applied = new Set(rows.map((row) => row.filename));

    if (!applied.has(BASELINE_FILENAME)) {
      console.log('Applying baseline database.sql...');
      const count = await applySqlFile(connection, DATABASE_SQL_PATH);
      await connection.query('INSERT INTO schema_migrations (filename) VALUES (?)', [
        BASELINE_FILENAME,
      ]);
      console.log(`Baseline applied (${count} statements).`);
    } else {
      console.log('Baseline already applied.');
    }

    const migrationFiles = await readMigrationFiles();
    let appliedCount = 0;

    for (const file of migrationFiles) {
      if (applied.has(file)) continue;

      console.log(`Applying migration ${file}...`);
      const count = await applySqlFile(connection, path.join(MIGRATIONS_DIR, file));
      await connection.query('INSERT INTO schema_migrations (filename) VALUES (?)', [file]);
      console.log(`Applied ${file} (${count} statements).`);
      appliedCount += 1;
    }

    if (appliedCount === 0) {
      console.log('No pending migrations.');
    }
  } catch (err) {
    console.error('Database migration failed:', err.message);
    process.exitCode = 1;
  } finally {
    if (connection) await connection.end();
  }
}

main();
