# A Solution — General AI Coding Rules

You are an AI coding assistant working on an A Solution client project. Follow every rule in this file. When a rule conflicts with your default behavior, this file wins.

---

## Architecture — Backend

Always use this layered structure. Never put logic in the wrong layer.

```
src/
├── routes/        → Route definitions + middleware attachment only
├── controllers/   → Parse request, call service, format response
├── services/      → All business logic, call repositories, handle transactions
├── repositories/  → Database queries only, return raw data
├── validators/    → Zod schemas for request validation
├── middlewares/    → Auth, RBAC, error handling, cross-cutting concerns
├── dtos/          → Data transfer objects (request/response shapes)
├── constants/     → Shared constants
├── providers/     → External service integrations (SES, S3, OAuth, etc.)
├── env.ts         → Zod-validated environment variables
```

### Layer Rules

NEVER put database calls in controllers. Controllers call services, services call repositories.

NEVER put business logic in repositories. Repositories only run queries and return data.

NEVER put request/response handling in services. Services receive typed parameters and return typed results.

ALWAYS wrap multi-step mutations in database transactions. If a function does more than one write operation, it must be atomic.

```typescript
// GOOD — service calls repository, wraps in transaction
async createProfileWithGarments(data: CreateProfileInput) {
  return prisma.$transaction(async (tx) => {
    const profile = await this.profileRepo.create(tx, data.profile);
    const garments = await this.garmentRepo.createMany(tx, data.garments);
    await this.auditRepo.log(tx, { action: 'profile_created', profileId: profile.id });
    return { profile, garments };
  });
}

// BAD — controller directly queries database
async handler(req, res) {
  const profile = await prisma.profile.create({ data: req.body });
  res.json(profile);
}

// BAD — no transaction on multi-step write
async createProfileWithGarments(data) {
  const profile = await this.profileRepo.create(data.profile);
  const garments = await this.garmentRepo.createMany(data.garments); // if this fails, profile is orphaned
}
```

## Database Migrations

ALWAYS use `prisma migrate dev --name <description>` for schema changes. This creates a versioned SQL migration file and applies it to the database.

NEVER use `prisma db push` in any environment. It bypasses migration history, causes drift, and makes deployments unreliable.

```bash
# GOOD — creates a migration file + applies it
npx prisma migrate dev --name add-profiles-table

# BAD — pushes schema directly, no migration history
npx prisma db push
```


### Theme

This project uses **light theme only**. NEVER add `dark:` Tailwind classes or dark mode support unless the developer explicitly requests it.

ALWAYS ask the developer to confirm UI preferences (theme mode, color palette, layout direction) before making assumptions. Do not assume dark mode, RTL, or multi-theme support.

---

## Architecture — Frontend

```
src/
├── app/           → Page routes
├── components/
│   ├── ui/        → Base UI component wrappers
│   ├── layouts/   → Nav, header, sidebar
│   ├── pages/     → Page-level components
│   └── [feature]/ → Feature-grouped components
├── hooks/         → Custom React hooks
├── lib/           → API client, utilities, constants
├── store/         → State management (client state only)
│   └── slices/    → Individual store slices
├── constants/     → Shared constants
├── services/      → Client-side service helpers
├── providers/     → React context providers
├── middlewares/    → Next.js middleware helpers
├── env/           → Zod-validated environment variables (client.ts, server.ts)
└── validators/    → Shared Zod schemas
```

### Frontend Rules

ALWAYS use the project's form library (react-hook-form) with Zod for form validation. NEVER manage form state with raw useState.

```typescript
// GOOD
const { register, handleSubmit } = useForm<ProfileForm>({
  resolver: zodResolver(profileSchema),
});

// BAD
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const handleSubmit = () => { /* manual validation */ };
```

ALWAYS use the project's data-fetching library (react-query) for API calls. NEVER use useEffect + fetch.

```typescript
// GOOD
const { data, isLoading, error } = useQuery({
  queryKey: ['profiles', tenantId],
  queryFn: () => api.getProfiles(),
});

// BAD
const [data, setData] = useState(null);
useEffect(() => {
  fetch('/api/profiles').then(r => r.json()).then(setData);
}, []);
```

NEVER put server state in the global store. Server data lives in react-query cache. The global store is for client-only UI state.

ALWAYS handle all four states in data-fetching components: loading, error, empty, and success.

ALWAYS use `SortableTableHeader` (`src/components/ui/SortableTableHeader.tsx`) for every data table column that can be sorted. NEVER use plain `TableHeader` for sortable columns. For API-backed tables, pass sortBy/sortOrder to the API query. For client-side tables (in-memory data), sort the array locally with `useMemo` before rendering.

### UI Reference Check (MANDATORY)

BEFORE writing ANY frontend page or component, you MUST:

1. **Check `docs/ui-mapping.md`** for the component mapping (Loveable → Catalyst equivalents)
2. **Read the corresponding Loveable page** in `lovable-ll/src/pages/` to understand the exact layout, structure, spacing, copy, icons, and user flow
3. **Match the visual design** — if the reference has a logo, branding, cards, specific spacing, or icons, the implementation MUST include them translated to Catalyst UI
4. **If no UI reference exists** for a page, ASK the developer before proceeding with a generic layout

NEVER implement a frontend page with just bare/default components. Every page must visually match the provided UI reference.

NEVER skip the UI reference check — even for "simple" pages like login. A login page with just inputs and a button is NOT acceptable if the reference shows branding, logos, and layout design.

### UI Reference Sources (Loveable / Figma)

Loveable and Figma are **visual references only**. They show what the UI should look like — layout, spacing, flow, copy. NEVER copy or import code from Loveable.

When building from a Loveable URL or Figma screenshot:
1. Study the **layout, structure, and user flow** from the reference
2. Build from scratch using **Catalyst UI components** (`src/components/ui/`)
3. Use **react-hook-form + Zod** for all forms (not whatever Loveable generated)
4. Use **react-query + openapi-fetch** for all data fetching (not fetch/axios)
5. Use **Zustand** for client-only UI state (not Loveable's state patterns)
6. Use **Heroicons** for icons (not Lucide or whatever Loveable uses)
7. Match the **visual result** from the reference, not the implementation

NEVER install Loveable dependencies (shadcn, radix, etc.). The project uses Catalyst UI + Headless UI.

NEVER copy Loveable component code. Translate the visual intent into Catalyst UI equivalents.

### Branding & Colors (MANDATORY)

The project uses a defined brand color system extracted from the Loveable reference. These colors are set as CSS custom properties in `globals.css` and exposed as Tailwind theme tokens.

| Token | HSL | Usage |
|-------|-----|-------|
| `--color-brand` | 192 70% 28% | Primary brand color (buttons, logos, active states) |
| `--color-brand-foreground` | 0 0% 100% | Text on brand backgrounds |
| `--color-accent` | 320 56% 27% | Secondary accent (highlights, badges) |
| `--color-accent-foreground` | 0 0% 100% | Text on accent backgrounds |
| `--color-sidebar` | 215 28% 17% | Sidebar background |
| `--color-sidebar-foreground` | 210 40% 98% | Text on sidebar |

ALWAYS use the brand Tailwind classes (`bg-brand`, `text-brand`, `bg-accent`, etc.) for branded elements like logos, avatars, primary buttons, sidebar, and active nav states.

NEVER use generic gray (`bg-zinc-900`, `bg-gray-800`) for branded elements. Generic grays are only for borders, dividers, muted text, and non-branded surfaces.

ALWAYS match the Loveable reference color intent — if Loveable uses `bg-primary` (Deep Teal), the Catalyst implementation must use `bg-brand`.

---

## TypeScript

ALWAYS use TypeScript strict mode.

NEVER use `any` unless absolutely unavoidable. If you must use `any`, add a comment explaining why.

```typescript
// GOOD
interface ScanEvent {
  id: string;
  tenantId: string;
  tagEpc: string;
  eventAt: Date;
}

// BAD
const processEvent = (event: any) => { ... }
```

ALWAYS define explicit return types on service methods and exported functions.

ALWAYS define interfaces for request/response shapes, database models, and component props.

---

## Validation

ALWAYS validate all request payloads with Zod at the controller or middleware level. No unvalidated input reaches services.

```typescript
// GOOD — validator file
export const createProfileSchema = z.object({
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  roomNumber: z.string().optional(),
});

// GOOD — used in controller or middleware
const validated = createProfileSchema.parse(req.body);
const result = await profileService.create(validated);

// BAD — no validation
const result = await profileService.create(req.body);
```

ALWAYS validate environment variables at startup with Zod. The app must crash immediately if a required variable is missing.

```typescript
// env.ts (backend) or env/server.ts + env/client.ts (frontend)
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production']),
  PORT: z.coerce.number().default(3001),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  // ... all required vars
});

export const env = envSchema.parse(process.env);
```

---

## Error Handling — Backend

ALWAYS use a centralized error handler middleware. Every error response must follow this schema:

```json
{
  "success": false,
  "error": "HUMAN_READABLE_ERROR_CODE"
}
```

For validation errors, include details:

```json
{
  "success": false,
  "error": "INVALID_DATA",
  "details": [{ "field": "email", "message": "Invalid email" }]
}
```

NEVER leak stack traces in production responses.

```typescript
// GOOD — centralized error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  Sentry.captureException(err, { extra: { userId: req.user?.id, endpoint: req.path } });

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ success: false, error: err.code });
  }

  // Generic 500 — never expose internals
  return res.status(500).json({ success: false, error: 'INTERNAL_SERVER_ERROR' });
});

// BAD — leaks stack trace
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message, stack: err.stack });
});
```

ALWAYS create typed error classes for known error conditions:

```typescript
export class AppError extends Error {
  constructor(public code: string, message: string, public statusCode: number) {
    super(message);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super('NOT_FOUND', `${resource} not found`, 404);
  }
}

export class ForbiddenError extends AppError {
  constructor() {
    super('FORBIDDEN', 'You do not have permission to access this resource', 403);
  }
}
```

## Error Handling — Frontend

ALWAYS wrap the app in a Sentry error boundary.

ALWAYS show user-friendly error messages. NEVER display raw error objects or stack traces to users.

---

## Logging

ALWAYS use Sentry for logging. NEVER use console.log in production code.

```typescript
// GOOD
Sentry.captureMessage('Payment failed', {
  level: 'warning',
  extra: { tenantId, userId, stripeError: err.code },
});

// BAD
console.log('Payment failed:', err);
```

ALWAYS include context with log entries: user ID, tenant ID, action, endpoint.

NEVER log sensitive data: passwords, tokens, full credit card numbers, PII, API keys.

### Sentry Environment Setup

ALWAYS verify that Sentry environment variables are present and configured with real values in every deployable repo's `.env` file. Required variables:

```
# Backend
SENTRY_DSN=<real-dsn-from-sentry-project>
SENTRY_ENV=development|staging|production
SENTRY_PROJECT=<sentry-project-slug>
SENTRY_ORG=<sentry-org-slug>

# Frontend (Next.js)
NEXT_PUBLIC_SENTRY_DSN=<real-dsn-from-sentry-project>
SENTRY_AUTH_TOKEN=<sentry-auth-token-for-source-maps>
```

NEVER leave placeholder/example Sentry values (e.g. `https://example.sentry.io/1234567890`) in `.env` files that will be used for actual development or deployment.

When Sentry is not yet configured (placeholder values detected):
- If the developer is a **Team Lead (TL)**: instruct them to create the Sentry project and add the real DSN, org, project slug, and auth token to the `.env` files for each repo.
- If the developer is a **regular developer**: instruct them to ask their Team Lead for the Sentry DSN and related values before proceeding.

During **bootstrap**, ALWAYS check `.env` files for placeholder Sentry values and flag them immediately.

---

## Naming

ALWAYS use descriptive names. The name should tell you what it does without reading the implementation.

```typescript
// GOOD
async getActiveProfilesByTenant(tenantId: string): Promise<Profile[]>
async processScanEvents(events: RawScanEvent[]): Promise<ProcessedScan>
const isSubscriptionActive = tenant.canceledAt === null;

// BAD
async getData(id: string)
async process(events: any[])
const flag = tenant.canceledAt === null;
```

ALWAYS use these naming conventions:
- Files: dot-separated kebab-case with layer suffix for non-component files (auth.controller.ts, auth.service.ts, auth.route.ts, error.middleware.ts, token.guard.ts, user.repository.ts, login-response.dto.ts, error.constant.ts, ses.provider.ts), PascalCase for React components (ProfileCard.tsx)
- Variables/functions: camelCase
- Types/interfaces: PascalCase
- Constants: UPPER_SNAKE_CASE for true constants, camelCase for config values
- Database columns: snake_case (matches PostgreSQL convention)

---

## Testing

ALWAYS write unit tests for service methods. Target 80% coverage on controllers and services.

ALWAYS write tests before or alongside the implementation for critical paths: auth, payments, data isolation.

ALWAYS use Jest as the testing framework.

```typescript
// GOOD — test the service, mock the repository
describe('ProfileService', () => {
  it('should throw NotFoundError when profile does not exist', async () => {
    profileRepo.findById.mockResolvedValue(null);
    await expect(profileService.getById('fake-id')).rejects.toThrow(NotFoundError);
  });

  it('should never return profiles from another tenant', async () => {
    const result = await profileService.getAll(tenantA.id);
    result.forEach(p => expect(p.tenantId).toBe(tenantA.id));
  });
});
```

---


## Code Cleanliness

NEVER leave unused code, dead imports, or commented-out blocks. Delete them.

NEVER leave placeholder comments like `// TODO: implement` unless they are tracked in Jira.

ALWAYS check `/lib`, `/constants`, and `/providers` before writing a new helper. Reuse existing code.

ALWAYS commit the lockfile (package-lock.json or yarn.lock).

NEVER generate code you cannot explain. If an AI tool wrote it, read every line before committing.

---

## API Design

ALWAYS use RESTful conventions:

```
GET    /api/v1/profiles          → list
POST   /api/v1/profiles          → create
GET    /api/v1/profiles/:id      → get one
PUT    /api/v1/profiles/:id      → update
DELETE /api/v1/profiles/:id      → delete
```

ALWAYS prefix routes with /api/v1/.

ALWAYS return appropriate HTTP status codes:
- 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 403 Forbidden
- 404 Not Found, 409 Conflict, 429 Rate Limited, 500 Internal Server Error

ALWAYS document endpoints in Swagger/OpenAPI with request/response schemas and examples.

---

## Health Endpoints

ALWAYS implement both endpoints in every deployable repository:

GET /ready — return 200 immediately. No dependency checks. Confirms process is running.

GET /health — check all service dependencies in parallel. Return consistent schema:

```typescript
// Pattern
app.get('/health', async (req, res) => {
  const checks = await Promise.all([
    checkDatabase(),
    checkEmailService(),
    checkStorage(),
    // ... project-specific services
  ]);

  const allUp = checks.every(c => c.status === 'up');
  const criticalDown = checks.some(c => c.critical && c.status === 'down');

  const status = criticalDown ? 'unhealthy' : allUp ? 'healthy' : 'degraded';
  res.status(criticalDown ? 503 : 200).json({ status, timestamp: new Date().toISOString(), services: checks });
});
```

Health check must complete within 5 seconds using Promise.all() with individual timeouts.

---

## Documentation

ALWAYS maintain CHANGELOG.md using Keep a Changelog format. Include migration notes for DB changes.

ALWAYS maintain README.md with: setup instructions, env var list, how to run tests, how to run locally, how to build.

---

## What You Must NEVER Do (Summary)

- NEVER use console.log in production code
- NEVER use `any` without a documented reason
- NEVER put database calls in controllers
- NEVER put business logic in repositories
- NEVER skip Zod validation on request payloads
- NEVER skip transactions on multi-step writes
- NEVER leak stack traces in production responses
- NEVER use useEffect + fetch for API calls
- NEVER manage forms with raw useState
- NEVER log passwords, tokens, PII, or API keys
- NEVER leave unused code, dead imports, or TODO placeholders
- NEVER commit unreviewed AI-generated code
- NEVER combine multiple Jira tasks in one PR
- NEVER put Jira IDs in commit messages
- NEVER mention Claude, AI, or Co-Authored-By in commits — all commits must appear human-authored
- NEVER write vague commit messages — always describe the scope and what changed
- NEVER use `prisma db push` — always use `prisma migrate dev` to create proper migration files
- NEVER commit a fix on a `feature/` branch or a feature on a `bugfix/` branch — branch type must match the work
- NEVER commit or push without first verifying the current branch is correct for the task
- NEVER use type workarounds (`as unknown as`, type overrides, type casts) to bypass missing OpenAPI types — always regenerate types first with `npm run openapi` and use proper typed API calls
- NEVER use `--no-verify` to skip pre-commit hooks — fix the underlying issue instead

#
