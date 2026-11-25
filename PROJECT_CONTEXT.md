# Student Management System — Project Context & Architecture

This document provides a comprehensive technical overview of the **Student Management System** architecture, data models, authentication mechanisms, deployment setup, and development state.

---

## 1. System Overview

The Student Management System is an enterprise-grade full-stack web application designed for academic administration. It provides role-based access control for managing student enrollment records, academic courses, user authentication credentials, and system administration.

- **Repository**: `hemanthkumar0114/Student-Management-System`
- **Owner**: Hemanth (Java Full Stack Developer)
- **Primary Architecture**: Decoupled Client-Server (Spring Boot REST API + React Vite SPA)

---

## 2. Technology Stack & Component Versions

| Component | Technology | Version | Purpose |
|---|---|---|---|
| **Runtime** | Java Development Kit (JDK) | OpenJDK 21 | Backend runtime environment |
| **Framework** | Spring Boot | 3.4.1 | Core application framework & dependency injection |
| **Security** | Spring Security & JJWT | 6.x / 0.11.5 | Stateless JWT authentication & role-based authorization |
| **Persistence** | Spring Data JPA & Hibernate | 6.x | ORM and relational database access |
| **Database Migration** | Flyway | 10.x (`flyway-core`, `flyway-mysql`) | Versioned DDL execution and baseline schema management |
| **Production Database** | MySQL-compatible TiDB Cloud | 8.0-compatible | Distributed SQL storage for production deployment |
| **Testing Database** | H2 Database | 2.x (In-Memory) | Isolated test suite execution |
| **Frontend Framework** | React | 19.2.8 | User interface library |
| **Frontend Build Tool** | Vite | 8.2.1 | Fast bundler and development server |
| **Routing** | React Router | 7.18.2 | Client-side routing with route guards |
| **Frontend Testing** | Vitest & JSDOM | 5.1.1 / 29.1.1 | Unit testing for frontend auth and helper services |
| **Containerization** | Docker | Multi-stage build | Multi-platform container packaging |
| **Cloud Hosting** | Render & Netlify | Cloud Platform | Docker backend service (Render) & Static SPA (Netlify) |

---

## 3. Architecture & Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                 React 19 Frontend (Vite)                    │
│  - Public Pages: Login                                      │
│  - Protected Pages: Dashboard, Students, Courses            │
│  - Admin-Only Pages: Add/Edit Student, Add/Edit Course,     │
│                     Admin Users Management                  │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS / REST (Bearer JWT)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│             Spring Security Filter Chain                    │
│  1. CorsConfigurationSource (Origin allowlist)              │
│  2. JwtAuthenticationFilter (Extract Bearer token)          │
│  3. CustomUserDetailsService (Load UserDetails & check status)│
│  4. SecurityFilterChain Authorizations (Role-based rules)   │
└──────────────────────────────┬──────────────────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
┌───────────────────────────────┐   ┌───────────────────────────────┐
│     Public Endpoints          │   │      Protected Endpoints      │
│  - /actuator/health           │   │  - /students/**, /api/students│
│  - /auth/login                │   │  - /courses/**, /api/courses  │
│  - /api/auth/login            │   │  - /admin/users/**            │
└───────────────────────────────┘   └─────────────┬─────────────────┘
                                                  │
                                                  ▼
┌─────────────────────────────────────────────────────────────┐
│              Business Service Layer                         │
│  - AuthService (BCrypt timing mitigation, LoginLockout)     │
│  - UserService (Admin quorum & self-protection rules)       │
│  - StudentServices (Validation, DTO mapping, pagination)    │
│  - CourseService (Catalog management, course code uniqueness│
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│             Spring Data JPA Repositories                    │
│      (StudentRepository, CourseRepository, UserRepository)  │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│               Database Layer (MySQL / H2)                   │
│  Managed via Flyway Migrations (V1__baseline_schema.sql)    │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Completed Features & Capabilities

### A. Authentication & Brute-Force Defense
- **Stateless JWT**: Standardized Bearer token flow with configurable expiration (`JWT_EXPIRATION`, default 24h).
- **Sliding Account Lockout**: Automatic 15-minute lockout after 5 consecutive failed login attempts (`LoginAttemptService`).
- **Timing Attack Mitigation**: When login fails due to an unrecognized username/email, `AuthService` executes a dummy BCrypt comparison with an identical workload factor (`$2a$10$wK6nSg7zL8dY7dM5L5mRgeVpU6p7Cq4Z3L0V6m8QeG1V1Y2e5e1m2`).
- **Standardized Error Envelope**: Consistent JSON error structures for 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, and 429 Too Many Requests (`ErrorResponse`).
- **Fail-Fast Startup**: `DataInitializer` enforces non-empty `app.admin.password` at startup, failing loudly before traffic is accepted.

### B. Student Management
- Complete CRUD operations for student records.
- Relational mapping with `Address` (embedded) and `Course` (Many-to-One).
- Server-side pagination, sorting, and search filtering by name and email.
- Academic performance tracking (CGPA calculation and department categorization).
- Dual endpoint support via route aliasing (`/students` and `/api/students`).

### C. Course Catalog Management
- Full lifecycle management for academic courses.
- Unique course code constraints and departmental associations.
- Dual endpoint support via route aliasing (`/courses` and `/api/courses`).

### D. User Administration & Safety Guarantees
- Dedicated administrative endpoint (`/admin/users/**` and `/api/admin/users/**`).
- User creation, update, role management, password resets, and status toggling (enable/disable).
- **Strict Administrator Quorum Protection**:
  - Cannot delete the last remaining administrator account.
  - Cannot disable the last remaining administrator account.
  - Cannot demote the last remaining administrator account to `USER`.
  - Safety checks verify both total admin count and enabled admin count (`countByRoleAndEnabled(Role.ADMIN, true) >= 1`).
- **Self-Account Safety**:
  - Administrators cannot delete their own account.
  - Administrators cannot disable their own account.
  - Administrators cannot demote their own account.
  - Frontend indicates active session with a `(You)` badge and disables destructive actions.

---

## 5. API Endpoints & Role Access Matrix

| Method | Path Aliases | Required Role | Public Access | Description |
|---|---|---|---|---|
| `GET` | `/actuator/health` | None | Yes | Health check for Docker/Render monitoring |
| `POST` | `/auth/login`, `/api/auth/login` | None | Yes | Authenticate and obtain JWT token |
| `GET` | `/auth/me`, `/api/auth/me` | Authenticated | No | Fetch currently logged-in user details |
| `GET` | `/students`, `/api/students` | `USER`, `ADMIN` | No | List students with pagination & search |
| `GET` | `/students/{id}`, `/api/students/{id}` | `USER`, `ADMIN` | No | Fetch student by ID |
| `POST` | `/students`, `/api/students` | `ADMIN` | No | Create new student |
| `PUT` | `/students/{id}`, `/api/students/{id}` | `ADMIN` | No | Update existing student |
| `DELETE` | `/students/{id}`, `/api/students/{id}` | `ADMIN` | No | Delete student record |
| `GET` | `/courses`, `/api/courses` | `USER`, `ADMIN` | No | List academic courses |
| `GET` | `/courses/{id}`, `/api/courses/{id}` | `USER`, `ADMIN` | No | Fetch course by ID |
| `POST` | `/courses`, `/api/courses` | `ADMIN` | No | Create new course |
| `PUT` | `/courses/{id}`, `/api/courses/{id}` | `ADMIN` | No | Update course details |
| `DELETE` | `/courses/{id}`, `/api/courses/{id}` | `ADMIN` | No | Delete course |
| `GET` | `/admin/users`, `/api/admin/users` | `ADMIN` | No | List all user accounts |
| `GET` | `/admin/users/{id}`, `/api/admin/users/{id}` | `ADMIN` | No | Fetch user account by ID |
| `POST` | `/admin/users`, `/api/admin/users` | `ADMIN` | No | Create new user account |
| `PUT` | `/admin/users/{id}`, `/api/admin/users/{id}` | `ADMIN` | No | Update user role, status, or password |
| `PATCH` | `/admin/users/{id}/status`, `/api/admin/users/{id}/status` | `ADMIN` | No | Toggle user account enabled/disabled |
| `DELETE` | `/admin/users/{id}`, `/api/admin/users/{id}` | `ADMIN` | No | Delete user account |

---

## 6. Database Schema & Flyway Versioning

Database versioning is managed via Flyway (`db/migration/V1__baseline_schema.sql`).

```sql
CREATE TABLE IF NOT EXISTS courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_name VARCHAR(255) NOT NULL,
    duration VARCHAR(255) NOT NULL,
    department VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    cgpa DOUBLE,
    city VARCHAR(255),
    state VARCHAR(255),
    pincode VARCHAR(255),
    course_id INT,
    CONSTRAINT fk_students_course FOREIGN KEY (course_id) REFERENCES courses (id)
);

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'USER') NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME(6) NOT NULL
);
```

---

## 7. Automated Test Suite

The project includes 62 automated tests executing locally and in CI:
- **Backend Test Suite (53 tests)**:
  - `AdminUserTests`: Admin CRUD lifecycle, last remaining admin protection, self-lockout prevention, case-insensitive normalization, password strength rules (8-72 chars), password hash leakage prevention.
  - `AuthTests`: Username/email login, bad password 401 handling, unknown user 401 handling, disabled account rejection.
  - `LoginLockoutTests`: 5-attempt sliding lockout threshold, 429 response validation, successful login counter reset, property startup validation.
  - `RoleAccessMatrixTests`: Full role permission matrix across public, user, and admin operations on both standard and `/api/` prefixed endpoints.
  - `StudentCrudTests`: Full student lifecycle, address embedding, unique email constraints.
  - `CourseTests`: Course creation, duplicate prevention, and deletion.
  - `DataInitializerTests`: Startup configuration validation, admin creation, demo account toggle.
  - `FlywayMigrationTests`: Verifies V1 baseline migration execution and table schemas.
  - `HibernateApplicationTests`: Spring Boot application context load verification.
  - `StudentControllerTest` & `StudentServicesTest`: Isolated Mockito unit tests.
- **Frontend Test Suite (9 tests)**:
  - `authService.test.js`: `getAuthToken`, `getStoredUser` (valid & invalid JSON handling), `setAuthData`, `clearAuthData`, and `getAuthHeaders` (unauthenticated vs authenticated Bearer header).

---

## 8. Deployment Overview

1. **TiDB Cloud Database**:
   - Production MySQL-compatible distributed SQL database with SSL enforced (`sslMode=REQUIRED`).
   - Schema migrations and baseline versioning managed automatically via Flyway (`V1__baseline_schema.sql`).
2. **Render (Docker Backend)**:
   - Existing live web service: `https://student-management-backend-2bfz.onrender.com`
   - Root directory: `Backend/Hibernate`
   - Runtime: `Docker`
   - Health check: `/actuator/health`
   - Environment variables: `PORT`, `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`, `ADMIN_USERNAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `JWT_SECRET`, `JWT_EXPIRATION`, `CORS_ALLOWED_ORIGINS`, `APP_DEMO_ENABLED`.
3. **Netlify (Vite React Frontend)**:
   - Base directory: `Frontend/student-management-frontend`
   - Build command: `npm run build`
   - Publish directory: `dist` (relative to the configured base directory)
   - Environment variable: `VITE_API_BASE_URL` (points to the live Render backend service: `https://student-management-backend-2bfz.onrender.com`).
   - SPA routing: `netlify.toml` redirects all routes `/*` to `/index.html`.

---

## 9. Current Limitations & Architectural Decisions

1. **Free-Tier Cold Starts**: On Render free tier, instances spin down after 15 minutes of inactivity; the first subsequent request requires ~50 seconds for JVM container initialization.
2. **Stateless Token Invalidation**: Tokens expire based on `JWT_EXPIRATION` (24h) and are discarded client-side upon logout. A distributed Redis blacklist is not currently implemented.
3. **In-Memory Lockout Storage**: `LoginAttemptService` tracks failed attempts in a `ConcurrentHashMap`. For horizontal multi-instance scaling in clustered environments, backing with Redis is recommended.

---

## 10. Recommended Future Roadmap

- [ ] Add Redis-backed token revocation blacklist for immediate server-side logout invalidation.
- [ ] Implement Refresh Token rotation to allow shorter-lived access tokens (e.g. 15 minutes access, 7 days refresh).
- [ ] Add password reset via time-limited email verification tokens.
- [ ] Add audit logging for sensitive administrative actions (user deletion, role modification).
- [ ] Integrate SonarQube or Snyk for automated static security analysis in CI.
