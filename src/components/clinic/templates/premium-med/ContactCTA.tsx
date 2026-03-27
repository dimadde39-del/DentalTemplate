"use client";

import { Instagram, Mail, MapPin, MessageCircle, PhoneCall } from "lucide-react";
import type { ContactCTAProps } from "@/components/clinic/template-props";
import {
  extractInstagramHandle,
  toTelHref,
  toWhatsAppHref,
} from "@/components/clinic/utils";
import { useClinicSectionEffects } from "@/components/clinic/useClinicSectionEffects";
import { premiumHeading } from "./fonts";

const SECTION_LABELS = {
  eyebrow: "Контакты",
  title: "Запишитесь на первый приём",
  subtitle:
    "Свяжитесь с клиникой удобным способом: мы спокойно сориентируем по первому этапу, врачу и формату визита.",
  primaryCta: "Написать в WhatsApp",
  secondaryCta: "Позвонить",
} as const;

export function ContactCTA({
  phone,
  email,
  instagramUrl,
  address,
}: ContactCTAProps) {
  const sectionRef = useClinicSectionEffects<HTMLDivElement>();
  const instagramHandle = extractInstagramHandle(instagramUrl);

  if (!phone.trim()) return null;

  return (
    <section id="contact" className="pt-[clamp(92px,10vw,148px)] pb-14">
      <div
        ref={sectionRef}
        className="mx-auto w-full max-w-[1380px] px-4 sm:px-6 lg:px-8"
      >
        <div className="reveal relative overflow-hidden rounded-[30px] border border-[color-mix(in_oklab,var(--line-strong)_72%,transparent)] bg-[linear-gradient(180deg,#20202a,#141417)] px-6 py-7 text-white shadow-[0_28px_58px_rgba(26,26,25,0.18)] sm:px-8 sm:py-8 lg:px-10 lg:py-10">
          <div className="absolute inset-x-10 top-0 h-px bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--accent)_78%,transparent),transparent)]" />

          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
            <div>
              <span className="inline-flex items-center gap-3 text-[0.76rem] uppercase tracking-[0.22em] text-white/58">
                <span className="h-px w-10 bg-white/24" />
                <span>{SECTION_LABELS.eyebrow}</span>
              </span>

              <h2
                className={`mt-4 max-w-[13ch] text-[clamp(2.35rem,4vw,4.2rem)] leading-[0.94] tracking-[-0.05em] text-white italic ${premiumHeading.className}`}
              >
                {SECTION_LABELS.title}
              </h2>

              <p className="mt-4 max-w-[58ch] text-[0.98rem] leading-8 text-white/62 sm:text-[1.02rem]">
                {SECTION_LABELS.subtitle}
              </p>

              <a
                href={toTelHref(phone)}
                className={`mt-6 block text-[clamp(2.1rem,4vw,3.5rem)] leading-[0.92] tracking-[-0.05em] text-white transition-colors hover:text-white/82 ${premiumHeading.className}`}
              >
                {phone}
              </a>

              <div className="mt-7 flex flex-wrap gap-3 text-sm text-white/68">
                {email?.trim() ? (
                  <a
                    href={`mailto:${email}`}
                    className="inline-flex min-h-11 items-center gap-2 rounded-[10px] border border-white/12 px-4 transition-colors hover:border-white/22 hover:text-white"
                  >
                    <Mail className="h-4 w-4 text-[var(--accent)]" />
                    <span>{email}</span>
                  </a>
                ) : null}

                {instagramUrl?.trim() && instagramHandle ? (
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 rounded-[10px] border border-white/12 px-4 transition-colors hover:border-white/22 hover:text-white"
                  >
                    <Instagram className="h-4 w-4 text-[var(--accent)]" />
                    <span>{instagramHandle}</span>
                  </a>
                ) : null}

                {address?.trim() ? (
                  <span className="inline-flex min-h-11 items-center gap-2 rounded-[10px] border border-white/12 px-4">
                    <MapPin className="h-4 w-4 text-[var(--accent)]" />
                    <span>{address}</span>
                  </span>
                ) : null}
              </div>
            </div>

            <div className="grid gap-3 sm:min-w-[260px]">
              <a
                href={toWhatsAppHref(phone)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[8px] border border-white/18 bg-transparent px-6 text-sm font-medium text-white transition-all duration-300 ease-[var(--ease)] hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                <MessageCircle className="h-4 w-4" />
                <span>{SECTION_LABELS.primaryCta}</span>
              </a>

              <a
                href={toTelHref(phone)}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[8px] border border-white bg-white px-6 text-sm font-medium text-[var(--text)] transition-all duration-300 ease-[var(--ease)] hover:-translate-y-0.5 hover:bg-[#F4F1EA]"
              >
                <PhoneCall className="h-4 w-4" />
                <span>{SECTION_LABELS.secondaryCta}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
