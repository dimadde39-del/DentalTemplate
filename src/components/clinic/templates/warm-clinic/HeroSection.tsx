"use client";

import { MessageCircle, PhoneCall } from "lucide-react";
import { useBooking } from "@/context/BookingContext";
import type { HeroSectionProps } from "@/components/clinic/template-props";
import { toTelHref } from "@/components/clinic/utils";
import { useClinicSectionEffects } from "@/components/clinic/useClinicSectionEffects";
import {
  warmClinicBodyFont,
  warmClinicHeadingFont,
} from "./fonts";

interface StatCard {
  readonly id: string;
  readonly label: string;
  readonly valueText: string;
  readonly target?: number;
  readonly decimals?: number;
  readonly suffix?: string;
  readonly delay: string;
}

const HERO_LABELS = {
  eyebrow: "Тёплая забота о вашей улыбке",
  primaryCta: "Записаться",
  secondaryCta: "Позвонить",
  panelKicker: "быстрая связь",
  panelTitle: "Подберём удобное время и спокойно проведём через первый визит",
  phoneLabel: "Телефон",
  formatLabel: "Формат",
  formatValue: "WhatsApp или звонок",
  startLabel: "Первый шаг",
  startValue: "Начинаем с консультации",
  reviewsLabel: "отзывов",
  ratingLabel: "средняя оценка",
  specialistsLabel: "специалистов",
  instagramLabel: "Instagram",
} as const;

export function HeroSection({
  name,
  heroTitle,
  heroSubtitle,
  phone,
  stats,
}: HeroSectionProps) {
  const { openBooking } = useBooking();
  const sectionRef = useClinicSectionEffects<HTMLDivElement>();

  const statCards: StatCard[] = [
    {
      id: "reviews",
      label: HERO_LABELS.reviewsLabel,
      valueText: stats.reviews !== null ? String(stats.reviews) : "0",
      target: stats.reviews ?? undefined,
      suffix: stats.reviewsSuffix ?? "",
      delay: "1",
    },
    {
      id: "rating",
      label: HERO_LABELS.ratingLabel,
      valueText: stats.rating !== null ? stats.rating.toFixed(1) : "0.0",
      target: stats.rating ?? undefined,
      decimals: 1,
      suffix: "★",
      delay: "2",
    },
    {
      id: "specialists",
      label: HERO_LABELS.specialistsLabel,
      valueText:
        typeof stats.specialists === "number" ? String(stats.specialists) : "0",
      target: stats.specialists ?? undefined,
      delay: "3",
    },
    {
      id: "instagram",
      label: HERO_LABELS.instagramLabel,
      valueText: stats.instagram?.trim() || HERO_LABELS.instagramLabel,
      delay: "4",
    },
  ];

  return (
    <section
      id="clinic-hero"
      className={`${warmClinicBodyFont.className} relative pt-10 sm:pt-12 lg:pt-14`}
    >
      <div className="mx-auto w-full max-w-[1360px] px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[36px] border border-[rgba(0,161,214,0.15)] bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(234,247,252,0.92))] shadow-[0_24px_60px_rgba(15,42,53,0.08)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_84%_18%,color-mix(in_oklab,var(--accent)_22%,transparent),transparent_19%),radial-gradient(circle_at_14%_92%,rgba(200,238,250,0.55),transparent_22%)]" />
          <div className="pointer-events-none absolute inset-[16px] rounded-[28px] border border-[rgba(0,161,214,0.12)]" />

          <div
            ref={sectionRef}
            className="relative px-5 py-10 sm:px-7 sm:py-12 lg:px-10 lg:py-14"
          >
            <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)] lg:gap-10">
              <div className="max-w-4xl">
                <p className="reveal inline-flex flex-wrap items-center gap-3 text-[0.78rem] uppercase tracking-[0.2em] text-[#5B7D8A]">
                  <span className="h-px w-10 bg-[linear-gradient(90deg,transparent,var(--accent))]" />
                  <span>{HERO_LABELS.eyebrow}</span>
                  <span className="text-[#7A9AA8]">{name}</span>
                </p>

                <h1
                  className={`reveal mt-5 max-w-[12ch] text-[clamp(3rem,7vw,6.4rem)] leading-[0.94] tracking-[-0.05em] text-[#0F2A35] italic ${warmClinicHeadingFont.className}`}
                  data-delay="1"
                >
                  {heroTitle}
                </h1>

                {heroSubtitle.trim() ? (
                  <p
                    className="reveal mt-5 max-w-[58ch] text-[1.02rem] leading-8 text-[#5B7D8A] lg:text-[1.12rem]"
                    data-delay="2"
                  >
                    {heroSubtitle}
                  </p>
                ) : null}

                <div className="reveal mt-8 flex flex-wrap gap-3" data-delay="3">
                  <button
                    type="button"
                    onClick={() => openBooking()}
                    className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full border border-[color-mix(in_oklab,var(--accent)_32%,transparent)] bg-[linear-gradient(180deg,color-mix(in_oklab,var(--accent)_18%,white),color-mix(in_oklab,var(--accent)_12%,white))] px-6 text-sm font-semibold text-[#0F2A35] shadow-[0_18px_32px_rgba(0,161,214,0.14)] transition-all duration-300 ease-[var(--ease)] hover:-translate-y-0.5 hover:border-[var(--accent)]"
                  >
                    <MessageCircle className="h-4 w-4 text-[var(--accent)]" />
                    <span>{HERO_LABELS.primaryCta}</span>
                  </button>

                  <a
                    href={toTelHref(phone)}
                    className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full border border-[rgba(0,161,214,0.16)] bg-white px-6 text-sm font-semibold text-[#0F2A35] transition-all duration-300 ease-[var(--ease)] hover:-translate-y-0.5 hover:border-[var(--accent)] hover:bg-[#F4FCFF]"
                  >
                    <PhoneCall className="h-4 w-4 text-[var(--accent)]" />
                    <span>{HERO_LABELS.secondaryCta}</span>
                  </a>
                </div>
              </div>

              <aside className="reveal" data-delay="2">
                <div className="relative grid gap-4 rounded-[28px] border border-[rgba(0,161,214,0.14)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(234,247,252,0.92))] p-6">
                  <div className="absolute right-5 top-5 h-18 w-18 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--accent)_24%,transparent),transparent_68%)]" />

                  <div>
                    <p className="text-[0.72rem] uppercase tracking-[0.18em] text-[#7A9AA8]">
                      {HERO_LABELS.panelKicker}
                    </p>
                    <h2
                      className={`mt-2 text-[1.5rem] leading-tight text-[#0F2A35] italic ${warmClinicHeadingFont.className}`}
                    >
                      {HERO_LABELS.panelTitle}
                    </h2>
                  </div>

                  <div className="grid gap-3">
                    <div className="flex items-center justify-between gap-4 rounded-[20px] border border-[rgba(0,161,214,0.12)] bg-white px-4 py-3">
                      <span className="text-[0.78rem] uppercase tracking-[0.12em] text-[#7A9AA8]">
                        {HERO_LABELS.phoneLabel}
                      </span>
                      <a
                        href={toTelHref(phone)}
                        className="text-right text-sm text-[#0F2A35] transition-colors hover:text-[var(--accent)]"
                      >
                        {phone}
                      </a>
                    </div>

                    <div className="flex items-center justify-between gap-4 rounded-[20px] border border-[rgba(0,161,214,0.12)] bg-white px-4 py-3">
                      <span className="text-[0.78rem] uppercase tracking-[0.12em] text-[#7A9AA8]">
                        {HERO_LABELS.formatLabel}
                      </span>
                      <span className="text-right text-sm text-[#0F2A35]">
                        {HERO_LABELS.formatValue}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4 rounded-[20px] border border-[rgba(0,161,214,0.12)] bg-white px-4 py-3">
                      <span className="text-[0.78rem] uppercase tracking-[0.12em] text-[#7A9AA8]">
                        {HERO_LABELS.startLabel}
                      </span>
                      <span className="text-right text-sm text-[#0F2A35]">
                        {HERO_LABELS.startValue}
                      </span>
                    </div>
                  </div>
                </div>
              </aside>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {statCards.map((stat) => {
                const hasCounter = typeof stat.target === "number";

                return (
                  <article
                    key={stat.id}
                    className="reveal rounded-[22px] border border-[rgba(0,161,214,0.14)] bg-white px-5 py-5 transition-all duration-300 ease-[var(--ease)] hover:-translate-y-1 hover:border-[var(--accent)]"
                    data-delay={stat.delay}
                    data-animate-counters={hasCounter ? "true" : undefined}
                  >
                    <div className="flex items-end gap-1 text-[clamp(1.8rem,2.7vw,2.4rem)] leading-none tracking-[-0.07em] text-[#0F2A35]">
                      {hasCounter ? (
                        <span
                          data-counter=""
                          data-target={stat.target}
                          data-decimals={stat.decimals ?? 0}
                          data-duration={stat.decimals ? 1400 : 1200}
                        >
                          {stat.valueText}
                        </span>
                      ) : (
                        <span>{stat.valueText}</span>
                      )}
                      {stat.suffix ? (
                        <span className="text-[0.8em] text-[#5B7D8A]">
                          {stat.suffix}
                        </span>
                      ) : null}
                    </div>

                    <p className="mt-3 text-[0.8rem] uppercase tracking-[0.08em] text-[#7A9AA8]">
                      {stat.label}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
