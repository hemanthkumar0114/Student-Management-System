# Student Management System

A full-stack Student Management System built using **Java, Spring Boot, React, and MySQL-compatible TiDB Cloud**. The application provides secure authentication, role-based access control, student and course management, administrative controls, and database migration management.

## Live Demo

| Component | Link |
|---|---|
| Live Application | https://student-management-system-live.netlify.app/ |
| Backend API | https://student-management-backend-2bfz.onrender.com |
| Backend Health | https://student-management-backend-2bfz.onrender.com/actuator/health |
| GitHub Repository | https://github.com/hemanthkumar0114/Student-Management-System |

## Key Features

### Authentication and Security
- JWT-based stateless authentication.
- Secure password hashing using BCrypt.
- Role-based authorization for ADMIN and USER accounts.
- Login protection with a 15-minute lockout after five consecutive failed attempts.
- Protected frontend routes.
- CORS configuration and centralized authentication error handling.
- Administrative safeguards preventing the removal or demotion of the last active administrator.
- Protection against administrators demoting or disabling their own accounts.

### Student Management
- Create, view, update, and delete student records.
- Search students by name or email.
- Server-side pagination and sorting.
- Student information validation.
- Student enrollment statistics.

### Course Management
- Create, view, update, and delete courses.
- Manage course information.
- Associate students with courses.

### User Administration
- Administrative user management.
- Enable and disable user accounts.
- Manage user roles.
- Enforce administrator safety rules.

### Deployment and Monitoring
- Docker-based backend deployment.
- Flyway database migration management.
- Spring Boot Actuator health monitoring.
- Cloud database integration.
- Automated backend and frontend testing.

## Technology Stack

| Category | Technologies |
|---|---|
| Backend | Java 21, Spring Boot 3.4.1 |
| Security | Spring Security 6, JWT, BCrypt |
| ORM | Spring Data JPA, Hibernate |
| Database | TiDB Cloud (MySQL-compatible) |
| Database Migration | Flyway |
| Frontend | React 19, JavaScript |
| Build Tool | Vite 8 |
| Routing | React Router 7 |
| Backend Testing | JUnit 5, Mockito, Spring Boot Test |
| Frontend Testing | Vitest, JSDOM |
| API Testing | Postman |
| Version Control | Git, GitHub |
| Containerization | Docker |
| Backend Hosting | Render |
| Frontend Hosting | Netlify |

## Application Architecture

```text
              React Frontend
                 (Vite)
                   |
                   | HTTPS / REST API
                   | JWT Bearer Token
                   |
          Spring Security Layer
                   |
          JWT Authentication Filter
                   |
              Controllers
                   |
               Services
                   |
             Repositories
                   |
             Spring Data JPA
                   |
               Hibernate
                   |
             Flyway Migration
                   |
             TiDB Cloud
          (MySQL Compatible)
```

### Backend Architecture

The backend follows a layered architecture:

- **Controller Layer:** Handles incoming REST API requests.
- **Service Layer:** Implements application business logic.
- **Repository Layer:** Performs database operations using Spring Data JPA.
- **Entity Layer:** Represents database entities.
- **DTO Layer:** Transfers data between frontend and backend.
- **Security Layer:** Handles JWT authentication and role-based authorization.

## Testing

The project includes automated backend and frontend tests.

| Test Suite | Tests |
|---|---:|
| Backend | 53 |
| Frontend | 9 |
| **Total** | **62** |

### Run Backend Tests

```powershell
cd Backend/Hibernate
.\mvnw.cmd test
```

### Run Frontend Tests

```powershell
cd Frontend/student-management-frontend
npm test
```

### Run All Tests on Windows

From the project root:

```powershell
.\run-tests.ps1
```

## Local Installation and Setup

### Prerequisites

Install the following:

- Java 21 or later
- Node.js and npm
- Git
- MySQL-compatible database for local development

### 1. Clone the Repository

```bash
git clone https://github.com/hemanthkumar0114/Student-Management-System.git
```

```bash
cd Student-Management-System
```

### 2. Configure the Backend

Navigate to:

```bash
cd Backend/Hibernate
```

Create a local `.env` file or configure the required environment variables.

Important backend variables:

```properties
PORT=8080
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/hibernate
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=your_database_password

ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_secure_admin_password

JWT_SECRET=your_secure_secret_key_of_at_least_32_characters
JWT_EXPIRATION=86400000

CORS_ALLOWED_ORIGINS=http://localhost:5173
APP_DEMO_ENABLED=false
```

Use your own secure credentials. Never commit passwords, database credentials, or JWT secrets to GitHub.

Start the backend:

```powershell
.\mvnw.cmd spring-boot:run
```

Backend runs at:

```text
http://localhost:8080
```

### 3. Configure the Frontend

Open another terminal:

```bash
cd Frontend/student-management-frontend
```

Create a `.env` file:

```properties
VITE_API_BASE_URL=http://localhost:8080
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

## Project Structure

```text
Student-Management-System/
│
├── .github/
│   └── workflows/
│       └── tests.yml
│
├── Backend/
│   └── Hibernate/
│       ├── Dockerfile
│       ├── .env.example
│       ├── pom.xml
│       └── src/
│           ├── main/
│           │   ├── java/com/example/Hibernate/
│           │   │   ├── Config/
│           │   │   ├── Controller/
│           │   │   ├── DTO/
│           │   │   ├── Entity/
│           │   │   ├── Exception/
│           │   │   ├── Repository/
│           │   │   ├── Security/
│           │   │   └── Service/
│           │   │
│           │   └── resources/
│           │       ├── application.properties
│           │       └── db/migration/
│           │
│           └── test/
│
├── Frontend/
│   └── student-management-frontend/
│       ├── netlify.toml
│       ├── package.json
│       └── src/
│           ├── components/
│           ├── context/
│           ├── pages/
│           └── services/
│
├── run-tests.ps1
├── run-tests.sh
├── DEPLOY.md
└── README.md
```

## Deployment

The application is deployed using the following services:

- **Frontend:** Netlify
- **Backend:** Render using Docker
- **Database:** TiDB Cloud
- **Source Control:** GitHub

The frontend communicates with the deployed Spring Boot backend through REST APIs.

## Known Limitations

1. Free-tier hosting may introduce cold starts after periods of inactivity.
2. JWT tokens expire according to the configured expiration time. Server-side token revocation is not implemented.
3. Login attempt tracking currently uses an in-memory data structure, which is not shared between multiple backend instances.

## Future Improvements

- Implement distributed login attempt tracking using Redis.
- Introduce refresh token management.
- Add more comprehensive integration and end-to-end tests.
- Improve dashboard analytics and reporting.
- Add additional monitoring and logging capabilities.

## Author

**Hemanth Kumar B M**

Java Full Stack Developer

- GitHub: https://github.com/hemanthkumar0114
- LinkedIn: https://www.linkedin.com/in/hemanth-kumar-469201393/

---

If you find this project interesting, feel free to explore the repository and try the live application.