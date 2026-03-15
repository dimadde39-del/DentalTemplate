"use client";

import { useBooking } from "@/context/BookingContext";
import { SiteConfig } from "@/config/site";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

const OVERLAY_VARIANTS = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
} as const;

const PANEL_VARIANTS = {
  initial: { opacity: 0, y: "100%" },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: "100%" },
} as const;

const bookingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  service: z.string().min(1, "Please select a service"),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingModalProps {
  readonly config: SiteConfig;
  readonly slug: string;
}

export function BookingModal({ config, slug }: BookingModalProps) {
  const { isOpen, closeBooking } = useBooking();
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedName, setSubmittedName] = useState("");
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  const onSubmit = async (data: BookingFormData) => {
    const { error } = await supabase.rpc('insert_public_lead', { 
      p_slug: slug,
      p_name: data.name, 
      p_phone: data.phone, 
      p_service: data.service 
    });

    if (error) {
      console.error("Error inserting lead:", error);
      return;
    }
    
    setSubmittedName(data.name);
    setIsSuccess(true);
    
    setTimeout(() => {
      closeBooking();
      setTimeout(() => {
        setIsSuccess(false);
        reset();
      }, 300);
    }, 3000);
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          variants={OVERLAY_VARIANTS}
          initial="initial"
          animate="animate"
          exit="exit"
          onClick={closeBooking}
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            variants={PANEL_VARIANTS}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
            className="h-[90vh] md:h-auto w-full md:max-w-lg bg-white dark:bg-zinc-900 rounded-t-3xl md:rounded-2xl shadow-2xl overflow-y-auto flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
              <h2 className="text-xl font-bold font-sans">Book Appointment</h2>
              <button
                onClick={closeBooking}
                className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-zinc-500" />
              </button>
            </div>

            <div className="p-6 flex-1 flex flex-col">
              {isSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center text-center py-12 h-full"
                >
                  <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Спасибо, {submittedName}!</h3>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    We've received your request and will contact you shortly to confirm your appointment.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 flex flex-col h-full">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Full Name
                    </label>
                    <input
                      {...register("name")}
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-base outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all"
                      placeholder="John Doe"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Phone Number
                    </label>
                    <input
                      {...register("phone")}
                      type="tel"
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-base outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all"
                      placeholder="+1 (555) 000-0000"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                    )}
                  </div>

                  <div className="space-y-1 pb-4">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Service Interested In
                    </label>
                    <select
                      {...register("service")}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-base outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all appearance-none"
                    >
                      <option value="">Select a service...</option>
                      {config.defaultServices.map((service) => (
                        <option key={service} value={service}>
                          {service}
                        </option>
                      ))}
                    </select>
                    {errors.service && (
                      <p className="text-red-500 text-sm mt-1">{errors.service.message}</p>
                    )}
                  </div>

                  <div className="mt-auto pt-4 shrink-0">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full min-h-[48px] bg-[var(--color-primary)] text-white rounded-xl font-bold text-base hover:opacity-90 active:scale-[0.98] disabled:opacity-70 transition-all flex items-center justify-center"
                    >
                      {isSubmitting ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        />
                      ) : (
                        "Confirm Request"
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
