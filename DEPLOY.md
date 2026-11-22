# Deployment Guide

This guide walks through deploying the Student Management System across production infrastructure: Aiven MySQL, Render (Docker Backend), and Netlify (Vite React Frontend), in that exact sequence.

---

## 1. Database Provisioning: Aiven MySQL

1. **Create Account and Project**:
   - Log in to [Aiven Console](https://console.aiven.io/).
   - Create a new project or select an existing one.

2. **Launch MySQL Service**:
   - Select **MySQL** as the service type.
   - Choose your preferred cloud provider and region.
   - Select the plan tier and provision the service.

3. **Obtain Connection Details**:
   - On the service overview page, locate:
     - `Host`
     - `Port`
     - `User` (default: `avnadmin`)
     - `Password`
     - `Service URI`

4. **Create Database**:
   - Connect via MySQL CLI or management tool (e.g., MySQL Workbench, DBeaver):
     ```bash
     mysql -h <HOST> -P <PORT> -u <USER> -p --ssl-mode=REQUIRED
     ```
   - Execute:
     ```sql
     CREATE DATABASE IF NOT EXISTS student_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
     ```

5. **Verify Flyway Compatibility**:
   - The backend runs Flyway migrations automatically on startup (`V1__baseline_schema.sql`).
   - If deploying on a database with pre-existing tables, Flyway will baseline automatically at version 1 without dropping or altering existing data.

---

## 2. Backend Deployment: Render (Docker)

1. **Create Web Service**:
   - Log in to [Render Dashboard](https://dashboard.render.com/).
   - Click **New +** and select **Web Service**.
   - Connect the Git repository `Student-Management-System`.

2. **Configure Service Settings**:
   - **Name**: `student-management-backend`
   - **Root Directory**: `Backend/Hibernate`
   - **Runtime**: `Docker`
   - **Dockerfile Path**: `Dockerfile`
   - **Region**: Choose the region closest to your Aiven MySQL instance.
   - **Instance Type**: Free or Starter.

3. **Configure Health Check Path**:
   - In **Advanced Settings**, set **Health Check Path** to:
     ```
     /actuator/health
     ```

4. **Set Environment Variables**:
   Configure the following under **Environment Variables**:

   | Variable | Value / Description |
   |---|---|
   | `PORT` | `8080` |
   | `SPRING_DATASOURCE_URL` | `jdbc:mysql://<AIVEN_HOST>:<AIVEN_PORT>/student_management?sslMode=REQUIRED` |
   | `SPRING_DATASOURCE_USERNAME` | `<AIVEN_USER>` |
   | `SPRING_DATASOURCE_PASSWORD` | `<AIVEN_PASSWORD>` |
   | `ADMIN_USERNAME` | `admin` |
   | `ADMIN_EMAIL` | `admin@example.com` |
   | `ADMIN_PASSWORD` | `<SECURE_ADMIN_PASSWORD>` (minimum 8 characters) |
   | `JWT_SECRET` | `<32_CHAR_OR_LONGER_SECRET_KEY>` |
   | `JWT_EXPIRATION` | `86400000` (24 hours in milliseconds) |
   | `CORS_ALLOWED_ORIGINS` | `https://<YOUR_NETLIFY_SUBDOMAIN>.netlify.app` |
   | `LOGIN_MAX_ATTEMPTS` | `5` |
   | `LOGIN_LOCKOUT_MINUTES` | `15` |

5. **Free-Tier Cold-Start Note**:
   > **Note on Free-Tier Instances**: Render free-tier services spin down after 15 minutes of inactivity. The first incoming request after idle sleep will trigger a container cold start, which typically takes 45 to 60 seconds. Subsequent requests will respond with standard low latency.

6. **Deploy**:
   - Trigger manual deploy or push to main branch.
   - Monitor build and runtime logs to confirm Flyway migration and Tomcat startup.

---

## 3. Frontend Deployment: Netlify

1. **Connect Repository**:
   - Log in to [Netlify](https://app.netlify.com/).
   - Click **Add new site** > **Import an existing project**.
   - Select your Git provider and choose `Student-Management-System`.

2. **Configure Build Settings**:
   - **Base directory**: `Frontend/student-management-frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `Frontend/student-management-frontend/dist`

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
     - `VITE_API_BASE_URL`: `https://student-management-backend.onrender.com` (your Render service URL, without trailing slash).

5. **Deploy**:
   - Click **Deploy site**.
   - Once deployed, copy your Netlify URL (e.g. `https://my-student-portal.netlify.app`) and update the `CORS_ALLOWED_ORIGINS` variable on your Render backend service.
