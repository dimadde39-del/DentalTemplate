"use client";

import { motion } from "framer-motion";

export function CTAButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      const bookingSection = document.getElementById("booking");
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className="bg-[var(--color-primary)] text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-shadow"
    >
      {children}
    </motion.button>
  );
}
