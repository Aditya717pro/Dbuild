import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as publicController from '../controllers/public.controller.js';
import * as placementPostersController from '../controllers/placementPosters.controller.js';
import * as announcementsController from '../controllers/announcements.controller.js';

const router = Router();

const publicLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
});

router.get('/announcements', publicLimiter, asyncHandler(publicController.publicAnnouncements));
router.get(
  '/announcements/:id/image',
  publicLimiter,
  asyncHandler(announcementsController.getAnnouncementImage),
);
router.get('/departments/:code/faculty', publicLimiter, asyncHandler(publicController.publicDepartmentFaculty));
router.get(
  '/placement-posters',
  publicLimiter,
  asyncHandler(placementPostersController.publicList),
);
router.get(
  '/placement-posters/:id/image',
  publicLimiter,
  asyncHandler(placementPostersController.publicImage),
);

export default router;
