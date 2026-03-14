import { supabase } from "@/lib/supabase";
import { siteConfig } from "@/config/site";
import type { LeadStatus } from "@/components/StatusToggle";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { Suspense } from "react";
import LeadSkeleton from "@/components/LeadSkeleton";
import { LeadTableClient } from "@/components/LeadTableClient";

// Ensure the page is dynamically rendered to access headers
export const dynamic = "force-dynamic";

// Server action
async function updateLeadStatus(leadId: string, newStatus: LeadStatus) {
  "use server";
  
  const { error } = await supabase
    .from("leads")
    .update({ status: newStatus })
    .eq("id", leadId);
    
  if (error) {
    return { success: false, error: error.message };
  }
  
  revalidatePath("/admin");
  return { success: true };
}

async function LeadsData({ tenantId }: { tenantId: string }) {
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
  const headersList = await headers();
  const host = headersList.get("host") || "";
  const tenantId = "tenant-slug";

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            {siteConfig.clinicName} CRM
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
