import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as attendance from '../controllers/attendance.controller.js';

const router = Router();
router.use(authenticate);

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use a date in YYYY-MM-DD format');

const sessionQuery = z.object({
  course_id: z.coerce.number().int().positive(),
  date,
});

const submitSchema = z.object({
  course_id: z.coerce.number().int().positive(),
  date,
  records: z
    .array(
      z.object({
        student_id: z.coerce.number().int().positive(),
        status: z.enum(['present', 'absent']),
      }),
    )
    .min(1, 'At least one attendance record is required')
    .refine(
      (records) => new Set(records.map((r) => r.student_id)).size === records.length,
      'Duplicate students in attendance records',
    ),
});

const courseParams = z.object({ courseId: z.coerce.number().int().positive() });

router.get(
  '/session',
  requireRole('admin', 'faculty'),
  validate(sessionQuery, 'query'),
  asyncHandler(attendance.session),
);

router.post(
  '/',
  requireRole('admin', 'faculty'),
  validate(submitSchema),
  asyncHandler(attendance.submit),
);

router.get('/me', requireRole('student'), asyncHandler(attendance.myAttendance));

router.get(
  '/students',
  requireRole('admin', 'faculty'),
  asyncHandler(attendance.studentOverview),
);

router.get(
  '/course/:courseId/summary',
  requireRole('admin', 'faculty'),
  validate(courseParams, 'params'),
  asyncHandler(attendance.courseSummary),
);

export default router;
