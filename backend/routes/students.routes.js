import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as students from '../controllers/students.controller.js';

const router = Router();
router.use(authenticate);

const email = z.string().trim().email().max(200).transform((value) => value.toLowerCase());

const studentBase = {
  name: z.string().trim().min(2).max(120),
  email,
  roll_no: z.string().trim().min(1).max(40),
  department_id: z.coerce.number().int().positive().nullable().optional(),
  year: z.coerce.number().int().min(1).max(6),
};

const createSchema = z.object({
  ...studentBase,
  password: z.string().min(8).max(72),
});

const updateSchema = z.object({
  ...studentBase,
  password: z.string().min(8).max(72).optional(),
  is_active: z.boolean(),
});

const idParams = z.object({ id: z.coerce.number().int().positive() });

router.get('/', asyncHandler(students.list));

router.post('/', requireRole('admin'), validate(createSchema), asyncHandler(students.create));

router.put(
  '/:id',
  requireRole('admin'),
  validate(idParams, 'params'),
  validate(updateSchema),
  asyncHandler(students.update),
);

router.delete(
  '/:id',
  requireRole('admin'),
  validate(idParams, 'params'),
  asyncHandler(students.remove),
);

export default router;
