"use client";

import { useState } from "react";
import { useScroll, useMotionValueEvent, useTransform, motion } from "framer-motion";
import { siteConfig } from "@/config/site";

interface HeaderProps {
  readonly openModal: () => void;
}

export function Header({ openModal }: HeaderProps) {
  const { scrollY } = useScroll();
  const height = useTransform(scrollY, [0, 20], ["80px", "64px"]);
  const logoScale = useTransform(scrollY, [0, 20], [1, 0.9]);
  
  const [isScrolled, setIsScrolled] = useState(false);

  // Zero-thrashing logic: triggers React state re-render ONLY when crossing the 20px threshold
  useMotionValueEvent(scrollY, "change", (latest) => {
    const thresholdPassed = latest > 20;
    if (thresholdPassed !== isScrolled) {
      setIsScrolled(thresholdPassed);
    }
  });

  return (
    <motion.header
      style={{ height }}
      className={`fixed top-0 left-0 right-0 z-50 flex items-center transition-colors duration-300 ${
        isScrolled
          ? "bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md shadow-sm border-b border-zinc-200 dark:border-zinc-800"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between h-full">
        <motion.div style={{ scale: logoScale }} className="origin-left">
          <span className="text-2xl font-extrabold tracking-tight text-foreground">
            {siteConfig.clinicName}
          </span>
        </motion.div>

        <button
          onClick={openModal}
          className="bg-[var(--color-primary)] text-white px-6 py-2.5 rounded-full font-bold text-sm shadow hover:shadow-md transition-all active:scale-[0.98]"
        >
          Book Now
        </button>
      </div>
    </motion.header>
  );
}
