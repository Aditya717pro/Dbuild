import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as announcements from '../controllers/announcements.controller.js';

const router = Router();
router.use(authenticate);

const createSchema = z
  .object({
    title: z.string().trim().min(3).max(200),
    body: z.string().trim().min(1).max(5000),
    audience: z.enum(['all', 'department', 'course']),
    department_id: z.coerce.number().int().positive().nullable().optional(),
    course_id: z.coerce.number().int().positive().nullable().optional(),
  })
  .refine((data) => data.audience !== 'department' || data.department_id, {
    message: 'department_id is required for department announcements',
    path: ['department_id'],
  })
  .refine((data) => data.audience !== 'course' || data.course_id, {
    message: 'course_id is required for course announcements',
    path: ['course_id'],
  });

const idParams = z.object({ id: z.coerce.number().int().positive() });

router.get('/', asyncHandler(announcements.list));

router.post(
  '/',
  requireRole('admin', 'faculty'),
  validate(createSchema),
  asyncHandler(announcements.create),
);

router.delete(
  '/:id',
  requireRole('admin', 'faculty'),
  validate(idParams, 'params'),
  asyncHandler(announcements.remove),
);

export default router;
