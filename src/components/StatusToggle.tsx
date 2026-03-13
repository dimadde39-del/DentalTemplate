"use client";

import { useOptimistic, useTransition, useState } from "react";

export type LeadStatus = "New" | "Processed" | "Canceled";

interface Props {
  leadId: string;
  initialStatus: LeadStatus;
  onStatusChange: (leadId: string, newStatus: LeadStatus) => Promise<{ success: boolean; error?: string }>;
}

export function StatusToggle({ leadId, initialStatus, onStatusChange }: Props) {
  const [isPending, startTransition] = useTransition();
  const [optimisticStatus, addOptimisticStatus] = useOptimistic(
    initialStatus,
    (_state: LeadStatus, newStatus: LeadStatus) => newStatus
  );
  
  const [error, setError] = useState<string | null>(null);

  const statuses: LeadStatus[] = ["New", "Processed", "Canceled"];

  const handleUpdate = async (newStatus: LeadStatus) => {
    if (newStatus === optimisticStatus) return;
    setError(null);
    
    startTransition(async () => {
      addOptimisticStatus(newStatus);
      const result = await onStatusChange(leadId, newStatus);
      if (!result.success) {
        setError(result.error || "Failed to update status");
      }
    });
  };

  return (
    <div className="flex flex-col gap-1">
      <select
        value={optimisticStatus}
        onChange={(e) => handleUpdate(e.target.value as LeadStatus)}
        disabled={isPending}
        className={`px-3 py-1.5 rounded-lg border text-sm font-medium outline-none transition-colors
          ${optimisticStatus === "New" ? "bg-blue-50 text-blue-700 border-blue-200" : ""}
          ${optimisticStatus === "Processed" ? "bg-green-50 text-green-700 border-green-200" : ""}
          ${optimisticStatus === "Canceled" ? "bg-red-50 text-red-700 border-red-200" : ""}
          disabled:opacity-50 cursor-pointer w-32
        `}
      >
        {statuses.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
