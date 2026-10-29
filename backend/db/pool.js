import 'dotenv/config';
import fs from 'node:fs';
import mysql from 'mysql2/promise';

function parseIntEnv(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function safeDecode(value) {
  if (!value) return '';
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function buildSslConfig() {
  const mode = (process.env.MYSQL_SSL || '').trim().toLowerCase();
  if (mode === 'disable' || mode === 'false' || mode === 'off') {
    return undefined;
  }
  const certVal = (process.env.MYSQL_CA_CERT || '').trim().replace(/^["']|["']$/g, '');
  if (certVal) {
    let ca;
    if (certVal.includes('BEGIN CERTIFICATE')) {
      ca = certVal.replace(/\\n/g, '\n');
    } else {
      if (!fs.existsSync(certVal)) {
        throw new Error(`CA certificate file not found at path: ${certVal}`);
      }
      ca = fs.readFileSync(certVal, 'utf8');
    }
    return { rejectUnauthorized: true, ca };
  }
  return { rejectUnauthorized: true };
}

export function parseConnectionConfig() {
  let url = process.env.MYSQL_URL;
  if (!url) {
    // Construct directly from discrete parts if provided
    const host = process.env.DB_HOST || process.env.MYSQL_HOST;
    const user = process.env.DB_USER || process.env.MYSQL_USER || 'appuser';
    const pass = process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD || '';
    const db = process.env.DB_NAME || process.env.MYSQL_DATABASE || process.env.DB;
    const port = parseIntEnv(process.env.DB_PORT || process.env.MYSQL_PORT, 3306);
    if (!host || !db) {
      throw new Error('Database connection is not configured. Set DB_HOST and DB_NAME (or MYSQL_URL).');
    }
    return {
      host,
      port,
      user,
      password: pass,
      database: db,
    };
  }

  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error('MYSQL_URL is not a valid connection string');
  }

  if (parsed.protocol !== 'mysql:' && parsed.protocol !== 'mysql2:') {
    throw new Error('MYSQL_URL must use the mysql:// scheme');
  }

  const database = safeDecode(parsed.pathname.replace(/^\//, ''));
  if (!database) {
    throw new Error('MYSQL_URL must include a database name');
  }

  return {
    host: parsed.hostname,
    port: parsed.port ? Number(parsed.port) : 3306,
    user: safeDecode(parsed.username),
    password: safeDecode(parsed.password),
    database,
  };
}

function typeCast(field, next) {
  if (field.type === 'TINY' && field.length === 1) {
    const value = field.string();
    return value === null ? null : value === '1';
  }
  return next();
}

function normalizeResult(result) {
  if (Array.isArray(result)) {
    return { rows: result, rowCount: result.length };
  }
  return {
    rows: [],
    rowCount: result.affectedRows ?? 0,
    affectedRows: result.affectedRows ?? 0,
    insertId: result.insertId ?? 0,
  };
}

function createPool() {
  const connection = parseConnectionConfig();
  const max = parseIntEnv(process.env.MYSQL_POOL_MAX, 3);
  const connectionLimit = Math.min(Math.max(max, 1), 3);
  const ssl = buildSslConfig();

  return mysql.createPool({
    ...connection,
    waitForConnections: true,
    connectionLimit,
    maxIdle: connectionLimit,
    idleTimeout: 30000,
    connectTimeout: 10000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    charset: 'utf8mb4',
    timezone: 'Z',
    typeCast,
    ...(ssl ? { ssl } : {}),
  });
}

// Reuse a single pool across serverless invocations on the same instance.
function getPool() {
  if (!globalThis.__cmpMysqlPool) {
    globalThis.__cmpMysqlPool = createPool();
  }
  return globalThis.__cmpMysqlPool;
}

export async function query(sql, params) {
  const [result] = await getPool().query(sql, params);
  return normalizeResult(result);
}

function wrapClient(connection) {
  return {
    query: async (sql, params) => {
      const [result] = await connection.query(sql, params);
      return normalizeResult(result);
    },
  };
}

export async function withTransaction(fn) {
  const connection = await getPool().getConnection();
  try {
    await connection.beginTransaction();
    const result = await fn(wrapClient(connection));
    await connection.commit();
    return result;
  } catch (err) {
    try {
      await connection.rollback();
    } catch (rollbackErr) {
      console.error('[db] rollback failed:', rollbackErr.message);
    }
    throw err;
  } finally {
    connection.release();
  }
}

export default getPool;
