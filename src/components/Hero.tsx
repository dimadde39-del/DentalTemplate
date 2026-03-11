"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Star } from "lucide-react";
import { siteConfig } from "@/config/site";
import { BookingModal } from "@/components/BookingModal";

export function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };


  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background pt-20">
      {/* Abstract Background Blobs - Framer Motion */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            y: [0, -40, 0],
            x: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[10%] left-[5%] w-[400px] h-[400px] bg-primary/20 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{
            y: [0, 50, 0],
            x: [0, -20, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-[5%] right-[5%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]"
        />
      </div>

      <div className="container relative z-10 px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8">
          {/* Subtle Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm shadow-sm"
          >
            <Star className="mr-2 h-4 w-4 fill-primary/50 text-primary" />
            <span>Premium care crafted for you</span>
          </motion.div>

          {/* Main heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-foreground drop-shadow-sm">
              Exceptional Dental{" "}
              <br className="hidden md:block" />
              Care at <span className="text-primary bg-clip-text">{siteConfig.clinicName}</span>
            </h1>
            <p className="mx-auto max-w-[700px] text-foreground/70 text-lg md:text-xl leading-relaxed">
              Experience world-class dental care where advanced technology meets compassionate,
              personalized treatment tailored precisely to you and your family.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto"
          >
            <button
              onClick={() => setIsModalOpen(true)}
              className="group inline-flex h-12 md:h-14 items-center justify-center rounded-full bg-primary px-8 text-sm md:text-base font-semibold text-white shadow-xl shadow-primary/25 transition-all hover:scale-105 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <Calendar className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
              Book an Appointment
            </button>
            <button
              onClick={() => scrollToSection("services")}
              className="group inline-flex h-12 md:h-14 items-center justify-center rounded-full border border-foreground/10 bg-background/50 backdrop-blur-md px-8 text-sm md:text-base font-semibold text-foreground transition-all hover:bg-foreground/5 hover:border-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 focus-visible:ring-offset-2 hover:scale-105 shadow-sm"
            >
              Explore Services
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>

          {/* Floating feature highlights */}
          <motion.div
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.7, delay: 0.4 }}
             className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 md:pt-20 w-full max-w-3xl"
          >
             <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-background/40 backdrop-blur-xl border border-foreground/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow">
                <div className="text-3xl font-extrabold text-foreground mb-1">5.0</div>
                <div className="text-sm font-semibold text-foreground/70 flex items-center">
                    <Star className="h-4 w-4 text-amber-400 fill-amber-400 mr-1.5" />
                    Google Reviews
                </div>
             </div>
             <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-background/40 backdrop-blur-xl border border-foreground/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow">
                <div className="text-3xl font-extrabold text-foreground mb-1">Top 1%</div>
                <div className="text-sm font-semibold text-foreground/70">Regional Providers</div>
             </div>
             <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-background/40 backdrop-blur-xl border border-foreground/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow">
                <div className="text-3xl font-extrabold text-foreground mb-1">10k+</div>
                <div className="text-sm font-semibold text-foreground/70">Happy Smiles</div>
             </div>
          </motion.div>
        </div>
      </div>

      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
