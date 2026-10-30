import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as dashboard from '../controllers/innovation/dashboard.controller.js';
import * as ideas from '../controllers/innovation/ideas.controller.js';
import * as projects from '../controllers/innovation/projects.controller.js';
import * as mentors from '../controllers/innovation/mentors.controller.js';
import * as startups from '../controllers/innovation/startups.controller.js';
import * as events from '../controllers/innovation/events.controller.js';
import * as lab from '../controllers/innovation/lab.controller.js';
import * as research from '../controllers/innovation/research.controller.js';

const router = Router();

const dateString = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use date format YYYY-MM-DD');
const timeString = z
  .string()
  .trim()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Use time format HH:MM');
const dateTimeString = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}T([01]\d|2[0-3]):[0-5]\d$/, 'Use date and time format YYYY-MM-DDTHH:MM');
const optionalText = (max) => z.string().trim().max(max).nullable().optional();
const optionalId = z.coerce.number().int().positive().nullable().optional();
const optionalDate = dateString.nullable().optional();
const fileSchema = z.object({
  file_name: z.string().trim().min(1).max(255),
  mime: z.string().trim().min(1).max(100),
  data: z.string().min(16),
});
const feedbackSchema = z.object({
  message: z.string().trim().min(3).max(4000),
});
const idParams = z.object({ id: z.coerce.number().int().positive() });
const mediaParams = z.object({
  id: z.coerce.number().int().positive(),
  mediaId: z.coerce.number().int().positive(),
});
const mediaParamsPublic = z.object({
  kind: z.enum(['idea', 'project']),
  id: z.coerce.number().int().positive(),
});

const ideaSchema = z.object({
  title: z.string().trim().min(3).max(200),
  category: z.string().trim().min(2).max(60),
  problem_statement: z.string().trim().min(20).max(5000),
  proposed_solution: z.string().trim().min(20).max(5000),
  technology: optionalText(300),
  team_members: optionalText(500),
  department_id: optionalId,
  year_of_study: optionalText(30),
  expected_outcome: optionalText(3000),
  status: z.enum(['draft', 'submitted']).optional(),
  images: z.array(fileSchema).max(2).optional(),
  document: fileSchema.nullable().optional(),
});
const ideaUpdateSchema = ideaSchema.omit({ images: true, document: true });
const ideaReviewSchema = z.object({
  status: z.enum(['under_review', 'approved', 'rejected', 'prototype_development', 'completed']),
  review_note: optionalText(4000),
  mentor_id: optionalId,
});

const projectSchema = z.object({
  idea_id: optionalId,
  title: z.string().trim().min(3).max(200),
  description: z.string().trim().min(20).max(5000),
  problem_solved: optionalText(5000),
  technology: optionalText(300),
  team_members: optionalText(500),
  department_id: optionalId,
  mentor_id: optionalId,
  github_url: optionalText(500),
  demo_url: optionalText(500),
  status: z.enum(['planning', 'in_development', 'prototype', 'testing', 'completed', 'on_hold']).default('planning'),
  progress: z.coerce.number().int().min(0).max(100).default(0),
  is_featured: z.boolean().optional(),
  images: z.array(fileSchema).max(3).optional(),
  document: fileSchema.nullable().optional(),
});
const projectUpdateSchema = projectSchema.omit({ idea_id: true, images: true, document: true });

const mentorSchema = z.object({
  user_id: z.coerce.number().int().positive(),
  expertise: z.string().trim().min(3).max(300),
  bio: optionalText(3000),
  availability: optionalText(300),
  max_mentees: z.coerce.number().int().min(1).max(100).default(5),
  is_available: z.boolean().default(true),
});
const mentorUpdateSchema = mentorSchema.omit({ user_id: true });
const mentorRequestSchema = z.object({
  mentor_id: z.coerce.number().int().positive(),
  idea_id: optionalId,
  project_id: optionalId,
  message: z.string().trim().min(10).max(3000),
});
const mentorRequestUpdateSchema = z.object({
  status: z.enum(['accepted', 'rejected', 'completed', 'cancelled', 'pending']),
  scheduled_at: dateTimeString.nullable().optional(),
  mentor_notes: optionalText(4000),
});

const startupSchema = z.object({
  name: z.string().trim().min(2).max(200),
  tagline: optionalText(200),
  description: z.string().trim().min(20).max(5000),
  problem: optionalText(5000),
  solution: optionalText(5000),
  market_opportunity: optionalText(5000),
  business_model: optionalText(5000),
  team_members: optionalText(500),
  funding_required: z.coerce.number().min(0).max(9999999999).nullable().optional(),
  stage: z.enum([
    'idea_generation', 'idea_validation', 'business_model', 'prototype',
    'market_validation', 'incubation', 'launched',
  ]).default('idea_generation'),
  application_status: z.enum(['draft', 'submitted']).optional(),
  website_url: optionalText(500),
});
const startupUpdateSchema = startupSchema.extend({
  application_status: z.enum(['draft', 'submitted', 'under_review', 'approved', 'rejected']).optional(),
});
const startupReviewSchema = z.object({
  application_status: z.enum(['under_review', 'approved', 'rejected']),
  review_note: optionalText(4000),
  stage: z.enum([
    'idea_generation', 'idea_validation', 'business_model', 'prototype',
    'market_validation', 'incubation', 'launched',
  ]).optional(),
  mentor_id: optionalId,
});

const eventSchema = z.object({
  title: z.string().trim().min(3).max(200),
  type: z.enum(['hackathon', 'ideathon', 'competition', 'workshop', 'seminar', 'entrepreneurship', 'challenge']),
  description: z.string().trim().min(20).max(5000),
  event_date: dateString,
  start_time: timeString.nullable().optional(),
  end_time: timeString.nullable().optional(),
  venue: z.string().trim().min(2).max(200),
  registration_deadline: optionalDate,
  max_participants: z.coerce.number().int().positive().nullable().optional(),
  team_size_min: z.coerce.number().int().min(1).max(100).default(1),
  team_size_max: z.coerce.number().int().min(1).max(100).default(1),
  status: z.enum(['upcoming', 'ongoing', 'completed', 'cancelled']).default('upcoming'),
}).refine((value) => value.team_size_max >= value.team_size_min, {
  message: 'Maximum team size cannot be smaller than the minimum',
  path: ['team_size_max'],
});
const eventRegistrationSchema = z.object({
  team_name: optionalText(120),
  team_members: optionalText(3000),
});
const eventRegistrationUpdateSchema = z.object({
  status: z.enum(['registered', 'waitlisted', 'cancelled', 'attended']),
});
const eventRegistrationParams = z.object({
  id: z.coerce.number().int().positive(),
  registrationId: z.coerce.number().int().positive(),
});

const equipmentSchema = z.object({
  name: z.string().trim().min(2).max(160),
  category: z.string().trim().min(2).max(80),
  description: optionalText(3000),
  quantity: z.coerce.number().int().min(1).max(999).default(1),
  status: z.enum(['available', 'maintenance', 'retired']).default('available'),
});
const bookingSchema = z.object({
  equipment_id: optionalId,
  facility: optionalText(160),
  purpose: z.string().trim().min(10).max(3000),
  requested_date: dateString,
  start_time: timeString,
  end_time: timeString,
  team_size: z.coerce.number().int().min(1).max(100).default(1),
});
const bookingUpdateSchema = z.object({
  status: z.enum(['approved', 'rejected', 'completed', 'cancelled']),
  admin_note: optionalText(3000),
});

const researchSchema = z.object({
  title: z.string().trim().min(3).max(250),
  abstract: z.string().trim().min(20).max(8000),
  type: z.enum(['student_project', 'faculty_project', 'published_paper', 'industry_collaboration']),
  department_id: optionalId,
  guide_id: optionalId,
  status: z.enum(['ongoing', 'completed', 'published', 'patented']).default('ongoing'),
  funding_amount: z.coerce.number().min(0).max(9999999999).nullable().optional(),
  funding_agency: optionalText(200),
  collaboration_partner: optionalText(200),
  published_on: optionalDate,
  paper_url: optionalText(500),
  progress: z.coerce.number().int().min(0).max(100).default(0),
});
const patentSchema = z.object({
  title: z.string().trim().min(3).max(250),
  patent_number: optionalText(100),
  status: z.enum(['draft', 'filed', 'published', 'granted', 'rejected']).default('draft'),
  inventors: z.string().trim().min(2).max(500),
  department_id: optionalId,
  filing_date: optionalDate,
  grant_date: optionalDate,
  description: optionalText(5000),
  document_url: optionalText(500),
});
const broadcastSchema = z.object({
  audience: z.enum(['all', 'student', 'faculty', 'admin']).default('all'),
  title: z.string().trim().min(3).max(200),
  message: z.string().trim().min(3).max(3000),
});

router.get('/showcase', asyncHandler(dashboard.publicShowcase));
router.get('/media/:kind/:id', validate(mediaParamsPublic, 'params'), asyncHandler(dashboard.media));

router.use(authenticate);

router.get('/dashboard', asyncHandler(dashboard.dashboard));
router.get('/notifications', asyncHandler(dashboard.notifications));
router.post('/notifications/read-all', asyncHandler(dashboard.markAllNotificationsRead));
router.post('/notifications/:id/read', validate(idParams, 'params'), asyncHandler(dashboard.markNotificationRead));
router.post(
  '/notifications/broadcast',
  requireRole('admin'),
  validate(broadcastSchema),
  asyncHandler(dashboard.broadcastNotification),
);

router.get('/ideas', asyncHandler(ideas.listIdeas));
router.post('/ideas', validate(ideaSchema), asyncHandler(ideas.createIdea));
router.get('/ideas/:id', validate(idParams, 'params'), asyncHandler(ideas.getIdea));
router.put('/ideas/:id', validate(idParams, 'params'), validate(ideaUpdateSchema), asyncHandler(ideas.updateIdea));
router.delete('/ideas/:id', validate(idParams, 'params'), asyncHandler(ideas.deleteIdea));
router.post('/ideas/:id/submit', validate(idParams, 'params'), asyncHandler(ideas.submitIdea));
router.post(
  '/ideas/:id/review',
  requireRole('admin'),
  validate(idParams, 'params'),
  validate(ideaReviewSchema),
  asyncHandler(ideas.reviewIdea),
);
router.post(
  '/ideas/:id/feedback',
  requireRole('admin', 'faculty'),
  validate(idParams, 'params'),
  validate(feedbackSchema),
  asyncHandler(ideas.ideaFeedback),
);
router.delete(
  '/ideas/:id/media/:mediaId',
  validate(mediaParams, 'params'),
  asyncHandler(ideas.deleteIdeaMedia),
);

router.get('/projects', asyncHandler(projects.listProjects));
router.post('/projects', validate(projectSchema), asyncHandler(projects.createProject));
router.get('/projects/:id', validate(idParams, 'params'), asyncHandler(projects.getProject));
router.put(
  '/projects/:id',
  validate(idParams, 'params'),
  validate(projectUpdateSchema),
  asyncHandler(projects.updateProject),
);
router.delete('/projects/:id', validate(idParams, 'params'), asyncHandler(projects.deleteProject));
router.post(
  '/projects/:id/feedback',
  requireRole('admin', 'faculty'),
  validate(idParams, 'params'),
  validate(feedbackSchema),
  asyncHandler(projects.projectFeedback),
);
router.post(
  '/projects/:id/media',
  validate(idParams, 'params'),
  validate(z.object({ images: z.array(fileSchema).min(1).max(3) })),
  asyncHandler(projects.addProjectMedia),
);

router.get('/mentors', asyncHandler(mentors.listMentors));
router.post(
  '/mentors',
  requireRole('admin'),
  validate(mentorSchema),
  asyncHandler(mentors.saveMentor),
);
router.put(
  '/mentors/:id',
  requireRole('admin', 'faculty'),
  validate(idParams, 'params'),
  validate(mentorUpdateSchema),
  asyncHandler(mentors.updateMentor),
);
router.delete('/mentors/:id', requireRole('admin'), validate(idParams, 'params'), asyncHandler(mentors.deleteMentor));
router.get('/mentor-requests', asyncHandler(mentors.listMentorRequests));
router.post(
  '/mentor-requests',
  requireRole('student'),
  validate(mentorRequestSchema),
  asyncHandler(mentors.createMentorRequest),
);
router.put(
  '/mentor-requests/:id',
  validate(idParams, 'params'),
  validate(mentorRequestUpdateSchema),
  asyncHandler(mentors.updateMentorRequest),
);

router.get('/startups', asyncHandler(startups.listStartups));
router.post('/startups', validate(startupSchema), asyncHandler(startups.createStartup));
router.get('/startups/:id', validate(idParams, 'params'), asyncHandler(startups.getStartup));
router.put(
  '/startups/:id',
  validate(idParams, 'params'),
  validate(startupUpdateSchema),
  asyncHandler(startups.updateStartup),
);
router.delete('/startups/:id', validate(idParams, 'params'), asyncHandler(startups.deleteStartup));
router.post(
  '/startups/:id/review',
  requireRole('admin'),
  validate(idParams, 'params'),
  validate(startupReviewSchema),
  asyncHandler(startups.reviewStartup),
);

router.get('/events', asyncHandler(events.listEvents));
router.post('/events', requireRole('admin'), validate(eventSchema), asyncHandler(events.createEvent));
router.put(
  '/events/:id',
  requireRole('admin'),
  validate(idParams, 'params'),
  validate(eventSchema),
  asyncHandler(events.updateEvent),
);
router.delete('/events/:id', requireRole('admin'), validate(idParams, 'params'), asyncHandler(events.deleteEvent));
router.post(
  '/events/:id/register',
  validate(idParams, 'params'),
  validate(eventRegistrationSchema),
  asyncHandler(events.registerForEvent),
);
router.get(
  '/events/:id/registrations',
  requireRole('admin'),
  validate(idParams, 'params'),
  asyncHandler(events.listEventRegistrations),
);
router.put(
  '/events/:id/registrations/:registrationId',
  requireRole('admin'),
  validate(eventRegistrationParams, 'params'),
  validate(eventRegistrationUpdateSchema),
  asyncHandler(events.updateEventRegistration),
);

router.get('/lab/equipment', asyncHandler(lab.listEquipment));
router.post('/lab/equipment', requireRole('admin'), validate(equipmentSchema), asyncHandler(lab.createEquipment));
router.put(
  '/lab/equipment/:id',
  requireRole('admin'),
  validate(idParams, 'params'),
  validate(equipmentSchema),
  asyncHandler(lab.updateEquipment),
);
router.delete(
  '/lab/equipment/:id',
  requireRole('admin'),
  validate(idParams, 'params'),
  asyncHandler(lab.deleteEquipment),
);
router.get('/lab/bookings', asyncHandler(lab.listBookings));
router.post('/lab/bookings', validate(bookingSchema), asyncHandler(lab.createBooking));
router.put(
  '/lab/bookings/:id',
  requireRole('admin'),
  validate(idParams, 'params'),
  validate(bookingUpdateSchema),
  asyncHandler(lab.updateBooking),
);
router.post('/lab/bookings/:id/cancel', validate(idParams, 'params'), asyncHandler(lab.cancelBooking));

router.get('/research', asyncHandler(research.listResearch));
router.post('/research', validate(researchSchema), asyncHandler(research.createResearch));
router.put(
  '/research/:id',
  validate(idParams, 'params'),
  validate(researchSchema),
  asyncHandler(research.updateResearch),
);
router.delete('/research/:id', validate(idParams, 'params'), asyncHandler(research.deleteResearch));

router.get('/patents', asyncHandler(research.listPatents));
router.post(
  '/patents',
  requireRole('admin', 'faculty'),
  validate(patentSchema),
  asyncHandler(research.createPatent),
);
router.put(
  '/patents/:id',
  requireRole('admin', 'faculty'),
  validate(idParams, 'params'),
  validate(patentSchema),
  asyncHandler(research.updatePatent),
);
router.delete(
  '/patents/:id',
  requireRole('admin', 'faculty'),
  validate(idParams, 'params'),
  asyncHandler(research.deletePatent),
);

export default router;
