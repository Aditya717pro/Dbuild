import 'dotenv/config';
import app from './api/index.js';

if (process.env.NODE_ENV === 'production') {
  console.error(
    'server.js is for local development only. On Vercel the app is exported from api/index.js.',
  );
  process.exit(1);
}

const port = Number(process.env.PORT || 5000);

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}/api`);
});
