# Testing Patterns

**Analysis Date:** 2026-03-20

## Test Framework

**Runner:**
- None configured in the current repository
- No Jest, Vitest, Playwright, Cypress, or other test-runner config files were found

**Assertion Library:**
- None configured

**Run Commands:**
```bash
npm run lint          # Current static lint pass
npx tsc --noEmit      # Current ad-hoc type check
```

## Test File Organization

**Location:**
- No `*.test.*`, `*.spec.*`, `__tests__/`, `tests/`, or `e2e/` directories were found in application source

**Naming:**
- No naming convention exists yet because there are no automated tests checked into the repo

**Structure:**
```text
No automated test tree present.
Verification currently relies on manual inspection plus static tooling.
```

## Test Structure

**Suite Organization:**
- Not established yet

**Patterns:**
- Linting is the only standardized quality gate exposed via `package.json`
- Type checking is possible via TypeScript CLI but is not defined as an npm script
- Manual browser testing is implied for public site, admin UI, and onboarding flows

## Mocking

**Framework:**
- No mocking framework configured

**Patterns:**
- No reusable factories, stubs, or test utilities observed

**What to Mock (recommended future direction):**
- Supabase browser/server clients
- RPC responses for tenant/public data
- Next.js headers/cookies in route and layout tests

## Fixtures and Factories

**Test Data:**
- No dedicated fixtures/factories exist yet
- Closest equivalent is demo content in `src/constants/data.ts` and SQL seed files under `supabase/`

**Location:**
- If tests are introduced, colocated tests near source or a dedicated `tests/` tree would both fit the current project scale

## Coverage

**Requirements:**
- No coverage target or enforcement observed

**Configuration:**
- No coverage tooling configured

**View Coverage:**
```bash
Not available yet.
```

## Test Types

**Unit Tests:**
- Not implemented

**Integration Tests:**
- Not implemented

**E2E Tests:**
- Not implemented

## Common Patterns

**Current Verification Reality:**
- Static linting through ESLint
- Manual TypeScript checks
- Manual browser validation of tenant site, login flow, and admin UI
- Manual SQL review / database-side verification of migrations and RPCs

**High-Priority Gaps to Address Later:**
- Tenant routing and custom-domain resolution
- Lead submission RPC path
- Admin auth/profile resolution
- Cross-tenant isolation and status update flows
- Migration safety / Supabase schema verification

---

*Testing analysis: 2026-03-20*
*Update when test patterns change*
