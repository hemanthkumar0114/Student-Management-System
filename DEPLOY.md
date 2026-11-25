# Deployment Guide

This guide documents the production deployment architecture for the Student Management System across existing cloud infrastructure: the existing TiDB Cloud production database, the existing live Render web service (Docker backend), and the Netlify frontend deployment (Vite React SPA).

---

## 1. Production Database: TiDB Cloud

The production environment utilizes an existing **TiDB Cloud** instance (MySQL 8.0-compatible distributed SQL database).

1. **Database Architecture & Compatibility**:
   - TiDB Cloud provides MySQL 8.0 wire protocol compatibility, high availability, and horizontal scalability.
   - Connections must enforce TLS/SSL encryption by specifying `sslMode=REQUIRED` in the JDBC connection string:
     ```
     jdbc:mysql://<TIDB_HOST>:<TIDB_PORT>/<DATABASE>?sslMode=REQUIRED
     ```

2. **Automated Schema Migrations with Flyway**:
   - The backend runs Flyway migrations automatically on startup (`src/main/resources/db/migration/V1__baseline_schema.sql`).
   - `spring.flyway.baseline-on-migrate=true` and `spring.flyway.baseline-version=1` ensure seamless migrations without altering or dropping existing records.

---

## 2. Backend Web Service: Render (Docker)

The backend runs as an existing live web service on **Render**:

- **Live Service URL**: `https://student-management-backend-2bfz.onrender.com`
- **Root Directory**: `Backend/Hibernate`
- **Runtime**: `Docker`
- **Dockerfile Path**: `Dockerfile`
- **Health Check Path**: `/actuator/health`

### Environment Variables Configured on Render:

| Variable | Description |
|---|---|
| `PORT` | `8080` |
| `SPRING_DATASOURCE_URL` | `jdbc:mysql://<TIDB_HOST>:<TIDB_PORT>/<DATABASE>?sslMode=REQUIRED` |
| `SPRING_DATASOURCE_USERNAME` | `<TIDB_USER>` |
| `SPRING_DATASOURCE_PASSWORD` | `<TIDB_PASSWORD>` |
| `ADMIN_USERNAME` | `admin` |
| `ADMIN_EMAIL` | `admin@example.com` |
| `ADMIN_PASSWORD` | `<SECURE_ADMIN_PASSWORD>` (minimum 8 characters) |
| `JWT_SECRET` | `<32_CHAR_OR_LONGER_SECRET_KEY>` |
| `JWT_EXPIRATION` | `86400000` (24 hours in milliseconds) |
| `CORS_ALLOWED_ORIGINS` | `https://<YOUR_NETLIFY_SUBDOMAIN>.netlify.app` |
| `LOGIN_MAX_ATTEMPTS` | `5` |
| `LOGIN_LOCKOUT_MINUTES` | `15` |
| `APP_DEMO_ENABLED` | `false` (set to `true` to create demo USER account) |

### Free-Tier Cold-Start Note:
> **Note on Free-Tier Instances**: Render free-tier services spin down after 15 minutes of inactivity. The first incoming request after idle sleep will trigger a container cold start, which typically takes 45 to 60 seconds. Subsequent requests will respond with standard low latency.

### Continuous Deployment:
- Pushing commits to the `main` branch automatically triggers the Render Docker build pipeline.
- Manual redeployments can also be triggered directly from the Render service dashboard.

---

## 3. Frontend Deployment: Netlify

1. **Connect Repository**:
   - Log in to [Netlify](https://app.netlify.com/).
   - Click **Add new site** > **Import an existing project**.
   - Select your Git provider and choose `Student-Management-System`.

2. **Configure Build Settings**:
   - **Base directory**: `Frontend/student-management-frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist` (relative to the configured base directory `Frontend/student-management-frontend`)

3. **SPA Redirects**:
   - SPA client-side routing is configured via `netlify.toml`:
     ```toml
     [[redirects]]
       from = "/*"
       to = "/index.html"
       status = 200
     ```

4. **Environment Variables**:
   - Under **Site configuration** > **Environment variables**, set:
     - `VITE_API_BASE_URL`: `https://student-management-backend-2bfz.onrender.com` (points to the live Render backend service, without trailing slash).

5. **Deploy**:
   - Click **Deploy site**.
   - Once deployed, copy your Netlify URL (e.g. `https://my-student-portal.netlify.app`) and update the `CORS_ALLOWED_ORIGINS` variable on your Render backend service.

---

## 4. Post-Deployment Verification & Health Checks

Once both services are provisioned and environment variables are active:

1. **Verify Backend Health**:
   ```bash
   curl -i https://student-management-backend-2bfz.onrender.com/actuator/health
   ```
   Expected response:
   ```json
   {"status":"UP"}
   ```

2. **Verify CORS Preflight**:
   ```bash
   curl -i -X OPTIONS https://student-management-backend-2bfz.onrender.com/auth/login \
     -H "Origin: https://<YOUR_NETLIFY_SUBDOMAIN>.netlify.app" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type,Authorization"
   ```
   Expected response headers include `Access-Control-Allow-Origin: https://<YOUR_NETLIFY_SUBDOMAIN>.netlify.app` and `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, HEAD, PATCH`.

3. **Verify Admin Authentication**:
   - Navigate to `https://<YOUR_NETLIFY_SUBDOMAIN>.netlify.app/login`.
   - Log in with your configured `ADMIN_USERNAME` and `ADMIN_PASSWORD`.
   - Confirm successful JWT token generation and redirection to the Admin Dashboard.
   - Navigate to `/admin/users` and confirm the administrator safety safeguards (self-account protections and user management) are operating as expected.

4. **Verify Database Persistence**:
   - Create a test course and a test student.
   - Refresh the page to confirm data is retrieved from TiDB Cloud.

---

## 5. Deployment Troubleshooting Reference

| Symptom | Probable Cause | Remediation |
|---|---|---|
| **Render Build Timeout** | Docker build compiling tests or maven dependencies | Verify `Dockerfile` runs `mvn clean package -DskipTests -B` and uses multi-stage caching. |
| **Startup Crash with Exit Code 1** | Missing or empty `ADMIN_PASSWORD` | DataInitializer validates that `ADMIN_PASSWORD` is supplied; configure a password with at least 8 characters. |
| **Database Connection Refused** | TiDB Cloud IP restriction or invalid SSL mode | Ensure `?sslMode=REQUIRED` is appended to the JDBC URL and TiDB Cloud allows inbound traffic from Render (`0.0.0.0/0`). |
| **401 Unauthorized on Valid Page Reload** | SPA router redirect missing on Netlify | Ensure `netlify.toml` contains `from = "/*" to = "/index.html" status = 200`. |
| **CORS Blocked in Browser Console** | Trailing slash or mismatched origin | Verify `CORS_ALLOWED_ORIGINS` in Render matches Netlify domain without a trailing slash (e.g. `https://portal.netlify.app`). |
| **First Request Takes 50s+** | Free-tier Render instance idle sleep | Expected behavior on Render free tier. Consider upgrading to Starter plan for dedicated 24/7 warm JVM. |
