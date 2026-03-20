import Image from "next/image";
import { SiteConfig } from "@/config/site";

interface DoctorsProps {
  readonly config: SiteConfig;
}

export function Doctors({ config }: DoctorsProps) {
  if (config.doctors.length === 0) return null;

  return (
    <section id="doctors" className="py-24 bg-white dark:bg-zinc-900">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-bold tracking-widest text-[var(--color-primary)] uppercase mb-3">
            {config.doctorsTitle}
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-6 line-tight tracking-tight">
            {config.doctorsTitle}
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            {config.doctorsSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {config.doctors.map((doctor) => (
            <article
              key={doctor.id}
              className="overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 shadow-sm"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-primary)]/10">
                {doctor.photo_url ? (
                  <Image
                    src={doctor.photo_url}
                    alt={doctor.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1280px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-5xl font-black text-[var(--color-primary)]">
                    {doctor.name
                      .split(" ")
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((part) => part[0]?.toUpperCase())
                      .join("")}
                  </div>
                )}
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                  {doctor.name}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {doctor.specialty}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
