import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';
import { DEMO_PASSWORD_ENVS, resolveDemoPassword } from '../config/demo.js';
import getPool, { withTransaction } from '../db/pool.js';

const BCRYPT_ROUNDS = 10;
const DEPARTMENT_CODE = 'CSE';
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
  },
  {
    name: 'Ron Weasley',
    email: 'ron.weasley@example.com',
    rollNo: 'CSE2024-002',
    year: 2,
    passwordRole: 'student',
  },
  {
    name: 'Hermione Granger',
    email: 'hermione.granger@example.com',
    rollNo: 'CSE2024-003',
    year: 2,
    passwordRole: 'student',
  },
];

const FACULTY = [
  // CSE
  {
    name: 'Severus Snape',
    email: 'severus.snape@example.com',
    designation: 'Assistant Professor',
    passwordRole: 'faculty',
    departmentCode: 'CSE',
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
    departmentCode: 'CSE',
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
    const login = account.role === 'student' ? String(account.id) : account.email;
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
    '- Faculty and administrators sign in with their email address.',
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

      // Ensure CSE exists (primary teaching department for students)
      let department = deptByCode.get(DEPARTMENT_CODE);
      if (!department) {
        const result = await client.query(
          'INSERT INTO departments (name, code) VALUES (?, ?)',
          ['Computer Science and Engineering', DEPARTMENT_CODE],
        );
        department = {
          id: result.insertId,
          name: 'Computer Science and Engineering',
          code: DEPARTMENT_CODE,
        };
        deptByCode.set(DEPARTMENT_CODE, department);
      }

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
          [user.id, student.rollNo, department.id, student.year],
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
        // Look up the faculty member's department; fall back to CSE if not found
        const memberDept = deptByCode.get(member.departmentCode) ?? department;
        await client.query(
          `INSERT INTO faculty (user_id, department_id, designation)
           VALUES (?, ?, ?)
           ON DUPLICATE KEY UPDATE
             department_id = VALUES(department_id),
             designation = VALUES(designation)`,
          [user.id, memberDept.id, member.designation],
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
      };
    });

    console.log('Demo data seeded successfully.');
    console.log(`Department: ${summary.department.name} (${summary.department.code})`);
    console.log('Accounts:');
    for (const user of [summary.admin, ...summary.studentAccounts, ...summary.facultyAccounts]) {
      const login = user.role === 'student' ? String(user.id) : user.email;
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
