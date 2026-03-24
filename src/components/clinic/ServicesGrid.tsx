"use client";

import { ArrowUpRight } from "lucide-react";
import { ClinicService, SiteConfig } from "@/config/site";
import { useBooking } from "@/context/BookingContext";

interface ServicesGridProps {
  readonly config: SiteConfig;
}

type SortableService = ClinicService & {
  readonly is_featured?: boolean | null;
};

function formatTenge(value: number): string {
  const normalized = Math.trunc(value).toString();
  return `${normalized.replace(/\B(?=(\d{3})+(?!\d))/g, " ")} \u20B8`;
}

function formatServicePrice(price: string | null | undefined): string {
  const raw = price?.trim();
  if (!raw) return "\u0426\u0435\u043d\u0430 \u043f\u043e \u0437\u0430\u043f\u0440\u043e\u0441\u0443";

  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) {
    return "\u0426\u0435\u043d\u0430 \u043f\u043e \u0437\u0430\u043f\u0440\u043e\u0441\u0443";
  }

  const numeric = Number(digits);
  if (!Number.isFinite(numeric) || numeric <= 0) {
    return "\u0426\u0435\u043d\u0430 \u043f\u043e \u0437\u0430\u043f\u0440\u043e\u0441\u0443";
  }

  const isApproximate = /(\u043e\u0442|from|\u2248|~|\+|[-\u2013\u2014])/i.test(raw);
  const formatted = formatTenge(numeric);

  return isApproximate
    ? `\u043e\u0442 ${formatted}`
    : formatted;
}

function getSortedServices(services: readonly ClinicService[]): SortableService[] {
  return [...services]
    .map((service) => service as SortableService)
    .filter((service) => service.name?.trim())
    .sort(
      (left, right) => Number(Boolean(right.is_featured)) - Number(Boolean(left.is_featured))
    );
}

export function ServicesGrid({ config }: ServicesGridProps) {
  const services = getSortedServices(config.services);
  const { openBooking } = useBooking();

  if (services.length === 0) return null;

  return (
    <section id="services" className="bg-background py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-left sm:text-center">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-[var(--color-primary)]/80">
            {config.servicesTitle}
          </p>
          <h2 className="mt-3 text-3xl font-black leading-[0.98] tracking-[-0.04em] text-foreground sm:text-4xl lg:text-5xl">
            {config.servicesTitle}
          </h2>
          {config.servicesSubtitle?.trim() ? (
            <p className="mt-4 text-base leading-7 text-foreground/72 sm:text-lg">
              {config.servicesSubtitle}
            </p>
          ) : null}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 md:mt-14 md:grid-cols-2 md:gap-6">
          {services.map((service) => (
            <button
              key={service.id}
              type="button"
              onClick={() => openBooking(service.name)}
              className="group relative flex min-h-[220px] w-full flex-col justify-between overflow-hidden rounded-[28px] border border-foreground/8 bg-foreground/[0.03] p-5 text-left ring-1 ring-white/5 transition-[transform,box-shadow,border-color] duration-200 md:p-7 md:hover:scale-[1.02] md:hover:border-[var(--color-primary)] md:hover:shadow-[0_18px_50px_color-mix(in_oklab,var(--color-primary)_16%,transparent)]"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-primary)]/60 to-transparent opacity-60" />

              <div>
                <p className="text-[1.6rem] font-black leading-none tracking-[-0.04em] text-foreground sm:text-[1.85rem]">
                  {formatServicePrice(service.price)}
                </p>

                <h3 className="mt-5 text-2xl font-bold leading-tight tracking-[-0.03em] text-foreground">
                  {service.name}
                </h3>

                {service.description?.trim() ? (
                  <p className="mt-3 line-clamp-1 text-sm leading-6 text-foreground/68 sm:text-base">
                    {service.description}
                  </p>
                ) : null}
              </div>

              <div className="mt-8 flex items-center justify-between text-sm font-semibold text-foreground/76">
                <span>{"\u041f\u043e\u0434\u0440\u043e\u0431\u043d\u0435\u0435"}</span>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-foreground/10 bg-white/5 text-[var(--color-primary)] transition-transform duration-200 md:group-hover:translate-x-1">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
