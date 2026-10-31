-- Add CDC flag to faculty and placement poster storage.
-- Safe to run more than once.

SET @is_cdc_exists = (
    SELECT COUNT(*)
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'faculty'
      AND COLUMN_NAME = 'is_cdc'
);

SET @is_cdc_sql = IF(
    @is_cdc_exists = 0,
    'ALTER TABLE faculty ADD COLUMN is_cdc TINYINT(1) NOT NULL DEFAULT 0 AFTER designation',
    'SELECT 1'
);

PREPARE is_cdc_stmt FROM @is_cdc_sql;
EXECUTE is_cdc_stmt;
DEALLOCATE PREPARE is_cdc_stmt;

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
