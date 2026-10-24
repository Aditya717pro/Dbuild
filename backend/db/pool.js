import pg from 'pg';

const { Pool } = pg;

function buildSslConfig() {
  if (process.env.PGSSLMODE === 'disable' || process.env.DB_SSL === 'false') {
    return false;
  }
  const ca = (process.env.DB_CA_CERT || '').replace(/\\n/g, '\n').trim();
  if (ca) {
    return { rejectUnauthorized: true, ca };
  }
  return { rejectUnauthorized: true };
}

function createPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not configured');
  }

  const max = Number(process.env.PG_POOL_MAX || 3);
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: Number.isFinite(max) ? Math.min(Math.max(max, 1), 3) : 3,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    ssl: buildSslConfig(),
  });

  pool.on('error', (err) => {
    console.error('[db] unexpected idle client error:', err.message);
  });

  return pool;
}

// Reuse a single pool across serverless invocations on the same instance.
function getPool() {
  if (!globalThis.__cmpPool) {
    globalThis.__cmpPool = createPool();
  }
  return globalThis.__cmpPool;
}

export function query(text, params) {
  return getPool().query(text, params);
}

export async function withTransaction(fn) {
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    try {
      await client.query('ROLLBACK');
    } catch (rollbackErr) {
      console.error('[db] rollback failed:', rollbackErr.message);
    }
    throw err;
  } finally {
    client.release();
  }
}

export default getPool;
