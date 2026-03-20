# Coding Conventions

**Analysis Date:** 2026-03-20

## Naming Patterns

**Files:**
- `PascalCase.tsx` for React components in `src/components/`
- `page.tsx`, `layout.tsx`, `loading.tsx` for Next.js route primitives in `src/app/`
- Descriptive lowercase or kebab-style `.ts` files for utilities and scripts such as `tenant.ts`, `supabase-server.ts`, `onboard-new-clinic.ts`
- SQL migrations use numeric prefixes plus short snake/kebab descriptors

**Functions:**
- `camelCase` for all functions
- No special async prefix pattern; async functions keep semantic names such as `getSiteConfig`, `updateLeadStatus`, `handleLogin`
- UI handlers usually use `handle*` names (`handleSubmit`, `handleUpdate`, `handlePointerDown`)

**Variables:**
- `camelCase` for local variables and state
- `UPPER_SNAKE_CASE` for shared constant objects such as animation variants
- No underscore-private convention observed

**Types:**
- `PascalCase` for interfaces and type aliases (`SiteConfig`, `ClinicService`, `LeadStatus`)
- Inline props interfaces frequently marked `readonly`
- No enums observed; unions are preferred for constrained values

## Code Style

**Formatting:**
- Double quotes are the dominant string style in application code
- Semicolons are consistently present
- Indentation is 2 spaces
- No Prettier config observed; formatting appears editor-driven plus lint-enforced

**Linting:**
- ESLint flat config via `eslint.config.mjs`
- Run command: `npm run lint`
- Current codebase does not fully satisfy lint rules; new work should target green lint status rather than replicate the failing patterns

## Import Organization

**Order:**
1. Framework / third-party packages
2. Internal alias imports via `@/`
3. Relative imports
4. `import type` used selectively when helpful

**Grouping:**
- Most files keep imports grouped rather than interleaved with code
- Blank-line separation exists in some files but is not perfectly consistent

**Path Aliases:**
- `@/*` maps to `src/*`

## Error Handling

**Patterns:**
- Server route/layout code uses `redirect()` or `notFound()` for control-flow failures
- Library helpers throw `Error` for invariant/security failures
- Server actions often return `{ success, error? }` objects to the client
- Client components usually log submission/auth failures to console instead of rendering rich recovery states

**Error Types:**
- Generic `Error` is used rather than custom error classes
- Guard clauses are common for auth and tenant invariants
- SQL functions raise exceptions directly in the database layer

## Logging

**Framework:**
- Plain `console.log` / `console.error`

**Patterns:**
- Logging is sparse and mostly limited to operational scripts or failed client actions
- No structured logger, severity abstraction, or central logging utility observed

## Comments

**When to Comment:**
- Comments are used mainly to explain intent or security reasoning, for example tenant-guard comments and proxy notes
- The codebase generally avoids obvious line-by-line commentary

**JSDoc/TSDoc:**
- Used selectively for exported helpers such as `assertTenantOwnership.ts`
- Not required for most UI code

**TODO Comments:**
- No strong repo-wide TODO format observed

## Function Design

**Size:**
- Functions are generally short-to-medium sized
- Complex flows are often kept inside route files/components rather than fully extracted into feature services

**Parameters:**
- Props are usually passed as typed objects
- Helper functions typically take 1-3 parameters

**Return Values:**
- Early returns and guard clauses are common
- Explicit returns are preferred over implicit fallthrough

## Module Design

**Exports:**
- Default exports for Next.js pages/layouts
- Named exports for components, helpers, utilities, and shared constants

**Barrel Files:**
- Barrel files are not a major pattern in this repository
- Most imports target concrete files directly

---

*Convention analysis: 2026-03-20*
*Update when patterns change*
