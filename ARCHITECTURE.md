# ARCHITECTURE.md

Reference document. Read when working on data layer, routing, or multi-tenancy.
Not required for UI-only changes.

---

## Tenant resolution

Middleware resolves tenant in this order:
1. Custom domain → lookup in `clinics` table
2. Subdomain → `global-dent.yourplatform.com`
3. Slug path → `/clinic/global-dent`

Every server component and RPC that touches data must receive `clinic_id`.
If you add a page and forget to scope it — you create a data leak between clinics.
This is a security incident, not a bug.

---

## Data model

```
clinics
  id           uuid PK
  slug         text unique
  name         text
  custom_domain text
  theme        jsonb  ← { accent, accent2, bg, logo_url, font_family }
  created_at   timestamp

leads
  id           uuid PK
  clinic_id    uuid FK → clinics.id
  name         text
  phone        text
  service      text
  status       text  ← new | contacted | booked | closed
  created_at   timestamp

appointments
  id           uuid PK
  clinic_id    uuid FK → clinics.id
  lead_id      uuid FK → leads.id
  doctor_id    uuid FK → doctors.id
  scheduled_at timestamp
  notes        text

doctors
  id           uuid PK
  clinic_id    uuid FK → clinics.id
  name         text
  role         text
  photo_url    text
  bio          text

services
  id           uuid PK
  clinic_id    uuid FK → clinics.id
  name         text
  description  text
  price        numeric
  is_featured  boolean
```

---

## RLS patterns

Every table has RLS enabled. Pattern:

```sql
-- Read: clinic members only
create policy "clinic_read" on leads
  for select using (
    clinic_id = auth.uid()
    or exists (select 1 from clinic_members where clinic_id = leads.clinic_id and user_id = auth.uid())
  );

-- Insert: via RPC only (no direct client insert)
create policy "no_direct_insert" on leads
  for insert with check (false);
```

Business logic lives in RPC functions:
```sql
-- Example: create_lead RPC
create or replace function create_lead(
  p_clinic_id uuid,
  p_name text,
  p_phone text,
  p_service text
) returns leads as $$
  insert into leads (clinic_id, name, phone, service, status)
  values (p_clinic_id, p_name, p_phone, p_service, 'new')
  returning *;
$$ language sql security definer;
```

Call from client:
```typescript
const { data } = await supabase.rpc('create_lead', {
  p_clinic_id: clinicId,
  p_name: name,
  p_phone: phone,
  p_service: service,
})
```

---

## White-label theming

`TenantThemeProvider` loads theme from `clinics.theme` jsonb and injects CSS variables:

```typescript
// lib/tenant/TenantThemeProvider.tsx
export function TenantThemeProvider({ theme, children }: Props) {
  const style = {
    '--accent': theme.accent,
    '--accent2': theme.accent2,
    '--bg': theme.bg,
    // etc
  } as React.CSSProperties

  return <div style={style}>{children}</div>
}
```

Platform defaults live in `globals.css`.
Tenant overrides layer on top via inline style on the root wrapper.
This is why hardcoding colors anywhere breaks everything.

---

## File structure

```
src/
  app/
    clinic/[slug]/
      page.tsx          ← fetches clinic data, passes to components
      layout.tsx        ← wraps with TenantThemeProvider
    admin/              ← clinic admin panel
  components/
    ui/                 ← shadcn — never edit directly
    clinic/             ← patient-facing components
      HeroSection.tsx
      ServicesGrid.tsx
      DoctorsGrid.tsx
      ReviewsCarousel.tsx
      BookingCTA.tsx
  lib/
    supabase/
      client.ts         ← browser client
      server.ts         ← server component client
      middleware.ts     ← middleware client
    tenant/
      TenantThemeProvider.tsx
      useTenant.ts
  styles/
    globals.css         ← design tokens, base styles

scripts/
  onboard.ts            ← atomic clinic creation

supabase/
  migrations/           ← all schema changes live here
```

---

## Adding a new feature — checklist

- [ ] Does it need a new table? → Write migration in `supabase/migrations/`
- [ ] Does it touch patient data? → Use RPC, not direct insert
- [ ] Does it render per-clinic? → Scope by `clinic_id`, wrap with `TenantThemeProvider`
- [ ] Does it have user input? → Zod schema before Server Action
- [ ] Does it use colors? → `var(--accent)` not hex
- [ ] Does it load heavy JS? → `dynamic()` import
- [ ] Is it a Server Component? → Remove `'use client'` if no interactivity needed

---

## Zod + Server Actions pattern

```typescript
// Always validate before touching the database
const LeadSchema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().regex(/^\+?[0-9]{10,15}$/),
  service: z.string().min(1),
})

export async function submitLead(formData: FormData) {
  'use server'
  
  const parsed = LeadSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: parsed.error.flatten() }
  
  const clinicId = await getClinicIdFromContext()
  
  const { data, error } = await supabase.rpc('create_lead', {
    p_clinic_id: clinicId,
    ...parsed.data,
  })
  
  if (error) return { error: 'Failed to submit' }
  revalidatePath(`/clinic/${slug}`)
  return { success: true }
}
```

---

## Error handling

Every page needs an `error.tsx` boundary:
```typescript
// app/clinic/[slug]/error.tsx
'use client'
export default function Error({ error, reset }) {
  return (
    <div>
      <p>Something went wrong</p>
      <button onClick={reset}>Try again</button>
    </div>
  )
}
```

Log errors in a way that's Sentry-compatible when you add it:
```typescript
console.error('[clinic-page]', error)  // structured prefix for easy grep/filter
```
