"use client";

import { motion } from "framer-motion";
import { FADE_VARIANTS } from "@/lib/fadeVariants";
import { StatusToggle, type LeadStatus } from "@/components/StatusToggle";

interface Lead {
  id: string;
  name: string;
  phone: string;
  selected_service: string;
  status: string;
  created_at: string;
}

interface Props {
  readonly leads: Lead[];
  readonly onStatusChange: (leadId: string, newStatus: LeadStatus) => Promise<{ success: boolean; error?: string }>;
}

export function LeadTableClient({ leads, onStatusChange }: Props) {
  return (
    <motion.div
      variants={FADE_VARIANTS}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden"
    >
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
            {!leads || leads.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">
                  No leads found for this clinic.
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
                      onStatusChange={onStatusChange} 
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
