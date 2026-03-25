"use client";

import { Instagram, Mail, MapPin, MessageCircle, PhoneCall } from "lucide-react";
import type { ContactCTAProps } from "@/components/clinic/template-props";
import {
  extractInstagramHandle,
  toTelHref,
  toWhatsAppHref,
} from "@/components/clinic/utils";
import { useClinicSectionEffects } from "@/components/clinic/useClinicSectionEffects";

const SECTION_LABELS = {
  eyebrow: "Contact / direct line",
  title: "Связаться быстро, без лишних шагов",
  primaryCta: "Написать в WhatsApp",
  secondaryCta: "Позвонить сейчас",
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
        <div className="reveal overflow-hidden rounded-[24px] border border-[var(--line)] bg-[linear-gradient(180deg,color-mix(in_oklab,var(--text)_4%,transparent),transparent_34%),var(--surface)] px-6 py-7 shadow-[var(--shadow-card)] sm:px-8 lg:px-10">
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center">
            <div>
              <span className="inline-flex items-center gap-3 text-[0.8rem] uppercase tracking-[0.22em] text-[var(--muted)]">
                <span className="h-px w-10 bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--accent)_80%,transparent))]" />
                <span>{SECTION_LABELS.eyebrow}</span>
              </span>

              <h2 className="mt-3 max-w-[16ch] text-[clamp(1.6rem,2.8vw,3rem)] font-bold leading-[1.02] tracking-[-0.06em] text-[var(--text)]">
                {SECTION_LABELS.title}
              </h2>

              <a
                href={toTelHref(phone)}
                className="mt-5 block font-display text-[clamp(2rem,4vw,3.2rem)] leading-[0.92] tracking-[-0.08em] text-[var(--text)] transition-colors hover:text-[var(--accent)]"
              >
                {phone}
              </a>

              <div className="mt-5 flex flex-wrap gap-3 text-sm text-[var(--muted)]">
                {email?.trim() ? (
                  <a
                    href={`mailto:${email}`}
                    className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[color-mix(in_oklab,var(--line)_90%,transparent)] bg-[color-mix(in_oklab,var(--surface-strong)_92%,transparent)] px-4 transition-colors hover:border-[color-mix(in_oklab,var(--text)_16%,var(--line))] hover:text-[var(--text)]"
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
                    className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[color-mix(in_oklab,var(--line)_90%,transparent)] bg-[color-mix(in_oklab,var(--surface-strong)_92%,transparent)] px-4 transition-colors hover:border-[color-mix(in_oklab,var(--text)_16%,var(--line))] hover:text-[var(--text)]"
                  >
                    <Instagram className="h-4 w-4 text-[var(--accent)]" />
                    <span>{instagramHandle}</span>
                  </a>
                ) : null}

                {address?.trim() ? (
                  <span className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[color-mix(in_oklab,var(--line)_90%,transparent)] bg-[color-mix(in_oklab,var(--surface-strong)_92%,transparent)] px-4">
                    <MapPin className="h-4 w-4 text-[var(--accent)]" />
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
                className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full border border-[color-mix(in_oklab,var(--accent)_42%,transparent)] bg-[linear-gradient(180deg,color-mix(in_oklab,var(--accent)_24%,transparent),color-mix(in_oklab,var(--accent)_14%,transparent)),color-mix(in_oklab,var(--text)_3%,transparent)] px-6 text-sm font-semibold text-white shadow-[inset_0_1px_0_color-mix(in_oklab,var(--text)_10%,transparent),0_18px_38px_color-mix(in_oklab,var(--accent)_18%,transparent)] transition-all duration-300 ease-[var(--ease)] hover:-translate-y-0.5 hover:border-[var(--accent)]"
              >
                <MessageCircle className="h-4 w-4" />
                <span>{SECTION_LABELS.primaryCta}</span>
              </a>

              <a
                href={toTelHref(phone)}
                className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full border border-[var(--line)] bg-[color-mix(in_oklab,var(--surface)_88%,transparent)] px-6 text-sm font-semibold text-[var(--text)] transition-all duration-300 ease-[var(--ease)] hover:-translate-y-0.5 hover:border-[color-mix(in_oklab,var(--text)_18%,var(--line))] hover:bg-[color-mix(in_oklab,var(--surface-strong)_80%,transparent)]"
              >
                <PhoneCall className="h-4 w-4 text-[var(--accent)]" />
                <span>{SECTION_LABELS.secondaryCta}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
