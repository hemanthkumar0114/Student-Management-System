# Student Management System

A robust, enterprise-grade full-stack Student Management System built with Spring Boot 3.4, React 19, and Vite. The system provides secure role-based student and course management, complete administrative controls, automated database versioning with Flyway, and unified cross-platform test runners.

---

## Features

- **Authentication & Security**:
  - Stateless JWT-based authentication with expiration handling.
  - Brute-force protection: automatic 15-minute sliding lockout after 5 consecutive failed attempts.
  - Constant-time dummy BCrypt verification to prevent timing attacks on nonexistent accounts.
  - Restricted CORS headers (`Authorization`, `Content-Type`, `Accept`).
  - Standardized JSON error response envelope for 401 Unauthorized and 429 Too Many Requests.
  - Fail-fast configuration validation at application startup.
- **Student Management**:
  - Full CRUD operations with validation rules and unique email constraints.
  - Server-side pagination with query param handling (`page`, `size`, `sort`).
  - Search by name or email with debounce support.
  - Student enrollment metrics and campus statistics.
  - Route aliasing supporting both `/students` and `/api/students`.
- **Course Catalog**:
  - Create, view, update, and manage academic courses.
  - Unique course code constraints.
  - Route aliasing supporting both `/courses` and `/api/courses`.
- **User Administration**:
  - Role management and user lifecycle control (enable/disable accounts).
  - Pre-seeded administrative and default user credentials via DataInitializer.
- **Observability & Deployment**:
  - Spring Boot Actuator endpoint exposing `/actuator/health`.
  - Multi-stage Docker builds with cached dependency layers and non-root user execution.
  - Zero-downtime database migrations via Flyway.

---

## Roles & Permissions

| Feature / Endpoint | Public / Anonymous | USER (`ROLE_USER`) | ADMIN (`ROLE_ADMIN`) |
|---|---|---|---|
| Auth Endpoints (`/auth/login`, `/auth/register`) | Allowed | Allowed | Allowed |
| Health Check (`/actuator/health`) | Allowed | Allowed | Allowed |
| View Students (`GET /students`, `/api/students`) | Denied (401) | Read-Only (200) | Full Access (200) |
| Manage Students (`POST`, `PUT`, `DELETE /students`) | Denied (401) | Denied (403) | Full Access (200/201/204) |
| View Courses (`GET /courses`, `/api/courses`) | Denied (401) | Read-Only (200) | Full Access (200) |
| Manage Courses (`POST`, `PUT`, `DELETE /courses`) | Denied (401) | Denied (403) | Full Access (200/201/204) |
| User Administration (`/admin/users/**`) | Denied (401) | Denied (403) | Full Access (200) |

---

## Tech Stack

- **Backend**:
  - Java 21 & Spring Boot 3.4.1
  - Spring Security 6 (JWT Filter, BCrypt hashing)
  - Spring Data JPA & Hibernate
  - Flyway Migration (`flyway-core`, `flyway-mysql`)
  - Spring Boot Actuator
  - In-Memory H2 Database (Test Profile) & MySQL (Production)
  - JUnit 5, Mockito & Spring Test Framework
- **Frontend**:
  - React 19 & Vite 8
  - React Router 7 (Protected and Admin Route guards)
  - Vitest & JSDOM for unit testing
  - ESLint for static analysis
- **DevOps & Infrastructure**:
  - Docker (Multi-stage build, unprivileged user)
  - GitHub Actions CI
  - Aiven MySQL, Render, and Netlify

---

## Architecture

```
Frontend (React 19 + Vite)
       │
       ▼ (HTTPS / JSON REST API with Bearer Token)
Spring Security Filter Chain
       │
       ├── JwtAuthenticationFilter (Token extraction & validation)
       ├── LoginAttemptService (Sliding lockout window)
       └── SecurityFilterChain (Role authorizations & CORS)
       │
Controllers (StudentController, CourseController, AdminUserController, AuthController)
       │
Services (Business logic, timing mitigation, DTO mapping)
       │
Repositories (Spring Data JPA interfaces)
       │
Flyway Migrations ──► Database (MySQL in Production / H2 in Tests)
```

---

## Environment Variables

### Backend (`Backend/Hibernate/.env`)

| Variable | Required | Description | Example |
|---|---|---|---|
| `PORT` | Yes | HTTP listening port | `8080` |
| `SPRING_DATASOURCE_URL` | Yes | JDBC connection string | `jdbc:mysql://localhost:3306/student_management` |
| `SPRING_DATASOURCE_USERNAME` | Yes | Database username | `root` |
| `SPRING_DATASOURCE_PASSWORD` | Yes | Database password | `secret` |
| `ADMIN_USERNAME` | Yes | Initial administrator username | `admin` |
| `ADMIN_EMAIL` | Yes | Initial administrator email | `admin@example.com` |
| `ADMIN_PASSWORD` | Yes | Initial admin password (min 8 chars) | `admin1234` |
| `JWT_SECRET` | Yes | HMAC SHA-256 key (min 32 chars) | `your-32-character-secret-key-goes-here` |
| `JWT_EXPIRATION` | Yes | Token validity in milliseconds | `86400000` |
| `CORS_ALLOWED_ORIGINS` | Yes | Permitted origins (comma-separated) | `http://localhost:5173` |
| `LOGIN_MAX_ATTEMPTS` | No | Consecutive failed login threshold | `5` (default) |
| `LOGIN_LOCKOUT_MINUTES` | No | Lockout duration in minutes | `15` (default) |

### Frontend (`Frontend/student-management-frontend/.env`)

| Variable | Required | Description | Example |
|---|---|---|---|
| `VITE_API_BASE_URL` | Yes | Base URL pointing to backend API | `http://localhost:8080` |

---

## Running Tests

All tests run locally without external database dependencies using an in-memory H2 database.

### Single-Command Test Runner

- **Unix / macOS / Linux**:
  ```bash
  ./run-tests.sh
  ```
- **Windows (PowerShell)**:
  ```powershell
  .\run-tests.ps1
  ```

### Running Component Suites Independently

- **Backend Test Suite (35 tests)**:
  ```bash
  cd Backend/Hibernate
  ./mvnw test
  ```
- **Frontend Test Suite (9 tests)**:
  ```bash
  cd Frontend/student-management-frontend
  npm test
  ```

---

## Project Structure

```
Student-Management-System/
├── .github/
│   └── workflows/
│       └── tests.yml                 # Automated CI test workflow
├── Backend/
│   └── Hibernate/
│       ├── Dockerfile                # Multi-stage production container
│       ├── .dockerignore
│       ├── .env.example              # Sample backend environment configuration
│       ├── pom.xml                   # Maven dependencies & build plugins
│       └── src/
│           ├── main/
│           │   ├── java/com/example/Hibernate/
│           │   │   ├── Config/       # SecurityConfig, CorsConfig, DataInitializer
│           │   │   ├── Controller/   # REST endpoints with route aliases
│           │   │   ├── Dto/          # Request & response data transfer objects
│           │   │   ├── Entity/       # JPA entities (Student, Course, User)
│           │   │   ├── Exception/    # Global exception handler and custom errors
│           │   │   ├── Repository/   # Spring Data JPA repositories
│           │   │   ├── Security/     # JWT provider, filter, and lockout services
│           │   │   └── Service/      # Core business logic services
│           │   └── resources/
│           │       ├── application.properties
│           │       └── db/migration/ # Flyway baseline SQL schemas
│           └── test/                 # Full integration & unit test suite
├── Frontend/
│   └── student-management-frontend/
│       ├── .env.example              # Sample frontend environment configuration
│       ├── netlify.toml              # Netlify build and SPA routing config
│       ├── package.json              # React, Vite, and Vitest dependencies
│       ├── vite.config.js
│       └── src/
│           ├── components/           # Reusable UI components
│           ├── context/              # Authentication context & provider
│           ├── pages/                # Application routes and views
│           └── services/             # API client & auth helpers with unit tests
├── DEPLOY.md                         # Complete production deployment guide
├── MIGRATION_PROGRESS.md             # Project audit and migration tracking
├── run-tests.sh                      # Unified Unix test runner
├── run-tests.ps1                     # Unified Windows test runner
└── README.md
```

---

## Screenshots

> Place application screenshots in `docs/screenshots/` to display previews in documentation.

| Student Directory | Course Management |
|---|---|
| ![Student Directory Placeholder](https://via.placeholder.com/600x350?text=Student+Directory+Preview) | ![Course Management Placeholder](https://via.placeholder.com/600x350?text=Course+Management+Preview) |

| User Administration | System Health Metrics |
|---|---|
| ![User Administration Placeholder](https://via.placeholder.com/600x350?text=User+Administration+Preview) | ![Health Check Placeholder](https://via.placeholder.com/600x350?text=Actuator+Health+Preview) |

---

## Known Limitations

1. **Free-Tier Cold Starts**: Deployment on free-tier hosting (e.g., Render) spins down instances after 15 minutes of inactivity; the initial request may take ~50 seconds to warm up the JVM.
2. **Stateless Token Invalidation**: Tokens expire naturally after `JWT_EXPIRATION` milliseconds and are discarded client-side upon logout; server-side token revocation does not maintain a distributed Redis blacklist.
3. **Database Concurrency**: Login attempt sliding lockout uses an in-memory `ConcurrentHashMap`. For horizontal multi-instance scaling, backing with Redis or database persistence is recommended.
