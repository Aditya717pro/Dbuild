-- ===========================================================================
-- College Management Portal - complete database setup
-- Target: MySQL 8.0.16+ (CHECK constraints are required)
--
-- How to run:
--   mysql -u root -p < database.sql
--   or open this file in MySQL Workbench and execute it.
--
-- This file contains NO passwords and NO user/account credentials.
-- It only creates the database and the tables the project needs.
-- After importing, create the first admin with:
--   cd backend
--   npm run create-admin
-- ===========================================================================

CREATE DATABASE IF NOT EXISTS `dbuild`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;

USE `dbuild`;

SET NAMES utf8mb4;

-- ---------------------------------------------------------------------------
-- 1. users
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id            INT           AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(120)  NOT NULL,
    email         VARCHAR(200)  NOT NULL,
    password_hash VARCHAR(255)  NOT NULL,
    role          VARCHAR(20)   NOT NULL,
    is_active     TINYINT(1)    NOT NULL DEFAULT 1,
    last_login_at TIMESTAMP     NULL DEFAULT NULL,
    created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY users_email_key (email),
    CONSTRAINT users_role_check      CHECK (role IN ('admin', 'faculty', 'student')),
    CONSTRAINT users_email_lower_chk CHECK (email = LOWER(email))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------------------
-- 2. departments
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS departments (
    id         INT           AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(120)  NOT NULL,
    code       VARCHAR(20)   NOT NULL,
    created_at TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY departments_name_key (name),
    UNIQUE KEY departments_code_key (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------------------
-- 3. students (profile row for users with role = 'student')
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS students (
    user_id       INT       PRIMARY KEY,
    roll_no       VARCHAR(40) NOT NULL,
    department_id INT       NULL,
    year          SMALLINT  NOT NULL DEFAULT 1,
    created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY students_roll_no_key (roll_no),
    KEY idx_students_department_id (department_id),
    CONSTRAINT students_year_check CHECK (year BETWEEN 1 AND 6),
    CONSTRAINT students_user_fk
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT students_department_fk
        FOREIGN KEY (department_id) REFERENCES departments (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------------------
-- 4. faculty (profile row for users with role = 'faculty')
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS faculty (
    user_id       INT           PRIMARY KEY,
    department_id INT           NULL,
    designation   VARCHAR(120)  NULL,
    created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_faculty_department_id (department_id),
    CONSTRAINT faculty_user_fk
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT faculty_department_fk
        FOREIGN KEY (department_id) REFERENCES departments (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------------------
-- 5. courses
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS courses (
    id            INT           AUTO_INCREMENT PRIMARY KEY,
    code          VARCHAR(20)   NOT NULL,
    name          VARCHAR(200)  NOT NULL,
    department_id INT           NULL,
    faculty_id    INT           NULL,
    semester      SMALLINT      NULL,
    created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY courses_code_key (code),
    KEY idx_courses_department_id (department_id),
    KEY idx_courses_faculty_id (faculty_id),
    CONSTRAINT courses_semester_check CHECK (semester IS NULL OR semester BETWEEN 1 AND 12),
    CONSTRAINT courses_department_fk
        FOREIGN KEY (department_id) REFERENCES departments (id) ON DELETE SET NULL,
    CONSTRAINT courses_faculty_fk
        FOREIGN KEY (faculty_id) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------------------
-- 6. enrollments
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS enrollments (
    id         INT       AUTO_INCREMENT PRIMARY KEY,
    student_id INT       NOT NULL,
    course_id  INT       NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY enrollments_student_course_key (student_id, course_id),
    KEY idx_enrollments_student_id (student_id),
    KEY idx_enrollments_course_id (course_id),
    CONSTRAINT enrollments_student_fk
        FOREIGN KEY (student_id) REFERENCES students (user_id) ON DELETE CASCADE,
    CONSTRAINT enrollments_course_fk
        FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------------------
-- 7. attendance
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS attendance (
    id         INT       AUTO_INCREMENT PRIMARY KEY,
    student_id INT       NOT NULL,
    course_id  INT       NOT NULL,
    `date`     DATE      NOT NULL,
    status     VARCHAR(20) NOT NULL,
    marked_by  INT       NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY attendance_student_course_date_key (student_id, course_id, `date`),
    KEY idx_attendance_student_id (student_id),
    KEY idx_attendance_course_id (course_id),
    KEY idx_attendance_date (`date`),
    KEY idx_attendance_course_date (course_id, `date`),
    CONSTRAINT attendance_status_check CHECK (status IN ('present', 'absent')),
    CONSTRAINT attendance_student_fk
        FOREIGN KEY (student_id) REFERENCES students (user_id) ON DELETE CASCADE,
    CONSTRAINT attendance_course_fk
        FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE,
    CONSTRAINT attendance_marked_by_fk
        FOREIGN KEY (marked_by) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------------------
-- 8. announcements
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS announcements (
    id            INT           AUTO_INCREMENT PRIMARY KEY,
    title         VARCHAR(200)  NOT NULL,
    body          TEXT          NOT NULL,
    posted_by     INT           NULL,
    audience      VARCHAR(20)   NOT NULL,
    department_id INT           NULL,
    course_id     INT           NULL,
    created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_announcements_department_id (department_id),
    KEY idx_announcements_course_id (course_id),
    KEY idx_announcements_created_at (created_at DESC),
    CONSTRAINT announcements_audience_check
        CHECK (audience IN ('all', 'department', 'course')),
    CONSTRAINT announcements_audience_target_check CHECK (
        (audience = 'all'        AND department_id IS NULL AND course_id IS NULL)
        OR (audience = 'department' AND department_id IS NOT NULL)
        OR (audience = 'course'     AND course_id IS NOT NULL)
    ),
    CONSTRAINT announcements_posted_by_fk
        FOREIGN KEY (posted_by) REFERENCES users (id) ON DELETE SET NULL,
    CONSTRAINT announcements_department_fk
        FOREIGN KEY (department_id) REFERENCES departments (id) ON DELETE CASCADE,
    CONSTRAINT announcements_course_fk
        FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------------------
-- 9. audit_logs
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
    id         BIGINT       AUTO_INCREMENT PRIMARY KEY,
    user_id    INT          NULL,
    action     VARCHAR(100) NOT NULL,
    entity     VARCHAR(100) NOT NULL,
    entity_id  VARCHAR(64)  NULL,
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_audit_logs_user_id (user_id),
    KEY idx_audit_logs_created_at (created_at DESC),
    CONSTRAINT audit_logs_user_fk
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ===========================================================================
-- Optional starter data (no passwords / no user accounts)
-- ===========================================================================
INSERT IGNORE INTO departments (name, code) VALUES
  ('Computer Science and Engineering', 'CSE'),
  ('Information Technology', 'IT'),
  ('Artificial Intelligence and Data Science', 'AI&DS'),
  ('Artificial Intelligence and Machine Learning', 'AI&ML'),
  ('Electronics and Communication Engineering', 'ECE'),
  ('Electrical and Electronics Engineering', 'EEE'),
  ('Mechanical Engineering', 'MECH'),
  ('Civil Engineering', 'CIVIL'),
  ('Bio-Medical Engineering', 'BME'),
  ('Medical Electronics', 'MDE'),
  ('Management Studies (MBA)', 'MBA'),
  ('Science and Humanities', 'S&H');

-- ===========================================================================
-- Done. Tables created in database `dbuild`.
--
-- For an existing database, apply schema updates and demo data with:
--   cd backend
--   npm run db:update
--
-- For schema migrations only (including production):
--   cd backend
--   npm run db:migrate
--
-- Create portal accounts (with your own password) afterwards:
--   npm run create-admin
--   npm run create-student
-- ===========================================================================
