# AUTO Dealership

A full-stack luxury automotive dealership platform. Public-facing website with inventory, services, and contact pages — plus a private CRM for staff with role-based access control.

## Project Structure

```
auto-dealership/
├── api/                    # Express.js REST API (Node.js + TypeScript)
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   ├── seed.ts         # Seeds admin account
│   │   └── migrations/     # Versioned SQL migrations
│   └── src/
│       ├── routes/         # Route definitions
│       ├── controllers/    # Request/response handling
│       ├── services/       # Business logic
│       ├── repositories/   # Database queries (Prisma)
│       ├── validators/     # Zod request schemas
│       ├── middlewares/    # Auth, RBAC, error handling
│       └── env.ts          # Zod-validated environment variables
└── web/                    # Next.js 14 frontend (App Router)
    └── src/
        ├── app/
        │   ├── (public)/   # Homepage, /cars, /services, /contact
        │   ├── staff-portal/  # Login page
        │   └── crm/        # Private CRM (role-gated)
        ├── components/ui/  # Catalyst UI component wrappers
        ├── lib/api.ts      # Typed API client
        └── store/auth.ts   # Zustand auth state
```

## Tech Stack

| Layer      | Technology                                     |
|------------|------------------------------------------------|
| Frontend   | Next.js 14, React 18, TypeScript, Tailwind CSS |
| UI         | Catalyst UI + Headless UI, Heroicons           |
| State      | Zustand (client), TanStack Query (server)      |
| Forms      | react-hook-form + Zod                          |
| Backend    | Node.js, Express.js, TypeScript                |
| Database   | SQLite via Prisma ORM                          |
| Auth       | JWT (jsonwebtoken), bcryptjs                   |
| Validation | Zod                                            |

## Getting Started

### Prerequisites

- Node.js >= 20.0.0
- npm >= 10.0.0

### 1. Install dependencies

```bash
# From the repo root
npm install

cd api && npm install
cd ../web && npm install
```

### 2. Configure environment

```bash
cp api/.env.example api/.env
```

Edit `api/.env` — at minimum set `JWT_SECRET` to a random string of ≥ 32 characters.

`web/.env.local` is committed and pre-configured for local development (`NEXT_PUBLIC_API_URL=http://localhost:3001`).

### 3. Set up the database

```bash
cd api
npx prisma migrate dev --name init
npm run db:seed
```

This creates the SQLite database at `api/prisma/auto.db` and seeds the admin account.

### 4. Run locally

Open two terminals:

```bash
# Terminal 1 — API (port 3001)
cd api
npm run dev

# Terminal 2 — Web (port 3000)
cd web
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

---

## CRM Access

The staff portal is at `/staff-portal` — it is **not** linked from any public page.

**Default admin credentials:**

```
Email:    admin@auto.com
Password: Auto@Admin2025
```

> Change these in Settings after first login. Never use these credentials in production.

### Roles

| Role    | Access                                                             |
|---------|--------------------------------------------------------------------|
| admin   | Full access — all pages, all inquiries, user management           |
| manager | Analytics, Newsletter, Settings, Vehicles, Services, all inquiries |
| sales   | Vehicles, Services, own assigned inquiries and pipeline only      |

Admins manage staff accounts at `/crm/users`.

---

## API Reference

All endpoints are prefixed with `/api/v1/`.

### Auth

| Method | Endpoint                    | Auth | Description         |
|--------|-----------------------------|------|---------------------|
| POST   | `/auth/login`               | —    | Obtain JWT token    |
| POST   | `/auth/logout`              | ✓    | Invalidate session  |
| GET    | `/auth/me`                  | ✓    | Current user info   |
| POST   | `/auth/change-password`     | ✓    | Change own password |

### Users

| Method | Endpoint      | Auth          | Description      |
|--------|---------------|---------------|------------------|
| GET    | `/users`      | admin/manager | List all staff   |
| POST   | `/users`      | admin         | Create user      |
| PUT    | `/users/:id`  | admin         | Update user      |
| DELETE | `/users/:id`  | admin         | Remove user      |

### Cars

| Method | Endpoint      | Auth          | Description    |
|--------|---------------|---------------|----------------|
| GET    | `/cars`       | —             | List cars      |
| POST   | `/cars`       | admin/manager | Create car     |
| GET    | `/cars/:id`   | —             | Get single car |
| PUT    | `/cars/:id`   | admin/manager | Update car     |
| DELETE | `/cars/:id`   | admin/manager | Delete car     |

### Services

| Method | Endpoint         | Auth          | Description      |
|--------|------------------|---------------|------------------|
| GET    | `/services`      | —             | List services    |
| POST   | `/services`      | admin/manager | Create service   |
| PUT    | `/services/:id`  | admin/manager | Update service   |
| DELETE | `/services/:id`  | admin/manager | Delete service   |

### Inquiries

| Method | Endpoint           | Auth  | Description                                 |
|--------|--------------------|-------|---------------------------------------------|
| GET    | `/inquiries`       | ✓     | List (sales users see assigned only)        |
| POST   | `/inquiries`       | —     | Submit inquiry (public contact form)        |
| GET    | `/inquiries/:id`   | ✓     | Get inquiry (sales: assigned only)          |
| PUT    | `/inquiries/:id`   | ✓     | Update status / assign staff                |
| DELETE | `/inquiries/:id`   | ✓     | Delete (admin/manager only)                 |

### Newsletter

| Method | Endpoint                      | Auth          | Description        |
|--------|-------------------------------|---------------|--------------------|
| POST   | `/newsletter/subscribe`       | —             | Subscribe email    |
| DELETE | `/newsletter/:email`          | admin/manager | Unsubscribe        |
| GET    | `/newsletter/subscribers`     | admin/manager | List subscribers   |

### Settings

| Method | Endpoint     | Auth          | Description                                     |
|--------|--------------|---------------|-------------------------------------------------|
| GET    | `/settings`  | —             | Get dealer info (name, address, hours, etc.)    |
| PUT    | `/settings`  | admin/manager | Update dealer info                              |

### Health

| Method | Endpoint  | Description                    |
|--------|-----------|--------------------------------|
| GET    | `/ready`  | Liveness probe — always 200    |
| GET    | `/health` | Full dependency health check   |

---

## Environment Variables

### API (`api/.env`)

| Variable        | Required | Description                                        |
|-----------------|----------|----------------------------------------------------|
| `NODE_ENV`      | Yes      | `development` \| `staging` \| `production`         |
| `PORT`          | No       | API port (default `3001`)                          |
| `DATABASE_URL`  | Yes      | SQLite path, e.g. `file:./prisma/auto.db`          |
| `JWT_SECRET`    | Yes      | Random string ≥ 32 characters                      |
| `JWT_EXPIRES_IN`| No       | Token lifetime (default `7d`)                      |
| `CORS_ORIGIN`   | No       | Allowed frontend origin (default `http://localhost:3000`) |
| `SENTRY_DSN`    | Prod     | DSN from Sentry project → Client Keys              |
| `SENTRY_ENV`    | Prod     | Environment tag sent to Sentry                     |
| `SENTRY_ORG`    | Prod     | Sentry organisation slug                           |
| `SENTRY_PROJECT`| Prod     | Sentry project slug                                |

### Web (`web/.env.local`)

| Variable              | Required | Description                          |
|-----------------------|----------|--------------------------------------|
| `NEXT_PUBLIC_API_URL` | Yes      | Base URL for the API (no trailing /) |

---

## Database Migrations

Always use `prisma migrate dev` — never `prisma db push`.

```bash
cd api

# Create and apply a migration
npx prisma migrate dev --name describe-your-change

# Reset database (dev only — destroys all data)
npm run db:reset

# Open Prisma Studio (GUI)
npm run db:studio
```

---

## Building for Production

```bash
# API
cd api
npm run build        # tsc → dist/
npm start            # node dist/server.js

# Web
cd web
npm run build        # next build → .next/
npm start            # next start -p 3000
```

Set `NODE_ENV=production`, configure real `JWT_SECRET`, `SENTRY_DSN`, and point `CORS_ORIGIN` at your production frontend domain.

---

## Running Tests

```bash
cd api
npm test             # jest --coverage
```

---

## License

MIT
