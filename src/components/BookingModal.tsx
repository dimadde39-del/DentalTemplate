"use client";

import { useBooking } from "@/context/BookingContext";
import { SiteConfig } from "@/config/site";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMemo, useState } from "react";
import { createBrowserClient } from "@/lib/supabase-browser";

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
  const supabase = useMemo(() => createBrowserClient(), []);
  const serviceOptions = config.services
    .map((service) => service.name.trim())
    .filter(Boolean);
  const hasStructuredServices = serviceOptions.length > 0;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  const onSubmit = async (data: BookingFormData) => {
    const { error } = await supabase.rpc("insert_public_lead", {
      p_slug: slug,
      p_name: data.name,
      p_phone: data.phone,
      p_service: data.service,
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
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm md:items-center"
        >
          <motion.div
            variants={PANEL_VARIANTS}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            onClick={(event) => event.stopPropagation()}
            className="flex h-[90vh] w-full flex-col overflow-y-auto rounded-t-3xl bg-white shadow-2xl md:h-auto md:max-w-lg md:rounded-2xl dark:bg-zinc-900"
          >
            <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 shrink-0 dark:border-zinc-800">
              <h2 className="font-sans text-xl font-bold">Book Appointment</h2>
              <button
                onClick={closeBooking}
                className="flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
                aria-label="Close"
              >
                <X className="h-5 w-5 text-zinc-500" />
              </button>
            </div>

            <div className="flex flex-1 flex-col p-6">
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex h-full flex-col items-center justify-center py-12 text-center"
                >
                  <CheckCircle2 className="mb-4 h-16 w-16 text-green-500" />
                  <h3 className="mb-2 text-2xl font-bold">Thank you, {submittedName}!</h3>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    We have received your request and will contact you shortly to confirm your
                    appointment.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="flex h-full flex-col space-y-5">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Full Name
                    </label>
                    <input
                      {...register("name")}
                      type="text"
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-base outline-none transition-all focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 dark:border-zinc-700 dark:bg-zinc-800"
                      placeholder="John Doe"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Phone Number
                    </label>
                    <input
                      {...register("phone")}
                      type="tel"
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-base outline-none transition-all focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 dark:border-zinc-700 dark:bg-zinc-800"
                      placeholder="+1 (555) 000-0000"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
                    )}
                  </div>

                  <div className="space-y-1 pb-4">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Service Interested In
                    </label>
                    {hasStructuredServices ? (
                      <select
                        {...register("service")}
                        className="w-full appearance-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-base outline-none transition-all focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 dark:border-zinc-700 dark:bg-zinc-800"
                      >
                        <option value="">Select a service...</option>
                        {serviceOptions.map((service) => (
                          <option key={service} value={service}>
                            {service}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        {...register("service")}
                        type="text"
                        className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-base outline-none transition-all focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 dark:border-zinc-700 dark:bg-zinc-800"
                        placeholder="Describe the treatment you are interested in"
                      />
                    )}
                    {errors.service && (
                      <p className="mt-1 text-sm text-red-500">{errors.service.message}</p>
                    )}
                  </div>

                  <div className="mt-auto shrink-0 pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex min-h-[48px] w-full items-center justify-center rounded-xl bg-[var(--color-primary)] text-base font-bold text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white"
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
