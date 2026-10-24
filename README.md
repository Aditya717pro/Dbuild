# College Management Portal

A full-stack College Management Portal for student enrollment, faculty records, department rosters, courses, attendance tracking, and internal announcements.

**Roles**

| Role | Capabilities |
| --- | --- |
| **Admin** | Manage departments, courses, students, faculty, enrollments, announcements, and attendance. Create other admin accounts. |
| **Faculty** | View their department and courses, view the department roster, mark attendance for courses assigned to them, post department/course announcements. |
| **Student** | View only their own enrolled courses, attendance percentage per course, and announcements relevant to them. |

There is **no public sign-up**. Accounts are created by an administrator.

---

## Architecture

```
React + Vite + Tailwind (Vercel)
        │  HTTPS, JWT in Authorization header
        ▼
Express API (Vercel serverless, exported from backend/api/index.js)
        │  pg Pool + TLS (DATABASE_URL + DB_CA_CERT)
        ▼
Self-managed PostgreSQL on AWS EC2
```

- Frontend and backend live in this one repository under `frontend/` and `backend/`.
- The frontend never touches the database; it only calls `/api/...` through `frontend/src/services/api.js`.
- The backend never calls `app.listen()` in production. `backend/api/index.js` exports the Express app, and `backend/server.js` is for local development only.
- Database access uses the least-privilege `appuser` role (DML only, no DDL, not a superuser).

---

## Repository layout

```
.
├── backend/
│   ├── api/index.js            # Express app export (Vercel entrypoint)
│   ├── controllers/            # Request handlers
│   ├── db/
│   │   ├── schema.sql          # Idempotent schema
│   │   ├── grants.sql          # Least-privilege appuser role
│   │   └── pool.js             # pg Pool (reused, TLS, max 3)
│   ├── middleware/             # auth, roles, validation, errors, rate limits
│   ├── routes/                 # REST routes with role checks
│   ├── scripts/create-admin.js # Bootstrap/reset an admin account
│   ├── utils/                  # jwt, audit, async handler, errors
│   ├── server.js               # Local dev server ONLY
│   ├── vercel.json             # /api/* rewrites to the function
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/         # Layout, tables, modals, states
│   │   ├── context/            # AuthContext
│   │   ├── hooks/              # useApiData
│   │   ├── pages/              # Login, dashboards, CRUD, attendance, announcements
│   │   ├── services/api.js     # Single API client, attaches JWT
│   │   └── utils/
│   ├── vercel.json             # SPA rewrites
│   └── .env.example
└── .gitignore
```

---

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL (the EC2 instance, or a local PostgreSQL for development)
- Two Vercel projects (one for `frontend/`, one for `backend/`)

---

## 1. Database setup on the EC2 instance

All values below are **placeholders**. Replace them with your own; never commit real credentials.

### 1.1 Create the database and owner

SSH into the Ubuntu EC2 instance and run as the PostgreSQL superuser:

```bash
sudo -u postgres psql
```

```sql
CREATE DATABASE college_portal;
CREATE ROLE college_owner LOGIN PASSWORD 'REPLACE_WITH_DB_OWNER_PASSWORD';
ALTER DATABASE college_portal OWNER TO college_owner;
\c college_portal
GRANT ALL ON SCHEMA public TO college_owner;
```

### 1.2 Apply the schema and grants

Copy `backend/db/schema.sql` and `backend/db/grants.sql` to the instance, then run **as the table owner** (not as postgres, not as appuser):

```bash
psql "postgresql://college_owner:REPLACE_WITH_DB_OWNER_PASSWORD@localhost:5432/college_portal" \
  -f schema.sql

# Edit grants.sql first and replace REPLACE_WITH_STRONG_PASSWORD, then:
psql "postgresql://college_owner:REPLACE_WITH_DB_OWNER_PASSWORD@localhost:5432/college_portal" \
  -f grants.sql
```

`schema.sql` is idempotent (`CREATE TABLE/INDEX IF NOT EXISTS`), and `grants.sql` is idempotent (guarded role creation + repeatable grants).

The app role `appuser` gets:

- `CONNECT` on the database, `USAGE` on schema `public`
- `SELECT, INSERT, UPDATE, DELETE` on tables
- `USAGE, SELECT` on sequences (needed for generated IDs)
- **No** `CREATE/ALTER/DROP`, no superuser, no role management

### 1.3 TLS and network access

The backend requires TLS by default (`rejectUnauthorized: true`). Provide the CA certificate that signs your PostgreSQL server certificate via `DB_CA_CERT` (PEM, with `\n` escapes if stored on one line).

- For a self-signed server certificate, put that CA/public certificate in `DB_CA_CERT`; do not disable verification.
- Keep port `5432` closed to the public internet. In the EC2 security group, allow `5432` only from trusted addresses. Vercel serverless egress IPs are not fixed, so use a network design appropriate for your environment (for example, a bastion/VPN/private connectivity or a tightly scoped allowlist). Do not open `5432` to `0.0.0.0/0`.
- Confirm `listen_addresses`, `pg_hba.conf`, and the certificate are configured for TLS.

### 1.4 Create the first admin account

From `backend/` with a valid `DATABASE_URL`:

```bash
# Windows PowerShell
$env:ADMIN_NAME="Portal Admin"; $env:ADMIN_EMAIL="admin@college.example"; $env:ADMIN_PASSWORD="REPLACE_WITH_STRONG_PASSWORD"; npm run create-admin

# macOS / Linux
ADMIN_NAME="Portal Admin" ADMIN_EMAIL="admin@college.example" ADMIN_PASSWORD="REPLACE_WITH_STRONG_PASSWORD" npm run create-admin
```

If the email already exists, the script updates that account's password, role (`admin`), and active status.

---

## 2. Local development

### 2.1 Backend

```bash
cd backend
cp .env.example .env        # Windows: copy .env.example .env
npm install
```

Fill in `backend/.env`:

- `DATABASE_URL` — e.g. `postgresql://appuser:...@localhost:5432/college_portal`
- `DB_CA_CERT` — CA PEM if your database uses TLS
- `JWT_SECRET` — 32+ random characters (`openssl rand -hex 32`)
- `FRONTEND_URL` — `http://localhost:5173`
- `PGSSLMODE=disable` — only for a local PostgreSQL without TLS

Run:

```bash
npm run dev
```

API: `http://localhost:5000/api` — health check: `GET /api/health` (runs `SELECT 1`).

### 2.2 Frontend

```bash
cd frontend
cp .env.example .env.local  # Windows: copy .env.example .env.local
npm install
npm run dev
```

`VITE_API_BASE_URL=/api` uses the Vite dev proxy to `http://localhost:5000`.

### 2.3 Checks

```bash
cd backend  && npm run lint && npm run check
cd frontend && npm run lint && npm run build
```

---

## 3. Environment variables

### Backend (`backend/.env` / Vercel backend project)

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string for the EC2 database (use `appuser`). |
| `DB_CA_CERT` | Yes for TLS | PEM CA certificate used to verify the database server. |
| `JWT_SECRET` | Yes | Signs short-lived JWTs (>= 32 random chars). |
| `FRONTEND_URL` | Yes | Allowed CORS origin(s). Comma-separated for multiple. |
| `JWT_EXPIRES_IN` | No | Token lifetime, default `2h`. |
| `PG_POOL_MAX` | No | Pool size, default 3 (clamped to 1–3). |
| `PGSSLMODE` | No | Set `disable` only for a local DB without TLS. |
| `NODE_ENV` | No | `production` hides stack traces. |
| `PORT` | No | Local dev server port, default 5000. |

### Frontend (Vercel frontend project)

| Variable | Purpose |
| --- | --- |
| `VITE_API_BASE_URL` | Full backend API base including `/api`, e.g. `https://REPLACE_WITH_BACKEND_PROJECT.vercel.app/api`. |

> Vite embeds `VITE_*` variables at build time. After changing it, redeploy the frontend.

---

## 4. Deploying to Vercel

Do **not** commit `.env` files or certificates. Set all secrets in the Vercel dashboard.

### 4.1 Push the repository

```bash
git init
git add .
git commit -m "Initial College Management Portal"
git remote add origin REPLACE_WITH_YOUR_GIT_REMOTE
git push -u origin main
```

### 4.2 Backend project

1. Import the repository in Vercel.
2. Set **Root Directory** to `backend`.
3. Framework preset: **Other** (no build step needed).
4. Add env vars: `DATABASE_URL`, `DB_CA_CERT`, `JWT_SECRET`, `FRONTEND_URL`, and optionally `JWT_EXPIRES_IN`, `PG_POOL_MAX`.
5. Deploy. `backend/vercel.json` rewrites `/api/*` to `api/index.js`, and the routes are mounted under `/api`.
6. Verify `https://REPLACE_WITH_BACKEND_PROJECT.vercel.app/api/health` reports `{"status":"ok","database":"up"}`.

### 4.3 Frontend project

1. Import the same repository again.
2. Set **Root Directory** to `frontend`.
3. Framework preset: **Vite**. Build command `npm run build`, output `dist`.
4. Add `VITE_API_BASE_URL=https://REPLACE_WITH_BACKEND_PROJECT.vercel.app/api`.
5. Deploy. `frontend/vercel.json` rewrites SPA routes to `index.html`.
6. Set the backend project's `FRONTEND_URL` to the final frontend origin (e.g. `https://REPLACE_WITH_FRONTEND_PROJECT.vercel.app`) and redeploy the backend so CORS allows it. Multiple origins can be comma-separated.

### 4.4 Post-deploy checklist

- `GET /api/health` returns 200 and `database: up`.
- Login works with the admin account created in step 1.4.
- An unauthenticated API request returns 401.
- A student token cannot read another student's data or write admin resources.
- The database port is not publicly open, and TLS verification is enabled.

---

## 5. API overview

All protected endpoints require `Authorization: Bearer <jwt>`. Every permission is enforced server-side; hiding UI is not treated as security.

| Method & path | Roles | Notes |
| --- | --- | --- |
| `POST /api/auth/login` | Public (rate-limited) | Returns JWT + user. |
| `GET /api/auth/me` | Any authenticated | Current user (and student/faculty profile). |
| `POST /api/auth/change-password` | Any authenticated | Requires current password. |
| `GET /api/health` | Public | `SELECT 1`. |
| `GET/POST/PUT/DELETE /api/departments` | Read: all; write: admin | |
| `GET/POST/PUT/DELETE /api/courses` | Read: role-filtered; write: admin | Students see enrolled courses only; faculty see assigned/department courses. |
| `GET/POST/PUT/DELETE /api/students` | Admin; faculty read own department | Faculty list is restricted to their department. |
| `GET/POST/PUT/DELETE /api/faculty` | Admin; faculty read own department | |
| `GET /api/faculty/roster` | Admin/faculty | Department roster; faculty forced to own department. |
| `GET/POST/DELETE /api/enrollments` | Read: role-filtered; write: admin | Unique student+course enforced. |
| `GET /api/attendance/session` | Admin/faculty | Enrolled students + existing marks for course/date. Faculty limited to own courses. |
| `POST /api/attendance` | Admin/faculty | Upsert on student+course+date; faculty limited to own courses. |
| `GET /api/attendance/me` | Student | Own present/total and percentage per course. |
| `GET /api/attendance/course/:courseId/summary` | Admin/faculty | Per-student summary. |
| `GET/POST/DELETE /api/announcements` | Read: audience-filtered; write: admin/faculty | Faculty can target own department or own courses only. |
| `GET/POST /api/users` | Admin | List users; create another admin. |

### Edge cases handled

- Duplicate enrollment → HTTP 409 (unique constraint).
- Attendance submitted twice for the same student/course/date → upsert (`ON CONFLICT ... DO UPDATE`).
- Faculty marking attendance for a course they do not teach → 403.
- Students reading other students' data → filtered/queries scoped to their own ID.
- Inactive accounts → rejected at login and on every authenticated request.
- Invalid/expired JWT → 401; insufficient role → 403.
- Validation failures → 400 with field-level details.
- Unexpected errors → generic 500 in production (no stack traces).

### Security measures

- Parameterized SQL everywhere (no string interpolation of user input).
- `helmet`, CORS restricted to `FRONTEND_URL`, JSON body size limit, login rate limiting.
- `bcryptjs` password hashing (bcrypt algorithm) and short-lived JWTs.
- Least-privilege `appuser` database role; TLS verification with a supplied CA.
- `audit_logs` records logins, user/profile changes, course/department changes, enrollments, attendance submissions, and announcement changes.
- Secrets come only from environment variables; `.env`, keys, and certificates are gitignored.

---

## 6. Troubleshooting

| Symptom | Check |
| --- | --- |
| `DATABASE_URL is not configured` | Backend env var missing. |
| Health returns 503 | `DATABASE_URL`, EC2 reachability, security group, TLS/CA (`DB_CA_CERT`). |
| Login always fails | Admin exists? Password correct? Account active? Check `users.role`. |
| CORS error in browser | `FRONTEND_URL` must exactly match the frontend origin; redeploy backend after changing. |
| Frontend calls the wrong host | `VITE_API_BASE_URL` is embedded at build time; redeploy after changing. |
| `permission denied for table ...` | Run `grants.sql` as the table owner and verify `appuser` has DML grants. |
| `password authentication failed for user "appuser"` | Update the password in `grants.sql`/database and `DATABASE_URL`. |
| Vercel API 404 for `/api/...` | Confirm backend Root Directory is `backend` and `backend/vercel.json` is present. |

---

## Notes

- No real credentials, hostnames, or deployment results are included in this repository. All placeholders must be replaced.
- The provided code was verified locally with lint and a production frontend build; it has **not** been deployed as part of this work.
