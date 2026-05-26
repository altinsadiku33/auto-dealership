# Changelog

All notable changes to the AUTO Dealership API are documented here.  
Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

### Added
- Sentry DSN, org, project and env variables to `.env.example` for error tracking setup
- Optional Sentry fields to the Zod `env` schema (`SENTRY_DSN`, `SENTRY_ENV`, `SENTRY_ORG`, `SENTRY_PROJECT`)

### Changed
- `error.middleware.ts`: replaced `console.error` with `process.stderr.write` in dev mode;  
  added inline comment directing team to wire up `Sentry.captureException` once DSN is configured

---

## [1.0.0] — 2026-05-25

### Added
- Express API with full CRUD for Cars, Services, Inquiries, Newsletter, and Users
- JWT authentication (`/api/v1/auth/login`, `/api/v1/auth/me`, `/api/v1/auth/logout`)
- Role-based access control middleware (`admin`, `manager`, `sales`)
- Zod validation on every inbound request via `validate()` middleware
- Centralized error handling with typed `AppError` subclasses (`NotFoundError`, `ForbiddenError`, etc.)
- Prisma ORM with SQLite; all schema changes via `prisma migrate dev`
- `/ready` liveness probe and `/health` dependency-check endpoint
- Bcrypt password hashing (12 rounds) for all user accounts
- Helmet + CORS security headers
- `morgan` request logging in non-production environments

### Database
- Initial migration: `cars`, `services`, `inquiries`, `newsletter_subscribers`, `users` tables
- Seed script (`prisma/seed.ts`) with default admin account and sample inventory
