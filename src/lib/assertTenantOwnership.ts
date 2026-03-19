import { createServerClient } from '@/lib/supabase-server';

type TenantTable = "leads" | "services" | "doctors" | "reviews" | "settings";

/**
 * Resolves the authenticated user's clinic_id from the profiles table.
 * Throws if not authenticated or no profile found.
 */
export async function getCurrentClinicId(): Promise<string> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("unauthenticated");

  const { data: profile } = await supabase
    .from("profiles")
    .select("clinic_id")
    .eq("user_id", user.id)
    .single();

  if (!profile?.clinic_id) throw new Error("no clinic profile found");
  return profile.clinic_id;
}

/**
 * Verifies that a row in the given table belongs to the specified clinic.
 * Throws if the row does not exist or belongs to a different clinic.
 */
export async function assertTenantOwnership(
  table: TenantTable,
  rowId: string,
  clinicId: string
): Promise<void> {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from(table)
    .select("clinic_id")
    .eq("id", rowId)
    .eq("clinic_id", clinicId)
    .single();

  if (!data) {
    throw new Error(`cross-tenant access denied: ${table}/${rowId}`);
  }
}
