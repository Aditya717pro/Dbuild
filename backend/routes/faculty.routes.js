import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as faculty from '../controllers/faculty.controller.js';

const router = Router();
router.use(authenticate);

const email = z.string().trim().email().max(200).transform((value) => value.toLowerCase());

const facultyBase = {
  name: z.string().trim().min(2).max(120),
  email,
  department_id: z.coerce.number().int().positive().nullable().optional(),
  designation: z.string().trim().max(120).nullable().optional(),
  is_cdc: z.boolean().optional(),
};

const createSchema = z.object({
  ...facultyBase,
  password: z.string().min(8).max(72),
});

const updateSchema = z.object({
  ...facultyBase,
  password: z.string().min(8).max(72).optional(),
  is_active: z.boolean(),
});

const idParams = z.object({ id: z.coerce.number().int().positive() });
const rosterQuery = z.object({
  department_id: z.coerce.number().int().positive().optional(),
});

router.get('/', requireRole('admin', 'faculty'), asyncHandler(faculty.list));
router.get(
  '/roster',
  requireRole('admin', 'faculty'),
  validate(rosterQuery, 'query'),
  asyncHandler(faculty.roster),
);

router.post('/', requireRole('admin'), validate(createSchema), asyncHandler(faculty.create));

router.put(
  '/:id',
  requireRole('admin'),
  validate(idParams, 'params'),
  validate(updateSchema),
  asyncHandler(faculty.update),
);

router.delete(
  '/:id',
  requireRole('admin'),
  validate(idParams, 'params'),
  asyncHandler(faculty.remove),
);

export default router;
