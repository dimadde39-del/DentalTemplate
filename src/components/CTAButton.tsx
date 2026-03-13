"use client";

import { motion } from "framer-motion";
import { useBooking } from "@/context/BookingContext";

export function CTAButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const { openBooking } = useBooking();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      openBooking();
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
