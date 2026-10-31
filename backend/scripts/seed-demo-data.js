import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';
import { DEMO_PASSWORD_ENVS, resolveDemoPassword } from '../config/demo.js';
import getPool, { withTransaction } from '../db/pool.js';

const BCRYPT_ROUNDS = 10;
const DEPARTMENT_CODE = 'CSE';
const DEPARTMENTS = [
  { code: 'CSE', name: 'Computer Science and Engineering' },
  { code: 'IT', name: 'Information Technology' },
  { code: 'AI&DS', name: 'Artificial Intelligence and Data Science' },
  { code: 'AI&ML', name: 'Artificial Intelligence and Machine Learning' },
  { code: 'ECE', name: 'Electronics and Communication Engineering' },
  { code: 'EEE', name: 'Electrical and Electronics Engineering' },
  { code: 'MECH', name: 'Mechanical Engineering' },
  { code: 'CIVIL', name: 'Civil Engineering' },
  { code: 'BME', name: 'Bio-Medical Engineering' },
  { code: 'MDE', name: 'Medical Electronics' },
  { code: 'MBA', name: 'Management Studies (MBA)' },
  { code: 'S&H', name: 'Science and Humanities' },
  { code: 'CSE-CDC', name: 'Computer Science and Engineering (CDC)' },
  { code: 'IT-CDC', name: 'Information Technology (CDC)' },
  { code: 'AI&DS-CDC', name: 'Artificial Intelligence and Data Science (CDC)' },
];
const CREDENTIALS_PATH = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../DEMO_CREDENTIALS.local.md',
);

const STUDENTS = [
  {
    name: 'Harry Potter',
    email: 'harry.potter@example.com',
    rollNo: 'CSE2024-001',
    year: 2,
    passwordRole: 'student',
    departmentCode: 'AI&DS',
  },
  {
    name: 'Ron Weasley',
    email: 'ron.weasley@example.com',
    rollNo: 'CSE2024-002',
    year: 2,
    passwordRole: 'student',
    departmentCode: 'CIVIL',
  },
  {
    name: 'Hermione Granger',
    email: 'hermione.granger@example.com',
    rollNo: 'CSE2024-003',
    year: 2,
    passwordRole: 'student',
    departmentCode: 'CSE',
  },
];

const FACULTY = [
  // CSE
  {
    name: 'Severus Snape',
    email: 'severus.snape@example.com',
    designation: 'Assistant Professor',
    passwordRole: 'faculty',
    departmentCode: 'CSE-CDC',
    isCdc: true,
  },
  {
    name: 'Albus Dumbledore',
    email: 'albus.dumbledore@example.com',
    designation: 'Professor and Head of Department',
    passwordRole: 'faculty',
    departmentCode: 'CSE',
  },
  {
    name: 'Minerva McGonagall',
    email: 'minerva.mcgonagall@example.com',
    designation: 'Associate Professor',
    passwordRole: 'faculty',
    departmentCode: 'AI&DS-CDC',
    isCdc: true,
  },
  // IT
  {
    name: 'Filius Flitwick',
    email: 'filius.flitwick@example.com',
    designation: 'Professor and Head of Department',
    passwordRole: 'faculty',
    departmentCode: 'IT',
  },
  {
    name: 'Sybill Trelawney',
    email: 'sybill.trelawney@example.com',
    designation: 'Assistant Professor',
    passwordRole: 'faculty',
    departmentCode: 'IT',
  },
  // ECE
  {
    name: 'Pomona Sprout',
    email: 'pomona.sprout@example.com',
    designation: 'Professor and Head of Department',
    passwordRole: 'faculty',
    departmentCode: 'ECE',
  },
  {
    name: 'Horace Slughorn',
    email: 'horace.slughorn@example.com',
    designation: 'Professor',
    passwordRole: 'faculty',
    departmentCode: 'ECE',
  },
  // EEE
  {
    name: 'Remus Lupin',
    email: 'remus.lupin@example.com',
    designation: 'Professor and Head of Department',
    passwordRole: 'faculty',
    departmentCode: 'EEE',
  },
  {
    name: 'Nymphadora Tonks',
    email: 'nymphadora.tonks@example.com',
    designation: 'Assistant Professor',
    passwordRole: 'faculty',
    departmentCode: 'EEE',
  },
  // MECH
  {
    name: 'Rubeus Hagrid',
    email: 'rubeus.hagrid@example.com',
    designation: 'Associate Professor',
    passwordRole: 'faculty',
    departmentCode: 'MECH',
  },
  {
    name: 'Arthur Weasley',
    email: 'arthur.weasley@example.com',
    designation: 'Professor and Head of Department',
    passwordRole: 'faculty',
    departmentCode: 'MECH',
  },
  // CIVIL
  {
    name: 'Kingsley Shacklebolt',
    email: 'kingsley.shacklebolt@example.com',
    designation: 'Professor and Head of Department',
    passwordRole: 'faculty',
    departmentCode: 'CIVIL',
  },
  {
    name: 'Neville Longbottom',
    email: 'neville.longbottom@example.com',
    designation: 'Assistant Professor',
    passwordRole: 'faculty',
    departmentCode: 'CIVIL',
  },
  // AI&DS
  {
    name: 'Luna Lovegood',
    email: 'luna.lovegood@example.com',
    designation: 'Assistant Professor',
    passwordRole: 'faculty',
    departmentCode: 'AI&DS',
  },
  {
    name: 'Hermione Granger-Weasley',
    email: 'hermione.granger.faculty@example.com',
    designation: 'Associate Professor',
    passwordRole: 'faculty',
    departmentCode: 'AI&DS',
  },
  // AI&ML
  {
    name: 'Draco Malfoy',
    email: 'draco.malfoy@example.com',
    designation: 'Assistant Professor',
    passwordRole: 'faculty',
    departmentCode: 'AI&ML',
  },
  {
    name: 'Gilderoy Lockhart',
    email: 'gilderoy.lockhart@example.com',
    designation: 'Professor and Head of Department',
    passwordRole: 'faculty',
    departmentCode: 'AI&ML',
  },
  // BME
  {
    name: 'Poppy Pomfrey',
    email: 'poppy.pomfrey@example.com',
    designation: 'Professor and Head of Department',
    passwordRole: 'faculty',
    departmentCode: 'BME',
  },
  {
    name: 'Dobby House',
    email: 'dobby.house@example.com',
    designation: 'Assistant Professor',
    passwordRole: 'faculty',
    departmentCode: 'BME',
  },
  // MDE
  {
    name: 'Cedric Diggory',
    email: 'cedric.diggory@example.com',
    designation: 'Associate Professor',
    passwordRole: 'faculty',
    departmentCode: 'MDE',
  },
  {
    name: 'Cho Chang',
    email: 'cho.chang@example.com',
    designation: 'Professor and Head of Department',
    passwordRole: 'faculty',
    departmentCode: 'MDE',
  },
  // MBA
  {
    name: 'Percy Weasley',
    email: 'percy.weasley@example.com',
    designation: 'Professor and Head of Department',
    passwordRole: 'faculty',
    departmentCode: 'MBA',
  },
  {
    name: 'Cornelius Fudge',
    email: 'cornelius.fudge@example.com',
    designation: 'Visiting Professor',
    passwordRole: 'faculty',
    departmentCode: 'MBA',
  },
  // S&H
  {
    name: 'Dolores Umbridge',
    email: 'dolores.umbridge@example.com',
    designation: 'Professor and Head of Department',
    passwordRole: 'faculty',
    departmentCode: 'S&H',
  },
  {
    name: 'Xenophilius Lovegood',
    email: 'xenophilius.lovegood@example.com',
    designation: 'Assistant Professor',
    passwordRole: 'faculty',
    departmentCode: 'S&H',
  },
  // CDC / Training & Placement Cell
  {
    name: 'Alastor Moody',
    email: 'alastor.moody@example.com',
    designation: 'Training & Placement Officer',
    passwordRole: 'faculty',
    departmentCode: 'IT-CDC',
    isCdc: true,
  },
];

const ADMIN = {
  name: 'Admin',
  email: 'admin@example.com',
  passwordRole: 'admin',
};

const COURSES = [
  {
    code: 'CSE201',
    name: 'Data Structures',
    semester: 3,
    facultyEmail: 'severus.snape@example.com',
  },
  {
    code: 'CSE202',
    name: 'Object-Oriented Programming',
    semester: 3,
    facultyEmail: 'severus.snape@example.com',
  },
  {
    code: 'CSE203',
    name: 'Database Management Systems',
    semester: 3,
    facultyEmail: 'albus.dumbledore@example.com',
  },
];

const ATTENDANCE_DATES = ['2026-10-20', '2026-10-27'];

const ABSENCES = new Set([
  'harry.potter@example.com|CSE202|2026-10-20',
  'ron.weasley@example.com|CSE203|2026-10-20',
  'ron.weasley@example.com|CSE203|2026-10-27',
]);

const MARKSHEET_EXAM_TYPE = 'End Semester Examination';
const MARKSHEET_COURSES = [
  { code: 'MA101', name: 'Engineering Mathematics I', semester: 1 },
  { code: 'PH101', name: 'Engineering Physics', semester: 1 },
  { code: 'CS101', name: 'Programming Fundamentals', semester: 1 },
  { code: 'EN101', name: 'English Communication', semester: 1 },
  { code: 'MA201', name: 'Engineering Mathematics II', semester: 2 },
  { code: 'CH201', name: 'Engineering Chemistry', semester: 2 },
  { code: 'CS102', name: 'Digital Logic Design', semester: 2 },
  { code: 'EE201', name: 'Basic Electrical Engineering', semester: 2 },
  { code: 'CSE201', name: 'Data Structures', semester: 3 },
  { code: 'CSE202', name: 'Object-Oriented Programming', semester: 3 },
  { code: 'CSE203', name: 'Database Management Systems', semester: 3 },
  { code: 'CSE204', name: 'Operating Systems', semester: 3 },
  { code: 'CSE401', name: 'Design and Analysis of Algorithms', semester: 4 },
  { code: 'CSE402', name: 'Software Engineering', semester: 4 },
  { code: 'CSE403', name: 'Computer Networks', semester: 4 },
  { code: 'CSE404', name: 'Web Technologies', semester: 4 },
];

const MARKSHEET_RESULTS = [
  {
    semester: 1,
    publishedOn: '2025-01-20',
    subjects: [
      { courseCode: 'MA101', scores: [84, 72, 93] },
      { courseCode: 'PH101', scores: [79, 68, 90] },
      { courseCode: 'CS101', scores: [88, 75, 96] },
      { courseCode: 'EN101', scores: [82, 70, 94] },
    ],
  },
  {
    semester: 2,
    publishedOn: '2025-06-20',
    subjects: [
      { courseCode: 'MA201', scores: [81, 69, 92] },
      { courseCode: 'CH201', scores: [77, 66, 89] },
      { courseCode: 'CS102', scores: [85, 73, 95] },
      { courseCode: 'EE201', scores: [80, 71, 91] },
    ],
  },
  {
    semester: 3,
    publishedOn: '2025-12-20',
    subjects: [
      { courseCode: 'CSE201', scores: [82, 74, 92] },
      { courseCode: 'CSE202', scores: [78, 68, 95] },
      { courseCode: 'CSE203', scores: [86, 71, 90] },
      { courseCode: 'CSE204', scores: [83, 70, 94] },
    ],
  },
  {
    semester: 4,
    publishedOn: '2026-05-20',
    subjects: [
      { courseCode: 'CSE401', scores: [84, 72, 93] },
      { courseCode: 'CSE402', scores: [80, 69, 91] },
      { courseCode: 'CSE403', scores: [81, 73, 92] },
      { courseCode: 'CSE404', scores: [87, 76, 95] },
    ],
  },
];

const FEE_INVOICES = [
  {
    feeType: 'Tuition Fee - Semester 3',
    amount: 75000,
    dueDate: '2026-07-31',
    payments: [
      { paidAmount: 75000, paidOn: '2026-07-18', receiptNo: 'FEE-2026-1001' },
      { paidAmount: 75000, paidOn: '2026-07-21', receiptNo: 'FEE-2026-1002' },
      { paidAmount: 75000, paidOn: '2026-07-15', receiptNo: 'FEE-2026-1003' },
    ],
  },
  {
    feeType: 'Hostel Fee - Semester 3',
    amount: 48000,
    dueDate: '2026-08-31',
    payments: [
      { paidAmount: 48000, paidOn: '2026-08-12', receiptNo: 'FEE-2026-2001' },
      { paidAmount: 24000, paidOn: '2026-08-20', receiptNo: 'FEE-2026-2002' },
      { paidAmount: 48000, paidOn: '2026-08-09', receiptNo: 'FEE-2026-2003' },
    ],
  },
  {
    feeType: 'Examination Fee - Semester 3',
    amount: 2500,
    dueDate: '2026-10-31',
    payments: [
      { paidAmount: 2500, paidOn: '2026-10-10', receiptNo: 'FEE-2026-3001' },
      { paidAmount: 0, paidOn: null, receiptNo: null },
      { paidAmount: 2500, paidOn: '2026-10-08', receiptNo: 'FEE-2026-3003' },
    ],
  },
];

const ANNOUNCEMENTS = [
  {
    title: 'Welcome to the DBuild College Management Portal',
    body:
      'Welcome to the College Management Portal. Use your dashboard to view your courses, attendance, and announcements.',
    audience: 'all',
    postedByEmail: 'admin@example.com',
  },
  {
    title: 'CSE Department Seminar',
    body:
      'A department seminar will be held on 5 November 2026 in Seminar Hall A. All CSE students are encouraged to attend.',
    audience: 'department',
    postedByEmail: 'albus.dumbledore@example.com',
  },
  {
    title: 'Data Structures Lab Reminder',
    body:
      'Remember to submit your Data Structures lab assignment before the next practical session.',
    audience: 'course',
    postedByEmail: 'severus.snape@example.com',
    courseCode: 'CSE201',
  },
];

const INNOVATION_MENTORS = [
  {
    email: 'minerva.mcgonagall@example.com',
    expertise: 'Embedded systems, IoT, product prototyping',
    bio: 'Guides student hardware teams from concept to working prototype, with a focus on reliable embedded design.',
    availability: 'Mon & Wed, 2:00-4:00 PM',
    maxMentees: 6,
  },
  {
    email: 'albus.dumbledore@example.com',
    expertise: 'AI strategy, software architecture, entrepreneurship',
    bio: 'Advises deep-tech teams on architecture decisions, go-to-market strategy, and incubation readiness.',
    availability: 'Tue & Thu, 11:00 AM-1:00 PM',
    maxMentees: 8,
  },
  {
    email: 'pomona.sprout@example.com',
    expertise: 'Biomedical devices, sensors, healthcare innovation',
    bio: 'Supports healthcare innovators with device design, clinical validation, and regulatory planning.',
    availability: 'Fri, 10:00 AM-12:00 PM',
    maxMentees: 5,
  },
  {
    email: 'arthur.weasley@example.com',
    expertise: 'Mechanical design, manufacturing, sustainable mobility',
    bio: 'Mentors fabrication-heavy projects on design for manufacturability, safety, and cost optimisation.',
    availability: 'Wed & Fri, 3:00-5:00 PM',
    maxMentees: 6,
  },
  {
    email: 'luna.lovegood@example.com',
    expertise: 'Data science, computer vision, social impact',
    bio: 'Helps teams apply responsible AI and evidence-based evaluation to real-world problems.',
    availability: 'Mon & Thu, 1:00-3:00 PM',
    maxMentees: 7,
  },
  {
    email: 'poppy.pomfrey@example.com',
    expertise: 'Medical electronics, clinical validation',
    bio: 'Advises on medical electronics safety, usability testing, and hospital pilot deployments.',
    availability: 'Tue, 9:00-11:00 AM',
    maxMentees: 4,
  },
];

const INNOVATION_IDEAS = [
  {
    key: 'agrisense',
    title: 'Smart Irrigation Advisory for Small Farms',
    category: 'IoT & Embedded Systems',
    problem_statement:
      'Smallholder farmers over-irrigate or under-irrigate crops because affordable soil-moisture sensing and local weather advisories are not available in one simple system.',
    proposed_solution:
      'A solar-powered field controller with soil-moisture probes and a low-power radio link that sends irrigation advisories to a mobile dashboard in the local language.',
    technology: 'ESP32, soil moisture sensors, LoRaWAN, React dashboard',
    team_members: 'Harry Potter, Ron Weasley',
    departmentCode: 'CSE',
    year_of_study: '3rd Year',
    expected_outcome:
      'A field-tested controller that reduces water usage by at least 20 percent while maintaining crop yield.',
    status: 'prototype_development',
    mentorEmail: 'minerva.mcgonagall@example.com',
    submitterEmail: 'harry.potter@example.com',
    review_note: 'Strong field validation plan. Approved for prototype development.',
    submittedAt: '2026-08-18 10:15:00',
    reviewedAt: '2026-08-25 14:30:00',
  },
  {
    key: 'wayfinder',
    title: 'Indoor Navigation App for Visually Impaired Students',
    category: 'AI & Machine Learning',
    problem_statement:
      'Visually impaired students struggle to navigate large campus buildings independently because existing indoor maps are visual-only and do not provide turn-by-turn audio guidance.',
    proposed_solution:
      'A mobile application that combines BLE beacon positioning with on-device obstacle detection to deliver audio turn-by-turn navigation inside campus buildings.',
    technology: 'React Native, BLE beacons, TensorFlow Lite, on-device vision',
    team_members: 'Hermione Granger',
    departmentCode: 'CSE',
    year_of_study: '3rd Year',
    expected_outcome:
      'An accessible navigation prototype covering three campus buildings with under two metres of positioning error.',
    status: 'approved',
    mentorEmail: 'albus.dumbledore@example.com',
    submitterEmail: 'hermione.granger@example.com',
    review_note: 'Excellent accessibility focus. Approved with mentor support.',
    submittedAt: '2026-09-02 09:40:00',
    reviewedAt: '2026-09-08 11:20:00',
  },
  {
    key: 'meditrack',
    title: 'Smart Medicine Adherence Companion',
    category: 'Healthcare',
    problem_statement:
      'Elderly patients frequently miss medication doses, and family members have no reliable way to confirm adherence without intrusive reminders.',
    proposed_solution:
      'A low-cost smart pill box that detects compartment openings and shares adherence summaries with caregivers through a simple mobile app.',
    technology: 'ESP32-C3, reed switches, Firebase, Flutter',
    team_members: 'Ron Weasley',
    departmentCode: 'CSE',
    year_of_study: '2nd Year',
    expected_outcome: 'A working pill box prototype with caregiver alerts and a two-week adherence report.',
    status: 'under_review',
    mentorEmail: null,
    submitterEmail: 'ron.weasley@example.com',
    review_note: null,
    submittedAt: '2026-10-12 16:05:00',
    reviewedAt: null,
  },
  {
    key: 'ecosort',
    title: 'AI Waste Segregation Kiosk for Campus',
    category: 'Sustainability',
    problem_statement:
      'Campus waste bins are contaminated because students are unsure which stream each item belongs to, reducing the value of recycled material.',
    proposed_solution:
      'A compact kiosk that uses a camera and lightweight vision model to identify waste and automatically open the correct segregation bin.',
    technology: 'Raspberry Pi 5, camera module, Edge Impulse, servo-controlled bins',
    team_members: 'Hermione Granger, Luna Lovegood',
    departmentCode: 'CSE',
    year_of_study: '3rd Year',
    expected_outcome: 'A pilot kiosk achieving at least 90 percent classification accuracy for common campus waste.',
    status: 'prototype_development',
    mentorEmail: 'arthur.weasley@example.com',
    submitterEmail: 'hermione.granger@example.com',
    review_note: 'Approved for prototype development after successful lab trial.',
    submittedAt: '2026-07-21 13:10:00',
    reviewedAt: '2026-07-30 10:00:00',
  },
  {
    key: 'signbridge',
    title: 'Real-Time Sign Language Translator',
    category: 'AI & Machine Learning',
    problem_statement:
      'Deaf and hard-of-hearing students face communication barriers in classrooms because sign language interpretation is not always available in real time.',
    proposed_solution:
      'An edge-AI application that recognises Indian Sign Language gestures from a webcam and displays live captions for classroom use.',
    technology: 'PyTorch, MediaPipe, ONNX Runtime, React',
    team_members: 'Harry Potter, Hermione Granger',
    departmentCode: 'CSE',
    year_of_study: '4th Year',
    expected_outcome: 'A real-time translator supporting a 200-word vocabulary with low-latency captions.',
    status: 'submitted',
    mentorEmail: null,
    submitterEmail: 'harry.potter@example.com',
    review_note: null,
    submittedAt: '2026-10-24 18:25:00',
    reviewedAt: null,
  },
];

const INNOVATION_PROJECTS = [
  {
    ideaKey: 'agrisense',
    title: 'AgriSense Smart Irrigation Controller',
    description:
      'A solar-powered irrigation controller that combines soil-moisture sensing, local weather data, and a farmer-friendly dashboard to recommend precise watering schedules.',
    problem_solved:
      'Reduces water waste and crop stress for smallholder farms that cannot afford commercial precision-irrigation systems.',
    technology: 'ESP32, LoRaWAN, React, Node.js',
    team_members: 'Harry Potter, Ron Weasley',
    departmentCode: 'CSE',
    ownerEmail: 'harry.potter@example.com',
    mentorEmail: 'minerva.mcgonagall@example.com',
    githubUrl: 'https://github.com/example/agrisense',
    demoUrl: 'https://agrisense.example.com/demo',
    status: 'prototype',
    progress: 72,
    isFeatured: true,
  },
  {
    ideaKey: 'wayfinder',
    title: 'WayFinder Campus Navigation',
    description:
      'An accessible indoor navigation app that provides audio turn-by-turn guidance using BLE beacons and on-device obstacle detection.',
    problem_solved:
      'Enables visually impaired students and visitors to move independently through large campus buildings.',
    technology: 'React Native, BLE beacons, TensorFlow Lite',
    team_members: 'Hermione Granger',
    departmentCode: 'CSE',
    ownerEmail: 'hermione.granger@example.com',
    mentorEmail: 'albus.dumbledore@example.com',
    githubUrl: 'https://github.com/example/wayfinder',
    demoUrl: 'https://wayfinder.example.com/demo',
    status: 'testing',
    progress: 85,
    isFeatured: true,
  },
  {
    ideaKey: 'ecosort',
    title: 'EcoSort Waste Segregation Kiosk',
    description:
      'A camera-based kiosk that classifies campus waste and automatically routes each item into the correct recycling stream.',
    problem_solved:
      'Improves recycling quality by removing contamination from campus waste streams.',
    technology: 'Raspberry Pi 5, Edge Impulse, servo-controlled bins',
    team_members: 'Hermione Granger, Luna Lovegood',
    departmentCode: 'CSE',
    ownerEmail: 'hermione.granger@example.com',
    mentorEmail: 'arthur.weasley@example.com',
    githubUrl: 'https://github.com/example/ecosort',
    demoUrl: null,
    status: 'in_development',
    progress: 45,
    isFeatured: false,
  },
  {
    ideaKey: null,
    title: 'Campus Energy Analytics Dashboard',
    description:
      'A dashboard that consolidates electricity meter data across campus buildings and highlights abnormal consumption patterns for facility teams.',
    problem_solved:
      'Gives the estate office actionable visibility into energy waste without manual meter readings.',
    technology: 'React, Express, MySQL, Chart.js',
    team_members: 'Ron Weasley',
    departmentCode: 'CSE',
    ownerEmail: 'ron.weasley@example.com',
    mentorEmail: 'albus.dumbledore@example.com',
    githubUrl: null,
    demoUrl: null,
    status: 'planning',
    progress: 20,
    isFeatured: false,
  },
];

const INNOVATION_STARTUPS = [
  {
    name: 'AgriSense Technologies',
    tagline: 'Affordable precision irrigation for smallholder farmers',
    founderEmail: 'harry.potter@example.com',
    description:
      'AgriSense builds solar-powered irrigation controllers and advisory software that help small farms save water while protecting crop yield.',
    problem:
      'Smallholder farmers lack affordable tools to measure soil moisture and schedule irrigation precisely.',
    solution:
      'A low-cost field controller paired with a local-language mobile dashboard that recommends when and how much to irrigate.',
    market_opportunity:
      'Over 120 million smallholder farms in India face water scarcity and rising irrigation costs.',
    business_model:
      'Hardware sold through agriculture cooperatives with an annual software subscription for advisories.',
    team_members: 'Harry Potter, Ron Weasley',
    funding_required: 1500000,
    stage: 'prototype',
    applicationStatus: 'approved',
    mentorEmail: 'minerva.mcgonagall@example.com',
    websiteUrl: 'https://agrisense.example.com',
    reviewNote: 'Approved for the Startup TN pre-incubation cohort 2026.',
    submittedAt: '2026-08-28 12:00:00',
    reviewedAt: '2026-09-05 10:30:00',
  },
  {
    name: 'WayFinder Labs',
    tagline: 'Independent indoor navigation for everyone',
    founderEmail: 'hermione.granger@example.com',
    description:
      'WayFinder Labs develops accessible indoor navigation software for universities, hospitals, and public buildings.',
    problem:
      'Indoor spaces remain difficult to navigate for people with visual impairments and first-time visitors.',
    solution:
      'BLE-beacon positioning combined with on-device vision and audio guidance delivered through a mobile app.',
    market_opportunity:
      'Accessibility mandates are driving adoption of indoor navigation across education and healthcare campuses.',
    business_model:
      'Annual per-building licence for institutions with a supported deployment and training package.',
    team_members: 'Hermione Granger',
    funding_required: 2500000,
    stage: 'market_validation',
    applicationStatus: 'approved',
    mentorEmail: 'albus.dumbledore@example.com',
    websiteUrl: 'https://wayfinder.example.com',
    reviewNote: 'Approved for incubation with pilot deployments at two campus buildings.',
    submittedAt: '2026-09-10 09:00:00',
    reviewedAt: '2026-09-18 15:00:00',
  },
  {
    name: 'EcoSort Systems',
    tagline: 'Automated waste segregation for clean campuses',
    founderEmail: 'hermione.granger@example.com',
    description:
      'EcoSort Systems builds vision-enabled waste segregation kiosks that improve recycling quality in institutions and public spaces.',
    problem:
      'Contaminated recycling streams reduce recovery value and increase landfill costs for institutions.',
    solution:
      'A compact kiosk that identifies waste items and automatically routes them into the correct stream.',
    market_opportunity:
      'Institutional waste management budgets are under pressure from stricter segregation rules.',
    business_model:
      'Kiosk leasing with a maintenance contract and ESG reporting dashboard.',
    team_members: 'Hermione Granger, Luna Lovegood',
    funding_required: 3000000,
    stage: 'incubation',
    applicationStatus: 'approved',
    mentorEmail: 'arthur.weasley@example.com',
    websiteUrl: 'https://ecosort.example.com',
    reviewNote: 'Approved for incubation after the campus pilot met accuracy targets.',
    submittedAt: '2026-07-25 11:30:00',
    reviewedAt: '2026-08-04 14:00:00',
  },
  {
    name: 'MediTrack Health',
    tagline: 'Connected medication adherence for families',
    founderEmail: 'ron.weasley@example.com',
    description:
      'MediTrack Health is developing a connected pill box and caregiver app that makes medication adherence visible and actionable.',
    problem:
      'Missed doses among elderly patients lead to avoidable hospital admissions and higher care costs.',
    solution:
      'A smart pill box that detects compartment openings and sends adherence summaries to caregivers.',
    market_opportunity:
      'Aging populations and home-care models are increasing demand for low-cost adherence monitoring.',
    business_model:
      'Device sale bundled with a monthly caregiver monitoring subscription.',
    team_members: 'Ron Weasley',
    funding_required: 800000,
    stage: 'idea_validation',
    applicationStatus: 'submitted',
    mentorEmail: null,
    websiteUrl: null,
    reviewNote: null,
    submittedAt: '2026-10-26 17:45:00',
    reviewedAt: null,
  },
];

const INNOVATION_EVENTS = [
  {
    title: 'HIT Innovation Hackathon 2026',
    type: 'hackathon',
    description:
      'A 36-hour campus hackathon where multidisciplinary teams build working prototypes for agriculture, healthcare, sustainability, and accessibility challenges.',
    eventDate: '2026-11-20',
    startTime: '09:00',
    endTime: '18:00',
    venue: 'IDEA Lab, Main Campus',
    registrationDeadline: '2026-11-12',
    maxParticipants: 120,
    teamSizeMin: 2,
    teamSizeMax: 4,
    status: 'upcoming',
    createdByEmail: 'admin@example.com',
  },
  {
    title: 'Startup TN Ideathon: Campus Edition',
    type: 'ideathon',
    description:
      'A one-day ideathon in partnership with Startup TN where students validate problem statements and pitch early-stage venture ideas to mentors and investors.',
    eventDate: '2026-12-05',
    startTime: '10:00',
    endTime: '16:00',
    venue: 'Seminar Hall A',
    registrationDeadline: '2026-11-28',
    maxParticipants: 80,
    teamSizeMin: 1,
    teamSizeMax: 3,
    status: 'upcoming',
    createdByEmail: 'admin@example.com',
  },
  {
    title: 'Design Thinking for Founders Workshop',
    type: 'workshop',
    description:
      'A hands-on workshop covering customer discovery, rapid prototyping, and pitch storytelling for student founders preparing for incubation reviews.',
    eventDate: '2027-01-18',
    startTime: '14:00',
    endTime: '17:00',
    venue: 'Innovation Centre Auditorium',
    registrationDeadline: '2027-01-12',
    maxParticipants: 60,
    teamSizeMin: 1,
    teamSizeMax: 1,
    status: 'upcoming',
    createdByEmail: 'admin@example.com',
  },
  {
    title: 'IPR and Patent Filing Clinic',
    type: 'seminar',
    description:
      'A seminar with patent attorneys on drafting provisional specifications, prior-art searches, and filing strategies for student innovations.',
    eventDate: '2026-10-10',
    startTime: '11:00',
    endTime: '13:00',
    venue: 'Board Room, Administrative Block',
    registrationDeadline: '2026-10-08',
    maxParticipants: 50,
    teamSizeMin: 1,
    teamSizeMax: 1,
    status: 'completed',
    createdByEmail: 'admin@example.com',
  },
];

const INNOVATION_EQUIPMENT = [
  {
    name: '3D Printer (FDM)',
    category: 'Additive Manufacturing',
    description: 'FDM printers for rapid prototyping of enclosures, fixtures, and mechanical parts.',
    quantity: 4,
    status: 'available',
  },
  {
    name: 'Laser Cutter',
    category: 'Fabrication',
    description: 'CO2 laser cutter for acrylic, wood, and thin sheet prototyping.',
    quantity: 2,
    status: 'available',
  },
  {
    name: 'CNC Milling Machine',
    category: 'Machining',
    description: 'Desktop CNC mill for precision metal and plastic components.',
    quantity: 1,
    status: 'available',
  },
  {
    name: 'Raspberry Pi 5 Kit',
    category: 'Embedded Systems',
    description: 'Raspberry Pi 5 boards with cameras, displays, and power supplies for edge-AI projects.',
    quantity: 15,
    status: 'available',
  },
  {
    name: 'Arduino Sensor Kit',
    category: 'Embedded Systems',
    description: 'Arduino boards with a curated set of environmental, motion, and biometric sensors.',
    quantity: 20,
    status: 'available',
  },
  {
    name: 'Digital Oscilloscope',
    category: 'Electronics',
    description: 'Four-channel digital oscilloscopes for signal debugging and validation.',
    quantity: 3,
    status: 'maintenance',
  },
  {
    name: 'Soldering Station',
    category: 'Electronics',
    description: 'Temperature-controlled soldering and rework stations with fume extraction.',
    quantity: 6,
    status: 'available',
  },
];

const INNOVATION_RESEARCH = [
  {
    title: 'Low-Cost Soil Moisture Sensor Network for Precision Farming',
    abstract:
      'This project develops a calibrated, low-power soil moisture sensor network that provides reliable field readings at a fraction of the cost of commercial precision-irrigation systems.',
    type: 'faculty_project',
    ownerEmail: 'minerva.mcgonagall@example.com',
    departmentCode: 'CSE',
    guideEmail: 'albus.dumbledore@example.com',
    status: 'ongoing',
    fundingAmount: 450000,
    fundingAgency: 'DST - SEED',
    collaborationPartner: 'Tamil Nadu Agricultural University',
    publishedOn: null,
    paperUrl: null,
    progress: 60,
  },
  {
    title: 'Assistive Indoor Navigation Using BLE Beacons',
    abstract:
      'A study of beacon placement strategies and on-device obstacle detection for accessible indoor navigation in large public buildings.',
    type: 'student_project',
    ownerEmail: 'hermione.granger@example.com',
    departmentCode: 'CSE',
    guideEmail: 'minerva.mcgonagall@example.com',
    status: 'ongoing',
    fundingAmount: 120000,
    fundingAgency: 'HIT Innovation Fund',
    collaborationPartner: null,
    publishedOn: null,
    paperUrl: null,
    progress: 75,
  },
  {
    title: 'AI-Based Waste Classification for Campus Sustainability',
    abstract:
      'An evaluation of lightweight vision models for real-time waste classification on edge devices, including accuracy, latency, and power trade-offs.',
    type: 'student_project',
    ownerEmail: 'hermione.granger@example.com',
    departmentCode: 'CSE',
    guideEmail: 'luna.lovegood@example.com',
    status: 'published',
    fundingAmount: 90000,
    fundingAgency: 'HIT Sustainability Cell',
    collaborationPartner: 'Chennai Municipal Corporation',
    publishedOn: '2026-08-15',
    paperUrl: 'https://doi.org/example/ecosort-vision',
    progress: 100,
  },
  {
    title: 'Clinical Validation of a Low-Cost ECG Monitoring Device',
    abstract:
      'A pilot clinical study validating the signal quality and usability of an affordable single-lead ECG device for remote cardiac screening.',
    type: 'industry_collaboration',
    ownerEmail: 'poppy.pomfrey@example.com',
    departmentCode: 'BME',
    guideEmail: null,
    status: 'published',
    fundingAmount: 900000,
    fundingAgency: 'ICMR',
    collaborationPartner: 'Apollo Hospitals',
    publishedOn: '2026-06-30',
    paperUrl: 'https://doi.org/example/lowcost-ecg',
    progress: 100,
  },
  {
    title: 'Edge AI for Real-Time Sign Language Recognition',
    abstract:
      'A comparative study of temporal gesture-recognition models optimised for low-latency inference on consumer edge hardware.',
    type: 'published_paper',
    ownerEmail: 'luna.lovegood@example.com',
    departmentCode: 'AI&DS',
    guideEmail: null,
    status: 'published',
    fundingAmount: null,
    fundingAgency: null,
    collaborationPartner: null,
    publishedOn: '2026-09-10',
    paperUrl: 'https://doi.org/example/edge-isl',
    progress: 100,
  },
];

const INNOVATION_PATENTS = [
  {
    title: 'Smart Irrigation Controller with Adaptive Scheduling',
    patentNumber: 'IN202641012345',
    status: 'published',
    inventors: 'Harry Potter, Minerva McGonagall',
    ownerEmail: 'harry.potter@example.com',
    departmentCode: 'CSE',
    filingDate: '2026-03-12',
    grantDate: null,
    description:
      'A controller that adapts irrigation schedules using soil-moisture feedback and local weather forecasts to reduce water consumption.',
  },
  {
    title: 'Wearable Medicine Adherence Monitoring Device',
    patentNumber: null,
    status: 'filed',
    inventors: 'Ron Weasley, Poppy Pomfrey',
    ownerEmail: 'ron.weasley@example.com',
    departmentCode: 'CSE',
    filingDate: '2026-07-08',
    grantDate: null,
    description:
      'A low-power wearable and pill-box system that detects medication events and shares adherence summaries with caregivers.',
  },
  {
    title: 'Vision-Assisted Indoor Navigation System',
    patentNumber: 'IN202541098765',
    status: 'granted',
    inventors: 'Hermione Granger, Albus Dumbledore',
    ownerEmail: 'hermione.granger@example.com',
    departmentCode: 'CSE',
    filingDate: '2025-11-20',
    grantDate: '2026-09-15',
    description:
      'An indoor navigation method combining beacon positioning with on-device obstacle detection to deliver accessible audio guidance.',
  },
];

const INNOVATION_MENTOR_REQUESTS = [
  {
    studentEmail: 'harry.potter@example.com',
    mentorEmail: 'minerva.mcgonagall@example.com',
    ideaKey: 'agrisense',
    projectKey: null,
    message:
      'Requesting guidance on field deployment and power budgeting for the AgriSense controller before our first farm pilot.',
    status: 'accepted',
    scheduledAt: '2026-11-05T15:00',
    mentorNotes: 'Scheduled a review of the power budget and enclosure design.',
  },
  {
    studentEmail: 'ron.weasley@example.com',
    mentorEmail: 'albus.dumbledore@example.com',
    ideaKey: 'meditrack',
    projectKey: null,
    message:
      'Looking for mentorship on clinical validation partnerships for the MediTrack adherence device.',
    status: 'pending',
    scheduledAt: null,
    mentorNotes: null,
  },
  {
    studentEmail: 'hermione.granger@example.com',
    mentorEmail: 'albus.dumbledore@example.com',
    ideaKey: null,
    projectKey: 'WayFinder Campus Navigation',
    message:
      'Requesting a review of the accessibility evaluation plan and pilot deployment approach for WayFinder.',
    status: 'completed',
    scheduledAt: '2026-10-16T11:00',
    mentorNotes: 'Session completed. Recommended adding a structured usability test with 10 participants.',
  },
];

const INNOVATION_BOOKINGS = [
  {
    userEmail: 'harry.potter@example.com',
    equipmentName: '3D Printer (FDM)',
    facility: null,
    purpose: 'Print enclosure prototypes for the AgriSense irrigation controller field pilot.',
    requestedDate: '2026-11-04',
    startTime: '10:00',
    endTime: '12:00',
    teamSize: 3,
    status: 'approved',
    adminNote: 'Approved. Please bring your own filament.',
    reviewedByEmail: 'admin@example.com',
  },
  {
    userEmail: 'hermione.granger@example.com',
    equipmentName: 'Laser Cutter',
    facility: null,
    purpose: 'Cut acrylic enclosure panels for WayFinder beacon prototypes.',
    requestedDate: '2026-11-06',
    startTime: '14:00',
    endTime: '16:00',
    teamSize: 2,
    status: 'pending',
    adminNote: null,
    reviewedByEmail: null,
  },
  {
    userEmail: 'ron.weasley@example.com',
    equipmentName: null,
    facility: 'IDEA Lab Meeting Room',
    purpose: 'Team standup and sprint planning for the MediTrack adherence project.',
    requestedDate: '2026-11-03',
    startTime: '16:00',
    endTime: '17:00',
    teamSize: 4,
    status: 'pending',
    adminNote: null,
    reviewedByEmail: null,
  },
];

const INNOVATION_EVENT_REGISTRATIONS = [
  {
    eventTitle: 'HIT Innovation Hackathon 2026',
    userEmail: 'harry.potter@example.com',
    teamName: 'Team AgriSense',
    teamMembers: 'Harry Potter, Ron Weasley',
    status: 'registered',
  },
  {
    eventTitle: 'HIT Innovation Hackathon 2026',
    userEmail: 'ron.weasley@example.com',
    teamName: 'Team AgriSense',
    teamMembers: 'Harry Potter, Ron Weasley',
    status: 'registered',
  },
  {
    eventTitle: 'Startup TN Ideathon: Campus Edition',
    userEmail: 'hermione.granger@example.com',
    teamName: 'WayFinder',
    teamMembers: 'Hermione Granger',
    status: 'registered',
  },
];

const INNOVATION_NOTIFICATIONS = [
  {
    userEmail: 'harry.potter@example.com',
    title: 'Idea approved for prototype development',
    message:
      'Your idea "Smart Irrigation Advisory for Small Farms" has been approved. Mentor Minerva McGonagall has been assigned to your team.',
    type: 'idea',
    link: '/innovation/portal/ideas',
    isRead: false,
  },
  {
    userEmail: 'harry.potter@example.com',
    title: 'Mentor request accepted',
    message:
      'Minerva McGonagall accepted your mentorship request. A session is scheduled for 5 November 2026 at 3:00 PM.',
    type: 'mentor',
    link: '/innovation/portal/mentors',
    isRead: false,
  },
  {
    userEmail: 'hermione.granger@example.com',
    title: 'Event registration confirmed',
    message:
      'You are registered for Startup TN Ideathon: Campus Edition on 5 December 2026 at Seminar Hall A.',
    type: 'event',
    link: '/innovation/portal/events',
    isRead: false,
  },
  {
    userEmail: 'ron.weasley@example.com',
    title: 'Startup application submitted',
    message:
      'Your application for MediTrack Health is under review by the innovation council.',
    type: 'startup',
    link: '/innovation/portal/startups',
    isRead: false,
  },
];

async function hashPassword(passwordRole) {
  return bcrypt.hash(resolveDemoPassword(passwordRole), BCRYPT_ROUNDS);
}

function writeCredentialsFile(summary) {
  const accounts = [
    { ...summary.admin, passwordRole: ADMIN.passwordRole },
    ...summary.studentAccounts,
    ...summary.facultyAccounts,
  ];

  const lines = [
    '# DBuild Demo Credentials (Local Development Only)',
    '',
    '> This file is excluded from Git via `.gitignore`. Do not use these credentials in production.',
    '',
    '## Portal logins',
    '',
    '| Name | Role | Login | Password | User ID |',
    '| --- | --- | --- | --- | --- |',
  ];

  for (const account of accounts) {
    const login = account.role === 'student' ? String(account.id) : account.name;
    const password = resolveDemoPassword(account.passwordRole);
    lines.push(
      `| ${account.name} | ${account.role} | ${login} | ${password} | ${account.id} |`,
    );
  }

  lines.push(
    '',
    '## Notes',
    '',
    '- Students sign in with their numeric **Student ID** (`users.id`), not their email.',
    '- Faculty and administrators sign in with their name.',
    '- The `faculty` role is the application\'s identifier for staff/teachers.',
    '- MySQL root access is separate from portal logins and is configured in `backend/.env`.',
    `- Demo password defaults are defined in \`backend/config/demo.js\`; override them with \`${DEMO_PASSWORD_ENVS.student}\`, \`${DEMO_PASSWORD_ENVS.faculty}\`, or \`${DEMO_PASSWORD_ENVS.admin}\` in \`backend/.env\`.`,
    '- Student profile fields supported by the schema: roll number, department, year.',
    '- Faculty profile fields supported by the schema: department, designation.',
    '',
  );

  fs.writeFileSync(CREDENTIALS_PATH, lines.join('\n'), 'utf8');
}

async function upsertUser(client, { name, email, role, passwordHash }) {
  const normalizedEmail = email.toLowerCase();
  await client.query(
    `INSERT INTO users (name, email, password_hash, role, is_active)
     VALUES (?, ?, ?, ?, 1)
     ON DUPLICATE KEY UPDATE
       name = VALUES(name),
       password_hash = VALUES(password_hash),
       role = VALUES(role),
       is_active = 1`,
    [name, normalizedEmail, passwordHash, role],
  );

  const { rows } = await client.query('SELECT id, name, email, role FROM users WHERE email = ?', [
    normalizedEmail,
  ]);
  return rows[0];
}

async function main() {
  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_DEMO_SEED !== 'true') {
    console.error('Refusing to seed demo data in production. Set ALLOW_DEMO_SEED=true to override.');
    process.exit(1);
  }

  const pool = getPool();

  try {
    const studentSeeds = [];
    for (const student of STUDENTS) {
      studentSeeds.push({ ...student, passwordHash: await hashPassword(student.passwordRole) });
    }

    const facultySeeds = [];
    for (const member of FACULTY) {
      facultySeeds.push({ ...member, passwordHash: await hashPassword(member.passwordRole) });
    }

    const adminSeed = { ...ADMIN, passwordHash: await hashPassword(ADMIN.passwordRole) };

    const summary = await withTransaction(async (client) => {
      // Load all departments into a map keyed by code
      const { rows: allDepts } = await client.query('SELECT id, name, code FROM departments');
      const deptByCode = new Map(allDepts.map((d) => [d.code, d]));

      // Ensure every department referenced by the public site exists
      for (const dept of DEPARTMENTS) {
        if (!deptByCode.has(dept.code)) {
          const result = await client.query(
            'INSERT INTO departments (name, code) VALUES (?, ?)',
            [dept.name, dept.code],
          );
          deptByCode.set(dept.code, { id: result.insertId, ...dept });
        }
      }

      const department = deptByCode.get(DEPARTMENT_CODE);

      const admin = await upsertUser(client, { ...adminSeed, role: 'admin' });

      const studentAccounts = [];
      for (const student of studentSeeds) {
        const user = await upsertUser(client, { ...student, role: 'student' });
        await client.query(
          `INSERT INTO students (user_id, roll_no, department_id, year)
           VALUES (?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE
             roll_no = VALUES(roll_no),
             department_id = VALUES(department_id),
             year = VALUES(year)`,
          [user.id, student.rollNo, (student.departmentCode && deptByCode.get(student.departmentCode)?.id) || department.id, student.year],
        );
        studentAccounts.push({
          ...user,
          rollNo: student.rollNo,
          email: student.email,
          passwordRole: student.passwordRole,
        });
      }

      const facultyAccounts = [];
      for (const member of facultySeeds) {
        const user = await upsertUser(client, { ...member, role: 'faculty' });
        const memberDept = member.departmentCode
          ? deptByCode.get(member.departmentCode) ?? department
          : department;
        const isCdc = member.isCdc ? 1 : 0;
        await client.query(
          `INSERT INTO faculty (user_id, department_id, designation, is_cdc)
           VALUES (?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE
             department_id = VALUES(department_id),
             designation = VALUES(designation),
             is_cdc = VALUES(is_cdc)`,
          [user.id, memberDept?.id ?? null, member.designation, isCdc],
        );
        facultyAccounts.push({
          ...user,
          designation: member.designation,
          email: member.email,
          passwordRole: member.passwordRole,
        });
      }

      const facultyByEmail = new Map(facultyAccounts.map((member) => [member.email, member]));
      const courses = [];

      for (const course of COURSES) {
        const faculty = facultyByEmail.get(course.facultyEmail);
        if (!faculty) {
          throw new Error(`Faculty account not found for course ${course.code}`);
        }

        await client.query(
          `INSERT INTO courses (code, name, department_id, faculty_id, semester)
           VALUES (?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE
             name = VALUES(name),
             department_id = VALUES(department_id),
             faculty_id = VALUES(faculty_id),
             semester = VALUES(semester)`,
          [course.code, course.name, department.id, faculty.id, course.semester],
        );

        const saved = (
          await client.query('SELECT id, code, name, faculty_id FROM courses WHERE code = ?', [
            course.code,
          ])
        ).rows[0];
        courses.push({ ...saved, facultyEmail: course.facultyEmail });
      }

      for (const course of MARKSHEET_COURSES) {
        await client.query(
          `INSERT INTO courses (code, name, department_id, faculty_id, semester)
           VALUES (?, ?, ?, NULL, ?)
           ON DUPLICATE KEY UPDATE
             name = VALUES(name),
             department_id = VALUES(department_id),
             semester = VALUES(semester)`,
          [course.code, course.name, department.id, course.semester],
        );
      }

      let enrollmentLinks = 0;
      for (const student of studentAccounts) {
        for (const course of courses) {
          await client.query(
            `INSERT INTO enrollments (student_id, course_id)
             VALUES (?, ?)
             ON DUPLICATE KEY UPDATE student_id = VALUES(student_id)`,
            [student.id, course.id],
          );
          enrollmentLinks += 1;
        }
      }

      let attendanceRows = 0;
      for (const course of courses) {
        const faculty = facultyByEmail.get(course.facultyEmail);
        for (const date of ATTENDANCE_DATES) {
          for (const student of studentAccounts) {
            const absenceKey = `${student.email}|${course.code}|${date}`;
            const status = ABSENCES.has(absenceKey) ? 'absent' : 'present';
            await client.query(
              `INSERT INTO attendance (student_id, course_id, \`date\`, status, marked_by)
               VALUES (?, ?, ?, ?, ?)
               ON DUPLICATE KEY UPDATE
                 status = VALUES(status),
                 marked_by = VALUES(marked_by)`,
              [student.id, course.id, date, status, faculty.id],
            );
            attendanceRows += 1;
          }
        }
      }

      const courseByCode = new Map(courses.map((course) => [course.code, course]));
      for (const course of MARKSHEET_COURSES) {
        const saved = (
          await client.query('SELECT id, code, name FROM courses WHERE code = ?', [course.code])
        ).rows[0];
        if (!saved) {
          throw new Error(`Course not found for marksheet: ${course.code}`);
        }
        courseByCode.set(course.code, saved);
      }

      let marksheetRows = 0;
      for (const semester of MARKSHEET_RESULTS) {
        for (const subject of semester.subjects) {
          const course = courseByCode.get(subject.courseCode);
          if (!course) {
            throw new Error(`Course not found for marksheet: ${subject.courseCode}`);
          }

          for (const [index, student] of studentAccounts.entries()) {
            const marksObtained = subject.scores[index] ?? subject.scores[0];
            await client.query(
              `INSERT INTO marksheets
                 (student_id, course_id, semester, exam_type, marks_obtained, max_marks, published_on)
               VALUES (?, ?, ?, ?, ?, ?, ?)
               ON DUPLICATE KEY UPDATE
                 marks_obtained = VALUES(marks_obtained),
                 max_marks = VALUES(max_marks),
                 published_on = VALUES(published_on)`,
              [
                student.id,
                course.id,
                semester.semester,
                MARKSHEET_EXAM_TYPE,
                marksObtained,
                100,
                semester.publishedOn,
              ],
            );
            marksheetRows += 1;
          }
        }
      }

      const studentIds = studentAccounts.map((student) => student.id);
      const studentPlaceholders = studentIds.map(() => '?').join(', ');
      await client.query(
        `DELETE FROM marksheets
         WHERE student_id IN (${studentPlaceholders})
           AND exam_type <> ?`,
        [...studentIds, MARKSHEET_EXAM_TYPE],
      );

      let feeRows = 0;
      for (const invoice of FEE_INVOICES) {
        for (const [index, student] of studentAccounts.entries()) {
          const payment = invoice.payments[index];
          await client.query(
            `INSERT INTO fees
               (student_id, fee_type, amount, paid_amount, due_date, paid_on, receipt_no)
             VALUES (?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
               amount = VALUES(amount),
               paid_amount = VALUES(paid_amount),
               paid_on = VALUES(paid_on),
               receipt_no = VALUES(receipt_no)`,
            [
              student.id,
              invoice.feeType,
              invoice.amount,
              payment?.paidAmount ?? 0,
              invoice.dueDate,
              payment?.paidOn ?? null,
              payment?.receiptNo ?? null,
            ],
          );
          feeRows += 1;
        }
      }

      const userByEmail = new Map(
        [admin, ...studentAccounts, ...facultyAccounts].map((user) => [user.email, user]),
      );

      let announcementCount = 0;
      for (const announcement of ANNOUNCEMENTS) {
        const postedBy = userByEmail.get(announcement.postedByEmail);
        if (!postedBy) {
          throw new Error(`Author not found for announcement: ${announcement.title}`);
        }
        const course = announcement.courseCode
          ? courseByCode.get(announcement.courseCode)
          : null;
        const departmentId = announcement.audience === 'department' ? department.id : null;
        const courseId = announcement.audience === 'course' ? course?.id ?? null : null;

        const existing = (
          await client.query(
            'SELECT id FROM announcements WHERE title = ? AND posted_by = ? LIMIT 1',
            [announcement.title, postedBy.id],
          )
        ).rows[0];

        if (existing) {
          await client.query(
            `UPDATE announcements
             SET body = ?, audience = ?, department_id = ?, course_id = ?
             WHERE id = ?`,
            [announcement.body, announcement.audience, departmentId, courseId, existing.id],
          );
        } else {
          await client.query(
            `INSERT INTO announcements (title, body, posted_by, audience, department_id, course_id)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
              announcement.title,
              announcement.body,
              postedBy.id,
              announcement.audience,
              departmentId,
              courseId,
            ],
          );
        }
        announcementCount += 1;
      }

      const innovationSummary = {
        mentors: 0,
        ideas: 0,
        projects: 0,
        startups: 0,
        events: 0,
        equipment: 0,
        research: 0,
        patents: 0,
        mentorRequests: 0,
        bookings: 0,
        registrations: 0,
        notifications: 0,
      };

      for (const profile of INNOVATION_MENTORS) {
        const mentor = userByEmail.get(profile.email);
        if (!mentor) {
          throw new Error(`Mentor account not found: ${profile.email}`);
        }
        await client.query(
          `INSERT INTO innovation_mentor_profiles
             (user_id, expertise, bio, availability, max_mentees, is_available)
           VALUES (?, ?, ?, ?, ?, 1)
           ON DUPLICATE KEY UPDATE
             expertise = VALUES(expertise),
             bio = VALUES(bio),
             availability = VALUES(availability),
             max_mentees = VALUES(max_mentees),
             is_available = 1`,
          [mentor.id, profile.expertise, profile.bio, profile.availability, profile.maxMentees],
        );
        innovationSummary.mentors += 1;
      }

      const innovationIdeaIds = new Map();
      for (const idea of INNOVATION_IDEAS) {
        const submitter = userByEmail.get(idea.submitterEmail);
        if (!submitter) {
          throw new Error(`Idea submitter not found: ${idea.submitterEmail}`);
        }
        const mentor = idea.mentorEmail ? userByEmail.get(idea.mentorEmail) : null;
        const ideaDept = deptByCode.get(idea.departmentCode) ?? department;
        const existing = (
          await client.query(
            'SELECT id FROM innovation_ideas WHERE title = ? AND submitted_by = ? LIMIT 1',
            [idea.title, submitter.id],
          )
        ).rows[0];

        if (existing) {
          await client.query(
            `UPDATE innovation_ideas
             SET category = ?, problem_statement = ?, proposed_solution = ?,
                 technology = ?, team_members = ?, department_id = ?, year_of_study = ?,
                 expected_outcome = ?, status = ?, mentor_id = ?, review_note = ?,
                 submitted_at = ?, reviewed_at = ?
             WHERE id = ?`,
            [
              idea.category,
              idea.problem_statement,
              idea.proposed_solution,
              idea.technology,
              idea.team_members,
              ideaDept.id,
              idea.year_of_study,
              idea.expected_outcome,
              idea.status,
              mentor?.id ?? null,
              idea.review_note,
              idea.submittedAt,
              idea.reviewedAt,
              existing.id,
            ],
          );
          innovationIdeaIds.set(idea.key, existing.id);
        } else {
          const result = await client.query(
            `INSERT INTO innovation_ideas
               (title, category, problem_statement, proposed_solution, technology,
                team_members, department_id, year_of_study, expected_outcome, status,
                mentor_id, submitted_by, review_note, submitted_at, reviewed_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              idea.title,
              idea.category,
              idea.problem_statement,
              idea.proposed_solution,
              idea.technology,
              idea.team_members,
              ideaDept.id,
              idea.year_of_study,
              idea.expected_outcome,
              idea.status,
              mentor?.id ?? null,
              submitter.id,
              idea.review_note,
              idea.submittedAt,
              idea.reviewedAt,
            ],
          );
          innovationIdeaIds.set(idea.key, result.insertId);
        }
        innovationSummary.ideas += 1;
      }

      const innovationProjectIds = new Map();
      for (const project of INNOVATION_PROJECTS) {
        const owner = userByEmail.get(project.ownerEmail);
        if (!owner) {
          throw new Error(`Project owner not found: ${project.ownerEmail}`);
        }
        const mentor = project.mentorEmail ? userByEmail.get(project.mentorEmail) : null;
        const projectDept = deptByCode.get(project.departmentCode) ?? department;
        const ideaId = project.ideaKey ? innovationIdeaIds.get(project.ideaKey) ?? null : null;
        const existing = ideaId
          ? (
              await client.query('SELECT id FROM innovation_projects WHERE idea_id = ? LIMIT 1', [
                ideaId,
              ])
            ).rows[0]
          : (
              await client.query(
                'SELECT id FROM innovation_projects WHERE title = ? AND owner_id = ? LIMIT 1',
                [project.title, owner.id],
              )
            ).rows[0];

        if (existing) {
          await client.query(
            `UPDATE innovation_projects
             SET idea_id = ?, title = ?, description = ?, problem_solved = ?,
                 technology = ?, team_members = ?, department_id = ?, owner_id = ?,
                 mentor_id = ?, github_url = ?, demo_url = ?, status = ?, progress = ?,
                 is_featured = ?
             WHERE id = ?`,
            [
              ideaId,
              project.title,
              project.description,
              project.problem_solved,
              project.technology,
              project.team_members,
              projectDept.id,
              owner.id,
              mentor?.id ?? null,
              project.githubUrl,
              project.demoUrl,
              project.status,
              project.progress,
              project.isFeatured ? 1 : 0,
              existing.id,
            ],
          );
          innovationProjectIds.set(project.title, existing.id);
        } else {
          const result = await client.query(
            `INSERT INTO innovation_projects
               (idea_id, title, description, problem_solved, technology, team_members,
                department_id, owner_id, mentor_id, github_url, demo_url, status,
                progress, is_featured)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              ideaId,
              project.title,
              project.description,
              project.problem_solved,
              project.technology,
              project.team_members,
              projectDept.id,
              owner.id,
              mentor?.id ?? null,
              project.githubUrl,
              project.demoUrl,
              project.status,
              project.progress,
              project.isFeatured ? 1 : 0,
            ],
          );
          innovationProjectIds.set(project.title, result.insertId);
        }
        innovationSummary.projects += 1;
      }

      for (const startup of INNOVATION_STARTUPS) {
        const founder = userByEmail.get(startup.founderEmail);
        if (!founder) {
          throw new Error(`Startup founder not found: ${startup.founderEmail}`);
        }
        const mentor = startup.mentorEmail ? userByEmail.get(startup.mentorEmail) : null;
        const existing = (
          await client.query(
            'SELECT id FROM innovation_startups WHERE name = ? AND founder_id = ? LIMIT 1',
            [startup.name, founder.id],
          )
        ).rows[0];

        if (existing) {
          await client.query(
            `UPDATE innovation_startups
             SET tagline = ?, description = ?, problem = ?, solution = ?,
                 market_opportunity = ?, business_model = ?, team_members = ?,
                 funding_required = ?, stage = ?, application_status = ?, mentor_id = ?,
                 website_url = ?, review_note = ?, reviewed_by = ?, submitted_at = ?,
                 reviewed_at = ?
             WHERE id = ?`,
            [
              startup.tagline,
              startup.description,
              startup.problem,
              startup.solution,
              startup.market_opportunity,
              startup.business_model,
              startup.team_members,
              startup.funding_required,
              startup.stage,
              startup.applicationStatus,
              mentor?.id ?? null,
              startup.websiteUrl,
              startup.reviewNote,
              startup.reviewedAt ? admin.id : null,
              startup.submittedAt,
              startup.reviewedAt,
              existing.id,
            ],
          );
        } else {
          await client.query(
            `INSERT INTO innovation_startups
               (name, tagline, founder_id, description, problem, solution, market_opportunity,
                business_model, team_members, funding_required, stage, application_status,
                mentor_id, website_url, review_note, reviewed_by, submitted_at, reviewed_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              startup.name,
              startup.tagline,
              founder.id,
              startup.description,
              startup.problem,
              startup.solution,
              startup.market_opportunity,
              startup.business_model,
              startup.team_members,
              startup.funding_required,
              startup.stage,
              startup.applicationStatus,
              mentor?.id ?? null,
              startup.websiteUrl,
              startup.reviewNote,
              startup.reviewedAt ? admin.id : null,
              startup.submittedAt,
              startup.reviewedAt,
            ],
          );
        }
        innovationSummary.startups += 1;
      }

      const innovationEventIds = new Map();
      for (const event of INNOVATION_EVENTS) {
        const createdBy = userByEmail.get(event.createdByEmail);
        if (!createdBy) {
          throw new Error(`Event creator not found: ${event.createdByEmail}`);
        }
        const existing = (
          await client.query(
            'SELECT id FROM innovation_events WHERE title = ? AND event_date = ? LIMIT 1',
            [event.title, event.eventDate],
          )
        ).rows[0];

        if (existing) {
          await client.query(
            `UPDATE innovation_events
             SET type = ?, description = ?, start_time = ?, end_time = ?, venue = ?,
                 registration_deadline = ?, max_participants = ?, team_size_min = ?,
                 team_size_max = ?, status = ?, created_by = ?
             WHERE id = ?`,
            [
              event.type,
              event.description,
              event.startTime,
              event.endTime,
              event.venue,
              event.registrationDeadline,
              event.maxParticipants,
              event.teamSizeMin,
              event.teamSizeMax,
              event.status,
              createdBy.id,
              existing.id,
            ],
          );
          innovationEventIds.set(event.title, existing.id);
        } else {
          const result = await client.query(
            `INSERT INTO innovation_events
               (title, type, description, event_date, start_time, end_time, venue,
                registration_deadline, max_participants, team_size_min, team_size_max,
                status, created_by)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              event.title,
              event.type,
              event.description,
              event.eventDate,
              event.startTime,
              event.endTime,
              event.venue,
              event.registrationDeadline,
              event.maxParticipants,
              event.teamSizeMin,
              event.teamSizeMax,
              event.status,
              createdBy.id,
            ],
          );
          innovationEventIds.set(event.title, result.insertId);
        }
        innovationSummary.events += 1;
      }

      const innovationEventByTitle = new Map(
        (await client.query('SELECT id, title FROM innovation_events')).rows.map((event) => [
          event.title,
          event,
        ]),
      );

      for (const registration of INNOVATION_EVENT_REGISTRATIONS) {
        const event = innovationEventByTitle.get(registration.eventTitle);
        const user = userByEmail.get(registration.userEmail);
        if (!event || !user) {
          throw new Error(`Event registration target not found: ${registration.eventTitle}`);
        }
        await client.query(
          `INSERT INTO innovation_event_registrations
             (event_id, user_id, team_name, team_members, status)
           VALUES (?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE
             team_name = VALUES(team_name),
             team_members = VALUES(team_members),
             status = VALUES(status)`,
          [event.id, user.id, registration.teamName, registration.teamMembers, registration.status],
        );
        innovationSummary.registrations += 1;
      }

      const innovationEquipmentIds = new Map();
      for (const equipment of INNOVATION_EQUIPMENT) {
        const existing = (
          await client.query('SELECT id FROM innovation_lab_equipment WHERE name = ? LIMIT 1', [
            equipment.name,
          ])
        ).rows[0];

        if (existing) {
          await client.query(
            `UPDATE innovation_lab_equipment
             SET category = ?, description = ?, quantity = ?, status = ?
             WHERE id = ?`,
            [equipment.category, equipment.description, equipment.quantity, equipment.status, existing.id],
          );
          innovationEquipmentIds.set(equipment.name, existing.id);
        } else {
          const result = await client.query(
            `INSERT INTO innovation_lab_equipment (name, category, description, quantity, status)
             VALUES (?, ?, ?, ?, ?)`,
            [equipment.name, equipment.category, equipment.description, equipment.quantity, equipment.status],
          );
          innovationEquipmentIds.set(equipment.name, result.insertId);
        }
        innovationSummary.equipment += 1;
      }

      const innovationEquipmentByName = new Map(
        (await client.query('SELECT id, name FROM innovation_lab_equipment')).rows.map((item) => [
          item.name,
          item,
        ]),
      );

      for (const booking of INNOVATION_BOOKINGS) {
        const user = userByEmail.get(booking.userEmail);
        if (!user) {
          throw new Error(`Booking user not found: ${booking.userEmail}`);
        }
        const equipmentId = booking.equipmentName
          ? innovationEquipmentByName.get(booking.equipmentName)?.id ?? null
          : null;
        const reviewedBy = booking.reviewedByEmail
          ? userByEmail.get(booking.reviewedByEmail) ?? null
          : null;
        const existing = (
          await client.query(
            `SELECT id FROM innovation_lab_bookings
             WHERE user_id = ? AND requested_date = ? AND purpose = ? LIMIT 1`,
            [user.id, booking.requestedDate, booking.purpose],
          )
        ).rows[0];

        if (existing) {
          await client.query(
            `UPDATE innovation_lab_bookings
             SET equipment_id = ?, facility = ?, start_time = ?, end_time = ?, team_size = ?,
                 status = ?, admin_note = ?, reviewed_by = ?, reviewed_at = ?
             WHERE id = ?`,
            [
              equipmentId,
              booking.facility,
              booking.startTime,
              booking.endTime,
              booking.teamSize,
              booking.status,
              booking.adminNote,
              reviewedBy?.id ?? null,
              reviewedBy ? '2026-10-28 10:00:00' : null,
              existing.id,
            ],
          );
        } else {
          await client.query(
            `INSERT INTO innovation_lab_bookings
               (user_id, equipment_id, facility, purpose, requested_date, start_time,
                end_time, team_size, status, admin_note, reviewed_by, reviewed_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              user.id,
              equipmentId,
              booking.facility,
              booking.purpose,
              booking.requestedDate,
              booking.startTime,
              booking.endTime,
              booking.teamSize,
              booking.status,
              booking.adminNote,
              reviewedBy?.id ?? null,
              reviewedBy ? '2026-10-28 10:00:00' : null,
            ],
          );
        }
        innovationSummary.bookings += 1;
      }

      for (const record of INNOVATION_RESEARCH) {
        const owner = userByEmail.get(record.ownerEmail);
        if (!owner) {
          throw new Error(`Research owner not found: ${record.ownerEmail}`);
        }
        const guide = record.guideEmail ? userByEmail.get(record.guideEmail) : null;
        const researchDept = deptByCode.get(record.departmentCode) ?? department;
        const existing = (
          await client.query(
            'SELECT id FROM innovation_research_records WHERE title = ? AND owner_id = ? LIMIT 1',
            [record.title, owner.id],
          )
        ).rows[0];

        if (existing) {
          await client.query(
            `UPDATE innovation_research_records
             SET abstract = ?, type = ?, department_id = ?, guide_id = ?, status = ?,
                 funding_amount = ?, funding_agency = ?, collaboration_partner = ?,
                 published_on = ?, paper_url = ?, progress = ?
             WHERE id = ?`,
            [
              record.abstract,
              record.type,
              researchDept.id,
              guide?.id ?? null,
              record.status,
              record.fundingAmount,
              record.fundingAgency,
              record.collaborationPartner,
              record.publishedOn,
              record.paperUrl,
              record.progress,
              existing.id,
            ],
          );
        } else {
          await client.query(
            `INSERT INTO innovation_research_records
               (title, abstract, type, owner_id, department_id, guide_id, status,
                funding_amount, funding_agency, collaboration_partner, published_on,
                paper_url, progress)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              record.title,
              record.abstract,
              record.type,
              owner.id,
              researchDept.id,
              guide?.id ?? null,
              record.status,
              record.fundingAmount,
              record.fundingAgency,
              record.collaborationPartner,
              record.publishedOn,
              record.paperUrl,
              record.progress,
            ],
          );
        }
        innovationSummary.research += 1;
      }

      for (const patent of INNOVATION_PATENTS) {
        const owner = userByEmail.get(patent.ownerEmail);
        if (!owner) {
          throw new Error(`Patent owner not found: ${patent.ownerEmail}`);
        }
        const patentDept = deptByCode.get(patent.departmentCode) ?? department;
        const existing = (
          await client.query(
            'SELECT id FROM innovation_patents WHERE title = ? AND owner_id = ? LIMIT 1',
            [patent.title, owner.id],
          )
        ).rows[0];

        if (existing) {
          await client.query(
            `UPDATE innovation_patents
             SET patent_number = ?, status = ?, inventors = ?, department_id = ?,
                 filing_date = ?, grant_date = ?, description = ?
             WHERE id = ?`,
            [
              patent.patentNumber,
              patent.status,
              patent.inventors,
              patentDept.id,
              patent.filingDate,
              patent.grantDate,
              patent.description,
              existing.id,
            ],
          );
        } else {
          await client.query(
            `INSERT INTO innovation_patents
               (title, patent_number, status, inventors, owner_id, department_id,
                filing_date, grant_date, description)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              patent.title,
              patent.patentNumber,
              patent.status,
              patent.inventors,
              owner.id,
              patentDept.id,
              patent.filingDate,
              patent.grantDate,
              patent.description,
            ],
          );
        }
        innovationSummary.patents += 1;
      }

      for (const request of INNOVATION_MENTOR_REQUESTS) {
        const student = userByEmail.get(request.studentEmail);
        const mentor = userByEmail.get(request.mentorEmail);
        if (!student || !mentor) {
          throw new Error(`Mentor request users not found: ${request.studentEmail}`);
        }
        const ideaId = request.ideaKey ? innovationIdeaIds.get(request.ideaKey) ?? null : null;
        const projectId = request.projectKey
          ? innovationProjectIds.get(request.projectKey) ?? null
          : null;
        const existing = (
          await client.query(
            `SELECT id FROM innovation_mentor_requests
             WHERE student_id = ? AND mentor_id = ? AND message = ? LIMIT 1`,
            [student.id, mentor.id, request.message],
          )
        ).rows[0];

        if (existing) {
          await client.query(
            `UPDATE innovation_mentor_requests
             SET idea_id = ?, project_id = ?, status = ?, scheduled_at = ?, mentor_notes = ?,
                 responded_at = ?
             WHERE id = ?`,
            [
              ideaId,
              projectId,
              request.status,
              request.scheduledAt,
              request.mentorNotes,
              request.status === 'pending' ? null : '2026-10-20 12:00:00',
              existing.id,
            ],
          );
        } else {
          await client.query(
            `INSERT INTO innovation_mentor_requests
               (student_id, mentor_id, idea_id, project_id, message, status, scheduled_at,
                mentor_notes, responded_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              student.id,
              mentor.id,
              ideaId,
              projectId,
              request.message,
              request.status,
              request.scheduledAt,
              request.mentorNotes,
              request.status === 'pending' ? null : '2026-10-20 12:00:00',
            ],
          );
        }
        innovationSummary.mentorRequests += 1;
      }

      for (const notification of INNOVATION_NOTIFICATIONS) {
        const user = userByEmail.get(notification.userEmail);
        if (!user) {
          throw new Error(`Notification user not found: ${notification.userEmail}`);
        }
        const existing = (
          await client.query(
            'SELECT id FROM innovation_notifications WHERE user_id = ? AND title = ? LIMIT 1',
            [user.id, notification.title],
          )
        ).rows[0];

        if (existing) {
          await client.query(
            `UPDATE innovation_notifications
             SET message = ?, type = ?, link = ?, is_read = ?
             WHERE id = ?`,
            [notification.message, notification.type, notification.link, notification.isRead ? 1 : 0, existing.id],
          );
        } else {
          await client.query(
            `INSERT INTO innovation_notifications (user_id, title, message, type, link, is_read)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
              user.id,
              notification.title,
              notification.message,
              notification.type,
              notification.link,
              notification.isRead ? 1 : 0,
            ],
          );
        }
        innovationSummary.notifications += 1;
      }

      const auditExists = (
        await client.query(
          "SELECT id FROM audit_logs WHERE action = 'seed.demo_data' AND entity = 'system' LIMIT 1",
        )
      ).rows[0];

      if (!auditExists) {
        await client.query(
          `INSERT INTO audit_logs (user_id, action, entity, entity_id)
           VALUES (NULL, 'seed.demo_data', 'system', 'demo')`,
        );
      }

      return {
        department,
        admin,
        studentAccounts,
        facultyAccounts,
        courses,
        enrollmentLinks,
        attendanceRows,
        marksheetRows,
        feeRows,
        announcementCount,
        innovationSummary,
      };
    });

    console.log('Demo data seeded successfully.');
    console.log(`Department: ${summary.department.name} (${summary.department.code})`);
    console.log('Accounts:');
    for (const user of [summary.admin, ...summary.studentAccounts, ...summary.facultyAccounts]) {
      const login = user.role === 'student' ? String(user.id) : user.name;
      console.log(`  ${user.role.padEnd(7)} id=${user.id} login=${login} name=${user.name}`);
    }
    console.log(
      `Courses: ${summary.courses.map((course) => `${course.code} (id ${course.id})`).join(', ')}`,
    );
    console.log(`Enrollment links ensured: ${summary.enrollmentLinks}`);
    console.log(`Attendance rows upserted: ${summary.attendanceRows}`);
    console.log(`Marksheet rows upserted: ${summary.marksheetRows}`);
    console.log(`Fee invoices upserted: ${summary.feeRows}`);
    console.log(`Announcements ensured: ${summary.announcementCount}`);
    console.log(
      `Innovation data ensured: ${summary.innovationSummary.mentors} mentors, ` +
        `${summary.innovationSummary.ideas} ideas, ` +
        `${summary.innovationSummary.projects} projects, ` +
        `${summary.innovationSummary.startups} startups, ` +
        `${summary.innovationSummary.events} events, ` +
        `${summary.innovationSummary.equipment} equipment, ` +
        `${summary.innovationSummary.research} research records, ` +
        `${summary.innovationSummary.patents} patents`,
    );
    writeCredentialsFile(summary);
    console.log(`Demo credentials written to ${CREDENTIALS_PATH}`);
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error('Demo data seed failed:', err.message);
  process.exitCode = 1;
});
