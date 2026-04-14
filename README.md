# TaskFlow

## Table of Contents

- [1. Overview](#1-overview)
- [2. Architecture Decisions](#2-architecture-decisions)
- [3. Running Locally](#3-running-locally)
- [4. Running Migrations](#4-running-migrations)
- [5. Test Credentials](#5-test-credentials)
- [6. API Reference](#6-api-reference)
- [7. What I'd Do With More Time](#7-what-id-do-with-more-time)

## 1. Overview

TaskFlow is a task management backend that supports user authentication, project management, task CRUD, filtering, pagination, seeded demo data, and interactive API documentation.

This submission is implemented as a Node.js + TypeScript REST API using:

- Express for HTTP routing
- PostgreSQL for persistence
- `node-pg-migrate` for schema migrations
- JWT for authentication
- bcrypt for password hashing
- Winston + Morgan for structured request/application logging
- Swagger UI for direct API testing
- Docker Compose for local setup

This repository currently contains the backend service and PostgreSQL setup. There is no frontend app in this repo, so the main reviewer experience is through the API and Swagger.

## 2. Architecture Decisions

I structured the backend so each layer has a clear responsibility. That keeps the code easier to review, easier to extend, and prevents business logic from leaking into route definitions.

- `routes/` defines the API surface and applies middleware in the correct order
- `controllers/` handles request parsing, validation entry points, and response shaping
- `services/` contains the business logic and database-facing operations
- `middlewares/` handles authentication, authorization checks, and centralized error handling
- `migrations/` manages schema changes explicitly instead of relying on ORM auto-sync
- `seeds/seed.sql` provides known demo data so the reviewer can test immediately
- `utils/` contains shared helpers like JWT handling, logging, Swagger setup, and common response helpers

### Logging

Logging is included so local debugging and API review are easier.

- HTTP requests are captured through Morgan
- Application logs are written through Winston
- This gives consistent request-level visibility and keeps operational logging separate from route/controller logic

### Authentication and Authorization

Authentication and authorization are separated intentionally.

- Authentication is handled with JWT. After login, the backend returns a token that must be sent on protected routes using `Authorization: Bearer <token>`.
- The `authMiddleware` validates the token, rejects unauthenticated requests, and attaches the authenticated user to the request.
- Authorization is enforced after authentication. Project update and delete routes check ownership so only the project owner can modify or delete that project.
- Task access is also scoped to the authenticated user. Task listing, creation, update, and delete flows are validated against the user's access to the related project or task.

That split keeps identity verification separate from business permissions, which makes the system easier to reason about and easier to extend later if membership rules become more advanced.

### Tradeoffs

- I used raw SQL migrations with `node-pg-migrate` for explicit control over schema evolution.
- Swagger annotations are colocated with route files so documentation stays close to the implementation.
- The code favors a simple service/controller split over introducing heavier abstractions too early.
- Docker Compose is optimized for reviewer setup speed and reproducibility rather than a more production-like orchestration setup.

### What I Intentionally Left Out

- Automated integration tests
- More production-grade container hardening and readiness checks between API and database
- Richer schema validation with tools like Zod or Joi
- A frontend client in this repository

## 3. Running Locally

Assumption: Docker Desktop is installed and running.

### Step 1: Clone the repository and move into the project directory

This downloads the code and switches your terminal into the repo root, which is where `docker-compose.yml` lives.

```bash
git clone https://github.com/Jenil1105/taskflow-jenil-savaj.git
cd taskflow-jenil-savaj
```

### Step 2: Create the local environment file

The backend and PostgreSQL containers read configuration from the root `.env` file. The quickest path is to copy the example file.

```bash
cp .env.example .env
```

If your shell does not support `cp`, you can create `.env` manually and copy the values from `.env.example`, or use PowerShell:

```powershell
Copy-Item .env.example .env
```

Important env note:

- `DATABASE_URL` must stay in sync with your PostgreSQL settings
- If you change `POSTGRES_USER`, `POSTGRES_PASSWORD`, or `POSTGRES_DB`, update `DATABASE_URL` as well
- Example: if you change the database password, the password inside `DATABASE_URL` must be changed too

### Step 3: Start the full local stack

This builds the backend image, starts PostgreSQL, runs migrations, loads seed data, and then starts the API service.

```bash
docker compose up --build
```

What happens on startup:

1. PostgreSQL starts from the root `docker-compose.yml`.
2. The backend container builds from `backend/Dockerfile`.
3. Migrations run automatically with `npx node-pg-migrate up`.
4. Seed data is loaded from `backend/seeds/seed.sql`.
5. The API starts on port `3000`.

Local URLs:

- API base URL: [http://localhost:3000/api](http://localhost:3000/api)
- Health check: [http://localhost:3000/health](http://localhost:3000/health)
- Swagger UI: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

Swagger UI is the easiest way to test the API directly, so there is no need to import a Postman collection for basic verification.

## 4. Running Migrations

Migrations run automatically when the backend container starts, so the normal path is just:

```bash
docker compose up --build
```

If you want to run migrations manually inside the backend container:

```bash
docker compose exec backend npx node-pg-migrate up
```

If you want to stop containers and start fresh:

```bash
docker compose down -v
cp .env.example .env
docker compose up --build
```

## 5. Test Credentials

The seed script creates test users immediately, so you can log in without registering first.

Primary test user:

```text
Email:    jenil@example.com
Password: password123
```

Secondary test user:

```text
Email:    user@example.com
Password: password123
```

## 6. API Reference

Interactive API docs:

- Swagger UI: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

Core endpoints:

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Projects

- `GET /api/projects`
- `POST /api/projects`
- `GET /api/projects/:id`
- `PATCH /api/projects/:id`
- `DELETE /api/projects/:id`
- `GET /api/projects/:id/stats`

### Tasks

- `GET /api/projects/:id/tasks`
- `POST /api/projects/:id/tasks`
- `PATCH /api/tasks/:id`
- `DELETE /api/tasks/:id`

### Testing Through Swagger

Use Swagger if you want to test APIs directly from the browser:

1. Open [http://localhost:3000/api-docs](http://localhost:3000/api-docs).
2. Run `POST /api/auth/login` with the seeded credentials.
3. Copy the JWT token from the response.
4. Click the `Authorize` button in Swagger.
5. Paste `<token>`.
6. Call protected project and task endpoints directly from the UI.

This removes the need for Postman during review.

## 7. What I'd Do With More Time

If I had more time, I would improve the project in a few specific ways:

- Add integration tests for auth, project ownership, and task update/delete flows
- Add stronger input validation and more consistent field-level error responses across every endpoint
- Make seeding idempotent so repeated container restarts do not risk duplicate seed inserts
- Add container health checks and a more reliable database readiness strategy instead of a simple startup delay
- Add a frontend client so the assignment can be reviewed end-to-end in the browser, not only through Swagger
