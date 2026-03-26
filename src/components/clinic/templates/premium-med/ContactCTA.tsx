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
  title: "Связь с клиникой напрямую",
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
        <div className="reveal overflow-hidden rounded-[28px] border border-[color-mix(in_oklab,var(--accent)_54%,white)] bg-[var(--accent)] px-6 py-7 text-white shadow-[0_26px_56px_color-mix(in_oklab,var(--accent)_22%,transparent)] sm:px-8 sm:py-8 lg:px-10 lg:py-10">
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
            <div>
              <span className="inline-flex items-center gap-3 text-[0.76rem] uppercase tracking-[0.22em] text-white/70">
                <span className="h-px w-10 bg-white/48" />
                <span>{SECTION_LABELS.eyebrow}</span>
              </span>

              <h2
                className={`mt-4 max-w-[14ch] text-[clamp(2.2rem,4vw,4rem)] leading-[0.94] tracking-[-0.05em] text-white ${premiumHeading.className}`}
              >
                {SECTION_LABELS.title}
              </h2>

              <a
                href={toTelHref(phone)}
                className={`mt-5 block text-[clamp(2.2rem,4.4vw,3.8rem)] leading-[0.92] tracking-[-0.055em] text-white transition-colors hover:text-white/82 ${premiumHeading.className}`}
              >
                {phone}
              </a>

              <div className="mt-6 flex flex-wrap gap-3 text-sm text-white/74">
                {email?.trim() ? (
                  <a
                    href={`mailto:${email}`}
                    className="inline-flex min-h-11 items-center gap-2 rounded-[10px] border border-white/18 bg-white/8 px-4 transition-colors hover:bg-white/12"
                  >
                    <Mail className="h-4 w-4 text-white" />
                    <span>{email}</span>
                  </a>
                ) : null}

                {instagramUrl?.trim() && instagramHandle ? (
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 rounded-[10px] border border-white/18 bg-white/8 px-4 transition-colors hover:bg-white/12"
                  >
                    <Instagram className="h-4 w-4 text-white" />
                    <span>{instagramHandle}</span>
                  </a>
                ) : null}

                {address?.trim() ? (
                  <span className="inline-flex min-h-11 items-center gap-2 rounded-[10px] border border-white/18 bg-white/8 px-4">
                    <MapPin className="h-4 w-4 text-white" />
                    <span>{address}</span>
                  </span>
                ) : null}
              </div>
            </div>

            <div className="grid gap-3 sm:max-w-[280px]">
              <a
                href={toWhatsAppHref(phone)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[8px] border border-white bg-white px-6 text-sm font-medium text-[var(--accent)] transition-all duration-300 ease-[var(--ease)] hover:-translate-y-0.5 hover:bg-[#F3F6FF]"
              >
                <MessageCircle className="h-4 w-4" />
                <span>{SECTION_LABELS.primaryCta}</span>
              </a>

              <a
                href={toTelHref(phone)}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[8px] border border-white/24 bg-white/10 px-6 text-sm font-medium text-white transition-all duration-300 ease-[var(--ease)] hover:-translate-y-0.5 hover:bg-white/14"
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
