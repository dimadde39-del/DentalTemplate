"use client";

import { ArrowUpRight, Plus } from "lucide-react";
import { useState } from "react";
import { ClinicService } from "@/config/site";
import { useBooking } from "@/context/BookingContext";
import {
  formatServicePrice,
  getVisibleServices,
  isBracketService,
  isFeaturedConsultation,
} from "./utils";
import { useClinicSectionEffects } from "./useClinicSectionEffects";

interface ServicesGridProps {
  readonly services: readonly ClinicService[];
  readonly title: string;
  readonly subtitle: string;
}

function getServiceIndex(index: number): string {
  return String(index + 1).padStart(2, "0");
}

export function ServicesGrid({
  services,
  title,
  subtitle,
}: ServicesGridProps) {
  const { openBooking } = useBooking();
  const sectionRef = useClinicSectionEffects<HTMLDivElement>();
  const [isBracesOpen, setIsBracesOpen] = useState(false);

  const visibleServices = getVisibleServices(services);
  const featuredService =
    visibleServices.find(isFeaturedConsultation) ?? null;
  const bracesServices = visibleServices.filter(isBracketService);
  const regularServices = visibleServices.filter((service) => {
    if (featuredService?.id === service.id) return false;
    if (isBracketService(service)) return false;
    return true;
  });

  if (visibleServices.length === 0) return null;

  return (
    <section id="services" className="pt-[clamp(88px,10vw,144px)]">
      <div
        ref={sectionRef}
        className="mx-auto w-full max-w-[1360px] px-4 sm:px-6 lg:px-8"
      >
        <div className="reveal mb-8 grid gap-4 lg:mb-10">
          <span className="inline-flex items-center gap-3 text-[0.8rem] uppercase tracking-[0.22em] text-white/80">
            <span className="h-px w-10 bg-[linear-gradient(90deg,transparent,rgba(0,161,214,0.9))]" />
            <span>Services / precision</span>
          </span>
          <h2 className="max-w-[12ch] text-[clamp(2.1rem,4vw,4rem)] font-bold leading-[0.98] tracking-[-0.06em] text-[var(--text)]">
            {title}
          </h2>
          {subtitle.trim() ? (
            <p className="max-w-[64ch] text-base leading-8 text-[var(--muted)]">
              {subtitle}
            </p>
          ) : null}
        </div>

        <div className="grid gap-4">
          {featuredService ? (
            <button
              type="button"
              onClick={() => openBooking(featuredService.name)}
              className="reveal relative overflow-hidden rounded-[30px] border border-[rgba(0,161,214,0.2)] bg-[linear-gradient(135deg,rgba(0,161,214,0.16),rgba(255,255,255,0.03)_52%,rgba(255,255,255,0.02)),rgba(255,255,255,0.03)] p-7 text-left shadow-[var(--shadow-card)] transition-all duration-300 ease-[var(--ease)] hover:-translate-y-1 hover:border-[rgba(0,161,214,0.34)] sm:p-8"
            >
              <div className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full border border-white/8 opacity-55" />

              <div className="relative grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
                <div>
                  <span className="inline-flex min-h-10 items-center rounded-full border border-white/10 bg-black/15 px-4 text-[0.78rem] uppercase tracking-[0.16em] text-white/76">
                    Featured service
                  </span>
                  <h3 className="mt-4 max-w-[12ch] text-[clamp(2rem,4vw,3.3rem)] font-bold leading-[0.98] tracking-[-0.06em] text-[var(--text)]">
                    {featuredService.name}
                  </h3>
                  {featuredService.description?.trim() ? (
                    <p className="mt-4 max-w-[58ch] text-base leading-8 text-white/78">
                      {featuredService.description}
                    </p>
                  ) : null}
                </div>

                <div className="inline-flex items-baseline gap-3 rounded-[18px] border border-white/10 bg-black/30 px-4 py-4 backdrop-blur">
                  <span className="text-[0.8rem] uppercase tracking-[0.16em] text-white/60">
                    стоимость
                  </span>
                  <strong className="font-display text-[2rem] leading-none tracking-[-0.06em] text-[var(--text)]">
                    {formatServicePrice(featuredService.price)}
                  </strong>
                </div>
              </div>
            </button>
          ) : null}

          {regularServices.length > 0 ? (
            <div className="grid gap-4 xl:grid-cols-3">
              {regularServices.map((service, index) => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => openBooking(service.name)}
                  className="group reveal grid min-h-[220px] gap-4 rounded-[24px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent_34%),rgba(255,255,255,0.028)] p-6 text-left shadow-[var(--shadow-card)] transition-all duration-300 ease-[var(--ease)] hover:-translate-y-1 hover:border-[rgba(0,161,214,0.28)]"
                  data-delay={String((index % 3) + 1)}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-[12px] border border-white/8 text-[0.78rem] uppercase tracking-[0.14em] text-[var(--muted-soft)]">
                      {getServiceIndex(index)}
                    </span>
                    <span className="font-display text-[1.45rem] leading-none tracking-[-0.06em] text-[var(--text)]">
                      {formatServicePrice(service.price)}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-[1.28rem] font-semibold leading-[1.18] text-[var(--text)]">
                      {service.name}
                    </h3>
                    {service.description?.trim() ? (
                      <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                        {service.description}
                      </p>
                    ) : null}
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-4 text-[0.82rem] uppercase tracking-[0.08em] text-white/54">
                    <span>подробнее</span>
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-[14px] border border-white/10 bg-white/[0.03] text-[var(--text)] transition-all duration-300 ease-[var(--ease)] group-hover:border-[rgba(0,161,214,0.34)]">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : null}

          {bracesServices.length > 0 ? (
            <article
              className={`reveal overflow-hidden rounded-[24px] border bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent_34%),rgba(255,255,255,0.028)] shadow-[var(--shadow-card)] transition-all duration-300 ease-[var(--ease)] ${
                isBracesOpen
                  ? "border-[rgba(0,161,214,0.28)]"
                  : "border-white/8"
              }`}
            >
              <button
                type="button"
                aria-expanded={isBracesOpen}
                aria-controls="braces-panel"
                onClick={() => setIsBracesOpen((open) => !open)}
                className="w-full px-6 py-6 text-left sm:px-7"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="grid gap-4">
                    <span className="inline-flex min-h-10 w-fit items-center gap-2 rounded-full border border-white/8 bg-white/[0.02] px-4 text-sm text-[var(--muted)]">
                      <Plus className="h-4 w-4 text-[var(--accent)]" />
                      <span>Ортодонтический пакет</span>
                    </span>

                    <div>
                      <h3 className="text-[clamp(1.35rem,2vw,1.8rem)] font-semibold leading-tight text-[var(--text)]">
                        Брекеты в одном раскрывающемся блоке
                      </h3>
                      <p className="mt-3 max-w-[66ch] text-sm leading-7 text-[var(--muted)] sm:text-base">
                        Все варианты брекет-систем собраны в одном месте, чтобы
                        не дробить сетку на несколько однотипных карточек.
                      </p>
                    </div>
                  </div>

                  <span
                    className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] border bg-white/[0.03] text-[var(--text)] transition-all duration-300 ease-[var(--ease)] ${
                      isBracesOpen
                        ? "rotate-45 border-[rgba(0,161,214,0.34)] bg-[rgba(0,161,214,0.08)]"
                        : "border-white/10"
                    }`}
                    aria-hidden="true"
                  >
                    <Plus className="h-4 w-4" />
                  </span>
                </div>
              </button>

              <div
                id="braces-panel"
                aria-hidden={!isBracesOpen}
                className={`grid transition-[grid-template-rows] duration-300 ease-[var(--ease)] ${
                  isBracesOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="min-h-0 overflow-hidden">
                  <ul className="grid gap-3 px-6 pb-6 sm:px-7 sm:pb-7">
                    {bracesServices.map((service) => (
                      <li
                        key={service.id}
                        className="flex flex-col gap-2 rounded-[18px] border border-white/6 bg-white/[0.02] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                      >
                        <div>
                          <p className="text-sm font-medium text-[var(--text)] sm:text-base">
                            {service.name}
                          </p>
                          {service.description?.trim() ? (
                            <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                              {service.description}
                            </p>
                          ) : null}
                        </div>

                        <span className="shrink-0 font-display text-[1.2rem] leading-none text-white/84">
                          {formatServicePrice(service.price)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ) : null}
        </div>
      </div>
    </section>
  );
}
