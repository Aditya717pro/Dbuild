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
  .max(200);

const loginSchema = z
  .object({
    name: identifier.optional(),
    email: identifier.optional(),
    identifier: identifier.optional(),
    password: z.string().min(1).max(200),
  })
  .refine((data) => Boolean(data.name || data.email || data.identifier), {
    message: 'Name or identifier is required',
    path: ['name'],
  })
  .transform((data) => {
    const raw = (data.name || data.identifier || data.email || '').trim();
    return {
      ...data,
      name: raw,
      identifier: raw,
      email: raw,
    };
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
