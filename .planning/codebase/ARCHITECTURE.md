# Architecture

**Analysis Date:** 2026-03-20

## Pattern Overview

**Overall:** Full-stack Next.js monolith with Supabase-backed multi-tenant SaaS patterns

**Key Characteristics:**
- App Router application with mixed server and client components
- Tenant-aware request handling via `src/proxy.ts`
- Auth and data access delegated to Supabase
- Business rules and tenancy boundaries enforced partly in SQL/RLS and partly in application code

## Layers

**Routing and Entry Layer:**
- Purpose: Route requests, inject tenant context, and protect admin access
- Contains: `src/proxy.ts`, `src/app/layout.tsx`, route group layouts/pages
- Depends on: Supabase SSR client and Next.js routing primitives
- Used by: Every incoming HTTP request

**Presentation Layer:**
- Purpose: Render clinic landing pages, login, and admin UI
- Contains: `src/app/(tenant)/*`, `src/app/admin/*`, `src/app/login/page.tsx`, `src/components/*`
- Depends on: Config/data utilities, React state/context, animation libs
- Used by: Public visitors and clinic admins

**Tenant/Data Access Layer:**
- Purpose: Resolve tenant-specific config and provide server/browser Supabase access
- Contains: `src/lib/tenant.ts`, `src/lib/supabase-server.ts`, `src/lib/supabase-browser.ts`, `src/lib/assertTenantOwnership.ts`, `src/config/site.ts`
- Depends on: Supabase SDKs, Next.js headers/cookies/cache
- Used by: Pages, layouts, server actions, and forms

**Persistence and Security Layer:**
- Purpose: Define schema, RLS policies, RPCs, seed data, and onboarding behavior
- Contains: `supabase/migrations/*.sql`, `supabase/seed_global_dent.sql`, `supabase_multi_tenant.sql`, `supabase_init.sql`
- Depends on: Supabase/Postgres features such as policies, functions, and security definer RPCs
- Used by: Frontend RPC calls, admin data reads/updates, onboarding script

**Operational Script Layer:**
- Purpose: One-off or operator-driven workflows outside HTTP requests
- Contains: `scripts/onboard-new-clinic.ts`
- Depends on: service-role Supabase client and env vars
- Used by: Platform operator / developer

## Data Flow

**Public Tenant Request:**

1. Request enters `src/proxy.ts`
2. Proxy derives tenant slug from subdomain or `/clinic/{slug}` path
3. Tenant slug is written into request headers
4. Layout/page resolves tenant config through `src/lib/tenant.ts`
5. `get_clinic_public_data` RPC returns clinic + services/doctors/reviews payload
6. UI components render the landing page and lead form
7. Lead form submits to `insert_public_lead` RPC through browser Supabase client

**Admin Request:**

1. Request enters `src/proxy.ts`
2. `/admin` routes require authenticated Supabase user
3. `src/app/admin/layout.tsx` and `src/app/admin/page.tsx` re-check auth/profile state
4. Current user's `profiles.clinic_id` resolves the tenant context
5. Leads are queried server-side and passed to `LeadTableClient`
6. Status changes go through a server action that re-validates tenant ownership before update

**Onboarding Script Execution:**

1. Operator runs `npm run onboard -- --slug=... --name=...`
2. `scripts/onboard-new-clinic.ts` loads `.env.local`
3. Script authenticates with service role credentials
4. Script calls `onboard_new_clinic` RPC
5. Database function clones clinic-level data from template clinic

**State Management:**
- UI state: React `useState`, `useTransition`, `useOptimistic`, and context in `src/context/BookingContext.tsx`
- Server state: fetched per request via Supabase
- Cached state: tenant config cached with `unstable_cache`
- Auth state: cookie-based Supabase sessions

## Key Abstractions

**Tenant Slug / Clinic Identity:**
- Purpose: Core partition key for public-site routing and clinic-specific content
- Examples: `x-tenant-slug` header, `profiles.clinic_id`, `clinics.slug`
- Pattern: Request-scoped tenant resolution plus DB-enforced separation

**SiteConfig:**
- Purpose: Unified presentation model for public tenant pages
- Examples: `src/config/site.ts`, `src/lib/tenant.ts`
- Pattern: Fallback config merged with DB-derived clinic data

**Supabase Client Factories:**
- Purpose: Centralize server/browser connection setup
- Examples: `createServerClient()`, `createBrowserClient()`, `supabaseAnon`
- Pattern: per-request server client + singleton browser/anon clients

**RPC Boundary:**
- Purpose: Push public data access and mutation through explicit Postgres functions
- Examples: `get_clinic_public_data`, `insert_public_lead`, `onboard_new_clinic`
- Pattern: security-definer functions instead of broad direct table access

## Entry Points

**Request Proxy:**
- Location: `src/proxy.ts`
- Triggers: Every non-static request matched by Next config
- Responsibilities: tenant detection, auth gate for admin routes, header mutation

**Public App Routes:**
- Location: `src/app/(tenant)/layout.tsx`, `src/app/(tenant)/page.tsx`
- Triggers: Public site requests
- Responsibilities: metadata, JSON-LD, tenant rendering, booking modal wiring

**Admin Route:**
- Location: `src/app/admin/page.tsx`
- Triggers: Authenticated CRM access
- Responsibilities: profile lookup, clinic resolution, leads management

**Operational CLI:**
- Location: `scripts/onboard-new-clinic.ts`
- Triggers: Manual CLI invocation
- Responsibilities: platform-level clinic provisioning

## Error Handling

**Strategy:** Fail at route boundaries using `redirect()` / `notFound()` for navigation errors and return structured `{ success, error }` payloads from server actions

**Patterns:**
- Auth failures in routes redirect or 404
- Data-write failures in server actions return an error object instead of throwing to UI
- Client-side submission failures are logged to console and stop success flow
- SQL functions raise exceptions for missing clinics or unauthorized access

## Cross-Cutting Concerns

**Logging:**
- Minimal console-based logging only

**Validation:**
- Zod validation on booking form inputs
- Supabase and SQL constraints/policies for data correctness and tenant isolation

**Authentication:**
- Admin area uses Supabase Auth sessions
- Public lead creation stays anonymous via RPC

**Caching:**
- Tenant site config cached with `unstable_cache`

---

*Architecture analysis: 2026-03-20*
*Update when major patterns change*
