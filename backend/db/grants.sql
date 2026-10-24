-- College Management Portal - least-privilege application role
-- Run AFTER schema.sql, as the database owner (the role that owns the tables).
-- Idempotent: safe to re-run.
--
-- The application connects with this role. It must NEVER be a superuser and
-- must NEVER be able to run DDL (CREATE/ALTER/DROP) or manage roles.

-- ---------------------------------------------------------------------------
-- 1. Create the role (placeholder password - replace before use)
-- ---------------------------------------------------------------------------
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'appuser') THEN
        CREATE ROLE appuser
            LOGIN
            PASSWORD 'REPLACE_WITH_STRONG_PASSWORD'
            NOSUPERUSER
            NOCREATEDB
            NOCREATEROLE
            NOINHERIT
            NOREPLICATION
            NOBYPASSRLS;
    ELSE
        -- Keep the attributes strict even if the role already existed.
        ALTER ROLE appuser
            NOSUPERUSER
            NOCREATEDB
            NOCREATEROLE
            NOINHERIT
            NOREPLICATION
            NOBYPASSRLS;
    END IF;
END
$$;

-- ---------------------------------------------------------------------------
-- 2. Connection + schema access
-- ---------------------------------------------------------------------------
DO $$
BEGIN
    EXECUTE format('GRANT CONNECT ON DATABASE %I TO appuser', current_database());
END
$$;

GRANT USAGE ON SCHEMA public TO appuser;

-- Explicitly ensure the app role cannot create objects (no DDL).
REVOKE CREATE ON SCHEMA public FROM appuser;

-- ---------------------------------------------------------------------------
-- 3. DML only on all current tables
-- ---------------------------------------------------------------------------
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO appuser;

-- Identity / serial columns need sequence access to generate ids.
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO appuser;

-- ---------------------------------------------------------------------------
-- 4. Future objects (run as the table owner so defaults apply to its objects)
-- ---------------------------------------------------------------------------
ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO appuser;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT USAGE, SELECT ON SEQUENCES TO appuser;

-- ---------------------------------------------------------------------------
-- 5. Safety: remove any accidental elevated grants
-- ---------------------------------------------------------------------------
REVOKE ALL ON SCHEMA public FROM appuser;
GRANT USAGE ON SCHEMA public TO appuser;
