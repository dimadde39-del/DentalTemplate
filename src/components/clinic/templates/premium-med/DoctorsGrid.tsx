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
    "Ортодонтия, хирургия, имплантация и терапия объединены в одном клиническом стандарте и одной спокойной пациентской траектории.",
  meta: "clinical practice",
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
    <section id="doctors" className="pt-[clamp(92px,10vw,148px)]">
      <div
        ref={sectionRef}
        className="mx-auto w-full max-w-[1380px] px-4 sm:px-6 lg:px-8"
      >
        <div className="mb-10 grid gap-5 border-b border-[var(--line)] pb-8 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,0.72fr)] lg:items-end">
          <div className="reveal">
            <span className="inline-flex items-center gap-3 text-[0.76rem] uppercase tracking-[0.22em] text-[var(--muted)]">
              <span className="h-px w-10 bg-[linear-gradient(90deg,transparent,var(--accent))]" />
              <span>{SECTION_LABELS.eyebrow}</span>
            </span>
            <h2
              className={`mt-4 max-w-[13ch] text-[clamp(2.4rem,4.2vw,4.7rem)] leading-[0.92] tracking-[-0.05em] text-[var(--text)] italic ${premiumHeading.className}`}
            >
              {title?.trim() || SECTION_LABELS.title}
            </h2>
          </div>

          <p className="reveal max-w-[58ch] text-[1rem] leading-8 text-[var(--muted)] lg:justify-self-end lg:text-[1.05rem]">
            {subtitle?.trim() || SECTION_LABELS.subtitle}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visibleDoctors.map((doctor, index) => {
            const photoSrc = normalizeDoctorPhotoSrc(doctor.photo_url);
            const shouldShowPhoto = Boolean(photoSrc) && !failedPhotos[doctor.id];

            return (
              <article
                key={doctor.id}
                className="reveal flex min-h-[332px] flex-col rounded-[24px] border border-[var(--line)] bg-white p-6 shadow-[var(--shadow-card)] transition-all duration-300 ease-[var(--ease)] hover:-translate-y-1 hover:border-[color-mix(in_oklab,var(--accent)_22%,var(--line))] hover:shadow-[0_22px_34px_rgba(26,26,25,0.06)] sm:p-7"
                data-delay={String((index % 3) + 1)}
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="text-[0.72rem] uppercase tracking-[0.2em] text-[var(--muted)]">
                    {SECTION_LABELS.meta}
                  </span>
                </div>

                <div className="mt-5 h-[108px] w-[108px] overflow-hidden rounded-[14px] border border-[var(--line)] bg-[linear-gradient(180deg,#F8F8F4,#F1F0EB)]">
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
                    <div className="grid h-full w-full place-items-center bg-[linear-gradient(180deg,color-mix(in_oklab,var(--accent)_10%,white),#F4F4EF)]">
                      <span
                        className={`text-[1.28rem] uppercase tracking-[0.08em] text-[var(--text)] ${premiumHeading.className}`}
                      >
                        {getDoctorInitials(doctor.name)}
                      </span>
                    </div>
                  )}
                </div>

                <h3
                  className={`mt-6 text-[1.7rem] leading-[1.02] text-[var(--text)] ${premiumHeading.className}`}
                >
                  {doctor.name}
                </h3>

                {doctor.specialty.trim() ? (
                  <p className="mt-3 max-w-[34ch] text-sm leading-7 text-[var(--muted)] sm:text-[0.98rem]">
                    {doctor.specialty}
                  </p>
                ) : null}

                <div className="mt-auto pt-6">
                  <div className="h-px w-full bg-[var(--line)]" />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
