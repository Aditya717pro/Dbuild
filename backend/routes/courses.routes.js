import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as courses from '../controllers/courses.controller.js';

const router = Router();
router.use(authenticate);

const courseSchema = z.object({
  code: z.string().trim().min(2).max(20),
  name: z.string().trim().min(2).max(200),
  department_id: z.coerce.number().int().positive().nullable().optional(),
  faculty_id: z.coerce.number().int().positive().nullable().optional(),
  semester: z.coerce.number().int().min(1).max(12).nullable().optional(),
});

const idParams = z.object({ id: z.coerce.number().int().positive() });

router.get('/', asyncHandler(courses.list));

router.post('/', requireRole('admin'), validate(courseSchema), asyncHandler(courses.create));

router.put(
  '/:id',
  requireRole('admin'),
  validate(idParams, 'params'),
  validate(courseSchema),
  asyncHandler(courses.update),
);

router.delete(
  '/:id',
  requireRole('admin'),
  validate(idParams, 'params'),
  asyncHandler(courses.remove),
);

export default router;
