"use client";

import type { CSSProperties } from "react";
import { Instagram, Mail, MapPin, MessageCircle, PhoneCall } from "lucide-react";
import type { ContactCTAProps } from "@/components/clinic/template-props";
import {
  extractInstagramHandle,
  toTelHref,
  toWhatsAppHref,
} from "@/components/clinic/utils";
import { useClinicSectionEffects } from "@/components/clinic/useClinicSectionEffects";

const headingStyle: CSSProperties = {
  fontFamily: "var(--font-heading), Georgia, serif",
};

const SECTION_LABELS = {
  eyebrow: "Контакты",
  title: "Связаться с клиникой напрямую",
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
    <section id="contact" className="pt-[clamp(88px,10vw,144px)] pb-14">
      <div
        ref={sectionRef}
        className="mx-auto w-full max-w-[1360px] px-4 sm:px-6 lg:px-8"
      >
        <div className="reveal overflow-hidden rounded-[20px] border border-[color-mix(in_oklab,var(--accent)_44%,white)] bg-[var(--accent)] px-6 py-7 text-white shadow-[0_24px_60px_color-mix(in_oklab,var(--accent)_26%,transparent)] sm:px-8 lg:px-10">
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center">
            <div>
              <span className="inline-flex items-center gap-3 text-[0.78rem] uppercase tracking-[0.2em] text-white/72">
                <span className="h-px w-10 bg-white/56" />
                <span>{SECTION_LABELS.eyebrow}</span>
              </span>

              <h2
                className="mt-3 max-w-[16ch] text-[clamp(1.8rem,3vw,3.2rem)] leading-[1.02] tracking-[-0.04em] text-white"
                style={headingStyle}
              >
                {SECTION_LABELS.title}
              </h2>

              <a
                href={toTelHref(phone)}
                className="mt-5 block text-[clamp(2rem,4vw,3.2rem)] leading-[0.94] tracking-[-0.05em] text-white transition-colors hover:text-white/82"
                style={headingStyle}
              >
                {phone}
              </a>

              <div className="mt-5 flex flex-wrap gap-3 text-sm text-white/72">
                {email?.trim() ? (
                  <a
                    href={`mailto:${email}`}
                    className="inline-flex min-h-11 items-center gap-2 rounded-md border border-white/18 bg-white/8 px-4 transition-colors hover:bg-white/12"
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
                    className="inline-flex min-h-11 items-center gap-2 rounded-md border border-white/18 bg-white/8 px-4 transition-colors hover:bg-white/12"
                  >
                    <Instagram className="h-4 w-4 text-white" />
                    <span>{instagramHandle}</span>
                  </a>
                ) : null}

                {address?.trim() ? (
                  <span className="inline-flex min-h-11 items-center gap-2 rounded-md border border-white/18 bg-white/8 px-4">
                    <MapPin className="h-4 w-4 text-white" />
                    <span>{address}</span>
                  </span>
                ) : null}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row xl:flex-col">
              <a
                href={toWhatsAppHref(phone)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-white bg-white px-6 text-sm font-medium text-[var(--accent)] transition-all duration-300 ease-[var(--ease)] hover:-translate-y-0.5 hover:bg-[#F2F4FA]"
              >
                <MessageCircle className="h-4 w-4" />
                <span>{SECTION_LABELS.primaryCta}</span>
              </a>

              <a
                href={toTelHref(phone)}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-white/26 bg-white/10 px-6 text-sm font-medium text-white transition-all duration-300 ease-[var(--ease)] hover:-translate-y-0.5 hover:bg-white/14"
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
