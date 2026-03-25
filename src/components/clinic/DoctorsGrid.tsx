"use client";

import Image from "next/image";
import type { ClinicVariant, ClinicVariantLabels } from "@/lib/tenant/variants";
import { ClinicDoctor } from "@/config/site";
import {
  getDoctorInitials,
  getVisibleDoctors,
  normalizeDoctorPhotoSrc,
} from "./utils";
import { useClinicSectionEffects } from "./useClinicSectionEffects";

export interface DoctorsGridProps {
  readonly variant: ClinicVariant;
  readonly doctors: readonly ClinicDoctor[];
  readonly title: string;
  readonly subtitle: string;
  readonly labels: Pick<ClinicVariantLabels, "doctorsEyebrow" | "doctorPrefix">;
}

export function DoctorsGrid({
  variant,
  doctors,
  title,
  subtitle,
  labels,
}: DoctorsGridProps) {
  const sectionRef = useClinicSectionEffects<HTMLDivElement>();
  const visibleDoctors = getVisibleDoctors(doctors);

  if (visibleDoctors.length === 0) return null;

  return (
    <section
      id="doctors"
      data-variant={variant}
      className="pt-[clamp(88px,10vw,144px)]"
    >
      <div
        ref={sectionRef}
        className="mx-auto w-full max-w-[1360px] px-4 sm:px-6 lg:px-8"
      >
        <div className="reveal mb-8 grid gap-4 lg:mb-10">
          <span className="inline-flex items-center gap-3 text-[0.8rem] uppercase tracking-[0.22em] text-[var(--muted)]">
            <span className="h-px w-10 bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--accent)_80%,transparent))]" />
            <span>{labels.doctorsEyebrow}</span>
          </span>
          <h2 className="max-w-[14ch] text-[clamp(2.1rem,4vw,4rem)] font-bold leading-[0.98] tracking-[-0.06em] text-[var(--text)]">
            {title}
          </h2>
          {subtitle.trim() ? (
            <p className="max-w-[64ch] text-base leading-8 text-[var(--muted)]">
              {subtitle}
            </p>
          ) : null}
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleDoctors.map((doctor, index) => {
            const photoSrc = normalizeDoctorPhotoSrc(doctor.photo_url);
            const shouldShowPrefix = Boolean(labels.doctorPrefix);

            return (
              <article
                key={doctor.id}
                className="reveal flex min-h-[252px] flex-col rounded-[24px] border border-[var(--line)] bg-[linear-gradient(180deg,color-mix(in_oklab,var(--text)_4%,transparent),transparent_34%),var(--surface)] p-6 shadow-[var(--shadow-card)] transition-all duration-300 ease-[var(--ease)] hover:-translate-y-1 hover:border-[color-mix(in_oklab,var(--accent)_30%,transparent)]"
                data-delay={String((index % 3) + 1)}
              >
                <div className="relative h-[74px] w-[74px] rounded-full border border-[color-mix(in_oklab,var(--accent)_40%,transparent)] bg-[radial-gradient(circle_at_center,color-mix(in_oklab,var(--accent)_12%,transparent),transparent_62%),color-mix(in_oklab,var(--surface)_95%,transparent)]">
                  <div className="absolute inset-[7px] overflow-hidden rounded-full border border-[color-mix(in_oklab,var(--line)_90%,transparent)]">
                    {photoSrc ? (
                      <Image
                        src={photoSrc}
                        alt={doctor.name}
                        fill
                        sizes="74px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center bg-[linear-gradient(135deg,color-mix(in_oklab,var(--accent)_18%,transparent),transparent)]">
                        <span className="font-display text-[1.18rem] uppercase tracking-[0.12em] text-[var(--text)]">
                          {getDoctorInitials(doctor.name)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <h3 className="mt-6 text-[1.24rem] font-semibold leading-[1.24] text-[var(--text)]">
                  {doctor.name}
                </h3>

                {doctor.specialty.trim() ? (
                  <p className="mt-3 text-sm leading-7 text-[var(--muted)] sm:text-base">
                    {doctor.specialty}
                  </p>
                ) : null}

                {shouldShowPrefix ? (
                  <div className="mt-auto pt-6 text-[0.82rem] uppercase tracking-[0.08em] text-[var(--muted-soft)]">
                    {labels.doctorPrefix} / {String(index + 1).padStart(2, "0")}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
