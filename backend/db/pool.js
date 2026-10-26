import mysql from 'mysql2/promise';

function parseIntEnv(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function buildSslConfig() {
  const mode = (process.env.MYSQL_SSL || '').trim().toLowerCase();
  if (mode === 'disable' || mode === 'false' || mode === 'off') {
    return undefined;
  }
  const ca = (process.env.MYSQL_CA_CERT || '').replace(/\\n/g, '\n').trim();
  if (ca) {
    return { rejectUnauthorized: true, ca };
  }
  return { rejectUnauthorized: true };
}

function parseConnectionConfig() {
  const url = process.env.MYSQL_URL;
  if (!url) {
    throw new Error('MYSQL_URL is not configured');
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

  const database = decodeURIComponent(parsed.pathname.replace(/^\//, ''));
  if (!database) {
    throw new Error('MYSQL_URL must include a database name');
  }

  return {
    host: parsed.hostname,
    port: parsed.port ? Number(parsed.port) : 3306,
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
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
