"use client";

import { Instagram, Mail, MapPin, MessageCircle, PhoneCall } from "lucide-react";
import { extractInstagramHandle, toTelHref, toWhatsAppHref } from "./utils";
import { useClinicSectionEffects } from "./useClinicSectionEffects";

export interface ContactCTAProps {
  readonly phone: string;
  readonly email: string | null;
  readonly instagramUrl: string | null;
  readonly address: string | null;
}

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
        <div className="reveal overflow-hidden rounded-[24px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent_34%),rgba(255,255,255,0.028)] px-6 py-7 shadow-[var(--shadow-card)] sm:px-8 lg:px-10">
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center">
            <div>
              <span className="inline-flex items-center gap-3 text-[0.8rem] uppercase tracking-[0.22em] text-white/80">
                <span className="h-px w-10 bg-[linear-gradient(90deg,transparent,rgba(0,161,214,0.9))]" />
                <span>Contact / direct line</span>
              </span>

              <h2 className="mt-3 max-w-[16ch] text-[clamp(1.6rem,2.8vw,3rem)] font-bold leading-[1.02] tracking-[-0.06em] text-[var(--text)]">
                Связаться быстро, без лишних шагов
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
                    className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/8 bg-white/[0.02] px-4 transition-colors hover:border-white/16 hover:text-[var(--text)]"
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
                    className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/8 bg-white/[0.02] px-4 transition-colors hover:border-white/16 hover:text-[var(--text)]"
                  >
                    <Instagram className="h-4 w-4 text-[var(--accent)]" />
                    <span>{instagramHandle}</span>
                  </a>
                ) : null}

                {address?.trim() ? (
                  <span className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/8 bg-white/[0.02] px-4">
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
                className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full border border-[rgba(0,161,214,0.4)] bg-[linear-gradient(180deg,rgba(0,161,214,0.24),rgba(0,161,214,0.14)),rgba(255,255,255,0.03)] px-6 text-sm font-semibold text-[#eaf8fd] shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_18px_38px_rgba(0,161,214,0.1)] transition-all duration-300 ease-[var(--ease)] hover:-translate-y-0.5 hover:border-[rgba(0,161,214,0.52)]"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Написать в WhatsApp</span>
              </a>

              <a
                href={toTelHref(phone)}
                className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full border border-[var(--line)] bg-white/[0.02] px-6 text-sm font-semibold text-[var(--text)] transition-all duration-300 ease-[var(--ease)] hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.05]"
              >
                <PhoneCall className="h-4 w-4 text-[var(--accent)]" />
                <span>Позвонить сейчас</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
