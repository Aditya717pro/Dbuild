import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import { loginLimiter } from '../middleware/rateLimit.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as auth from '../controllers/auth.controller.js';

const router = Router();

const identifier = z
  .string()
  .trim()
  .min(1)
  .max(200)
  .transform((value) => value.toLowerCase());

const loginSchema = z.object({
  email: identifier,
  password: z.string().min(1).max(200),
});

const changePasswordSchema = z.object({
  current_password: z.string().min(1).max(200),
  new_password: z.string().min(8).max(72),
});

router.post('/login', loginLimiter, validate(loginSchema), asyncHandler(auth.login));
router.get('/me', authenticate, asyncHandler(auth.me));
router.post(
  '/change-password',
  authenticate,
  validate(changePasswordSchema),
  asyncHandler(auth.changePassword),
);

export default router;
