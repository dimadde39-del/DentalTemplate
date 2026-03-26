"use client";

import { ArrowUpRight, Plus } from "lucide-react";
import { useState } from "react";
import { useBooking } from "@/context/BookingContext";
import type { ServicesGridProps } from "@/components/clinic/template-props";
import {
  getVisibleServices,
  isBracketService,
  isFeaturedConsultation,
} from "@/components/clinic/utils";
import { useClinicSectionEffects } from "@/components/clinic/useClinicSectionEffects";
import { premiumHeading } from "./fonts";

const SECTION_LABELS = {
  eyebrow: "Услуги клиники",
  title: "Полный спектр современной стоматологии",
  subtitle:
    "Диагностика, терапия, ортодонтия, хирургия и имплантация в одном медицинском контуре.",
  featuredBadge: "Первичный прием",
  priceLabel: "стоимость",
  moreLabel: "подробнее",
  bracesBadge: "Брекет-системы",
  bracesTitle: "Варианты брекет-систем в одном раскрывающемся блоке",
  bracesDescription:
    "Собираем ортодонтические решения в одной карточке, чтобы цены и различия было легко сравнить без перегрузки страницы.",
} as const;

function renderPrice(price: string | null | undefined): string {
  return price?.trim() || "Цена по запросу";
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
  const featuredService = visibleServices.find(isFeaturedConsultation) ?? null;
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
          <span className="inline-flex items-center gap-3 text-[0.78rem] uppercase tracking-[0.2em] text-[var(--muted)]">
            <span className="h-px w-10 bg-[var(--accent)]" />
            <span>{SECTION_LABELS.eyebrow}</span>
          </span>
          <h2
            className={`max-w-[14ch] text-[clamp(2.2rem,4vw,4.2rem)] leading-[0.98] tracking-[-0.045em] text-[var(--text)] ${premiumHeading.className}`}
          >
            {title?.trim() || SECTION_LABELS.title}
          </h2>
          <p className="max-w-[64ch] text-base leading-8 text-[var(--muted)]">
            {subtitle?.trim() || SECTION_LABELS.subtitle}
          </p>
        </div>

        <div className="grid gap-4">
          {featuredService ? (
            <button
              type="button"
              onClick={() => openBooking(featuredService.name)}
              className="reveal group overflow-hidden rounded-[20px] border border-[var(--line)] bg-white p-7 text-left shadow-[var(--shadow-card)] transition-all duration-300 ease-[var(--ease)] hover:-translate-y-1 hover:border-[color-mix(in_oklab,var(--accent)_35%,var(--line))] sm:p-8"
            >
              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
                <div>
                  <span className="inline-flex min-h-9 items-center rounded-md border border-[color-mix(in_oklab,var(--accent)_24%,var(--line))] bg-[color-mix(in_oklab,var(--accent)_8%,white)] px-3 text-[0.76rem] uppercase tracking-[0.16em] text-[var(--muted)]">
                    {SECTION_LABELS.featuredBadge}
                  </span>
                  <h3
                    className={`mt-4 max-w-[12ch] text-[clamp(2rem,3.8vw,3.2rem)] leading-[1] tracking-[-0.04em] text-[var(--text)] ${premiumHeading.className}`}
                  >
                    {featuredService.name}
                  </h3>
                  {featuredService.description?.trim() ? (
                    <p className="mt-4 max-w-[58ch] text-base leading-8 text-[var(--muted)]">
                      {featuredService.description}
                    </p>
                  ) : null}
                </div>

                <div className="inline-flex items-baseline gap-3 rounded-[14px] border border-[var(--line)] bg-[#FCFCFA] px-4 py-4">
                  <span className="text-[0.78rem] uppercase tracking-[0.16em] text-[var(--muted)]">
                    {SECTION_LABELS.priceLabel}
                  </span>
                  <strong
                    className={`text-[1.9rem] leading-none tracking-[-0.05em] text-[var(--accent)] ${premiumHeading.className}`}
                  >
                    {renderPrice(featuredService.price)}
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
                  className="group reveal grid min-h-[218px] gap-4 rounded-[18px] border border-[var(--line)] bg-white p-6 text-left shadow-[var(--shadow-card)] transition-all duration-300 ease-[var(--ease)] hover:-translate-y-1 hover:border-[color-mix(in_oklab,var(--accent)_35%,var(--line))]"
                  data-delay={String((index % 3) + 1)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3
                      className={`max-w-[13ch] text-[1.34rem] leading-[1.14] text-[var(--text)] ${premiumHeading.className}`}
                    >
                      {service.name}
                    </h3>
                    <div className="shrink-0 text-right">
                      <span className="block text-[0.72rem] uppercase tracking-[0.14em] text-[var(--muted)]">
                        {SECTION_LABELS.priceLabel}
                      </span>
                      <span className={`mt-2 block text-[1.2rem] font-medium leading-none text-[var(--accent)] ${premiumHeading.className}`}>
                        {renderPrice(service.price)}
                      </span>
                    </div>
                  </div>

                  {service.description?.trim() ? (
                    <p className="text-sm leading-7 text-[var(--muted)]">
                      {service.description}
                    </p>
                  ) : (
                    <span />
                  )}

                  <div className="mt-auto flex items-center justify-between gap-4 border-t border-[var(--line)] pt-4 text-[0.78rem] uppercase tracking-[0.08em] text-[var(--muted)]">
                    <span>{SECTION_LABELS.moreLabel}</span>
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[var(--line)] text-[var(--text)] transition-colors group-hover:border-[var(--accent)] group-hover:text-[var(--accent)]">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : null}

          {bracesServices.length > 0 ? (
            <article
              className={`reveal overflow-hidden rounded-[20px] border bg-white shadow-[var(--shadow-card)] transition-all duration-300 ease-[var(--ease)] ${
                isBracesOpen ? "border-[color-mix(in_oklab,var(--accent)_35%,var(--line))]" : "border-[var(--line)]"
              }`}
            >
              <button
                type="button"
                aria-expanded={isBracesOpen}
                aria-controls="braces-panel-premium-med"
                onClick={() => setIsBracesOpen((open) => !open)}
                className="w-full px-6 py-6 text-left sm:px-7"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="grid gap-4">
                    <span className="inline-flex min-h-9 w-fit items-center gap-2 rounded-md border border-[color-mix(in_oklab,var(--accent)_24%,var(--line))] bg-[color-mix(in_oklab,var(--accent)_8%,white)] px-3 text-[0.78rem] uppercase tracking-[0.14em] text-[var(--muted)]">
                      <Plus className="h-4 w-4 text-[var(--accent)]" />
                      <span>{SECTION_LABELS.bracesBadge}</span>
                    </span>

                    <div>
                      <h3
                        className={`text-[clamp(1.45rem,2vw,2rem)] leading-tight text-[var(--text)] ${premiumHeading.className}`}
                      >
                        {SECTION_LABELS.bracesTitle}
                      </h3>
                      <p className="mt-3 max-w-[68ch] text-sm leading-7 text-[var(--muted)] sm:text-base">
                        {SECTION_LABELS.bracesDescription}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border text-[var(--text)] transition-all duration-300 ease-[var(--ease)] ${
                      isBracesOpen
                        ? "rotate-45 border-[var(--accent)] text-[var(--accent)]"
                        : "border-[var(--line)]"
                    }`}
                    aria-hidden="true"
                  >
                    <Plus className="h-4 w-4" />
                  </span>
                </div>
              </button>

              <div
                id="braces-panel-premium-med"
                aria-hidden={!isBracesOpen}
                className={`grid transition-[grid-template-rows] duration-300 ease-[var(--ease)] ${
                  isBracesOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="min-h-0 overflow-hidden">
                  <ul className="grid gap-3 px-6 pb-6 sm:grid-cols-2 sm:px-7 sm:pb-7">
                    {bracesServices.map((service) => (
                      <li
                        key={service.id}
                        className="rounded-[14px] border border-[var(--line)] bg-[#FCFCFA] px-4 py-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <p className="max-w-[20ch] text-sm font-medium text-[var(--text)] sm:text-base">
                            {service.name}
                          </p>
                          <span className={`shrink-0 text-[1.02rem] font-medium text-[var(--accent)] ${premiumHeading.className}`}>
                            {renderPrice(service.price)}
                          </span>
                        </div>
                        {service.description?.trim() ? (
                          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                            {service.description}
                          </p>
                        ) : null}
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
