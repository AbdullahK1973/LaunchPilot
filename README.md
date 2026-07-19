# LaunchPilot

LaunchPilot is a production-oriented AI launch workspace for ecommerce teams. It stores brands, products, launches, image context, generated assets, and immutable revisions in PostgreSQL.

## Included

- Email/password authentication with hashed credentials and revocable server sessions
- Workspace-scoped authorization and role-ready memberships
- Persistent brands, products, launches, outputs, and revisions
- OpenAI Responses API generation with structured output and product-image context
- S3-compatible signed image uploads with file validation
- Multi-launch dashboard, history, editing, and Markdown export
- Stripe subscriptions, webhooks, monthly quotas, and server-side entitlement enforcement
- Workspace settings and provider-neutral integration destinations
- Security headers, environment validation, Sentry instrumentation, CI, unit tests, and Playwright setup

When `OPENAI_API_KEY` is absent, generation uses clearly identified demo output. Database access, authentication, and workspace data never fall back to browser storage.

## Local setup

1. Copy `.env.example` to `.env`.
2. Set a random `SESSION_SECRET` containing at least 32 characters.
3. Start PostgreSQL with `docker compose up -d postgres`.
4. Run `npm run db:migrate` and name the first migration `init`.
5. Run `npm run dev`.

For real generation, set `OPENAI_API_KEY`. For image uploads, provide all `S3_*` variables. For paid plans, provide the Stripe secret, webhook secret, and Pro price ID.

## Commands

- `npm run dev` — local development
- `npm run lint` — ESLint
- `npm run typecheck` — strict TypeScript validation
- `npm test` — Vitest unit tests
- `npm run test:e2e` — Playwright browser tests
- `npm run build` — production build
- `npm run db:migrate` — create/apply a local migration
- `npm run db:deploy` — apply committed migrations in production

## Production notes

- Run behind HTTPS and set `APP_URL` to the canonical HTTPS origin.
- Use a managed PostgreSQL service with backups and connection pooling.
- Keep upload buckets private for writes; configure the public or CDN URL for read-only image access.
- Point Stripe webhooks to `/api/stripe/webhook`.
- Set `SENTRY_DSN` to enable server instrumentation.
- Rotate service credentials through the deployment platform, never through the settings UI.

The OpenAI implementation follows the Responses API, structured-output, and image-input guidance. Prompts prohibit invented product claims and image inputs are treated as context rather than evidence for regulated claims.
