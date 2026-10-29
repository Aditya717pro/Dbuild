import 'dotenv/config';
import app from './api/index.js';
import { query } from './db/pool.js';

if (process.env.NODE_ENV === 'production') {
  console.error(
    'server.js is for local development only. On Vercel the app is exported from api/index.js.',
  );
  process.exit(1);
}

const port = Number(process.env.PORT || 5000);

async function start() {
  try {
    await query('SELECT 1');
    console.log('Database connection OK');
  } catch (err) {
    console.error(`Database connection failed: ${err.message}`);
    process.exit(1);
  }

  app.listen(port, () => {
    console.log(`API listening on http://localhost:${port}/api`);
  });
}

start();
