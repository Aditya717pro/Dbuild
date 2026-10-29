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
