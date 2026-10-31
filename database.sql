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
    is_cdc        TINYINT(1)    NOT NULL DEFAULT 0,
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
    image_data    MEDIUMBLOB    NULL,
    image_mime    VARCHAR(100)  NULL,
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
-- 9. marksheets (published end semester results per student/course)
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
-- 10. fees (student fee invoices and payments)
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
-- 11. placement_posters (upcoming placement pool drive posters)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS placement_posters (
    id                    INT           AUTO_INCREMENT PRIMARY KEY,
    title                 VARCHAR(200)  NOT NULL,
    company               VARCHAR(160)  NOT NULL,
    drive_date            DATE          NOT NULL,
    venue                 VARCHAR(200)  NOT NULL,
    eligibility           VARCHAR(500)  NOT NULL,
    registration_deadline DATE          NULL,
    description           TEXT          NULL,
    apply_url             VARCHAR(500)  NULL,
    department_id         INT           NULL,
    image_data            MEDIUMBLOB    NOT NULL,
    image_mime            VARCHAR(100)  NOT NULL,
    posted_by             INT           NULL,
    created_at            TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_placement_posters_department_id (department_id),
    KEY idx_placement_posters_drive_date (drive_date),
    KEY idx_placement_posters_created_at (created_at DESC),
    CONSTRAINT placement_posters_department_fk
        FOREIGN KEY (department_id) REFERENCES departments (id) ON DELETE CASCADE,
    CONSTRAINT placement_posters_posted_by_fk
        FOREIGN KEY (posted_by) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------------------
-- 12. innovation_ideas
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS innovation_ideas (
    id                 INT           AUTO_INCREMENT PRIMARY KEY,
    title              VARCHAR(200)  NOT NULL,
    category           VARCHAR(60)   NOT NULL,
    problem_statement  TEXT          NOT NULL,
    proposed_solution  TEXT          NOT NULL,
    technology         VARCHAR(300)  NULL,
    team_members       VARCHAR(500)  NULL,
    department_id      INT           NULL,
    year_of_study      VARCHAR(30)   NULL,
    expected_outcome   TEXT          NULL,
    status             ENUM('draft', 'submitted', 'under_review', 'approved', 'rejected', 'prototype_development', 'completed')
                       NOT NULL DEFAULT 'draft',
    mentor_id          INT           NULL,
    submitted_by       INT           NOT NULL,
    review_note        TEXT          NULL,
    submitted_at       TIMESTAMP     NULL DEFAULT NULL,
    reviewed_at        TIMESTAMP     NULL DEFAULT NULL,
    created_at         TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at         TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_innovation_ideas_status (status),
    KEY idx_innovation_ideas_department_id (department_id),
    KEY idx_innovation_ideas_submitted_by (submitted_by),
    KEY idx_innovation_ideas_mentor_id (mentor_id),
    KEY idx_innovation_ideas_created_at (created_at DESC),
    CONSTRAINT innovation_ideas_department_fk
        FOREIGN KEY (department_id) REFERENCES departments (id) ON DELETE SET NULL,
    CONSTRAINT innovation_ideas_mentor_fk
        FOREIGN KEY (mentor_id) REFERENCES users (id) ON DELETE SET NULL,
    CONSTRAINT innovation_ideas_submitted_by_fk
        FOREIGN KEY (submitted_by) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS innovation_idea_attachments (
    id         INT           AUTO_INCREMENT PRIMARY KEY,
    idea_id    INT           NOT NULL,
    kind       ENUM('image', 'document') NOT NULL,
    file_name  VARCHAR(255)  NOT NULL,
    mime       VARCHAR(100)  NOT NULL,
    size_bytes INT UNSIGNED  NOT NULL,
    data       MEDIUMBLOB    NOT NULL,
    created_at TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_innovation_idea_attachments_idea_id (idea_id),
    CONSTRAINT innovation_idea_attachments_idea_fk
        FOREIGN KEY (idea_id) REFERENCES innovation_ideas (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS innovation_projects (
    id              INT           AUTO_INCREMENT PRIMARY KEY,
    idea_id         INT           NULL,
    title           VARCHAR(200)  NOT NULL,
    description     TEXT          NOT NULL,
    problem_solved  TEXT          NULL,
    technology      VARCHAR(300)  NULL,
    team_members    VARCHAR(500)  NULL,
    department_id   INT           NULL,
    owner_id        INT           NOT NULL,
    mentor_id       INT           NULL,
    github_url      VARCHAR(500)  NULL,
    demo_url        VARCHAR(500)  NULL,
    status          ENUM('planning', 'in_development', 'prototype', 'testing', 'completed', 'on_hold')
                    NOT NULL DEFAULT 'planning',
    progress        TINYINT UNSIGNED NOT NULL DEFAULT 0,
    is_featured     TINYINT(1)    NOT NULL DEFAULT 0,
    created_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY innovation_projects_idea_key (idea_id),
    KEY idx_innovation_projects_owner_id (owner_id),
    KEY idx_innovation_projects_mentor_id (mentor_id),
    KEY idx_innovation_projects_department_id (department_id),
    KEY idx_innovation_projects_status (status),
    KEY idx_innovation_projects_featured (is_featured, created_at DESC),
    CONSTRAINT innovation_projects_progress_check CHECK (progress BETWEEN 0 AND 100),
    CONSTRAINT innovation_projects_idea_fk
        FOREIGN KEY (idea_id) REFERENCES innovation_ideas (id) ON DELETE SET NULL,
    CONSTRAINT innovation_projects_department_fk
        FOREIGN KEY (department_id) REFERENCES departments (id) ON DELETE SET NULL,
    CONSTRAINT innovation_projects_owner_fk
        FOREIGN KEY (owner_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT innovation_projects_mentor_fk
        FOREIGN KEY (mentor_id) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS innovation_project_media (
    id         INT           AUTO_INCREMENT PRIMARY KEY,
    project_id INT           NOT NULL,
    kind       ENUM('image', 'document') NOT NULL DEFAULT 'image',
    file_name  VARCHAR(255)  NOT NULL,
    mime       VARCHAR(100)  NOT NULL,
    size_bytes INT UNSIGNED  NOT NULL,
    data       MEDIUMBLOB    NOT NULL,
    created_at TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_innovation_project_media_project_id (project_id),
    CONSTRAINT innovation_project_media_project_fk
        FOREIGN KEY (project_id) REFERENCES innovation_projects (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS innovation_mentor_profiles (
    user_id       INT           PRIMARY KEY,
    expertise     VARCHAR(300)  NOT NULL,
    bio           TEXT          NULL,
    availability  VARCHAR(300)  NULL,
    max_mentees   SMALLINT UNSIGNED NOT NULL DEFAULT 5,
    is_available  TINYINT(1)    NOT NULL DEFAULT 1,
    created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT innovation_mentor_profiles_max_check CHECK (max_mentees BETWEEN 1 AND 100),
    CONSTRAINT innovation_mentor_profiles_user_fk
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS innovation_mentor_requests (
    id            INT           AUTO_INCREMENT PRIMARY KEY,
    student_id    INT           NOT NULL,
    mentor_id     INT           NOT NULL,
    idea_id       INT           NULL,
    project_id    INT           NULL,
    message       TEXT          NOT NULL,
    status        ENUM('pending', 'accepted', 'rejected', 'completed', 'cancelled')
                  NOT NULL DEFAULT 'pending',
    scheduled_at  DATETIME      NULL,
    mentor_notes  TEXT          NULL,
    responded_at  TIMESTAMP     NULL DEFAULT NULL,
    created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_innovation_mentor_requests_student (student_id),
    KEY idx_innovation_mentor_requests_mentor (mentor_id, status),
    KEY idx_innovation_mentor_requests_idea (idea_id),
    KEY idx_innovation_mentor_requests_project (project_id),
    CONSTRAINT innovation_mentor_requests_student_fk
        FOREIGN KEY (student_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT innovation_mentor_requests_mentor_fk
        FOREIGN KEY (mentor_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT innovation_mentor_requests_idea_fk
        FOREIGN KEY (idea_id) REFERENCES innovation_ideas (id) ON DELETE SET NULL,
    CONSTRAINT innovation_mentor_requests_project_fk
        FOREIGN KEY (project_id) REFERENCES innovation_projects (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS innovation_startups (
    id                 INT           AUTO_INCREMENT PRIMARY KEY,
    name               VARCHAR(200)  NOT NULL,
    tagline            VARCHAR(200)  NULL,
    founder_id         INT           NOT NULL,
    description        TEXT          NOT NULL,
    problem            TEXT          NULL,
    solution           TEXT          NULL,
    market_opportunity TEXT          NULL,
    business_model     TEXT          NULL,
    team_members       VARCHAR(500)  NULL,
    funding_required   DECIMAL(12,2) NULL,
    stage              ENUM('idea_generation', 'idea_validation', 'business_model', 'prototype', 'market_validation', 'incubation', 'launched')
                       NOT NULL DEFAULT 'idea_generation',
    application_status ENUM('draft', 'submitted', 'under_review', 'approved', 'rejected')
                       NOT NULL DEFAULT 'draft',
    mentor_id          INT           NULL,
    website_url        VARCHAR(500)  NULL,
    review_note        TEXT          NULL,
    reviewed_by        INT           NULL,
    submitted_at       TIMESTAMP     NULL DEFAULT NULL,
    reviewed_at        TIMESTAMP     NULL DEFAULT NULL,
    created_at         TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at         TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_innovation_startups_founder (founder_id),
    KEY idx_innovation_startups_status (application_status),
    KEY idx_innovation_startups_stage (stage),
    KEY idx_innovation_startups_mentor (mentor_id),
    CONSTRAINT innovation_startups_funding_check CHECK (funding_required IS NULL OR funding_required >= 0),
    CONSTRAINT innovation_startups_founder_fk
        FOREIGN KEY (founder_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT innovation_startups_mentor_fk
        FOREIGN KEY (mentor_id) REFERENCES users (id) ON DELETE SET NULL,
    CONSTRAINT innovation_startups_reviewed_by_fk
        FOREIGN KEY (reviewed_by) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS innovation_events (
    id                    INT           AUTO_INCREMENT PRIMARY KEY,
    title                 VARCHAR(200)  NOT NULL,
    type                  ENUM('hackathon', 'ideathon', 'competition', 'workshop', 'seminar', 'entrepreneurship', 'challenge')
                          NOT NULL,
    description           TEXT          NOT NULL,
    event_date            DATE          NOT NULL,
    start_time            TIME          NULL,
    end_time              TIME          NULL,
    venue                 VARCHAR(200)  NOT NULL,
    registration_deadline DATE          NULL,
    max_participants      INT UNSIGNED  NULL,
    team_size_min         TINYINT UNSIGNED NOT NULL DEFAULT 1,
    team_size_max         TINYINT UNSIGNED NOT NULL DEFAULT 1,
    status                ENUM('upcoming', 'ongoing', 'completed', 'cancelled') NOT NULL DEFAULT 'upcoming',
    created_by            INT           NULL,
    created_at            TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_innovation_events_date (event_date),
    KEY idx_innovation_events_status (status),
    KEY idx_innovation_events_type (type),
    CONSTRAINT innovation_events_team_size_check CHECK (
        team_size_min >= 1 AND team_size_max >= team_size_min AND team_size_max <= 100
    ),
    CONSTRAINT innovation_events_time_check CHECK (
        start_time IS NULL OR end_time IS NULL OR end_time > start_time
    ),
    CONSTRAINT innovation_events_created_by_fk
        FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS innovation_event_registrations (
    id           INT           AUTO_INCREMENT PRIMARY KEY,
    event_id     INT           NOT NULL,
    user_id      INT           NOT NULL,
    team_name    VARCHAR(120)  NULL,
    team_members TEXT          NULL,
    status       ENUM('registered', 'waitlisted', 'cancelled', 'attended')
                 NOT NULL DEFAULT 'registered',
    created_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY innovation_event_registrations_user_key (event_id, user_id),
    KEY idx_innovation_event_registrations_user (user_id),
    KEY idx_innovation_event_registrations_status (event_id, status),
    CONSTRAINT innovation_event_registrations_event_fk
        FOREIGN KEY (event_id) REFERENCES innovation_events (id) ON DELETE CASCADE,
    CONSTRAINT innovation_event_registrations_user_fk
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS innovation_lab_equipment (
    id          INT           AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(160)  NOT NULL,
    category    VARCHAR(80)   NOT NULL,
    description TEXT          NULL,
    quantity    SMALLINT UNSIGNED NOT NULL DEFAULT 1,
    status      ENUM('available', 'maintenance', 'retired') NOT NULL DEFAULT 'available',
    created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_innovation_lab_equipment_status (status),
    CONSTRAINT innovation_lab_equipment_quantity_check CHECK (quantity >= 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS innovation_lab_bookings (
    id             INT           AUTO_INCREMENT PRIMARY KEY,
    user_id        INT           NOT NULL,
    equipment_id   INT           NULL,
    facility       VARCHAR(160)  NULL,
    purpose        TEXT          NOT NULL,
    requested_date DATE          NOT NULL,
    start_time     TIME          NOT NULL,
    end_time       TIME          NOT NULL,
    team_size      TINYINT UNSIGNED NOT NULL DEFAULT 1,
    status         ENUM('pending', 'approved', 'rejected', 'completed', 'cancelled')
                   NOT NULL DEFAULT 'pending',
    admin_note     TEXT          NULL,
    reviewed_by    INT           NULL,
    reviewed_at    TIMESTAMP     NULL DEFAULT NULL,
    created_at     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_innovation_lab_bookings_user (user_id),
    KEY idx_innovation_lab_bookings_equipment_date (equipment_id, requested_date),
    KEY idx_innovation_lab_bookings_status (status),
    CONSTRAINT innovation_lab_bookings_time_check CHECK (end_time > start_time),
    CONSTRAINT innovation_lab_bookings_team_check CHECK (team_size BETWEEN 1 AND 100),
    CONSTRAINT innovation_lab_bookings_user_fk
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT innovation_lab_bookings_equipment_fk
        FOREIGN KEY (equipment_id) REFERENCES innovation_lab_equipment (id) ON DELETE SET NULL,
    CONSTRAINT innovation_lab_bookings_reviewed_by_fk
        FOREIGN KEY (reviewed_by) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS innovation_research_records (
    id                  INT           AUTO_INCREMENT PRIMARY KEY,
    title               VARCHAR(250)  NOT NULL,
    abstract            TEXT          NOT NULL,
    type                ENUM('student_project', 'faculty_project', 'published_paper', 'industry_collaboration')
                        NOT NULL,
    owner_id            INT           NOT NULL,
    department_id       INT           NULL,
    guide_id            INT           NULL,
    status              ENUM('ongoing', 'completed', 'published', 'patented') NOT NULL DEFAULT 'ongoing',
    funding_amount      DECIMAL(12,2) NULL,
    funding_agency      VARCHAR(200)  NULL,
    collaboration_partner VARCHAR(200) NULL,
    published_on        DATE          NULL,
    paper_url           VARCHAR(500)  NULL,
    progress            TINYINT UNSIGNED NOT NULL DEFAULT 0,
    created_at          TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_innovation_research_owner (owner_id),
    KEY idx_innovation_research_department (department_id),
    KEY idx_innovation_research_status (status),
    KEY idx_innovation_research_type (type),
    CONSTRAINT innovation_research_funding_check CHECK (funding_amount IS NULL OR funding_amount >= 0),
    CONSTRAINT innovation_research_progress_check CHECK (progress BETWEEN 0 AND 100),
    CONSTRAINT innovation_research_owner_fk
        FOREIGN KEY (owner_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT innovation_research_department_fk
        FOREIGN KEY (department_id) REFERENCES departments (id) ON DELETE SET NULL,
    CONSTRAINT innovation_research_guide_fk
        FOREIGN KEY (guide_id) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS innovation_patents (
    id            INT           AUTO_INCREMENT PRIMARY KEY,
    title         VARCHAR(250)  NOT NULL,
    patent_number VARCHAR(100)  NULL,
    status        ENUM('draft', 'filed', 'published', 'granted', 'rejected') NOT NULL DEFAULT 'draft',
    inventors     VARCHAR(500)  NOT NULL,
    owner_id      INT           NOT NULL,
    department_id INT           NULL,
    filing_date   DATE          NULL,
    grant_date    DATE          NULL,
    description   TEXT          NULL,
    document_url  VARCHAR(500)  NULL,
    created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_innovation_patents_owner (owner_id),
    KEY idx_innovation_patents_department (department_id),
    KEY idx_innovation_patents_status (status),
    CONSTRAINT innovation_patents_owner_fk
        FOREIGN KEY (owner_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT innovation_patents_department_fk
        FOREIGN KEY (department_id) REFERENCES departments (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS innovation_notifications (
    id         INT           AUTO_INCREMENT PRIMARY KEY,
    user_id    INT           NOT NULL,
    title      VARCHAR(200)  NOT NULL,
    message    TEXT          NOT NULL,
    type       ENUM('idea', 'mentor', 'event', 'lab', 'startup', 'research', 'system')
               NOT NULL DEFAULT 'system',
    link       VARCHAR(255)  NULL,
    is_read    TINYINT(1)    NOT NULL DEFAULT 0,
    created_at TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_innovation_notifications_user (user_id, is_read, created_at DESC),
    CONSTRAINT innovation_notifications_user_fk
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS innovation_feedback (
    id          INT           AUTO_INCREMENT PRIMARY KEY,
    entity_type ENUM('idea', 'project', 'startup', 'mentor_request') NOT NULL,
    entity_id   INT           NOT NULL,
    author_id   INT           NULL,
    message     TEXT          NOT NULL,
    created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_innovation_feedback_entity (entity_type, entity_id, created_at),
    KEY idx_innovation_feedback_author (author_id),
    CONSTRAINT innovation_feedback_author_fk
        FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------------------
-- 13. audit_logs
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
  ('Science and Humanities', 'S&H'),
  ('Computer Science and Engineering (CDC)', 'CSE-CDC'),
  ('Information Technology (CDC)', 'IT-CDC'),
  ('Artificial Intelligence and Data Science (CDC)', 'AI&DS-CDC');

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

-- Innovation & Startup Management Portal Schema

CREATE TABLE IF NOT EXISTS innovation_ideas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  problem_statement TEXT NOT NULL,
  proposed_solution TEXT NOT NULL,
  innovation_category VARCHAR(100) NOT NULL,
  technology_used TEXT NULL,
  team_members TEXT NULL,
  department_id INT NULL,
  year_of_study SMALLINT NULL,
  expected_outcome TEXT NULL,
  supporting_documents JSON NULL,
  project_images JSON NULL,
  status ENUM('Submitted','Under Review','Approved','Rejected','Prototype Development','Completed') NOT NULL DEFAULT 'Submitted',
  is_draft TINYINT(1) NOT NULL DEFAULT 0,
  admin_feedback TEXT NULL,
  mentor_feedback TEXT NULL,
  reviewed_by INT NULL,
  reviewed_at TIMESTAMP NULL DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_innovation_ideas_student_id (student_id),
  KEY idx_innovation_ideas_status (status),
  KEY idx_innovation_ideas_department_id (department_id),
  KEY idx_innovation_ideas_category (innovation_category),
  CONSTRAINT innovation_ideas_student_fk FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT innovation_ideas_department_fk FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
  CONSTRAINT innovation_ideas_reviewer_fk FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


 
CREATE TABLE IF NOT EXISTS innovation_projects (id INT AUTO_INCREMENT PRIMARY KEY, idea_id INT NULL, title VARCHAR(200) NOT NULL, description TEXT NOT NULL, problem_solved TEXT NULL, technology VARCHAR(500) NULL, student_team JSON NULL, student_id INT NOT NULL, faculty_mentor_id INT NULL, department_id INT NULL, project_images JSON NULL, github_link VARCHAR(500) NULL, demo_link VARCHAR(500) NULL, development_status ENUM('planning','in_progress','prototype','testing','completed','on_hold') NOT NULL DEFAULT 'planning', progress INT NOT NULL DEFAULT 0, is_featured TINYINT(1) NOT NULL DEFAULT 0, category VARCHAR(100) NULL, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, KEY idx_innovation_projects_student_id (student_id), KEY idx_innovation_projects_mentor_id (faculty_mentor_id), KEY idx_innovation_projects_status (development_status), KEY idx_innovation_projects_department_id (department_id), CONSTRAINT innovation_projects_idea_fk FOREIGN KEY (idea_id) REFERENCES innovation_ideas (id) ON DELETE SET NULL, CONSTRAINT innovation_projects_student_fk FOREIGN KEY (student_id) REFERENCES users (id) ON DELETE CASCADE, CONSTRAINT innovation_projects_mentor_fk FOREIGN KEY (faculty_mentor_id) REFERENCES users (id) ON DELETE SET NULL, CONSTRAINT innovation_projects_department_fk FOREIGN KEY (department_id) REFERENCES departments (id) ON DELETE SET NULL, CONSTRAINT innovation_projects_progress_check CHECK (progress BETWEEN 0 AND 100)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci; 
---

