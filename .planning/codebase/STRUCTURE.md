# Codebase Structure

**Analysis Date:** 2026-03-20

## Directory Layout

```text
DentalTemplate/
|- .claude/                # Local assistant/project metadata
|- .next/                  # Next.js build output and generated types
|- node_modules/           # Installed dependencies
|- public/                 # Static public assets
|  \- doctors/             # Demo doctor images
|- scripts/                # Operator-facing CLI scripts
|- src/                    # Application source code
|  |- app/                 # Next.js App Router entry points
|  |- components/          # Reusable UI building blocks
|  |- config/              # Shared config models/defaults
|  |- constants/           # Hardcoded content/constants
|  |- context/             # React context providers
|  \- lib/                 # Data access and utility modules
|- supabase/               # Migrations and seed data
|  \- migrations/          # Ordered SQL migration files
|- package.json            # Scripts and dependency manifest
|- README.md               # Project-level setup and architecture notes
|- supabase_init.sql       # Legacy bootstrap SQL
\- supabase_multi_tenant.sql # Consolidated bootstrap SQL
```

## Directory Purposes

**src/app/**
- Purpose: Route handlers, layouts, metadata routes, and page entry points
- Contains: `layout.tsx`, `robots.ts`, `sitemap.ts`, route groups `(tenant)`, `admin`, `login`
- Key files: `src/app/(tenant)/page.tsx`, `src/app/admin/page.tsx`, `src/app/login/page.tsx`
- Subdirectories: grouped by route concern rather than feature folder

**src/components/**
- Purpose: Shared presentation components
- Contains: marketing UI, admin table UI, atoms, modal flows
- Key files: `BookingModal.tsx`, `LeadTableClient.tsx`, `Hero.tsx`, `Testimonials.tsx`
- Subdirectories: `atoms/` for smaller presentational pieces

**src/lib/**
- Purpose: Shared runtime utilities for auth, data access, tenancy, and small helpers
- Contains: Supabase client factories, tenant config resolver, ownership guards
- Key files: `supabase-server.ts`, `supabase-browser.ts`, `tenant.ts`, `assertTenantOwnership.ts`
- Subdirectories: none

**scripts/**
- Purpose: Manual/operational scripts that run outside the web request lifecycle
- Contains: `onboard-new-clinic.ts`
- Key files: `scripts/onboard-new-clinic.ts`
- Subdirectories: none

**supabase/**
- Purpose: Database definition and demo-data lifecycle
- Contains: migrations and one seed script
- Key files: `supabase/migrations/0001_rls_hardening.sql`, `supabase/migrations/0006_rpc_include_clinic_config.sql`, `supabase/seed_global_dent.sql`
- Subdirectories: `migrations/` for ordered schema history

**public/**
- Purpose: Browser-served static files
- Contains: SVG defaults and doctor demo images
- Key files: `public/doctors/*`
- Subdirectories: `doctors/` only

## Key File Locations

**Entry Points:**
- `src/proxy.ts` - Request proxy / tenant resolution
- `src/app/(tenant)/page.tsx` - Public landing page
- `src/app/admin/page.tsx` - Admin CRM page
- `scripts/onboard-new-clinic.ts` - Operator onboarding script

**Configuration:**
- `package.json` - Scripts and dependencies
- `tsconfig.json` - TypeScript config and path alias
- `next.config.ts` - Remote image config
- `.env.example` - Example runtime configuration
- `eslint.config.mjs` - Lint setup

**Core Logic:**
- `src/lib/tenant.ts` - Public clinic config retrieval
- `src/lib/supabase-server.ts` - Server Supabase client
- `src/lib/assertTenantOwnership.ts` - App-layer tenant safety checks
- `supabase/migrations/*.sql` - Security model, RPCs, and schema evolution

**Testing:**
- No dedicated test directories or test files observed

**Documentation:**
- `README.md` - High-level project description and setup
- `.planning/codebase/*.md` - Generated codebase map artifacts

## Naming Conventions

**Files:**
- `PascalCase.tsx` for React components such as `BookingModal.tsx`, `LeadTableClient.tsx`
- `lowercase.ts` or mixed descriptive names for utility/modules such as `tenant.ts`, `supabase-server.ts`, `proxy.ts`
- Numbered SQL migration files: `0001_rls_hardening.sql`

**Directories:**
- Lowercase plural directories for collections such as `components/`, `scripts/`, `migrations/`
- Route-group directories use Next.js conventions such as `(tenant)`

**Special Patterns:**
- `layout.tsx`, `page.tsx`, `loading.tsx`, `robots.ts`, `sitemap.ts` follow Next.js App Router naming
- `.next/` and `tsconfig.tsbuildinfo` are generated artifacts, not source of truth

## Where to Add New Code

**New Public Feature:**
- Primary code: `src/app/(tenant)/` and `src/components/`
- Data access: `src/lib/`
- Database changes: `supabase/migrations/`

**New Admin Feature:**
- Route/page: `src/app/admin/`
- Shared UI: `src/components/`
- Server-side logic: `src/lib/` or server actions colocated in route files

**New Script / Operator Workflow:**
- Implementation: `scripts/`
- Supporting SQL: `supabase/migrations/` or explicit seed/bootstrap file

**Utilities / Shared Models:**
- Shared helpers: `src/lib/`
- Shared config/types: `src/config/`
- Hardcoded demo data: `src/constants/`

## Special Directories

**.next/**
- Purpose: Generated Next.js output and route/type artifacts
- Source: Auto-generated by dev/build runs
- Committed: No, should remain ignored

**supabase/migrations/**
- Purpose: Ordered database evolution
- Source: Manual SQL migrations
- Committed: Yes

**.planning/codebase/**
- Purpose: GSD-generated reference documentation for future planning
- Source: This mapping workflow
- Committed: Yes, per GSD workflow defaults

---

*Structure analysis: 2026-03-20*
*Update when directory structure changes*
