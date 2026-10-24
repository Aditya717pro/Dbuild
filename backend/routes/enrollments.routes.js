import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as enrollments from '../controllers/enrollments.controller.js';

const router = Router();
router.use(authenticate);

const createSchema = z.object({
  student_id: z.coerce.number().int().positive(),
  course_id: z.coerce.number().int().positive(),
});

const idParams = z.object({ id: z.coerce.number().int().positive() });

router.get('/', asyncHandler(enrollments.list));

router.post('/', requireRole('admin'), validate(createSchema), asyncHandler(enrollments.create));

router.delete(
  '/:id',
  requireRole('admin'),
  validate(idParams, 'params'),
  asyncHandler(enrollments.remove),
);

export default router;
