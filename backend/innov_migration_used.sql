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
