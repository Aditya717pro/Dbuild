-- College Management Portal - schema
-- Target: self-managed PostgreSQL on AWS EC2
-- This script is idempotent: safe to run multiple times.
-- Run as the database owner (e.g. postgres), NOT as the application role.

BEGIN;

-- ---------------------------------------------------------------------------
-- users
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id            INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name          TEXT        NOT NULL,
    email         TEXT        NOT NULL,
    password_hash TEXT        NOT NULL,
    role          TEXT        NOT NULL,
    is_active     BOOLEAN     NOT NULL DEFAULT TRUE,
    last_login_at TIMESTAMPTZ,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT users_email_key      UNIQUE (email),
    CONSTRAINT users_role_check     CHECK (role IN ('admin', 'faculty', 'student')),
    CONSTRAINT users_email_lower_chk CHECK (email = lower(email))
);

-- ---------------------------------------------------------------------------
-- departments
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS departments (
    id         INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name       TEXT        NOT NULL,
    code       TEXT        NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT departments_name_key UNIQUE (name),
    CONSTRAINT departments_code_key UNIQUE (code)
);

-- ---------------------------------------------------------------------------
-- students (profile row for users with role = 'student')
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS students (
    user_id       INTEGER  PRIMARY KEY,
    roll_no       TEXT     NOT NULL,
    department_id INTEGER,
    year          SMALLINT NOT NULL DEFAULT 1,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT students_roll_no_key UNIQUE (roll_no),
    CONSTRAINT students_year_check  CHECK (year BETWEEN 1 AND 6),
    CONSTRAINT students_user_fk
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT students_department_fk
        FOREIGN KEY (department_id) REFERENCES departments (id) ON DELETE SET NULL
);

-- ---------------------------------------------------------------------------
-- faculty (profile row for users with role = 'faculty')
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS faculty (
    user_id       INTEGER PRIMARY KEY,
    department_id INTEGER,
    designation   TEXT,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT faculty_user_fk
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT faculty_department_fk
        FOREIGN KEY (department_id) REFERENCES departments (id) ON DELETE SET NULL
);

-- ---------------------------------------------------------------------------
-- courses
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS courses (
    id            INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    code          TEXT        NOT NULL,
    name          TEXT        NOT NULL,
    department_id INTEGER,
    faculty_id    INTEGER,
    semester      SMALLINT,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT courses_code_key UNIQUE (code),
    CONSTRAINT courses_semester_check CHECK (semester IS NULL OR semester BETWEEN 1 AND 12),
    CONSTRAINT courses_department_fk
        FOREIGN KEY (department_id) REFERENCES departments (id) ON DELETE SET NULL,
    CONSTRAINT courses_faculty_fk
        FOREIGN KEY (faculty_id) REFERENCES users (id) ON DELETE SET NULL
);

-- ---------------------------------------------------------------------------
-- enrollments
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS enrollments (
    id         INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    student_id INTEGER     NOT NULL,
    course_id  INTEGER     NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT enrollments_student_course_key UNIQUE (student_id, course_id),
    CONSTRAINT enrollments_student_fk
        FOREIGN KEY (student_id) REFERENCES students (user_id) ON DELETE CASCADE,
    CONSTRAINT enrollments_course_fk
        FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------------
-- attendance
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS attendance (
    id         INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    student_id INTEGER     NOT NULL,
    course_id  INTEGER     NOT NULL,
    date       DATE        NOT NULL,
    status     TEXT        NOT NULL,
    marked_by  INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT attendance_student_course_date_key UNIQUE (student_id, course_id, date),
    CONSTRAINT attendance_status_check CHECK (status IN ('present', 'absent')),
    CONSTRAINT attendance_student_fk
        FOREIGN KEY (student_id) REFERENCES students (user_id) ON DELETE CASCADE,
    CONSTRAINT attendance_course_fk
        FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE,
    CONSTRAINT attendance_marked_by_fk
        FOREIGN KEY (marked_by) REFERENCES users (id) ON DELETE SET NULL
);

-- ---------------------------------------------------------------------------
-- announcements
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS announcements (
    id            INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title         TEXT        NOT NULL,
    body          TEXT        NOT NULL,
    posted_by     INTEGER,
    audience      TEXT        NOT NULL,
    department_id INTEGER,
    course_id     INTEGER,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
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
);

-- ---------------------------------------------------------------------------
-- audit_logs
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
    id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id    INTEGER,
    action     TEXT        NOT NULL,
    entity     TEXT        NOT NULL,
    entity_id  TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT audit_logs_user_fk
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
);

-- ---------------------------------------------------------------------------
-- indexes
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_students_department_id     ON students (department_id);
CREATE INDEX IF NOT EXISTS idx_faculty_department_id      ON faculty (department_id);
CREATE INDEX IF NOT EXISTS idx_courses_department_id      ON courses (department_id);
CREATE INDEX IF NOT EXISTS idx_courses_faculty_id         ON courses (faculty_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_student_id     ON enrollments (student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id      ON enrollments (course_id);
CREATE INDEX IF NOT EXISTS idx_attendance_student_id      ON attendance (student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_course_id       ON attendance (course_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date            ON attendance (date);
CREATE INDEX IF NOT EXISTS idx_attendance_course_date     ON attendance (course_id, date);
CREATE INDEX IF NOT EXISTS idx_announcements_department_id ON announcements (department_id);
CREATE INDEX IF NOT EXISTS idx_announcements_course_id    ON announcements (course_id);
CREATE INDEX IF NOT EXISTS idx_announcements_created_at   ON announcements (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id         ON audit_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at      ON audit_logs (created_at DESC);

COMMIT;
