import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { query } from '../db/pool.js';
import { errorHandler, notFound } from '../middleware/error.js';
import { writeLimiter } from '../middleware/rateLimit.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import authRoutes from '../routes/auth.routes.js';
import departmentRoutes from '../routes/departments.routes.js';
import courseRoutes from '../routes/courses.routes.js';
import studentRoutes from '../routes/students.routes.js';
import facultyRoutes from '../routes/faculty.routes.js';
import enrollmentRoutes from '../routes/enrollments.routes.js';
import attendanceRoutes from '../routes/attendance.routes.js';
import recordsRoutes from '../routes/records.routes.js';
import announcementRoutes from '../routes/announcements.routes.js';
import publicRoutes from '../routes/public.routes.js';
import placementPosterRoutes from '../routes/placementPosters.routes.js';
import innovationRoutes from '../routes/innovation.routes.js';
import userRoutes from '../routes/users.routes.js';

const app = express();

app.disable('x-powered-by');
app.set('trust proxy', 1);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
);

const jsonParser = express.json({ limit: '100kb' });
const uploadJsonParser = express.json({ limit: '12mb' });
app.use((req, res, next) => {
  const isUpload =
    (req.method === 'POST' && /\/(placement-posters|announcements)\/?$/.test(req.url))
    || (['POST', 'PUT'].includes(req.method) && /\/innovation\/(ideas|projects)(\/|$)/.test(req.url));
  return (isUpload ? uploadJsonParser : jsonParser)(req, res, next);
});

const allowedOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((origin) => origin.trim().replace(/\/+$/, ''))
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Same-origin / server-to-server requests have no Origin header.
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin.replace(/\/+$/, ''))) return callback(null, true);
      // In local development allow any origin when FRONTEND_URL is unset.
      if (allowedOrigins.length === 0 && process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      // Reject without CORS headers; the browser blocks the response.
      return callback(null, false);
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
    maxAge: 86400,
  }),
);

// Vercel may hand the rewrite destination (/api/index) to the function.
// Normalise it back to the /api prefix so Express routing matches.
app.use((req, _res, next) => {
  req.url = req.url.replace(/^\/api\/index(?:\.js)?(?=\/|$)/, '/api');
  next();
});

app.use(writeLimiter);

app.get(
  '/api/health',
  asyncHandler(async (_req, res) => {
    try {
      await query('SELECT 1');
      return res.json({ status: 'ok', database: 'up', timestamp: new Date().toISOString() });
    } catch (err) {
      console.error('[health] database check failed:', err.message);
      return res.status(503).json({ status: 'error', database: 'down' });
    }
  }),
);

app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/records', recordsRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/placement-posters', placementPosterRoutes);
app.use('/api/innovation', innovationRoutes);
app.use('/api/users', userRoutes);

app.get('/api', (_req, res) => {
  res.json({ service: 'college-management-portal-api', status: 'ok' });
});

app.use(notFound);
app.use(errorHandler);

export default app;
