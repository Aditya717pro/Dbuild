-- College Management Portal - reference schema
-- Target: MySQL 8.0+ (local or self-managed)
--
-- The canonical fresh-install file is database.sql at the repository root.
-- This file contains the same tables without CREATE DATABASE/USE or starter departments.
-- If you change a table, update database.sql AND add a migration in backend/db/migrations/.
-- This script is idempotent: safe to run multiple times.
-- Run as the database owner (or root), NOT as the application user.

-- ---------------------------------------------------------------------------
-- users
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
-- departments
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
-- students (profile row for users with role = 'student')
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
-- faculty (profile row for users with role = 'faculty')
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
-- courses
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
-- enrollments
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
-- attendance
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
-- announcements
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
-- marksheets (published end semester results per student/course)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS marksheets (
    id             INT           AUTO_INCREMENT PRIMARY KEY,
    student_id     INT           NOT NULL,
    course_id      INT           NOT NULL,
    semester       SMALLINT      NOT NULL,
    exam_type      VARCHAR(60)   NOT NULL,
    marks_obtained DECIMAL(6,2)  NOT NULL,
    max_marks      DECIMAL(6,2)  NOT NULL DEFAULT 100.00,
    published_on   DATE          NOT NULL,
    created_at     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY marksheets_student_course_exam_key (student_id, course_id, semester, exam_type),
    KEY idx_marksheets_student_id (student_id),
    KEY idx_marksheets_course_id (course_id),
    CONSTRAINT marksheets_semester_check CHECK (semester BETWEEN 1 AND 12),
    CONSTRAINT marksheets_marks_check CHECK (
        marks_obtained >= 0 AND max_marks > 0 AND marks_obtained <= max_marks
    ),
    CONSTRAINT marksheets_student_fk
        FOREIGN KEY (student_id) REFERENCES students (user_id) ON DELETE CASCADE,
    CONSTRAINT marksheets_course_fk
        FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------------------
-- fees (student fee invoices and payments)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS fees (
    id          INT           AUTO_INCREMENT PRIMARY KEY,
    student_id  INT           NOT NULL,
    fee_type    VARCHAR(100)  NOT NULL,
    amount      DECIMAL(10,2) NOT NULL,
    paid_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    due_date    DATE          NOT NULL,
    paid_on     DATE          NULL,
    receipt_no  VARCHAR(40)   NULL,
    created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY fees_student_type_due_key (student_id, fee_type, due_date),
    KEY idx_fees_student_id (student_id),
    KEY idx_fees_due_date (due_date),
    CONSTRAINT fees_amount_check CHECK (
        amount > 0 AND paid_amount >= 0 AND paid_amount <= amount
    ),
    CONSTRAINT fees_student_fk
        FOREIGN KEY (student_id) REFERENCES students (user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------------------
-- audit_logs
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
