import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { authenticate, requireCdcOrAdmin } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as placementPosters from '../controllers/placementPosters.controller.js';

const router = Router();
router.use(authenticate);
router.use(requireCdcOrAdmin('Only CDC faculty and administrators can manage placement posters'));

const dateString = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use date format YYYY-MM-DD');

const createSchema = z.object({
  title: z.string().trim().min(3).max(200),
  company: z.string().trim().min(1).max(160),
  drive_date: dateString,
  venue: z.string().trim().min(1).max(200),
  eligibility: z.string().trim().min(1).max(500),
  registration_deadline: dateString.nullable().optional(),
  description: z.string().trim().max(3000).nullable().optional(),
  apply_url: z.string().trim().max(500).nullable().optional(),
  department_id: z.coerce.number().int().positive().nullable().optional(),
  image_data: z.string().min(1).max(6_000_000),
});

const idParams = z.object({ id: z.coerce.number().int().positive() });

router.get('/', asyncHandler(placementPosters.list));
router.post('/', validate(createSchema), asyncHandler(placementPosters.create));
router.delete('/:id', validate(idParams, 'params'), asyncHandler(placementPosters.remove));

export default router;
