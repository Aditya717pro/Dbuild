-- Innovation & Startup Management Portal.
-- Safe to run more than once.

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
