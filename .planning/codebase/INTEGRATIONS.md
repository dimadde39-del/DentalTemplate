# External Integrations

**Analysis Date:** 2026-03-20

## APIs & External Services

**Primary Backend Platform:**
- Supabase - Database access, auth, and RPC-backed multi-tenant operations
  - SDK/Client: `@supabase/supabase-js` and `@supabase/ssr`
  - Auth: URL + anon key in public env vars, service role key for operational scripts
  - Endpoints used: auth session APIs and RPC calls such as `get_clinic_public_data`, `insert_public_lead`, `onboard_new_clinic`

**External Media Sources:**
- Unsplash - Public hero/slider images embedded directly in UI
  - Integration method: direct remote image URLs
  - Configuration: allowed through `next.config.ts`
- Pexels - Allowed in `next.config.ts`, though not currently referenced in source files inspected

**Outbound Links / Public Profiles:**
- Google Maps, Instagram, and Facebook URLs are stored as clinic configuration fields
  - Integration method: plain URL fields rendered into metadata or UI
  - Auth: none

## Data Storage

**Databases:**
- PostgreSQL on Supabase - Primary system of record
  - Connection: Supabase URL + keys from env vars
  - Client: Supabase JS clients in `src/lib/supabase-server.ts`, `src/lib/supabase-browser.ts`, and `scripts/onboard-new-clinic.ts`
  - Migrations: SQL files under `supabase/migrations/`, plus bootstrap SQL at repository root

**File Storage:**
- Local static assets in `public/`
  - Clinic/doctor demo images under `public/doctors/`
- Supabase Storage is allowed by remote image config (`*.supabase.co`) but no direct storage client usage was found in application code

**Caching:**
- Next.js `unstable_cache` used in `src/lib/tenant.ts` for tenant public config
  - No Redis or external cache service observed

## Authentication & Identity

**Auth Provider:**
- Supabase Auth - Email/password login flow for admin area
  - Implementation: SSR server client in protected routes and browser client for login
  - Token storage: cookies via `@supabase/ssr`
  - Session management: Supabase-managed session cookies

**OAuth Integrations:**
- None observed in current codebase

## Monitoring & Observability

**Error Tracking:**
- None observed

**Analytics:**
- None observed

**Logs:**
- No structured logging system found
- Current logging is limited to `console.error` / `console.log` in client and scripts

## CI/CD & Deployment

**Hosting:**
- Vercel is the implied hosting target from `README.md`
  - Deployment expectations: wildcard subdomains and custom-domain DNS to Vercel
  - Environment vars: expected to be configured outside the repo

**CI Pipeline:**
- No GitHub Actions, CI config, or deployment pipeline definition found in the repository

## Environment Configuration

**Development:**
- Required env vars from `.env.example`: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, white-label branding fields
- Local secrets are expected in `.env.local`

**Staging:**
- No staging-specific configuration files or conventions observed

**Production:**
- Production appears to rely on hosted Supabase + hosted Next.js deployment
- No secret management or failover strategy is documented in-repo

## Webhooks & Callbacks

**Incoming:**
- None observed

**Outgoing:**
- None observed

---

*Integration audit: 2026-03-20*
*Update when adding/removing external services*
