"use client";

import { Instagram, Mail, MapPin, MessageCircle, PhoneCall } from "lucide-react";
import {
  VARIANTS,
  type ClinicVariant,
  type ClinicVariantLabels,
} from "@/lib/tenant/variants";
import { extractInstagramHandle, toTelHref, toWhatsAppHref } from "./utils";
import { useClinicSectionEffects } from "./useClinicSectionEffects";

export interface ContactCTAProps {
  readonly variant: ClinicVariant;
  readonly phone: string;
  readonly email: string | null;
  readonly instagramUrl: string | null;
  readonly address: string | null;
  readonly labels: Pick<
    ClinicVariantLabels,
    "contactEyebrow" | "contactTitle" | "contactPrimaryCta" | "contactSecondaryCta"
  >;
}

export function ContactCTA({
  variant,
  phone,
  email,
  instagramUrl,
  address,
  labels,
}: ContactCTAProps) {
  const sectionRef = useClinicSectionEffects<HTMLDivElement>();
  const instagramHandle = extractInstagramHandle(instagramUrl);
  const buttonRadiusClassName =
    VARIANTS[variant].buttonShape === "pill" ? "rounded-full" : "rounded-[18px]";

  if (!phone.trim()) return null;

  return (
    <section
      id="contact"
      data-variant={variant}
      className="pt-[clamp(88px,10vw,144px)] pb-14"
    >
      <div
        ref={sectionRef}
        className="mx-auto w-full max-w-[1360px] px-4 sm:px-6 lg:px-8"
      >
        <div className="reveal overflow-hidden rounded-[24px] border border-[var(--line)] bg-[linear-gradient(180deg,color-mix(in_oklab,var(--text)_4%,transparent),transparent_34%),var(--surface)] px-6 py-7 shadow-[var(--shadow-card)] sm:px-8 lg:px-10">
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center">
            <div>
              <span className="inline-flex items-center gap-3 text-[0.8rem] uppercase tracking-[0.22em] text-[var(--muted)]">
                <span className="h-px w-10 bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--accent)_80%,transparent))]" />
                <span>{labels.contactEyebrow}</span>
              </span>

              <h2 className="mt-3 max-w-[16ch] text-[clamp(1.6rem,2.8vw,3rem)] font-bold leading-[1.02] tracking-[-0.06em] text-[var(--text)]">
                {labels.contactTitle}
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
                className={`inline-flex min-h-13 items-center justify-center gap-2 border border-[color-mix(in_oklab,var(--accent)_42%,transparent)] bg-[linear-gradient(180deg,color-mix(in_oklab,var(--accent)_24%,transparent),color-mix(in_oklab,var(--accent)_14%,transparent)),color-mix(in_oklab,var(--text)_3%,transparent)] px-6 text-sm font-semibold text-white shadow-[inset_0_1px_0_color-mix(in_oklab,var(--text)_10%,transparent),0_18px_38px_color-mix(in_oklab,var(--accent)_18%,transparent)] transition-all duration-300 ease-[var(--ease)] hover:-translate-y-0.5 hover:border-[var(--accent)] ${buttonRadiusClassName}`}
              >
                <MessageCircle className="h-4 w-4" />
                <span>{labels.contactPrimaryCta}</span>
              </a>

              <a
                href={toTelHref(phone)}
                className={`inline-flex min-h-13 items-center justify-center gap-2 border border-[var(--line)] bg-[color-mix(in_oklab,var(--surface)_88%,transparent)] px-6 text-sm font-semibold text-[var(--text)] transition-all duration-300 ease-[var(--ease)] hover:-translate-y-0.5 hover:border-[color-mix(in_oklab,var(--text)_18%,var(--line))] hover:bg-[color-mix(in_oklab,var(--surface-strong)_80%,transparent)] ${buttonRadiusClassName}`}
              >
                <PhoneCall className="h-4 w-4 text-[var(--accent)]" />
                <span>{labels.contactSecondaryCta}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
