"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, CheckCircle2 } from "lucide-react";
import { siteConfig } from "@/config/site";
import { supabase } from "@/lib/supabase";
import { useBooking } from "@/context/BookingContext";

export function BookingModal() {
  const { isOpen, closeModal } = useBooking();
  const [formData, setFormData] = useState({ name: "", phone: "", service: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errors, setErrors] = useState({ name: false, phone: false });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const validate = () => {
    const newErrors = {
      name: formData.name.trim() === "",
      phone: formData.phone.trim() === "",
    };
    setErrors(newErrors);
    return !newErrors.name && !newErrors.phone;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("loading");
    
    try {
      // Collect UTM parameters from current URL
      let utmParams = {};
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        utmParams = {
          utm_source: urlParams.get('utm_source') || null,
          utm_medium: urlParams.get('utm_medium') || null,
          utm_campaign: urlParams.get('utm_campaign') || null,
          utm_term: urlParams.get('utm_term') || null,
          utm_content: urlParams.get('utm_content') || null,
        };
      }

      const { error } = await supabase.from('leads').insert([
        {
          name: formData.name,
          phone: formData.phone,
          service: formData.service || 'General Inquiry',
          status: 'new',
          ...utmParams
        }
      ]);

      if (error) throw error;
      setStatus("success");
    } catch (err) {
      console.error("Failed to submit lead", err);
      setStatus("error");
    }
  };

  const handleClose = () => {
    closeModal();
    // Reset state after animation finishes
    setTimeout(() => {
      setStatus("idle");
      setFormData({ name: "", phone: "", service: "" });
      setErrors({ name: false, phone: false });
    }, 300);
  };


  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md"
          />

          {/* Modal Content */}
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none">
            <motion.div
              initial={isMobile ? { opacity: 0, y: "100%" } : { opacity: 0, y: 50, scale: 0.95 }}
              animate={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, y: 0, scale: 1 }}
              exit={isMobile ? { opacity: 0, y: "100%" } : { opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-lg overflow-hidden rounded-t-[2rem] sm:rounded-b-[2rem] sm:rounded-t-[2rem] border-t sm:border border-foreground/10 bg-background/80 backdrop-blur-2xl shadow-2xl pointer-events-auto flex flex-col max-h-[90vh]"
            >
              {/* Mobile Drag Indicator */}
              <div className="w-full flex justify-center pt-3 pb-1 sm:hidden relative z-10 cursor-grab active:cursor-grabbing" onClick={handleClose}>
                <div className="w-12 h-1.5 bg-foreground/20 rounded-full" />
              </div>

              {/* Header */}
              <div className="relative border-b border-foreground/5 p-6 md:p-8 pt-4 sm:pt-8">
                <button
                  onClick={handleClose}
                  className="absolute right-4 top-4 sm:right-6 sm:top-6 flex h-11 w-11 items-center justify-center rounded-full bg-foreground/5 text-foreground/50 hover:bg-foreground/10 hover:text-foreground transition-colors"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
                <h3 className="text-2xl font-bold tracking-tight text-foreground pr-10">
                  {status === "success" ? "Request Received" : "Book an Appointment"}
                </h3>
                <p className="text-foreground/60 mt-2">
                  {status === "success"
                    ? "We'll be in touch with you shortly."
                    : "Fill out the form below and we will contact you to confirm your visit."}
                </p>
              </div>

              {/* Body */}
              <div className="p-6 md:p-8 relative min-h-[300px] flex flex-col justify-center">
                {status === "success" ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-center space-y-4 py-8"
                  >
                    <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                      <CheckCircle2 className="h-10 w-10" />
                    </div>
                    <h4 className="text-xl font-bold">Thank you, {formData.name.split(' ')[0]}!</h4>
                    <p className="text-foreground/70">
                      Our manager will call you shortly at <span className="font-semibold">{formData.phone}</span> to finalize your appointment details.
                    </p>
                    <button
                       onClick={handleClose}
                       className="mt-6 w-full rounded-full bg-foreground/5 border border-foreground/10 py-3 font-semibold hover:bg-foreground/10 transition-colors"
                    >
                      Close Window
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-semibold text-foreground/80">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          if (errors.name) setErrors({ ...errors, name: false });
                        }}
                        placeholder="John Doe"
                        className={`w-full rounded-xl border bg-background/50 px-5 py-4 text-base sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors ${
                          errors.name ? "border-red-500/50 focus:border-red-500" : "border-foreground/10 focus:border-primary"
                        }`}
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-semibold text-foreground/80">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => {
                          setFormData({ ...formData, phone: e.target.value });
                          if (errors.phone) setErrors({ ...errors, phone: false });
                        }}
                        placeholder="+1 (555) 000-0000"
                        className={`w-full rounded-xl border bg-background/50 px-5 py-4 text-base sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors ${
                          errors.phone ? "border-red-500/50 focus:border-red-500" : "border-foreground/10 focus:border-primary"
                        }`}
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="service" className="text-sm font-semibold text-foreground/80">
                        Service of Interest
                      </label>
                      <div className="relative">
                        <select
                          id="service"
                          value={formData.service}
                          onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                          className="w-full appearance-none rounded-xl border border-foreground/10 bg-background/50 px-5 py-4 text-base sm:text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                        >
                          <option value="">General Inquiry / Not Sure</option>
                          {siteConfig.defaultServices.map((service) => (
                            <option key={service} value={service}>
                              {service}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-foreground/50">
                          <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={status === "loading"}
                        className="group relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-primary px-8 py-4 font-bold text-base text-white shadow-[0_0_20px_rgb(0,0,0,0.1)] transition-all hover:scale-[1.02] hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-70 disabled:hover:scale-100"
                      >
                        {status === "loading" ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <span>Submit Request</span>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
