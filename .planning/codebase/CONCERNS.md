# Codebase Concerns

**Analysis Date:** 2026-03-20

## Tech Debt

**White-label rendering is only partially dynamic:**
- Issue: The app fetches clinic-specific `services`, `doctors`, and `reviews`, but public UI still relies on fallback arrays and hardcoded review content
- Files: `src/lib/tenant.ts`, `src/components/Services.tsx`, `src/components/Testimonials.tsx`, `src/constants/data.ts`
- Why: The data layer was expanded faster than the public experience
- Impact: Product promise ("white-label platform") is stronger than the actual customization depth
- Fix approach: Render DB-backed clinic content end-to-end and add admin controls for editing it

**Database bootstrap sources are split:**
- Issue: There are two root SQL bootstrap files (`supabase_init.sql`, `supabase_multi_tenant.sql`) plus migrations in `supabase/migrations/`
- Files: `supabase_init.sql`, `supabase_multi_tenant.sql`, `supabase/migrations/*.sql`
- Why: Evolution from early stub setup toward fuller multi-tenant schema
- Impact: Higher chance of environment drift or onboarding confusion
- Fix approach: Define one canonical bootstrap path and relegate the others to archived/reference status

## Known Bugs

**Custom domains appear incomplete in request routing:**
- Symptoms: README/env imply custom-domain support, but request proxy only derives tenant slug from subdomain or `/clinic/{slug}`
- Trigger: Accessing the app via a bare custom domain such as `clinic-domain.com`
- Files: `src/proxy.ts`, `README.md`, `.env.example`
- Workaround: Use `/clinic/{slug}` path or platform subdomain
- Root cause: No observed lookup path from `host` to `clinics.domain`

**Onboarding does not appear to create an admin profile for the new clinic:**
- Symptoms: New clinic can be created, but admin access still depends on an existing `profiles.clinic_id` record
- Trigger: Running `scripts/onboard-new-clinic.ts` for a brand-new clinic
- Files: `scripts/onboard-new-clinic.ts`, `src/app/admin/page.tsx`, `supabase/migrations/0002_platform_admin_guard.sql`, `supabase_multi_tenant.sql`
- Workaround: Manual DB/profile setup after onboarding
- Root cause: RPC clones clinic data but does not provision clinic-admin identity

**Demo doctor image paths are inconsistent:**
- Symptoms: Seed data references `.jpg` doctor paths while `public/doctors/` contains `.png.png` filenames
- Trigger: Rendering seeded doctor records if doctor UI is later enabled
- Files: `supabase/seed_global_dent.sql`, `public/doctors/*`
- Workaround: Manual data or asset-path correction
- Root cause: Asset set and seed references drifted out of sync

## Security Considerations

**Public lead form is anonymous and lightly protected:**
- Risk: Spam or abusive submissions to `insert_public_lead`
- Files: `src/components/BookingModal.tsx`, `supabase_multi_tenant.sql`
- Current mitigation: RPC indirection instead of direct table access
- Recommendations: Add rate limiting, bot mitigation/captcha, and consent/privacy handling

**Tenant isolation relies on both DB and app logic:**
- Risk: Future changes could bypass one layer if maintainers do not understand the dual model
- Files: `src/lib/assertTenantOwnership.ts`, `src/app/admin/page.tsx`, `supabase/migrations/0001_rls_hardening.sql`
- Current mitigation: RLS plus app-layer ownership checks
- Recommendations: Add automated tests for cross-tenant boundaries and document required invariants

## Performance Bottlenecks

**No measured performance baseline exists:**
- Problem: The repo contains caching and animation work, but no p95 timings, load metrics, or Lighthouse history
- Measurement: None recorded
- Cause: Performance has not been instrumented yet
- Improvement path: Add profiling/benchmarks before optimizing tenant RPC and landing-page rendering

## Fragile Areas

**Tenant routing and metadata coupling:**
- Why fragile: Tenant identity is shared across proxy headers, layout metadata generation, and RPC lookups
- Common failures: Wrong tenant site, metadata drift, 404s for certain hostnames, invalid sitemap/robots URLs
- Safe modification: Change `src/proxy.ts`, `src/app/(tenant)/layout.tsx`, `src/app/sitemap.ts`, and `src/app/robots.ts` together
- Test coverage: No automated coverage observed

**Supabase schema/security rules:**
- Why fragile: Critical behavior depends on SQL migrations and security-definer functions rather than only TypeScript code
- Common failures: Environment drift, RLS policy gaps, RPC mismatch with frontend assumptions
- Safe modification: Treat SQL migrations as first-class app code and verify in a disposable Supabase environment
- Test coverage: No migration or RLS tests observed

## Scaling Limits

**Operational scale is currently unvalidated:**
- Current capacity: Unknown
- Limit: Not benchmarked for concurrent tenants, lead volume, or admin usage
- Symptoms at limit: Unknown; likely to surface first in Supabase query latency and host-level cold-start behavior
- Scaling path: Add observability, query profiling, and environment-specific load testing before commercial rollout

## Dependencies at Risk

**Lint/type discipline is not currently green:**
- Risk: Changes can regress unnoticed because the baseline already contains failures
- Impact: Harder to trust automation or incremental refactors
- Migration plan: Make lint/type/build fully green, then protect with CI

## Missing Critical Features

**No full admin content management layer:**
- Problem: Admin area mainly handles leads, not the white-label content model that the platform concept implies
- Current workaround: Developers edit code or seed data directly
- Blocks: True self-serve clinic customization
- Implementation complexity: Medium

**No automated tests:**
- Problem: Multitenancy, auth, and DB policy behavior are unverified in automation
- Current workaround: Manual validation
- Blocks: Confident releases and safer refactors
- Implementation complexity: Medium

## Test Coverage Gaps

**Tenant routing and host resolution:**
- What's not tested: subdomain routing, path fallback, and custom-domain behavior
- Risk: Tenants can route incorrectly or fail in production
- Priority: High
- Difficulty to test: Medium

**Operational onboarding flow:**
- What's not tested: `onboard_new_clinic` end-to-end from CLI into working admin access
- Risk: New tenants may be provisioned incompletely
- Priority: High
- Difficulty to test: Medium

**Admin auth and profile resolution:**
- What's not tested: interaction between Supabase auth state and `profiles.clinic_id`
- Risk: Admin access can break or silently 404
- Priority: High
- Difficulty to test: Medium

---

*Concerns audit: 2026-03-20*
*Update as issues are fixed or new ones discovered*
