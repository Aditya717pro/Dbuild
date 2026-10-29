# Database migrations

Add numbered SQL files here using names such as:

```
001_add_student_email.sql
002_add_course_credits.sql
```

The migration runner (`npm run db:migrate` from `backend/`) applies pending files in filename order and records each filename in the `schema_migrations` table.

Rules:

- Never edit a migration that has already been pushed; add a new one.
- Every schema change must also be applied to `database.sql` at the repository root for fresh installs.
- Keep migrations to standard SQL statements understood by MySQL 8.0.
- Run `npm run db:update` from `backend/` to apply migrations and refresh demo data locally.
