import type { LeadStatus } from "@/components/StatusToggle";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { getSiteConfig } from "@/lib/tenant";
import { assertTenantOwnership, getCurrentClinicId } from "@/lib/assertTenantOwnership";
import { createServerClient } from "@/lib/supabase-server";
import { Suspense } from "react";
import LeadSkeleton from "@/components/LeadSkeleton";
import { LeadTableClient } from "@/components/LeadTableClient";

// Ensure the page is dynamically rendered to access headers
export const dynamic = "force-dynamic";

type ClinicRow = {
  id: string;
  slug: string;
  name: string;
};

type ProfileRow = {
  clinic_id: string | null;
};

async function getClinicById(id: string): Promise<ClinicRow | null> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("clinics")
    .select("id, slug, name")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Failed to resolve clinic by id:", error.message);
    return null;
  }

  return (data as ClinicRow | null) ?? null;
}

async function getClinicBySlug(slug: string): Promise<ClinicRow | null> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("clinics")
    .select("id, slug, name")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Failed to resolve clinic by slug:", error.message);
    return null;
  }

  return (data as ClinicRow | null) ?? null;
}

async function getAuthenticatedProfile(): Promise<ProfileRow | null> {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("clinic_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Failed to load admin profile:", error.message);
    return null;
  }

  return (data as ProfileRow | null) ?? null;
}

// Server action
async function updateLeadStatusForClinic(
  clinicId: string,
  slug: string,
  leadId: string,
  newStatus: LeadStatus
) {
  "use server";
  const supabase = await createServerClient();

  let currentClinicId: string;
  try {
    currentClinicId = await getCurrentClinicId();
  } catch {
    return { success: false, error: "Unauthorized." };
  }

  if (currentClinicId !== clinicId) {
    return { success: false, error: "Cross-tenant access denied." };
  }

  // Application-layer tenant guard (defense-in-depth on top of RLS)
  try {
    await assertTenantOwnership("leads", leadId, clinicId);
  } catch {
    return { success: false, error: "Cross-tenant access denied." };
  }

  const { error } = await supabase
    .from("leads")
    .update({ status: newStatus })
    .eq("id", leadId)
    .eq("clinic_id", clinicId);
    
  if (error) {
    return { success: false, error: error.message };
  }
  
  revalidatePath(`/clinic/${slug}/admin`);
  revalidatePath("/admin");
  return { success: true };
}

async function LeadsData({
  clinicId,
  onStatusChange,
}: {
  clinicId: string;
  onStatusChange: (leadId: string, newStatus: LeadStatus) => Promise<{ success: boolean; error?: string }>;
}) {
  const supabase = await createServerClient();
  const { data: leads, error } = await supabase
    .from("leads")
    .select("*")
    .eq("clinic_id", clinicId)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-8 text-center text-red-500">
        Error loading leads: {error.message}
      </div>
    );
  }

  return <LeadTableClient leads={leads || []} onStatusChange={onStatusChange} />;
}

export default async function AdminPage() {
  const headersList = await headers();
  const requestedSlug = headersList.get("x-tenant-slug")?.trim().toLowerCase() ?? null;
  const profile = await getAuthenticatedProfile();

  if (!profile?.clinic_id) notFound();

  const profileClinic = await getClinicById(profile.clinic_id);
  if (!profileClinic) notFound();

  if (!requestedSlug) {
    redirect(`/clinic/${profileClinic.slug}/admin`);
  }

  const clinic = await getClinicBySlug(requestedSlug);
  if (!clinic) notFound();

  if (clinic.id !== profileClinic.id) {
    notFound();
  }

  const config = await getSiteConfig(clinic.slug);
  if (!config) notFound();
  const onStatusChange = updateLeadStatusForClinic.bind(null, clinic.id, clinic.slug);

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
          <LeadsData clinicId={clinic.id} onStatusChange={onStatusChange} />
        </Suspense>
      </div>
    </div>
  );
}
