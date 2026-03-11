"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Calendar } from "lucide-react";
import { siteConfig } from "@/config/site";
import { useBooking } from "@/context/BookingContext";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { openModal } = useBooking();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-foreground/5 bg-white/70 backdrop-blur-md">
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        {/* Logo / Clinic Name */}
        <div className="flex items-center gap-2 font-bold text-xl tracking-tighter text-foreground">
          <span className="text-primary">{siteConfig.clinicName}</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <button
            onClick={openModal}
            className="group inline-flex h-10 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-white shadow-md shadow-primary/25 transition-all hover:scale-105 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <Calendar className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
            Book Now
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 text-foreground/70 hover:text-foreground outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-background/95 backdrop-blur-xl border-b border-foreground/5"
          >
            <div className="flex flex-col px-4 py-6 space-y-4">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openModal();
                }}
                className="inline-flex h-12 w-full items-center justify-center rounded-full bg-primary px-6 text-base font-semibold text-white shadow-md transition-all active:scale-95"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Book Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
