"use client";

import { ClinicDoctor } from "@/config/site";
import {
  getDoctorInitials,
  getVisibleDoctors,
  normalizeDoctorPhotoSrc,
} from "./utils";
import { useClinicSectionEffects } from "./useClinicSectionEffects";

export interface DoctorsGridProps {
  readonly doctors: readonly ClinicDoctor[];
  readonly title: string;
  readonly subtitle: string;
}

export function DoctorsGrid({
  doctors,
  title,
  subtitle,
}: DoctorsGridProps) {
  const sectionRef = useClinicSectionEffects<HTMLDivElement>();
  const visibleDoctors = getVisibleDoctors(doctors);

  if (visibleDoctors.length === 0) return null;

  return (
    <section id="doctors" className="pt-[clamp(88px,10vw,144px)]">
      <div
        ref={sectionRef}
        className="mx-auto w-full max-w-[1360px] px-4 sm:px-6 lg:px-8"
      >
        <div className="reveal mb-8 grid gap-4 lg:mb-10">
          <span className="inline-flex items-center gap-3 text-[0.8rem] uppercase tracking-[0.22em] text-white/80">
            <span className="h-px w-10 bg-[linear-gradient(90deg,transparent,rgba(0,161,214,0.9))]" />
            <span>Doctors / expertise</span>
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

            return (
              <article
                key={doctor.id}
                className="reveal flex min-h-[252px] flex-col rounded-[24px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent_34%),rgba(255,255,255,0.028)] p-6 shadow-[var(--shadow-card)] transition-all duration-300 ease-[var(--ease)] hover:-translate-y-1 hover:border-[rgba(0,161,214,0.3)]"
                data-delay={String((index % 3) + 1)}
              >
                <div className="relative h-[74px] w-[74px] rounded-full border border-[rgba(0,161,214,0.38)] bg-[radial-gradient(circle_at_center,rgba(0,161,214,0.1),transparent_62%),rgba(255,255,255,0.025)]">
                  <div className="absolute inset-[7px] overflow-hidden rounded-full border border-white/8">
                    {photoSrc ? (
                      <img
                        src={photoSrc}
                        alt={doctor.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center bg-[linear-gradient(135deg,rgba(0,161,214,0.18),transparent)]">
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

                <div className="mt-auto pt-6 text-[0.82rem] uppercase tracking-[0.08em] text-white/52">
                  Doctor / {String(index + 1).padStart(2, "0")}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
