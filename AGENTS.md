# Student Management System — Agent & Developer Instructions

## 1. Developer Profile & Project Identity
- **Developer**: Hemanth (Java Full Stack Developer)
- **Project**: Student Management System
- **Repository**: `hemanthkumar0114/Student-Management-System`
- **Core Technologies**:
  - **Backend**: Java 21, Spring Boot 3.4.1, Spring Data JPA, Hibernate 6, Spring Security 6, Flyway Migration, Actuator
  - **Frontend**: React 19, Vite 8, React Router 7, Vanilla CSS design system
  - **Database**: MySQL-compatible TiDB Cloud (Production), H2 In-Memory (Test Suite)
  - **Testing**: JUnit 5, Spring Boot Test, Mockito, Vitest 5, JSDOM
  - **Deployment**: Docker, Render (Backend Web Service), Netlify (Frontend SPA)

---

## 2. Non-Negotiable Development Rules
1. **Preserve Existing Work**: Never discard, revert, overwrite, or reset uncommitted changes or working functionality.
2. **No Unauthorized Git Actions**: Never `git commit`, `git push`, reset history, or delete branches without explicit permission.
3. **Zero Secret Exposure**: Never hardcode or commit passwords, JWT secrets, database credentials, or API keys. Always use environment variables or `.env` templates.
4. **Independent & Systematic Execution**: Work step by step, diagnosing root causes directly without asking the user to manually inspect source files.
5. **Rigorous Verification**: Never claim a test, build, or deployment succeeds without actually running the command and inspecting the output.

---

## 3. Architecture & Coding Conventions

### Backend (Spring Boot 3.4)
- **Layered Architecture**: Strict separation of concerns:
  - `Controller/`: Handles HTTP routing, path aliasing (e.g. `/students` and `/api/students`), validation triggering (`@Valid`), and HTTP response codes.
  - `Service/`: Encapsulates business logic, DTO mapping, permission checks, timing attack mitigations, and safety rules.
  - `Repository/`: Spring Data JPA interfaces for data access.
  - `DTO/`: Data Transfer Objects for all request payloads and response bodies. Never expose raw JPA entities with sensitive fields (such as `password`).
  - `Security/`: JWT authentication filter, token provider, custom user details service, and login lockout tracking.
  - `Exception/`: Centralized `GlobalExceptionHandler` converting all exceptions into standardized `ErrorResponse` JSON envelopes.
- **Password Rules**: Minimum 8 characters, maximum 72 characters (BCrypt limit).

### Frontend (React 19 + Vite)
- **Component Organization**: Clean separation into `components/` (reusable UI controls), `context/` (state management like `AuthContext`), `pages/` (route views), and `services/` (HTTP API callers).
- **Authentication State**: Managed via `AuthContext`, persisted in `localStorage` (`ucms_token`, `ucms_user`), and verified on mount via `/auth/me`.
- **Route Protection**:
  - `ProtectedRoute`: Requires valid authenticated session (`isAuthenticated`).
  - `AdminRoute`: Requires `ADMIN` role (`user.role === 'ADMIN'`).
- **Production Hygiene**: Quick-login demo buttons must only render in development mode (`import.meta.env.DEV`).

---

## 4. Administrator & Account Safety Guarantees
The system strictly enforces active administrator quorum and self-protection:
1. **Last Administrator Protection**:
   - The last remaining administrator account cannot be deleted.
   - The last remaining administrator account cannot be disabled.
   - The last remaining administrator account cannot be demoted to `USER`.
   - Checks ensure at least one **enabled/active** administrator remains (`countByRoleAndEnabled(Role.ADMIN, true) >= 1`).
2. **Self-Account Safety**:
   - Administrators cannot delete their own active account.
   - Administrators cannot disable their own active account.
   - Administrators cannot demote their own active account.
   - In the frontend UI: own row displays a `(You)` badge, and Delete / Toggle Status buttons are disabled with explanatory tooltips. In the Edit modal, Role and Status fields are disabled for the self account.

---

## 5. Security & Authentication Standards
- **Stateless JWT**: Tokens signed using HMAC SHA-256 (`app.jwt.secret`) with a default 24-hour expiration (`86400000` ms).
- **Brute-Force Lockout**: 5 consecutive failed attempts trigger an automatic 15-minute sliding lockout window managed by `LoginAttemptService`.
- **Timing Attack Mitigation**: When an unrecognized username/email attempts login, `AuthService` performs a dummy BCrypt hash verification to prevent username enumeration via response latency differences.
- **CORS Allowlist**: Explicitly controlled via `app.cors.allowed-origins`. Allowed headers include `Authorization`, `Content-Type`, `Accept`, `Origin`, and `X-Requested-With`.
- **Fail-Fast Configuration**: `DataInitializer` validates non-empty `app.admin.password` at startup, terminating execution immediately if misconfigured.

---

## 6. Testing & Build Commands
- **Unified Test Script**:
  - Windows: `.\run-tests.ps1`
  - Unix / macOS / Linux: `./run-tests.sh`
- **Backend Test Suite (53 tests)**:
  ```powershell
  cd Backend/Hibernate
  mvn test
  ```
  *(Tests execute against in-memory H2 with Flyway disabled for speed and zero external dependencies).*
- **Frontend Test Suite (9 tests)**:
  ```powershell
  cd Frontend/student-management-frontend
  npm test
  ```
- **Production Builds**:
  - Backend: `mvn clean package -DskipTests` $\rightarrow$ `target/Hibernate-0.0.1-SNAPSHOT.jar`
  - Frontend: `npm run build` $\rightarrow$ `dist/`

---

## 7. Working Style & Guidelines
- Explain technical concepts in beginner-friendly, concise language.
- Work step by step; during troubleshooting, issue one terminal command at a time.
- Provide complete code replacements when modifying files.
- Always check Git status and preserve user modifications.
