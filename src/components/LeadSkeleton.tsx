"use client";

import { motion } from "framer-motion";
import { FADE_VARIANTS } from "@/lib/fadeVariants";

export default function LeadSkeleton() {
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
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="animate-pulse">
                <td className="px-6 py-4">
                  <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-32"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-28"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-36"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-24"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-32 mt-[-4px]"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
