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
        │  mysql2 Pool + TLS (MYSQL_URL + MYSQL_CA_CERT)
        ▼
Self-managed MySQL 8.0+ on AWS EC2 (Ubuntu)
```

- Frontend and backend live in this one repository under `frontend/` and `backend/`, and deploy together as two [Vercel Services](https://vercel.com/docs/services) in one project.
- The frontend never touches the database; it only calls `/api/...` through `frontend/src/services/api.js`. The public `/api/*` rewrite routes those same-origin calls to the backend service.
- The backend never calls `app.listen()` in production. `backend/api/index.js` exports the Express app, and `backend/server.js` is for local development only.
- Database access uses the least-privilege `appuser` account (DML only, no DDL, not an administrator).

---

## Repository layout

```
.
├── backend/
│   ├── api/index.js            # Express app export (Vercel entrypoint)
│   ├── controllers/            # Request handlers
│   ├── db/
│   │   ├── schema.sql          # Idempotent MySQL schema
│   │   ├── grants.sql          # Least-privilege appuser account
│   │   └── pool.js             # mysql2 Pool (reused, TLS, max 3)
│   ├── middleware/             # auth, roles, validation, errors, rate limits
│   ├── routes/                 # REST routes with role checks
│   ├── scripts/create-admin.js # Bootstrap/reset an admin account
│   ├── utils/                  # jwt, audit, async handler, errors
│   ├── server.js               # Local dev server ONLY
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/         # Layout, tables, modals, states
│   │   ├── context/            # AuthContext
│   │   ├── hooks/              # useApiData
│   │   ├── pages/              # Login, dashboards, CRUD, attendance, announcements
│   │   ├── services/api.js     # Single API client, attaches JWT
│   │   └── utils/
│   └── .env.example
├── vercel.json                 # Services + public routing (/api and SPA)
└── .gitignore
```

---

## Prerequisites

- Node.js 18+ and npm
- MySQL 8.0.16+ (the EC2 instance, or a local MySQL for development)
- One Vercel project deployed with Services (see section 4)

> MySQL 8.0.16 or newer is required because the schema uses `CHECK` constraints.

---

## 1. Database setup on the EC2 instance

All values below are **placeholders**. Replace them with your own; never commit real credentials.

### 1.1 Install MySQL

On Ubuntu:

```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl enable --now mysql
sudo mysql_secure_installation
```

### 1.2 Create the database and owner

Connect as the MySQL administrator:

```bash
sudo mysql
```

```sql
CREATE DATABASE college_portal
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;

CREATE USER 'college_owner'@'localhost'
  IDENTIFIED BY 'REPLACE_WITH_DB_OWNER_PASSWORD';

GRANT ALL PRIVILEGES ON college_portal.* TO 'college_owner'@'localhost';

FLUSH PRIVILEGES;
```

### 1.3 Apply the schema and grants

Copy `backend/db/schema.sql` and `backend/db/grants.sql` to the instance.

Run the schema as the table owner:

```bash
mysql -u college_owner -p college_portal < schema.sql
```

Edit `grants.sql` first and replace `REPLACE_WITH_STRONG_PASSWORD`. Then run it as the MySQL administrator, because creating the application user requires the `CREATE USER` privilege:

```bash
sudo mysql < grants.sql
```

`schema.sql` is idempotent (`CREATE TABLE IF NOT EXISTS`), and `grants.sql` is idempotent (guarded user creation + repeatable grants).

The application user `appuser` gets:

- `SELECT, INSERT, UPDATE, DELETE` on `college_portal.*`
- **No** `CREATE/ALTER/DROP`, no user management, no administrative privileges

Adjust `'appuser'@'%'` in `grants.sql` if you want to restrict the allowed client host.

### 1.4 TLS and network access

The backend connects with TLS by default (`rejectUnauthorized: true`). Provide the CA certificate that signs your MySQL server certificate via `MYSQL_CA_CERT` (PEM, with `\n` escapes if stored on one line).

- For a self-signed server certificate, put that CA/public certificate in `MYSQL_CA_CERT`; do not disable verification.
- Keep port `3306` closed to the public internet. In the EC2 security group, allow `3306` only from trusted addresses. Vercel serverless egress IPs are not fixed, so use a network design appropriate for your environment (for example, a bastion/VPN/private connectivity or a tightly scoped allowlist). Do not open `3306` to `0.0.0.0/0`.
- Confirm `bind-address`, MySQL TLS settings, and the firewall/security group are configured for your environment.
- For managed production environments, consider `require_secure_transport=ON` in the MySQL server configuration.

### 1.5 Create the first admin account

From `backend/` with a valid `MYSQL_URL`:

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

- `MYSQL_URL` — e.g. `mysql://appuser:...@localhost:3306/college_portal`
- `MYSQL_CA_CERT` — CA PEM if your database uses TLS
- `JWT_SECRET` — 32+ random characters (`openssl rand -hex 32`)
- `FRONTEND_URL` — `http://localhost:5173`
- `MYSQL_SSL=disable` — only for a local MySQL without TLS

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

To run both services together with the same routing as production, install the Vercel CLI and run `vercel dev` from the repository root.

---

## 3. Environment variables

### Backend (`backend/.env` / Vercel services project)

| Variable | Required | Purpose |
| --- | --- | --- |
| `MYSQL_URL` | Yes | MySQL connection string for the EC2 database (use `appuser`). |
| `MYSQL_CA_CERT` | Yes for TLS | PEM CA certificate used to verify the database server. |
| `JWT_SECRET` | Yes | Signs short-lived JWTs (>= 32 random chars). |
| `FRONTEND_URL` | No | Allowed CORS origin(s). Comma-separated. Not needed for same-origin calls in the services deployment. |
| `JWT_EXPIRES_IN` | No | Token lifetime, default `2h`. |
| `MYSQL_POOL_MAX` | No | Pool size, default 3 (clamped to 1–3). |
| `MYSQL_SSL` | No | Set `disable` only for a local DB without TLS. |
| `NODE_ENV` | No | `production` hides stack traces. |
| `PORT` | No | Local dev server port, default 5000. |

### Frontend (Vercel services project)

| Variable | Purpose |
| --- | --- |
| `VITE_API_BASE_URL` | API base URL including `/api`. Keep the default `/api` so calls stay same-origin and use the services rewrite. |

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

### 4.2 Services project

1. Import the repository in Vercel.
2. Leave **Root Directory** at the repository root. The root `vercel.json` defines both services:
   - `frontend` (Vite) serves the public site at `/`.
   - `backend` (Node) serves the API under `/api/*`.
3. If Vercel prompts for a framework preset, select **Services**. Otherwise it reads `vercel.json` and builds both services.
4. Add the backend env vars: `MYSQL_URL`, `MYSQL_CA_CERT`, `JWT_SECRET`, and optionally `FRONTEND_URL`, `JWT_EXPIRES_IN`, `MYSQL_SSL`, `MYSQL_POOL_MAX`.
5. Deploy. Top-level rewrites send `/api/*` to the `backend` service and everything else to `frontend`; `frontend` rewrites client-side routes to `index.html`.
6. Verify `https://REPLACE_WITH_PROJECT.vercel.app/api/health` reports `{"status":"ok","database":"up"}`.

`VITE_API_BASE_URL` defaults to `/api`, so the browser calls the same origin and no separate backend URL is needed. Set `FRONTEND_URL` only if you call the API from a different origin.

To run both services together locally with the same routing, run `vercel dev` from the repository root.

### 4.3 Post-deploy checklist

- `GET /api/health` returns 200 and `database: up`.
- Login works with the admin account created in step 1.5.
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
- Attendance submitted twice for the same student/course/date → upsert (`ON DUPLICATE KEY UPDATE`).
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
- Least-privilege `appuser` database account; TLS verification with a supplied CA.
- `audit_logs` records logins, user/profile changes, course/department changes, enrollments, attendance submissions, and announcement changes.
- Secrets come only from environment variables; `.env`, keys, and certificates are gitignored.

---

## 6. Troubleshooting

| Symptom | Check |
| --- | --- |
| `MYSQL_URL is not configured` | Backend env var missing. |
| Health returns 503 | `MYSQL_URL`, EC2 reachability, security group, TLS/CA (`MYSQL_CA_CERT`). |
| `Access denied for user 'appuser'@...` | Update the password in `grants.sql`/database and `MYSQL_URL`; confirm the account host matches the client. |
| `Unknown database 'college_portal'` | Create the database and apply `schema.sql`. |
| `Table ... doesn't exist` | Run `schema.sql` as the database owner. |
| `Can't connect to MySQL server` | Check MySQL is running, `bind-address`, port `3306`, and the EC2 security group. |
| Login always fails | Admin exists? Password correct? Account active? Check `users.role`. |
| CORS error in browser | Same-origin calls should not need `FRONTEND_URL`; if you call the API from another origin, set it exactly and redeploy. |
| Frontend calls the wrong host | `VITE_API_BASE_URL` should normally be `/api`; it is embedded at build time, so redeploy after changing. |
| `permission denied` / `command denied` | Re-run `grants.sql` as the MySQL administrator and verify `appuser` has DML grants only. |
| Vercel API 404 for `/api/...` | Confirm the root `vercel.json` is present, `services.backend.root` is `backend`, and the public `/api/(.*)` rewrite targets `backend`. |
| Service build or runtime settings ignored | Keep fields such as `functions`, `framework`, and commands inside each service in the root `vercel.json`. |

---

## Notes

- No real credentials, hostnames, or deployment results are included in this repository. All placeholders must be replaced.
- The provided code was verified locally with lint and a production frontend build; it has **not** been deployed as part of this work.
