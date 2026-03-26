"use client";

import Image from "next/image";
import type { DoctorsGridProps } from "@/components/clinic/template-props";
import {
  getDoctorInitials,
  getVisibleDoctors,
  normalizeDoctorPhotoSrc,
} from "@/components/clinic/utils";
import { useClinicSectionEffects } from "@/components/clinic/useClinicSectionEffects";
import {
  warmClinicBodyFont,
  warmClinicHeadingFont,
} from "./fonts";

const SECTION_LABELS = {
  eyebrow: "Наша команда",
  title: "Специалисты, с которыми спокойно лечиться",
  subtitle:
    "Каждый врач работает в понятной коммуникации и аккуратном темпе, чтобы лечение ощущалось предсказуемым и комфортным.",
} as const;

export function DoctorsGrid({
  doctors,
  title,
  subtitle,
}: DoctorsGridProps) {
  const sectionRef = useClinicSectionEffects<HTMLDivElement>();
  const visibleDoctors = getVisibleDoctors(doctors);

  if (visibleDoctors.length === 0) return null;

  return (
    <section
      id="doctors"
      className={`${warmClinicBodyFont.className} pt-[clamp(88px,10vw,144px)]`}
    >
      <div
        ref={sectionRef}
        className="mx-auto w-full max-w-[1360px] px-4 sm:px-6 lg:px-8"
      >
        <div className="reveal mb-8 grid gap-4 lg:mb-10">
          <span className="inline-flex items-center gap-3 text-[0.8rem] uppercase tracking-[0.2em] text-[var(--muted)]">
            <span className="h-px w-10 bg-[linear-gradient(90deg,transparent,var(--accent))]" />
            <span>{SECTION_LABELS.eyebrow}</span>
          </span>
          <h2
            className={`max-w-[14ch] text-[clamp(2.2rem,4vw,4rem)] leading-[1] tracking-[-0.04em] text-[var(--text)] italic ${warmClinicHeadingFont.className}`}
          >
            {title?.trim() || SECTION_LABELS.title}
          </h2>
          <p className="max-w-[64ch] text-base leading-8 text-[var(--muted)]">
            {subtitle?.trim() || SECTION_LABELS.subtitle}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleDoctors.map((doctor, index) => {
            const photoSrc = normalizeDoctorPhotoSrc(doctor.photo_url);

            return (
              <article
                key={doctor.id}
                className="reveal flex min-h-[252px] flex-col rounded-[26px] border border-[var(--line)] bg-white p-6 shadow-[0_18px_42px_rgba(15,42,53,0.06)] transition-all duration-300 ease-[var(--ease)] hover:-translate-y-1 hover:border-[var(--accent)]"
                data-delay={String((index % 3) + 1)}
              >
                <div className="relative h-[82px] w-[82px] overflow-hidden rounded-full bg-[var(--accent-soft)] ring-1 ring-[var(--line)]">
                  {photoSrc ? (
                    <Image
                      src={photoSrc}
                      alt={doctor.name}
                      fill
                      sizes="82px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center">
                      <span className="text-[1.18rem] uppercase tracking-[0.12em] text-[var(--text)]">
                        {getDoctorInitials(doctor.name)}
                      </span>
                    </div>
                  )}
                </div>

                <h3
                  className={`mt-6 text-[1.34rem] leading-[1.18] text-[var(--text)] italic ${warmClinicHeadingFont.className}`}
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
