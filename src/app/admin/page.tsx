import type { LeadStatus } from "@/components/StatusToggle";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { getSiteConfig } from "@/lib/tenant";
import { assertTenantOwnership, getCurrentClinicId } from "@/lib/assertTenantOwnership";
import { createServerClient } from "@/lib/supabase-server";
import { Suspense } from "react";
import LeadSkeleton from "@/components/LeadSkeleton";
import { LeadTableClient } from "@/components/LeadTableClient";

// Ensure the page is dynamically rendered to access headers
export const dynamic = "force-dynamic";


// Server action
async function updateLeadStatus(leadId: string, newStatus: LeadStatus) {
  "use server";
  const supabase = await createServerClient();

  // Resolve clinic from authenticated user's profile
  const clinicId = await getCurrentClinicId();

  // Application-layer tenant guard (defense-in-depth on top of RLS)
  await assertTenantOwnership("leads", leadId, clinicId);

  const { error } = await supabase
    .from("leads")
    .update({ status: newStatus })
    .eq("id", leadId)
    .eq("clinic_id", clinicId);
    
  if (error) {
    return { success: false, error: error.message };
  }
  
  revalidatePath("/admin");
  return { success: true };
}

async function LeadsData({ tenantId }: { tenantId: string }) {
  const supabase = await createServerClient();
  const { data: leads, error } = await supabase
    .from("leads")
    .select("*")
    .eq("clinic_id", tenantId)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-8 text-center text-red-500">
        Error loading leads: {error.message}
      </div>
    );
  }

  return <LeadTableClient leads={leads || []} tenantId={tenantId} onStatusChange={updateLeadStatus} />;
}

export default async function AdminPage() {
  const supabase = await createServerClient();

  // Resolve clinic from authenticated user's profile (not from headers)
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) notFound();

  const { data: profile } = await supabase
    .from('profiles')
    .select('clinic_id')
    .eq('user_id', user.id)
    .single();

  if (!profile?.clinic_id) notFound();

  const tenantId = profile.clinic_id;

  const { data: clinic } = await supabase
    .from('clinics')
    .select('slug, name')
    .eq('id', tenantId)
    .single();

  if (!clinic) notFound();

  const config = await getSiteConfig(clinic.slug);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            {config.clinicName} CRM
          </h1>
          <p className="text-zinc-500 mt-2">Manage your patient leads and appointment requests.</p>
        </header>

        <Suspense fallback={<LeadSkeleton />}>
          <LeadsData tenantId={tenantId} />
        </Suspense>
      </div>
    </div>
  );
}
