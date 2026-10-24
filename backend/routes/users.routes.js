import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as users from '../controllers/users.controller.js';

const router = Router();
router.use(authenticate, requireRole('admin'));

const createAdminSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200).transform((value) => value.toLowerCase()),
  password: z.string().min(8).max(72),
});

router.get('/', asyncHandler(users.list));
router.post('/', validate(createAdminSchema), asyncHandler(users.createAdmin));

export default router;
