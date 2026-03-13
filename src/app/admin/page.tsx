import { supabase } from "@/lib/supabase";
import { siteConfig } from "@/config/site";
import { StatusToggle, type LeadStatus } from "@/components/StatusToggle";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

interface Lead {
  id: string;
  clinic_id: string;
  name: string;
  phone: string;
  selected_service: string;
  status: string;
  created_at: string;
}

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

export default async function AdminPage() {
  const headersList = await headers();
  // Using explicit tenant_id check. In production, this would be computed from hostname/auth.
  const host = headersList.get("host") || "";
  const tenantId = "tenant-slug"; // Stub for multi-tenant routing

  // NOTE: For a real production app with RLS enabled and anon access blocked,
  // we would use a service role key here to read leads, OR authenticate the admin.
  // We'll proceed with standard selection logic as scoped for this step.
  const { data: leads, error } = await supabase
    .from("leads")
    .select("*")
    .eq("clinic_id", tenantId)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            {siteConfig.clinicName} CRM
          </h1>
          <p className="text-zinc-500 mt-2">Manage your patient leads and appointment requests.</p>
        </header>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
                  <th className="px-6 py-4 font-semibold text-sm text-zinc-600 dark:text-zinc-400">Patient Name</th>
                  <th className="px-6 py-4 font-semibold text-sm text-zinc-600 dark:text-zinc-400">Phone</th>
                  <th className="px-6 py-4 font-semibold text-sm text-zinc-600 dark:text-zinc-400">Service</th>
                  <th className="px-6 py-4 font-semibold text-sm text-zinc-600 dark:text-zinc-400">Date</th>
                  <th className="px-6 py-4 font-semibold text-sm text-zinc-600 dark:text-zinc-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {error ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-red-500">
                      Error loading leads: {error.message}
                    </td>
                  </tr>
                ) : !leads || leads.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">
                      No leads found for tenant {tenantId}.
                    </td>
                  </tr>
                ) : (
                  leads.map((lead: Lead) => (
                    <tr key={lead.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                      <td className="px-6 py-4 text-zinc-900 dark:text-zinc-100 font-medium">
                        {lead.name}
                      </td>
                      <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                        {lead.phone}
                      </td>
                      <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                        {lead.selected_service}
                      </td>
                      <td className="px-6 py-4 text-zinc-500 text-sm">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <StatusToggle 
                          leadId={lead.id} 
                          initialStatus={lead.status as LeadStatus} 
                          onStatusChange={updateLeadStatus} 
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
