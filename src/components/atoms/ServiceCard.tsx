"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

interface ServiceCardProps {
  title: string;
  description?: string | null;
  price?: string | null;
  icon?: React.ReactNode;
  delay?: number;
}

export function ServiceCard({
  title,
  description,
  price,
  icon,
  delay = 0,
}: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
      className="group relative flex flex-col justify-between p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-8 opacity-5 transform translate-x-1/4 -translate-y-1/4 group-hover:scale-110 transition-transform duration-500">
        {icon}
      </div>

      <div>
        <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center mb-6 group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors duration-300">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
          {title}
        </h3>
        {description && (
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
            {description}
          </p>
        )}
        {price && (
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)] mb-6">
            {price}
          </p>
        )}
      </div>

      <div className="flex items-center text-[var(--color-primary)] font-semibold text-sm group-hover:translate-x-2 transition-transform duration-300">
        Learn more <ChevronRight className="w-4 h-4 ml-1" />
      </div>
    </motion.div>
  );
}
