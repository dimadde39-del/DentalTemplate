"use client";

import { ArrowUpRight, Plus } from "lucide-react";
import { useState } from "react";
import { useBooking } from "@/context/BookingContext";
import type { ServicesGridProps } from "@/components/clinic/template-props";
import {
  formatServicePrice,
  getVisibleServices,
  isBracketService,
  isFeaturedConsultation,
} from "@/components/clinic/utils";
import { useClinicSectionEffects } from "@/components/clinic/useClinicSectionEffects";
import {
  warmClinicBodyFont,
  warmClinicHeadingFont,
} from "./fonts";

const SECTION_LABELS = {
  eyebrow: "Что мы лечим",
  title: "Тёплые решения для лечения и эстетики",
  subtitle:
    "От профилактики до ортодонтии — каждый план лечения собирается спокойно, понятно и без перегруза.",
  featuredBadge: "С чего начать",
  priceLabel: "стоимость",
  moreLabel: "подробнее",
  bracesBadge: "Брекеты",
  bracesTitle: "Все варианты брекет-систем в одной карточке",
  bracesDescription:
    "Собрали основные варианты в одном месте, чтобы сравнивать было удобно и без лишней навигации.",
} as const;

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
  const featuredService = visibleServices.find(isFeaturedConsultation) ?? null;
  const bracesServices = visibleServices.filter(isBracketService);
  const regularServices = visibleServices.filter((service) => {
    if (featuredService?.id === service.id) return false;
    if (isBracketService(service)) return false;
    return true;
  });

  if (visibleServices.length === 0) return null;

  return (
    <section
      id="services"
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
            className={`max-w-[13ch] text-[clamp(2.2rem,4vw,4.2rem)] leading-[1] tracking-[-0.04em] text-[var(--text)] italic ${warmClinicHeadingFont.className}`}
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
              className="reveal relative overflow-hidden rounded-[32px] border border-[var(--line)] bg-[linear-gradient(135deg,white,var(--bg-soft))] p-7 text-left shadow-[0_24px_54px_rgba(15,42,53,0.08)] transition-all duration-300 ease-[var(--ease)] hover:-translate-y-1 hover:border-[var(--accent)] sm:p-8"
            >
              <div className="absolute -right-16 top-0 h-44 w-44 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--accent)_24%,transparent),transparent_68%)]" />
              <div className="relative grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
                <div>
                  <span className="inline-flex min-h-10 items-center rounded-full border border-[var(--line)] bg-[var(--accent-pale)] px-4 text-[0.78rem] uppercase tracking-[0.16em] text-[var(--muted)]">
                    {SECTION_LABELS.featuredBadge}
                  </span>
                  <h3
                    className={`mt-4 max-w-[12ch] text-[clamp(2.1rem,4vw,3.4rem)] leading-[1] tracking-[-0.04em] text-[var(--text)] italic ${warmClinicHeadingFont.className}`}
                  >
                    {featuredService.name}
                  </h3>
                  {featuredService.description?.trim() ? (
                    <p className="mt-4 max-w-[58ch] text-base leading-8 text-[var(--muted)]">
                      {featuredService.description}
                    </p>
                  ) : null}
                </div>

                <div className="inline-flex items-baseline gap-3 rounded-[22px] border border-[var(--line)] bg-white px-4 py-4">
                  <span className="text-[0.8rem] uppercase tracking-[0.16em] text-[var(--muted-soft)]">
                    {SECTION_LABELS.priceLabel}
                  </span>
                  <strong className="text-[2rem] leading-none tracking-[-0.05em] text-[var(--text)]">
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
                  className="group reveal grid min-h-[220px] gap-4 rounded-[26px] border border-[var(--line)] bg-white p-6 text-left shadow-[0_18px_42px_rgba(15,42,53,0.06)] transition-all duration-300 ease-[var(--ease)] hover:-translate-y-1 hover:border-[var(--accent)]"
                  data-delay={String((index % 3) + 1)}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="inline-flex h-11 min-w-11 items-center justify-center rounded-full bg-[var(--accent-soft)] px-3 text-[0.76rem] uppercase tracking-[0.14em] text-[var(--muted)]">
                      {getServiceIndex(index)}
                    </span>
                    <span className="text-[1.35rem] leading-none tracking-[-0.05em] text-[var(--text)]">
                      {formatServicePrice(service.price)}
                    </span>
                  </div>

                  <div>
                    <h3
                      className={`text-[1.36rem] leading-[1.16] text-[var(--text)] italic ${warmClinicHeadingFont.className}`}
                    >
                      {service.name}
                    </h3>
                    {service.description?.trim() ? (
                      <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                        {service.description}
                      </p>
                    ) : null}
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-4 text-[0.82rem] uppercase tracking-[0.08em] text-[var(--muted-soft)]">
                    <span>{SECTION_LABELS.moreLabel}</span>
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--accent-pale)] text-[var(--text)] transition-all duration-300 ease-[var(--ease)] group-hover:border-[var(--accent)]">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : null}

          {bracesServices.length > 0 ? (
            <article
              className={`reveal overflow-hidden rounded-[28px] border bg-white shadow-[0_18px_42px_rgba(15,42,53,0.06)] transition-all duration-300 ease-[var(--ease)] ${
                isBracesOpen ? "border-[var(--accent)]" : "border-[var(--line)]"
              }`}
            >
              <button
                type="button"
                aria-expanded={isBracesOpen}
                aria-controls="braces-panel-warm-clinic"
                onClick={() => setIsBracesOpen((open) => !open)}
                className="w-full px-6 py-6 text-left sm:px-7"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="grid gap-4">
                    <span className="inline-flex min-h-10 w-fit items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--accent-pale)] px-4 text-sm text-[var(--muted)]">
                      <Plus className="h-4 w-4 text-[var(--accent)]" />
                      <span>{SECTION_LABELS.bracesBadge}</span>
                    </span>

                    <div>
                      <h3
                        className={`text-[clamp(1.4rem,2vw,1.9rem)] leading-tight text-[var(--text)] italic ${warmClinicHeadingFont.className}`}
                      >
                        {SECTION_LABELS.bracesTitle}
                      </h3>
                      <p className="mt-3 max-w-[66ch] text-sm leading-7 text-[var(--muted)] sm:text-base">
                        {SECTION_LABELS.bracesDescription}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border bg-[var(--accent-pale)] text-[var(--text)] transition-all duration-300 ease-[var(--ease)] ${
                      isBracesOpen
                        ? "rotate-45 border-[var(--accent)]"
                        : "border-[var(--line)]"
                    }`}
                    aria-hidden="true"
                  >
                    <Plus className="h-4 w-4" />
                  </span>
                </div>
              </button>

              <div
                id="braces-panel-warm-clinic"
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
                        className="rounded-[20px] border border-[var(--line)] bg-[linear-gradient(180deg,white,var(--accent-pale))] px-4 py-4"
                      >
                        <p className="text-sm font-medium text-[var(--text)] sm:text-base">
                          {service.name}
                        </p>
                        {service.description?.trim() ? (
                          <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                            {service.description}
                          </p>
                        ) : null}
                        <span className="mt-3 block text-[1.18rem] leading-none text-[var(--text)]">
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
