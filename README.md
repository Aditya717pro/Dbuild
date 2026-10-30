# College Management Portal

A full-stack College Management Portal for student enrollment, faculty records, department rosters, courses, attendance tracking, and internal announcements.

| Role | Capabilities |
| --- | --- |
| **Admin** | Manage departments, courses, students, faculty, enrollments, attendance, and announcements. Create other admin accounts. |
| **Faculty** | View their department and courses, view the department roster, mark attendance for courses assigned to them, and post department/course announcements. |
| **Student** | View only their own enrolled courses, semester-wise marksheets, attendance percentage per course, fees details, and announcements relevant to them. |

There is **no public sign-up**. Accounts are created by an administrator or by the demo seed script.

---

## Architecture

```text
React + Vite + Tailwind
        |  HTTP, JWT in Authorization header
        v
Express API (backend/api/index.js)
        |  mysql2 Pool (DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME)
        v
MySQL 8.0+
```

- Frontend and backend live in this repository under `frontend/` and `backend/`.
- The frontend calls `/api/...` through `frontend/src/services/api.js`. The Vite dev proxy forwards `/api` to the backend.
- The backend exports the Express app from `backend/api/index.js`; `backend/server.js` starts it for local development.
- The schema and demo data live in tracked files, so a fresh clone can rebuild the database.
- Git does **not** push a live database. A fresh clone recreates it from `database.sql`, migrations, and the demo seed script.

---

## Repository layout

```text
.
├── backend/
│   ├── api/index.js              # Express app export (Vercel entrypoint)
│   ├── config/demo.js            # Tracked demo account password defaults
│   ├── controllers/              # Request handlers
│   ├── db/
│   │   ├── migrations/           # Numbered schema migrations
│   │   ├── schema.sql            # Reference schema (canonical file is database.sql)
│   │   ├── grants.sql            # Least-privilege appuser account
│   │   └── pool.js               # mysql2 Pool
│   ├── middleware/               # Auth, roles, validation, errors, rate limits
│   ├── routes/                   # REST routes with role checks
│   ├── scripts/
│   │   ├── migrate.js            # Baseline schema + migration runner
│   │   ├── seed-demo-data.js     # Idempotent demo data seed
│   │   ├── verify-demo-auth.js   # Checks demo password hashes
│   │   ├── create-admin.js       # Bootstrap/reset an admin account
│   │   ├── create-student.js     # Create a student account
│   │   └── test-db-connection.js # Connection and table check
│   ├── utils/                    # JWT, audit, async handler, errors
│   ├── server.js                 # Local dev server
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/           # Layout, tables, modals, states
│   │   ├── context/              # AuthContext
│   │   ├── hooks/                # useApiData
│   │   ├── pages/                # Login, dashboards, CRUD, attendance, announcements
│   │   ├── services/api.js       # Single API client, attaches JWT
│   │   └── utils/
│   └── .env.example
├── database.sql                  # Canonical fresh-install schema and starter departments
├── docker-compose.yml            # Local MySQL 8.0 service
├── vercel.json                   # Vercel services + public routing
└── README.md
```

---

## Prerequisites

- Node.js 18+
- npm
- Docker Desktop **or** MySQL 8.0.16+

> MySQL 8.0.16 or newer is required because the schema uses `CHECK` constraints.

---

## Quick start

### 1. Start MySQL

The recommended local setup uses Docker:

```bash
docker compose up -d --wait
```

This starts MySQL 8.0 on `127.0.0.1:3306` with an empty root password and imports `database.sql` the first time the volume is created.

If port `3306` is already in use, choose another host port:

```powershell
$env:MYSQL_PORT="3307"
docker compose up -d --wait
```

Then set `DB_PORT=3307` in `backend/.env`.

To reset the local database completely:

```bash
docker compose down -v
docker compose up -d --wait
```

> `down -v` deletes the Docker database volume. Use it only when you want a clean database.

### 2. Configure and start the backend

```bash
cd backend
cp .env.example .env
npm install
npm run test-db
npm run db:update
npm run verify-demo
npm run dev
```

On Windows PowerShell, use `copy .env.example .env` instead of `cp`.

The API runs at `http://localhost:5000/api`. Health check:

```bash
curl http://localhost:5000/api/health
```

`npm run db:update` applies the baseline schema, pending migrations, and demo data. It is idempotent and safe to rerun.

### 3. Start the frontend

In another terminal:

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

On Windows PowerShell, use `copy .env.example .env.local` instead of `cp`.

Open `http://localhost:5173`.

### 4. Log in

| Portal | URL |
| --- | --- |
| Student | `http://localhost:5173/login/student` |
| Teacher/Faculty | `http://localhost:5173/login/teacher` |
| Admin | `http://localhost:5173/login/admin` |

---

## Demo accounts

These accounts are created by `npm run db:update` and are for local development only.

| Name | Role | Login | Default password |
| --- | --- | --- | --- |
| Admin | admin | `Admin` | `admin@123` |
| Harry Potter | student | `2` | `student@123` |
| Ron Weasley | student | `3` | `student@123` |
| Hermione Granger | student | `4` | `student@123` |
| Severus Snape | faculty | `Severus Snape` | `faculty@123` |
| Albus Dumbledore | faculty | `Albus Dumbledore` | `faculty@123` |

Students sign in with their numeric **Student ID** (`users.id`), not their email. Faculty and administrators sign in with their name.

The demo passwords are tracked in `backend/config/demo.js` so that password changes can propagate to everyone who pulls the repository. They are intentionally weak demo credentials. Do not use them in production. Override them in `backend/.env` if needed:

```dotenv
DEMO_STUDENT_PASSWORD=your-local-student-password
DEMO_FACULTY_PASSWORD=your-local-faculty-password
DEMO_ADMIN_PASSWORD=your-local-admin-password
```

After seeding, `DEMO_CREDENTIALS.local.md` is generated at the repository root with the actual logins. That file is gitignored.

---

## Manual MySQL setup

If you do not want to use Docker:

```bash
mysql -u root -p < database.sql
```

Then configure `backend/.env`:

```dotenv
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your-mysql-password
DB_NAME=dbuild
MYSQL_SSL=disable
JWT_SECRET=replace-with-a-long-random-secret
FRONTEND_URL=http://localhost:5173
```

Run the backend setup:

```bash
cd backend
npm install
npm run test-db
npm run db:update
```

### Least-privilege application user

For a non-development environment, create the application user after importing the schema:

1. Edit `backend/db/grants.sql` and replace `REPLACE_WITH_STRONG_PASSWORD`.
2. Run it as a MySQL administrator:
   ```bash
   mysql -u root -p < backend/db/grants.sql
   ```
3. Set the application credentials:
   ```dotenv
   DB_USER=appuser
   DB_PASSWORD=the-password-from-grants.sql
   DB_MIGRATION_USER=root
   DB_MIGRATION_PASSWORD=the-mysql-admin-password
   MYSQL_SSL=disable
   ```
4. Keep `DB_MIGRATION_USER` for setup only. The application itself uses `appuser`, which has DML privileges only and cannot run DDL.

For production with TLS, omit `MYSQL_SSL=disable` and set `MYSQL_CA_CERT` to a CA file path or PEM contents.

---

## Applying database changes after `git pull`

A Git pull cannot change a running MySQL database by itself. After pulling changes, run:

```bash
git pull
docker compose up -d --wait
cd backend
npm install
npm run db:update
```

`npm run db:update`:

1. Applies the idempotent `database.sql` baseline if needed.
2. Applies pending files from `backend/db/migrations/`.
3. Re-runs the demo seed, updating demo accounts, courses, enrollments, attendance, marksheets, fees, and announcements.

It is safe to rerun. Existing Docker volumes are preserved; Docker only imports `database.sql` when the volume is first created.

For production, run only the schema migration step:

```bash
cd backend
npm run db:migrate
```

`db:migrate` does not seed demo accounts.

### Changing the schema

Every schema change must be made in two places:

1. Update `database.sql` for fresh installs.
2. Add a new numbered file in `backend/db/migrations/` for existing databases.

Example migration:

```sql
ALTER TABLE courses ADD COLUMN credits TINYINT UNSIGNED NOT NULL DEFAULT 3;
```

Then test:

```bash
cd backend
npm run db:update
```

### Changing demo data or passwords

- Demo account passwords: edit `backend/config/demo.js`.
- Demo accounts, courses, enrollments, attendance, marksheets, fees, and announcements: edit `backend/scripts/seed-demo-data.js`.

Commit the change, push it, and tell pullers to run `npm run db:update`. The seed script re-hashes and updates the demo accounts.

If a puller has set `DEMO_*` overrides in `backend/.env`, those overrides take precedence over the tracked defaults.

---

## Scripts

Run these from `backend/` unless noted otherwise.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the API with file watching. |
| `npm start` | Start the API without watching. |
| `npm run test-db` | Test the connection and verify the eleven application tables. |
| `npm run db:migrate` | Apply the baseline and pending schema migrations. Safe for production. |
| `npm run db:update` | Apply migrations and refresh demo data. Local/demo use only. |
| `npm run seed-demo` | Create/update demo accounts and academic data. |
| `npm run verify-demo` | Check all six demo passwords against the stored bcrypt hashes. |
| `npm run create-admin` | Create or reset an admin account from `ADMIN_*` env vars. |
| `npm run create-student` | Create a student account from `STUDENT_*` env vars. |
| `npm run lint` | Run backend ESLint. |
| `npm run check` | Syntax-check the API entrypoints. |

From `frontend/`:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite dev server. |
| `npm run build` | Build the production frontend. |
| `npm run lint` | Run frontend ESLint. |
| `npm run preview` | Preview the production build. |

---

## Environment variables

### Backend

Create `backend/.env` from `backend/.env.example`.

| Variable | Required | Purpose |
| --- | --- | --- |
| `DB_HOST` | Yes | MySQL host, usually `localhost`. |
| `DB_PORT` | Yes | MySQL port, usually `3306`. |
| `DB_USER` | Yes | Application MySQL user. Use `root` for local Docker; use `appuser` in production. |
| `DB_PASSWORD` | No | MySQL password; empty for the default local Docker root. |
| `DB_NAME` | Yes | Database name, `dbuild`. |
| `MYSQL_SSL` | No | Set `disable` for local MySQL without TLS. |
| `MYSQL_CA_CERT` | No | Path to a CA file or PEM contents for TLS verification. |
| `MYSQL_URL` | No | Full connection string; overrides the discrete `DB_*` values. |
| `MYSQL_POOL_MAX` | No | Pool size, default 3 (clamped to 1-3). |
| `DB_MIGRATION_USER` | No | DDL-capable user for migrations; defaults to `DB_USER`. |
| `DB_MIGRATION_PASSWORD` | No | Password for the migration user; defaults to `DB_PASSWORD`. |
| `DEMO_STUDENT_PASSWORD` | No | Overrides the tracked student demo password. |
| `DEMO_FACULTY_PASSWORD` | No | Overrides the tracked faculty demo password. |
| `DEMO_ADMIN_PASSWORD` | No | Overrides the tracked admin demo password. |
| `ALLOW_DEMO_SEED` | No | Set `true` to allow demo seeding when `NODE_ENV=production`. Not recommended. |
| `JWT_SECRET` | Yes | Signs short-lived JWTs (at least 32 random characters). |
| `FRONTEND_URL` | No | Allowed CORS origin(s), comma-separated. |
| `JWT_EXPIRES_IN` | No | Token lifetime, default `2h`. |
| `NODE_ENV` | No | `production` hides stack traces and blocks demo seeding. |
| `PORT` | No | Local dev server port, default 5000. |

Generate a JWT secret with:

```bash
openssl rand -hex 32
```

### Frontend

Create `frontend/.env.local` from `frontend/.env.example`.

| Variable | Purpose |
| --- | --- |
| `VITE_API_BASE_URL` | API base URL including `/api`. Keep the default `/api` for the Vite proxy and Vercel services. |

Vite embeds `VITE_*` variables at build time. Redeploy the frontend after changing them.

---

## Deployment to Vercel

Do not commit `.env` files. Set secrets in the Vercel dashboard.

1. Import the repository in Vercel.
2. Leave **Root Directory** at the repository root. The root `vercel.json` defines both services:
   - `frontend` (Vite) serves the public site at `/`.
   - `backend` (Node) serves the API under `/api/*`.
3. Add the backend environment variables: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`, and optionally `MYSQL_SSL`, `MYSQL_CA_CERT`, `FRONTEND_URL`, `JWT_EXPIRES_IN`, `MYSQL_POOL_MAX`.
4. Run `npm run db:migrate` from `backend/` against the production database from a trusted machine before deploying. Do not run `db:update` or `seed-demo` in production.
5. Deploy.
6. Verify `https://REPLACE_WITH_PROJECT.vercel.app/api/health` reports `{"status":"ok","database":"up"}`.

`VITE_API_BASE_URL` defaults to `/api`, so the browser calls the same origin and no separate backend URL is needed.

### Post-deploy checklist

- `GET /api/health` returns 200 and `database: up`.
- The production admin account works.
- An unauthenticated API request returns 401.
- A student token cannot read another student's data or write admin resources.
- Demo accounts are not enabled in production.
- The database port is not publicly open, and TLS is enabled when required.

---

## API overview

All protected endpoints require `Authorization: Bearer <jwt>`. Permissions are enforced server-side.

| Method and path | Roles | Notes |
| --- | --- | --- |
| `POST /api/auth/login` | Public (rate-limited) | Students use numeric student ID; admin/faculty use name. Returns JWT + user. |
| `GET /api/auth/me` | Any authenticated | Current user and student/faculty profile. |
| `POST /api/auth/change-password` | Any authenticated | Requires current password. |
| `GET /api/health` | Public | Runs `SELECT 1`. |
| `GET/POST/PUT/DELETE /api/departments` | Read: all; write: admin | |
| `GET/POST/PUT/DELETE /api/courses` | Read: role-filtered; write: admin | Students see enrolled courses; faculty see assigned/department courses. |
| `GET/POST/PUT/DELETE /api/students` | Admin; faculty read own department | |
| `GET/POST/PUT/DELETE /api/faculty` | Admin; faculty read own department | |
| `GET /api/faculty/roster` | Admin/faculty | Department roster; faculty limited to own department. |
| `GET/POST/DELETE /api/enrollments` | Read: role-filtered; write: admin | Unique student+course enforced. |
| `GET /api/attendance/session` | Admin/faculty | Enrolled students and existing marks for course/date. |
| `POST /api/attendance` | Admin/faculty | Upsert on student+course+date. |
| `GET /api/attendance/me` | Student | Own present/total and percentage per course. |
| `GET /api/attendance/course/:courseId/summary` | Admin/faculty | Per-student summary. |
| `GET /api/records/me/marksheets` | Student | Own semester-wise end semester marksheets with all subjects and grades. |
| `GET /api/records/me/fees` | Student | Own fee invoices, payments, balances, and status. |
| `GET/POST/DELETE /api/announcements` | Read: audience-filtered; write: admin/faculty | Faculty can target own department or courses only. |
| `GET/POST /api/users` | Admin | List users; create another admin. |

### Security measures

- Parameterized SQL everywhere.
- `helmet`, restricted CORS, JSON body size limit, and login rate limiting.
- `bcryptjs` password hashing and short-lived JWTs.
- Least-privilege `appuser` database account; migrations use a separate DDL-capable account.
- `audit_logs` records logins, profile changes, course/department changes, enrollments, attendance, and announcements.
- Secrets come only from environment variables; `.env` files are gitignored.
- Demo seeding is blocked when `NODE_ENV=production` unless explicitly overridden.

---

## Troubleshooting

| Symptom | Check |
| --- | --- |
| `Database connection is not configured` | Set `DB_HOST` and `DB_NAME` (or `MYSQL_URL`) in `backend/.env`. |
| `Database connection failed` on backend start | MySQL is running; run `npm run test-db` from `backend/`. |
| Health returns 503 | MySQL is running and the `DB_*` values are correct. |
| `Access denied for user ...` | Check `DB_USER`, `DB_PASSWORD`, `DB_MIGRATION_USER`, and `DB_MIGRATION_PASSWORD`. |
| `Unknown database 'dbuild'` | Start Docker Compose or import `database.sql`. |
| `Table ... doesn't exist` | Run `npm run db:update` from `backend/`. |
| `Can't connect to MySQL server` | Check MySQL is running and listening on `DB_HOST:DB_PORT`. |
| Docker says port 3306 is already in use | Set `MYSQL_PORT=3307` for Compose and `DB_PORT=3307` in `backend/.env`. |
| Changes do not appear after `git pull` | Run `npm run db:update`; existing Docker volumes are not re-initialized automatically. |
| `Refusing to seed demo data in production` | Use `npm run db:migrate` in production, or set `ALLOW_DEMO_SEED=true` only for an intentional demo deployment. |
| `permission denied` during migration | The migration user needs DDL privileges; set `DB_MIGRATION_USER` and `DB_MIGRATION_PASSWORD`. |
| CORS error in browser | Same-origin calls should not need `FRONTEND_URL`; set it exactly if calling from another origin. |
| Login always fails | Confirm the account exists, the password is correct, and the account is active. |
| Student login fails | Students use their numeric `users.id`, not their email address. |
| Staff or Admin login fails | Staff and administrators use their account name (e.g. `Admin`, `Severus Snape`). |

---

## Notes

- A live MySQL database and Docker volume are not stored in Git.
- A fresh clone rebuilds the database from tracked files after `npm run db:update`.
- Existing clones apply new schema/data changes by running `npm run db:update` after pulling.
- `backend/.env`, `DEMO_CREDENTIALS.local.md`, CA files, `node_modules/`, and build output are gitignored.
- The documented demo passwords are intentionally public local-demo credentials. Do not use them in production.
