"use client";

import { useState } from "react";
import type { DoctorsGridProps } from "@/components/clinic/template-props";
import {
  getDoctorInitials,
  getVisibleDoctors,
  normalizeDoctorPhotoSrc,
} from "@/components/clinic/utils";
import { useClinicSectionEffects } from "@/components/clinic/useClinicSectionEffects";
import { premiumHeading } from "./fonts";

const SECTION_LABELS = {
  eyebrow: "Специалисты",
  title: "Команда профильных врачей",
  subtitle:
    "Ортодонты, хирурги, терапевты и имплантологи в едином клиническом стандарте.",
} as const;

export function DoctorsGrid({
  doctors,
  title,
  subtitle,
}: DoctorsGridProps) {
  const sectionRef = useClinicSectionEffects<HTMLDivElement>();
  const visibleDoctors = getVisibleDoctors(doctors);
  const [failedPhotos, setFailedPhotos] = useState<Record<string, boolean>>({});

  if (visibleDoctors.length === 0) return null;

  return (
    <section id="doctors" className="pt-[clamp(88px,10vw,144px)]">
      <div
        ref={sectionRef}
        className="mx-auto w-full max-w-[1360px] px-4 sm:px-6 lg:px-8"
      >
        <div className="reveal mb-8 grid gap-4 lg:mb-10">
          <span className="inline-flex items-center gap-3 text-[0.78rem] uppercase tracking-[0.2em] text-[var(--muted)]">
            <span className="h-px w-10 bg-[var(--accent)]" />
            <span>{SECTION_LABELS.eyebrow}</span>
          </span>
          <h2
            className={`max-w-[14ch] text-[clamp(2.1rem,4vw,4rem)] leading-[0.98] tracking-[-0.045em] text-[var(--text)] ${premiumHeading.className}`}
          >
            {title?.trim() || SECTION_LABELS.title}
          </h2>
          {(subtitle?.trim() || SECTION_LABELS.subtitle) ? (
            <p className="max-w-[64ch] text-base leading-8 text-[var(--muted)]">
              {subtitle?.trim() || SECTION_LABELS.subtitle}
            </p>
          ) : null}
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleDoctors.map((doctor, index) => {
            const photoSrc = normalizeDoctorPhotoSrc(doctor.photo_url);
            const shouldShowPhoto = Boolean(photoSrc) && !failedPhotos[doctor.id];

            return (
              <article
                key={doctor.id}
                className="reveal flex min-h-[260px] flex-col rounded-[18px] border border-[var(--line)] bg-white p-6 shadow-[var(--shadow-card)] transition-all duration-300 ease-[var(--ease)] hover:-translate-y-1 hover:border-[color-mix(in_oklab,var(--accent)_35%,var(--line))]"
                data-delay={String((index % 3) + 1)}
              >
                <div className="relative h-[92px] w-[92px] overflow-hidden rounded-[8px] border border-[var(--line)] bg-[#F1F3F7]">
                  {shouldShowPhoto ? (
                    <img
                      src={photoSrc ?? undefined}
                      alt={doctor.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      onError={() =>
                        setFailedPhotos((current) => ({
                          ...current,
                          [doctor.id]: true,
                        }))
                      }
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center bg-[color-mix(in_oklab,var(--accent)_10%,white)]">
                      <span className="text-[1.16rem] uppercase tracking-[0.08em] text-[var(--text)]">
                        {getDoctorInitials(doctor.name)}
                      </span>
                    </div>
                  )}
                </div>

                <h3
                  className={`mt-6 text-[1.32rem] leading-[1.18] text-[var(--text)] ${premiumHeading.className}`}
                >
                  {doctor.name}
                </h3>

                {doctor.specialty.trim() ? (
                  <p className="mt-3 text-sm leading-7 text-[var(--muted)] sm:text-base">
                    {doctor.specialty}
                  </p>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
