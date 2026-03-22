"use client";

import { useBooking } from "@/context/BookingContext";
import { SiteConfig } from "@/config/site";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle } from "lucide-react";
import { BookingForm } from "@/components/clinic/BookingForm";

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

interface BookingModalProps {
  readonly config: SiteConfig;
  readonly slug: string;
}

function toWhatsAppHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}`;
}

export function BookingModal({ config, slug }: BookingModalProps) {
  const { isOpen, closeBooking } = useBooking();
  const whatsAppHref = toWhatsAppHref(config.contactPhone);

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
            className="flex h-[92vh] w-full flex-col overflow-y-auto rounded-t-[32px] border border-foreground/8 bg-background text-foreground shadow-2xl ring-1 ring-white/5 md:h-auto md:max-w-2xl md:rounded-[32px]"
          >
            <div className="flex shrink-0 items-center justify-between border-b border-foreground/8 px-5 py-4 sm:px-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-[var(--color-primary)]/82">
                  Бесплатная консультация
                </p>
                <h2 className="mt-2 text-xl font-black leading-tight tracking-[-0.04em] text-foreground sm:text-2xl">
                  Выберите удобный способ связи
                </h2>
              </div>
              <button
                onClick={closeBooking}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-foreground/10 bg-foreground/[0.03] transition-colors"
                aria-label="Закрыть"
              >
                <X className="h-5 w-5 text-foreground/70" />
              </button>
            </div>

            <div className="flex flex-1 flex-col gap-5 px-5 py-5 sm:px-6 sm:py-6">
              <div className="rounded-[28px] border border-foreground/8 bg-foreground/[0.03] p-5 ring-1 ring-white/5">
                <p className="text-sm leading-6 text-foreground/70">
                  Нужен быстрый ответ? Напишите в WhatsApp. Предпочитаете, чтобы администратор
                  сам перезвонил? Оставьте заявку в форме ниже.
                </p>
                <a
                  href={whatsAppHref}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-foreground/10 bg-[var(--color-primary)] px-5 py-3 text-base font-semibold text-white shadow-[0_14px_36px_color-mix(in_oklab,var(--color-primary)_26%,transparent)] transition-colors"
                >
                  <MessageCircle className="h-5 w-5 shrink-0" />
                  <span>Открыть WhatsApp</span>
                </a>
              </div>

              <BookingForm
                config={config}
                slug={slug}
                variant="sheet"
                title="Оставить заявку"
                subtitle="Заполните форму, и мы передадим заявку администратору клиники без звонка и без перезагрузки страницы."
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
