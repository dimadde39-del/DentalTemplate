# CLAUDE.md

Read this fully. Then read `ARCHITECTURE.md` before touching any data layer code.

---

## What this is

Multi-tenant white-label SaaS for dental clinics in Kazakhstan.
One codebase → unlimited clinics. Each clinic: own slug, custom domain, isolated data, own brand colors.

**Patients book by phone or WhatsApp. Payment at reception. That's it.**
No online payment. No AI features. No medical records storage. No email marketing.
These are permanent decisions, not missing features. Do not add them. Do not suggest them.

---

## Output format — always follow this

**For any code task:**
1. One-line summary of what you're changing and why
2. List of files you will touch (if more than 3 — stop and ask if that's really necessary)
3. File-by-file changes with diffs
4. Migration note if Supabase schema changed

**For vague tasks ("make it better", "redesign this"):**
1. Ask one clarifying question
2. Write a 3-step plan
3. Wait for confirmation, then implement

Never mix plan and code in one blob. Never refactor things not mentioned in the task.

---

## The one rule that overrides everything

**Smallest possible change that solves the problem.**

Changing 5 files to fix something in 1 file = you're doing it wrong.
Refactoring a working module because it "could be cleaner" = stop.
Adding a dependency for something that takes 10 lines = stop.

---

## Design system

Aesthetic: Dark Tech-Medical. Tesla.com meets a premium Seoul clinic.
Cold, precise, technological. A patient opens this and thinks "these people know what they're doing."

**Tokens live in `globals.css` — the only place hex values are allowed.**
In every component, every style, every inline — use `var()` only, never hex.
Why: `TenantThemeProvider` overrides these vars per clinic from Supabase.
One hardcoded color in a component breaks branding for every clinic on the platform.

```css
/* globals.css — edit here, nowhere else */
--bg:      /* near-black page background */
--bg2:     /* surfaces */
--bg3:     /* cards */
--accent:  /* primary CTA — overridden per tenant */
--accent2: /* secondary highlight — overridden per tenant */
--text:    /* primary text */
--muted:   /* secondary text */
--line:    /* border color */
```

Typography: `Syne` (headings, 600/700) + `Inter` (body). Load via `next/font/google` only.
Animations: Framer Motion. `transform` and `opacity` only — never animate layout properties.
Components: `shadcn/ui` + Radix primitives + `lucide-react`. No other UI libraries.

---

## Security — non-negotiable

**Never do this:**
```typescript
supabase.from('leads').select('*')
```
**Always do this:**
```typescript
supabase.from('leads').select('*').eq('clinic_id', clinicId)
```

RLS is the last line of defense. Explicit `clinic_id` filter is the first.
Business logic = RPC functions. Never multi-step mutations from the client.
Never expose `service_role` key outside server-side code.
All inputs validated with Zod before hitting any Server Action or RPC.

---

## Hard no's

- `unstable_cache` in production — the name means what it says
- `useEffect` + `fetch` for initial data — fetch on server, pass as props
- `'use client'` unless you actually need state, browser APIs, or animations
- New UI libraries for a single component
- Inserting into `clinics` table by hand

---

## Onboarding new clinics

One way only:
```bash
npm run onboard -- --slug=new-clinic --name="Clinic Name"
```
Atomic transaction with rollback. If you break this script, you break the platform.

---

When something is unclear — read `ARCHITECTURE.md` first, then ask.
