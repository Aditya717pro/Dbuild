import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as records from '../controllers/records.controller.js';

const router = Router();
router.use(authenticate);
router.use(requireRole('student'));

router.get('/me/marksheets', asyncHandler(records.marksheets));
router.get('/me/fees', asyncHandler(records.fees));

export default router;
