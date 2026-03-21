import { ClinicDoctor, SiteConfig } from "@/config/site";

interface DoctorsRailProps {
  readonly config: SiteConfig;
}

type RailDoctor = ClinicDoctor & {
  readonly years_experience?: number | null;
  readonly experience_years?: number | null;
  readonly experience_label?: string | null;
};

function normalizeDoctorPhotoSrc(photoUrl: string | null | undefined): string | null {
  const trimmed = photoUrl?.trim();
  if (!trimmed) return null;

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  const normalized = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;

  if (normalized.startsWith("/doctors/") && normalized.endsWith(".jpg")) {
    return normalized.replace(/\.jpg$/i, ".png");
  }

  return normalized;
}

function getDoctorInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function getDoctorExperienceLabel(doctor: RailDoctor): string | null {
  if (doctor.experience_label?.trim()) {
    return doctor.experience_label.trim();
  }

  const years = doctor.years_experience ?? doctor.experience_years;
  if (!years || years <= 0) return null;

  return `${years}+ лет опыта`;
}

function getVisibleDoctors(doctors: readonly ClinicDoctor[]): RailDoctor[] {
  return doctors.filter((doctor) => doctor.name?.trim()) as RailDoctor[];
}

export function DoctorsRail({ config }: DoctorsRailProps) {
  const doctors = getVisibleDoctors(config.doctors);

  if (doctors.length === 0) return null;

  return (
    <section id="doctors" className="bg-background py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-left sm:text-center">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-[var(--color-primary)]/80">
            {config.doctorsTitle}
          </p>
          <h2 className="mt-3 text-3xl font-black leading-[0.98] tracking-[-0.04em] text-foreground sm:text-4xl lg:text-5xl">
            {config.doctorsTitle}
          </h2>
          {config.doctorsSubtitle?.trim() ? (
            <p className="mt-4 text-base leading-7 text-foreground/72 sm:text-lg">
              {config.doctorsSubtitle}
            </p>
          ) : null}
        </div>

        <div className="-mx-4 mt-10 overflow-x-auto px-4 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:mx-0 lg:mt-14 lg:overflow-visible lg:px-0">
          <div className="flex snap-x snap-mandatory gap-4 pb-2 lg:grid lg:grid-cols-5 lg:gap-5 lg:pb-0">
            {doctors.map((doctor) => {
              const experienceLabel = getDoctorExperienceLabel(doctor);
              const photoSrc = normalizeDoctorPhotoSrc(doctor.photo_url);

              return (
                <article
                  key={doctor.id}
                  className="group w-[16.5rem] shrink-0 snap-start overflow-hidden rounded-[28px] border border-foreground/8 bg-foreground/[0.03] ring-1 ring-white/5 transition-[transform,box-shadow,border-color] duration-200 lg:w-auto lg:shrink lg:hover:scale-[1.02] lg:hover:border-[var(--color-primary)] lg:hover:shadow-[0_18px_50px_color-mix(in_oklab,var(--color-primary)_14%,transparent)]"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-[var(--color-primary)]/10">
                    {photoSrc ? (
                      <img
                        src={photoSrc}
                        alt={doctor.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-[var(--color-primary)]/16 to-transparent text-5xl font-black tracking-[-0.04em] text-[var(--color-primary)]">
                        {getDoctorInitials(doctor.name)}
                      </div>
                    )}

                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>

                  <div className="p-5">
                    <h3 className="text-xl font-bold leading-tight tracking-[-0.03em] text-foreground">
                      {doctor.name}
                    </h3>

                    {doctor.specialty?.trim() ? (
                      <p className="mt-2 text-sm leading-6 text-foreground/68">
                        {doctor.specialty}
                      </p>
                    ) : null}

                    {experienceLabel ? (
                      <p className="mt-4 inline-flex rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
                        {experienceLabel}
                      </p>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
