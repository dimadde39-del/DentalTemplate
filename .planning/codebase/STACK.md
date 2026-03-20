# Technology Stack

**Analysis Date:** 2026-03-20

## Languages

**Primary:**
- TypeScript 5.x - All application code in `src/` and `scripts/`

**Secondary:**
- SQL (PostgreSQL / PLpgSQL) - Schema, RLS policies, RPCs, and seed data in `supabase/` and root SQL files
- CSS - Global styling in `src/app/globals.css`

## Runtime

**Environment:**
- Node.js 20.x recommended - Required by `next@16`, React 19 tooling, and `tsx`-based scripts
- Browser runtime - Client components under `src/components/` and `src/app/login/page.tsx`

**Package Manager:**
- npm - Lockfile present in `package-lock.json`

## Frameworks

**Core:**
- Next.js 16.1.6 - App Router application, metadata routes, and request proxying
- React 19.2.3 - Server and client UI components
- Supabase - Auth, Postgres, RPC, and SSR/browser clients

**Testing:**
- No automated test framework configured in the repository at the moment

**Build/Dev:**
- TypeScript 5.x - Static typing via `tsconfig.json`
- ESLint 9 - Linting via `eslint.config.mjs`
- Tailwind CSS 4 - Utility-first styling via `src/app/globals.css` and `@tailwindcss/postcss`
- `tsx` - Runs operational scripts like `scripts/onboard-new-clinic.ts`

## Key Dependencies

**Critical:**
- `next` 16.1.6 - Full-stack app framework
- `react` / `react-dom` 19.2.3 - UI runtime
- `@supabase/ssr` 0.9.0 - SSR auth/session integration for Next.js
- `@supabase/supabase-js` 2.99.1 - Browser, server, and script-side Supabase access
- `react-hook-form` 7.71.2 + `zod` 4.3.6 + `@hookform/resolvers` 5.2.2 - Form state and validation in lead capture UI

**Infrastructure:**
- `framer-motion` 12.36.0 - Animation and motion effects
- `lucide-react` 0.577.0 - Icon system
- `yargs` 18.0.0 - CLI parsing in onboarding script

## Configuration

**Environment:**
- Runtime configuration is environment-variable driven via `.env.local` / `.env.example`
- Core variables observed: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_PLATFORM_DOMAIN`
- Additional URL-related variables are referenced in code: `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_BASE_URL`

**Build:**
- `package.json` - Scripts and dependency graph
- `tsconfig.json` - TypeScript settings and path alias `@/* -> ./src/*`
- `next.config.ts` - Remote image allowlist
- `eslint.config.mjs` - Lint rules
- `postcss.config.mjs` - Tailwind/PostCSS setup

## Platform Requirements

**Development:**
- Cross-platform Node.js development environment
- Local access to a Supabase project or equivalent credentials
- No Docker setup or local database orchestration is defined in-repo

**Production:**
- Intended hosting pattern appears to be Vercel + Supabase
- Multi-tenant routing expects wildcard subdomains and optional custom domains

---

*Stack analysis: 2026-03-20*
*Update after major dependency changes*
