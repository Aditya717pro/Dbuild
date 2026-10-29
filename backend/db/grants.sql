-- College Management Portal - least-privilege application user
-- Run AFTER schema.sql, as the database owner (the account that owns the tables).
-- Idempotent: safe to re-run.
--
-- The application connects with this user. It must NEVER be a superuser and
-- must NEVER be able to run DDL (CREATE/ALTER/DROP) or manage users.

-- ---------------------------------------------------------------------------
-- 1. Create the user (placeholder password - replace before use)
-- ---------------------------------------------------------------------------
CREATE USER IF NOT EXISTS 'appuser'@'%' IDENTIFIED BY 'REPLACE_WITH_STRONG_PASSWORD';

ALTER USER 'appuser'@'%' IDENTIFIED BY 'REPLACE_WITH_STRONG_PASSWORD';

-- ---------------------------------------------------------------------------
-- 2. Remove any accidental elevated grants, then grant DML only
-- ---------------------------------------------------------------------------
REVOKE ALL PRIVILEGES, GRANT OPTION FROM 'appuser'@'%';

GRANT SELECT, INSERT, UPDATE, DELETE ON dbuild.* TO 'appuser'@'%';
