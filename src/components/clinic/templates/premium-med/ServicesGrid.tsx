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
  title: "Полный спектр клинической стоматологии",
  subtitle:
    "От первичной диагностики и терапии до ортодонтии, хирургии и имплантации — в едином спокойном клиническом стандарте.",
  featuredBadge: "Первый шаг",
  priceLabel: "стоимость",
  moreLabel: "подробнее",
  bracesBadge: "Ортодонтия",
  bracesTitle: "Брекет-системы собраны в одном деликатном раскрывающемся блоке",
  bracesDescription:
    "Так легче сравнить варианты и обсудить лечение без перегруженной сетки и визуального шума.",
  fallbackPrice: "Цена по запросу",
} as const;

function getPrice(price: string | null | undefined): string {
  return price?.trim() || SECTION_LABELS.fallbackPrice;
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
    <section id="services" className="pt-[clamp(92px,10vw,148px)]">
      <div
        ref={sectionRef}
        className="mx-auto w-full max-w-[1380px] px-4 sm:px-6 lg:px-8"
      >
        <div className="mb-10 grid gap-5 border-b border-[var(--line)] pb-8 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,0.7fr)] lg:items-end">
          <div className="reveal">
            <span className="inline-flex items-center gap-3 text-[0.76rem] uppercase tracking-[0.22em] text-[var(--muted)]">
              <span className="h-px w-10 bg-[linear-gradient(90deg,transparent,var(--accent),transparent)]" />
              <span>{SECTION_LABELS.eyebrow}</span>
            </span>
            <h2
              className={`mt-4 max-w-[14ch] text-[clamp(2.5rem,4.4vw,4.9rem)] leading-[0.92] tracking-[-0.05em] text-[var(--text)] italic ${premiumHeading.className}`}
            >
              {title?.trim() || SECTION_LABELS.title}
            </h2>
          </div>

          <p className="reveal max-w-[56ch] text-[1rem] leading-8 text-[var(--muted)] lg:justify-self-end lg:text-[1.05rem]">
            {subtitle?.trim() || SECTION_LABELS.subtitle}
          </p>
        </div>

        <div className="grid gap-5">
          {featuredService ? (
            <button
              type="button"
              onClick={() => openBooking(featuredService.name)}
              className="reveal relative overflow-hidden rounded-[28px] border border-[var(--line)] bg-white p-7 text-left shadow-[var(--shadow-card)] transition-all duration-300 ease-[var(--ease)] hover:-translate-y-1 hover:border-[var(--line-strong)] hover:shadow-[0_24px_38px_rgba(26,26,25,0.06)] sm:p-8 lg:p-10"
            >
              <div className="absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--accent),transparent)]" />

              <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
                <div className="max-w-3xl">
                  <span className="inline-flex min-h-9 items-center rounded-[999px] border border-[var(--line)] bg-[var(--accent-pale)] px-3 text-[0.72rem] uppercase tracking-[0.18em] text-[var(--muted)]">
                    {SECTION_LABELS.featuredBadge}
                  </span>

                  <h3
                    className={`mt-5 max-w-[12ch] text-[clamp(2.35rem,4.1vw,4rem)] leading-[0.94] tracking-[-0.045em] text-[var(--text)] italic ${premiumHeading.className}`}
                  >
                    {featuredService.name}
                  </h3>

                  {featuredService.description?.trim() ? (
                    <p className="mt-5 max-w-[58ch] text-[1rem] leading-8 text-[var(--muted)]">
                      {featuredService.description}
                    </p>
                  ) : null}
                </div>

                <div className="grid gap-3 rounded-[20px] border border-[var(--line)] bg-[var(--surface-strong)] px-5 py-5">
                  <span className="text-[0.72rem] uppercase tracking-[0.16em] text-[var(--muted)]">
                    {SECTION_LABELS.priceLabel}
                  </span>
                  <strong
                    className={`text-[2rem] leading-none tracking-[-0.05em] text-[var(--accent)] ${premiumHeading.className}`}
                  >
                    {getPrice(featuredService.price)}
                  </strong>
                </div>
              </div>
            </button>
          ) : null}

          {regularServices.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {regularServices.map((service, index) => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => openBooking(service.name)}
                  className="group reveal relative overflow-hidden rounded-[24px] border border-[var(--line)] bg-white p-6 text-left shadow-[var(--shadow-card)] transition-all duration-300 ease-[var(--ease)] hover:-translate-y-1 hover:border-[var(--line-strong)] hover:shadow-[0_24px_36px_rgba(26,26,25,0.055)] sm:p-7"
                  data-delay={String((index % 3) + 1)}
                >
                  <div className="absolute inset-x-6 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--accent),transparent)]" />

                  <div className="flex items-start justify-between gap-5">
                    <h3
                      className={`max-w-[14ch] text-[1.55rem] leading-[1.04] text-[var(--text)] italic ${premiumHeading.className}`}
                    >
                      {service.name}
                    </h3>

                    <div className="shrink-0 text-right">
                      <span className="block text-[0.7rem] uppercase tracking-[0.16em] text-[var(--muted)]">
                        {SECTION_LABELS.priceLabel}
                      </span>
                      <span
                        className={`mt-2 block text-[1.2rem] leading-none text-[var(--accent)] ${premiumHeading.className}`}
                      >
                        {getPrice(service.price)}
                      </span>
                    </div>
                  </div>

                  {service.description?.trim() ? (
                    <p className="mt-5 max-w-[54ch] text-sm leading-7 text-[var(--muted)] sm:text-[0.98rem]">
                      {service.description}
                    </p>
                  ) : null}

                  <div className="mt-6 flex items-center justify-between gap-4 border-t border-[var(--line)] pt-4 text-[0.76rem] uppercase tracking-[0.16em] text-[var(--muted)]">
                    <span>{SECTION_LABELS.moreLabel}</span>
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-[var(--line)] text-[var(--text)] transition-all duration-300 ease-[var(--ease)] group-hover:border-[var(--accent)] group-hover:text-[var(--accent)]">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : null}

          {bracesServices.length > 0 ? (
            <article
              className={`reveal relative overflow-hidden rounded-[28px] border bg-white shadow-[var(--shadow-card)] transition-all duration-300 ease-[var(--ease)] ${
                isBracesOpen ? "border-[var(--line-strong)]" : "border-[var(--line)]"
              }`}
            >
              <div className="absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--accent),transparent)]" />

              <button
                type="button"
                aria-expanded={isBracesOpen}
                aria-controls="braces-panel-premium-med"
                onClick={() => setIsBracesOpen((open) => !open)}
                className="w-full px-6 py-6 text-left sm:px-7 sm:py-7"
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="grid gap-4">
                    <span className="inline-flex min-h-9 w-fit items-center gap-2 rounded-[999px] border border-[var(--line)] bg-[var(--accent-pale)] px-3 text-[0.72rem] uppercase tracking-[0.18em] text-[var(--muted)]">
                      <Plus className="h-4 w-4 text-[var(--accent)]" />
                      <span>{SECTION_LABELS.bracesBadge}</span>
                    </span>

                    <div>
                      <h3
                        className={`max-w-[18ch] text-[clamp(1.65rem,2.4vw,2.3rem)] leading-[1.02] text-[var(--text)] italic ${premiumHeading.className}`}
                      >
                        {SECTION_LABELS.bracesTitle}
                      </h3>
                      <p className="mt-3 max-w-[64ch] text-sm leading-7 text-[var(--muted)] sm:text-[0.98rem]">
                        {SECTION_LABELS.bracesDescription}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 lg:pt-1">
                    <span className="text-[0.74rem] uppercase tracking-[0.18em] text-[var(--muted)]">
                      {bracesServices.length} варианта
                    </span>
                    <span
                      className={`inline-flex h-10 w-10 items-center justify-center rounded-[10px] border text-[var(--text)] transition-all duration-300 ease-[var(--ease)] ${
                        isBracesOpen
                          ? "rotate-45 border-[var(--accent)] text-[var(--accent)]"
                          : "border-[var(--line)]"
                      }`}
                      aria-hidden="true"
                    >
                      <Plus className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </button>

              <div
                id="braces-panel-premium-med"
                aria-hidden={!isBracesOpen}
                className={`grid transition-[grid-template-rows] duration-300 ease-[var(--ease)] ${
                  isBracesOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="min-h-0 overflow-hidden border-t border-[var(--line)]">
                  <ul className="grid gap-4 px-6 py-6 sm:grid-cols-2 sm:px-7 sm:py-7 xl:grid-cols-3">
                    {bracesServices.map((service) => (
                      <li
                        key={service.id}
                        className="grid gap-3 rounded-[18px] border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <p className="max-w-[18ch] text-sm leading-6 text-[var(--text)] sm:text-[0.98rem]">
                            {service.name}
                          </p>
                          <span
                            className={`shrink-0 text-[1.05rem] leading-none text-[var(--accent)] ${premiumHeading.className}`}
                          >
                            {getPrice(service.price)}
                          </span>
                        </div>

                        {service.description?.trim() ? (
                          <p className="text-sm leading-6 text-[var(--muted)]">
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
