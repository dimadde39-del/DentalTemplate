"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Lead = {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  service: string;
  status: string;
};

const STATUS_OPTIONS = ["New", "Processed", "Canceled", "Spam"];

export default function AdminPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error("Error fetching leads:", error);
      alert("Failed to load leads.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      // Optimistically update the UI
      setLeads((prev) =>
        prev.map((lead) => (lead.id === id ? { ...lead, status: newStatus } : lead))
      );

      const { error } = await supabase
        .from("leads")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status. Reverting change.");
      // Revert on error by refetching
      fetchLeads();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-5 flex justify-between items-center border-b border-gray-100 bg-gray-50/50">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Lead Management
          </h3>
          <p className="text-sm text-gray-500 mt-1">Review and update incoming patient inquiries.</p>
        </div>
        <button 
          onClick={fetchLeads}
          disabled={loading}
          className="text-sm bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-lg shadow-sm transition-all disabled:opacity-50 flex items-center gap-2 font-medium"
        >
          {loading ? (
             <svg className="animate-spin h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          )}
          Refresh
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                Phone
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                Service
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {loading && leads.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex justify-center items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Loading leads...</span>
                  </div>
                </td>
              </tr>
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                    <p className="text-base font-medium text-gray-900">No leads yet</p>
                    <p className="text-sm mt-1">When someone submits the form, it will show up here.</p>
                  </div>
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(lead.created_at).toLocaleDateString(undefined, {
                      month: 'short', day: 'numeric', year: 'numeric'
                    })}
                    <div className="text-xs text-gray-400 mt-0.5">
                      {new Date(lead.created_at).toLocaleTimeString(undefined, {
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a href={`tel:${lead.phone}`} className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
                      {lead.phone}
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {lead.service}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-48">
                    <div className="relative">
                      <select
                        value={lead.status || "New"}
                        onChange={(e) => updateStatus(lead.id, e.target.value)}
                        className={`block w-full appearance-none pl-3 pr-8 py-1.5 text-sm font-medium rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors cursor-pointer
                          ${
                            lead.status === "New" ? "bg-blue-50/50 text-blue-700 border-blue-200 focus:ring-blue-500 hover:bg-blue-50" :
                            lead.status === "Processed" ? "bg-green-50/50 text-green-700 border-green-200 focus:ring-green-500 hover:bg-green-50" :
                            lead.status === "Canceled" ? "bg-gray-50 border-gray-300 text-gray-600 focus:ring-gray-500 hover:bg-gray-100" :
                            lead.status === "Spam" ? "bg-red-50/50 text-red-700 border-red-200 focus:ring-red-500 hover:bg-red-50" :
                            "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
