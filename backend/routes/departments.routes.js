import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as departments from '../controllers/departments.controller.js';

const router = Router();
router.use(authenticate);

const departmentSchema = z.object({
  name: z.string().trim().min(2).max(120),
  code: z.string().trim().min(2).max(20),
});

const idParams = z.object({ id: z.coerce.number().int().positive() });

router.get('/', asyncHandler(departments.list));

router.post(
  '/',
  requireRole('admin'),
  validate(departmentSchema),
  asyncHandler(departments.create),
);

router.put(
  '/:id',
  requireRole('admin'),
  validate(idParams, 'params'),
  validate(departmentSchema),
  asyncHandler(departments.update),
);

router.delete(
  '/:id',
  requireRole('admin'),
  validate(idParams, 'params'),
  asyncHandler(departments.remove),
);

export default router;
