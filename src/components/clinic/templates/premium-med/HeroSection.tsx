"use client";

import { MessageCircle, PhoneCall } from "lucide-react";
import { useBooking } from "@/context/BookingContext";
import type { HeroSectionProps } from "@/components/clinic/template-props";
import { toTelHref } from "@/components/clinic/utils";
import { useClinicSectionEffects } from "@/components/clinic/useClinicSectionEffects";
import { premiumHeading } from "./fonts";

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
  eyebrow: "Стоматология экспертного уровня",
  primaryCta: "Записаться на прием",
  secondaryCta: "Позвонить",
  panelKicker: "private coordination",
  panelTitle: "Организуем первый визит спокойно, точно и без лишней суеты",
  phoneLabel: "Телефон",
  formatLabel: "Формат связи",
  formatValue: "WhatsApp или звонок",
  startLabel: "Первый этап",
  startValue: "Консультация и персональный план лечения",
  note: "Ответим в тот же день и подскажем, с какого специалиста начать.",
  reviewsLabel: "отзывов",
  ratingLabel: "рейтинг",
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
    <section id="clinic-hero" className="relative pt-8 sm:pt-10 lg:pt-12">
      <div className="mx-auto w-full max-w-[1380px] px-4 sm:px-6 lg:px-8">
        <div
          ref={sectionRef}
          className="relative overflow-hidden rounded-[34px] border border-[var(--line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(255,255,255,0.92))] shadow-[var(--shadow-soft)]"
        >
          <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--accent)_34%,transparent),transparent)]" />
          <div className="pointer-events-none absolute right-[-8%] top-[-12%] h-72 w-72 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--accent)_14%,transparent),transparent_68%)]" />
          <div className="pointer-events-none absolute inset-[18px] rounded-[26px] border border-[color-mix(in_oklab,var(--accent)_8%,transparent)]" />

          <div className="relative px-5 py-9 sm:px-7 sm:py-11 lg:px-10 lg:py-12">
            <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.12fr)_minmax(320px,0.88fr)] lg:gap-12">
              <div className="max-w-4xl">
                <p className="reveal inline-flex flex-wrap items-center gap-3 text-[0.76rem] uppercase tracking-[0.22em] text-[var(--muted)]">
                  <span className="h-px w-10 bg-[linear-gradient(90deg,transparent,var(--accent))]" />
                  <span>{HERO_LABELS.eyebrow}</span>
                  <span className="text-[color-mix(in_oklab,var(--muted)_78%,var(--text))]">
                    {name}
                  </span>
                </p>

                <h1
                  className={`reveal mt-5 max-w-[12ch] text-[clamp(3.25rem,7.2vw,6.8rem)] leading-[0.9] tracking-[-0.06em] text-[var(--text)] italic ${premiumHeading.className}`}
                  data-delay="1"
                >
                  {heroTitle}
                </h1>

                {heroSubtitle.trim() ? (
                  <p
                    className="reveal mt-5 max-w-[60ch] text-[1rem] leading-8 text-[var(--muted)] sm:text-[1.04rem] lg:text-[1.12rem]"
                    data-delay="2"
                  >
                    {heroSubtitle}
                  </p>
                ) : null}

                <div className="reveal mt-9 flex flex-wrap gap-3" data-delay="3">
                  <button
                    type="button"
                    onClick={() => openBooking()}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[8px] border border-[var(--accent)] bg-[var(--accent)] px-5 text-sm font-medium text-white transition-all duration-300 ease-[var(--ease)] hover:-translate-y-0.5 hover:bg-[color-mix(in_oklab,var(--accent)_90%,black)] hover:shadow-[0_20px_36px_color-mix(in_oklab,var(--accent)_16%,transparent)]"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>{HERO_LABELS.primaryCta}</span>
                  </button>

                  <a
                    href={toTelHref(phone)}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[8px] border border-[var(--line-strong)] bg-white px-5 text-sm font-medium text-[var(--text)] transition-all duration-300 ease-[var(--ease)] hover:-translate-y-0.5 hover:border-[var(--accent)] hover:shadow-[0_18px_28px_rgba(26,26,25,0.06)]"
                  >
                    <PhoneCall className="h-4 w-4 text-[var(--accent)]" />
                    <span>{HERO_LABELS.secondaryCta}</span>
                  </a>
                </div>
              </div>

              <aside className="reveal lg:pt-4" data-delay="2">
                <div className="grid gap-5 rounded-[28px] border border-[var(--line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(243,242,238,0.82))] p-6 shadow-[0_18px_34px_rgba(26,26,25,0.04)]">
                  <div className="border-b border-[var(--line)] pb-5">
                    <p className="text-[0.72rem] uppercase tracking-[0.2em] text-[var(--muted)]">
                      {HERO_LABELS.panelKicker}
                    </p>
                    <h2
                      className={`mt-2 text-[1.6rem] leading-[1.02] text-[var(--text)] italic ${premiumHeading.className}`}
                    >
                      {HERO_LABELS.panelTitle}
                    </h2>
                  </div>

                  <div className="grid gap-3">
                    <div className="grid gap-1 rounded-[18px] border border-[var(--line)] bg-white px-4 py-4">
                      <span className="text-[0.74rem] uppercase tracking-[0.16em] text-[var(--muted)]">
                        {HERO_LABELS.phoneLabel}
                      </span>
                      <a
                        href={toTelHref(phone)}
                        className="text-[1rem] text-[var(--text)] transition-colors hover:text-[var(--accent)]"
                      >
                        {phone}
                      </a>
                    </div>

                    <div className="grid gap-1 rounded-[18px] border border-[var(--line)] bg-white px-4 py-4">
                      <span className="text-[0.74rem] uppercase tracking-[0.16em] text-[var(--muted)]">
                        {HERO_LABELS.formatLabel}
                      </span>
                      <span className="text-[1rem] text-[var(--text)]">
                        {HERO_LABELS.formatValue}
                      </span>
                    </div>

                    <div className="grid gap-1 rounded-[18px] border border-[var(--line)] bg-white px-4 py-4">
                      <span className="text-[0.74rem] uppercase tracking-[0.16em] text-[var(--muted)]">
                        {HERO_LABELS.startLabel}
                      </span>
                      <span className="text-[1rem] text-[var(--text)]">
                        {HERO_LABELS.startValue}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm leading-7 text-[var(--muted)]">
                    {HERO_LABELS.note}
                  </p>
                </div>
              </aside>
            </div>

            <div className="mt-10 border-t border-[var(--line)] pt-6">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {statCards.map((stat) => {
                  const hasCounter = typeof stat.target === "number";

                  return (
                    <article
                      key={stat.id}
                      className="reveal rounded-[20px] border border-[var(--line)] bg-[rgba(255,255,255,0.74)] px-5 py-5 transition-all duration-300 ease-[var(--ease)] hover:-translate-y-1 hover:border-[color-mix(in_oklab,var(--accent)_24%,var(--line))] hover:shadow-[0_20px_32px_rgba(26,26,25,0.05)]"
                      data-delay={stat.delay}
                      data-animate-counters={hasCounter ? "true" : undefined}
                    >
                      <p className="text-[0.76rem] uppercase tracking-[0.18em] text-[var(--muted)]">
                        {stat.label}
                      </p>

                      <div
                        className={`mt-4 flex items-end gap-1 text-[clamp(2.05rem,3.1vw,3rem)] leading-none tracking-[-0.07em] text-[var(--text)] ${premiumHeading.className}`}
                      >
                        {hasCounter ? (
                          <span
                            data-counter=""
                            data-target={stat.target}
                            data-decimals={stat.decimals ?? 0}
                            data-duration={stat.decimals ? 1450 : 1200}
                          >
                            {stat.valueText}
                          </span>
                        ) : (
                          <span>{stat.valueText}</span>
                        )}
                        {stat.suffix ? (
                          <span className="text-[0.72em] text-[var(--muted)]">
                            {stat.suffix}
                          </span>
                        ) : null}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
