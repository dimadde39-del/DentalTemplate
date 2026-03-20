"use client";

import { SiteConfig } from "@/config/site";
import { motion } from "framer-motion";

interface HeroSectionProps {
  readonly config: SiteConfig;
}

const DESKTOP_STAGGER = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
} as const;

const DESKTOP_FADE_UP = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
} as const;

function toWhatsAppHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}`;
}

export function HeroSection({ config }: HeroSectionProps) {
  const whatsAppHref = toWhatsAppHref(config.contactPhone);
  const hasSubtitle = Boolean(config.heroSubtitle?.trim());

  return (
    <section
      id="clinic-hero"
      className="relative min-h-[100svh] overflow-hidden bg-background text-foreground"
    >
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/85 to-black" />
        <div className="absolute inset-x-0 top-0 h-72 bg-[var(--color-primary)]/12 blur-3xl" />
        <div className="absolute right-[-18%] top-[18%] h-64 w-64 rounded-full bg-[var(--color-primary)]/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-[100svh] w-full max-w-7xl items-center px-4 pb-8 pt-24 sm:px-6 sm:pb-10 sm:pt-28 lg:px-8">
        <div className="w-full max-w-3xl">
          <div className="md:hidden">
            <div className="mb-4 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-white/72 backdrop-blur">
              {config.clinicName}
            </div>

            <h1 className="max-w-[11ch] text-[2.4rem] font-black leading-[0.94] tracking-[-0.04em] text-white">
              {config.heroTitle}
            </h1>

            {hasSubtitle ? (
              <p className="mt-4 max-w-[34ch] text-base leading-7 text-white/72">
                {config.heroSubtitle}
              </p>
            ) : null}

            <div className="mt-7">
              <a
                href={whatsAppHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-[var(--color-primary)] px-5 py-3 text-base font-semibold text-white shadow-[0_10px_30px_color-mix(in_oklab,var(--color-primary)_30%,transparent)] transition-colors"
              >
                Записаться в WhatsApp
              </a>
            </div>

            <p className="mt-4 text-sm leading-6 text-white/56">
              Бесплатная консультация и быстрый ответ в WhatsApp
            </p>
          </div>

          <motion.div
            initial="hidden"
            animate="show"
            variants={DESKTOP_STAGGER}
            className="hidden md:block"
          >
            <motion.div
              variants={DESKTOP_FADE_UP}
              className="mb-5 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.26em] text-white/72 backdrop-blur"
            >
              {config.clinicName}
            </motion.div>

            <motion.h1
              variants={DESKTOP_FADE_UP}
              className="max-w-[11ch] text-6xl font-black leading-[0.92] tracking-[-0.05em] text-white lg:text-7xl"
            >
              {config.heroTitle}
            </motion.h1>

            {hasSubtitle ? (
              <motion.p
                variants={DESKTOP_FADE_UP}
                className="mt-6 max-w-2xl text-lg leading-8 text-white/72 lg:text-xl"
              >
                {config.heroSubtitle}
              </motion.p>
            ) : null}

            <motion.div variants={DESKTOP_FADE_UP} className="mt-8">
              <a
                href={whatsAppHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-[var(--color-primary)] px-6 py-3 text-base font-semibold text-white shadow-[0_14px_40px_color-mix(in_oklab,var(--color-primary)_30%,transparent)] transition-transform duration-200 hover:scale-[1.02]"
              >
                Записаться в WhatsApp
              </a>
            </motion.div>

            <motion.p
              variants={DESKTOP_FADE_UP}
              className="mt-4 text-sm leading-6 text-white/56"
            >
              Бесплатная консультация и быстрый ответ в WhatsApp
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
