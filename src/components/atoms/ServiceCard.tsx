"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface ServiceCardProps {
  title: string;
  index: number;
}

export function ServiceCard({ title, index }: ServiceCardProps) {
  // Variations to make the sleek bento box look more dynamic
  const isLarge = index === 0 || index === 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-[2rem] bg-foreground/[0.02] border border-foreground/[0.08] p-8 transition-all hover:bg-foreground/[0.04] hover:shadow-[0_8px_40px_rgb(0,0,0,0.06)] ${
        isLarge ? "md:col-span-2 lg:col-span-2" : "col-span-1"
      }`}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 opacity-0 transition-opacity group-hover:opacity-100" />
      
      <div className="mb-4">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-background shadow-sm border border-foreground/5 mb-6 group-hover:scale-110 transition-transform duration-500 text-primary">
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        </div>
        <h3 className="text-2xl font-bold tracking-tight text-foreground transition-colors">
          {title}
        </h3>
        <p className="mt-3 text-foreground/60 leading-relaxed line-clamp-2 md:line-clamp-3">
          Experience state-of-the-art {title.toLowerCase()} tailored exactly to your unique dental profile, utilizing advanced diagnostic imaging and precision clinical techniques.
        </p>
      </div>

      <div className="mt-8 flex items-center text-sm font-semibold text-primary/80 group-hover:text-primary transition-colors">
        <span>Learn more about this treatment</span>
        <ArrowUpRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
      </div>
    </motion.div>
  );
}
