"use client";

import { motion } from "framer-motion";

export function FloatingBlobs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-1/4 -left-20 w-96 h-96 bg-[var(--color-primary)]/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, -100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute bottom-1/4 -right-20 w-[30rem] h-[30rem] bg-indigo-500/10 rounded-full blur-3xl"
      />
    </div>
  );
}
