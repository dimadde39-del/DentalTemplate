"use client";

import type { CSSProperties } from "react";
import { MessageCircle, PhoneCall } from "lucide-react";
import { useBooking } from "@/context/BookingContext";
import type { HeroSectionProps } from "@/components/clinic/template-props";
import { toTelHref } from "@/components/clinic/utils";
import { useClinicSectionEffects } from "@/components/clinic/useClinicSectionEffects";

interface StatCard {
  readonly id: string;
  readonly label: string;
  readonly valueText: string;
  readonly target?: number;
  readonly decimals?: number;
  readonly suffix?: string;
  readonly delay: string;
}

const headingStyle: CSSProperties = {
  fontFamily: "var(--font-heading), Georgia, serif",
};

const HERO_LABELS = {
  eyebrow: "Стоматология экспертного уровня",
  primaryCta: "Записаться на прием",
  secondaryCta: "Позвонить",
  panelKicker: "private line",
  panelTitle: "Координируем запись без лишней суеты и с понятным маршрутом лечения",
  phoneLabel: "Телефон",
  formatLabel: "Формат связи",
  formatValue: "WhatsApp или звонок",
  startLabel: "Первый этап",
  startValue: "Консультация и план лечения",
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
    <section id="clinic-hero" className="relative pt-10 sm:pt-12 lg:pt-14">
      <div className="mx-auto w-full max-w-[1360px] px-4 sm:px-6 lg:px-8">
        <div
          ref={sectionRef}
          className="relative overflow-hidden rounded-[26px] border border-[var(--line)] bg-[linear-gradient(180deg,#FFFFFF,#FBFBF9)] px-5 py-10 shadow-[var(--shadow-soft)] sm:px-7 sm:py-12 lg:px-10 lg:py-14"
        >
          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.16fr)_minmax(320px,0.84fr)] lg:gap-12">
            <div className="max-w-4xl">
              <p className="reveal inline-flex flex-wrap items-center gap-3 text-[0.74rem] uppercase tracking-[0.22em] text-[var(--muted)]">
                <span className="h-px w-10 bg-[var(--accent)]" />
                <span>{HERO_LABELS.eyebrow}</span>
                <span className="text-[var(--text)]">{name}</span>
              </p>

              <h1
                className="reveal mt-5 max-w-[13ch] text-[clamp(3rem,6.6vw,6.2rem)] leading-[0.94] tracking-[-0.055em] text-[var(--text)]"
                style={headingStyle}
                data-delay="1"
              >
                {heroTitle}
              </h1>

              {heroSubtitle.trim() ? (
                <p
                  className="reveal mt-5 max-w-[62ch] text-[1rem] leading-8 text-[var(--muted)] lg:text-[1.08rem]"
                  data-delay="2"
                >
                  {heroSubtitle}
                </p>
              ) : null}

              <div className="reveal mt-8 flex flex-wrap gap-3" data-delay="3">
                <button
                  type="button"
                  onClick={() => openBooking()}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-[var(--accent)] bg-[var(--accent)] px-5 text-sm font-medium text-white transition-all duration-300 ease-[var(--ease)] hover:-translate-y-0.5 hover:bg-[color-mix(in_oklab,var(--accent)_88%,black)]"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>{HERO_LABELS.primaryCta}</span>
                </button>

                <a
                  href={toTelHref(phone)}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-[var(--line)] bg-white px-5 text-sm font-medium text-[var(--text)] transition-all duration-300 ease-[var(--ease)] hover:-translate-y-0.5 hover:border-[var(--accent)]"
                >
                  <PhoneCall className="h-4 w-4 text-[var(--accent)]" />
                  <span>{HERO_LABELS.secondaryCta}</span>
                </a>
              </div>
            </div>

            <aside className="reveal" data-delay="2">
              <div className="grid gap-4 rounded-[20px] border border-[var(--line)] bg-[#FCFCFA] p-6">
                <div className="grid gap-2 border-b border-[var(--line)] pb-5">
                  <p className="text-[0.72rem] uppercase tracking-[0.18em] text-[var(--muted)]">
                    {HERO_LABELS.panelKicker}
                  </p>
                  <h2
                    className="text-[1.5rem] leading-tight text-[var(--text)]"
                    style={headingStyle}
                  >
                    {HERO_LABELS.panelTitle}
                  </h2>
                </div>

                <div className="grid gap-3">
                  <div className="flex items-center justify-between gap-4 rounded-[14px] border border-[var(--line)] bg-white px-4 py-3">
                    <span className="text-[0.78rem] uppercase tracking-[0.12em] text-[var(--muted)]">
                      {HERO_LABELS.phoneLabel}
                    </span>
                    <a
                      href={toTelHref(phone)}
                      className="text-right text-sm text-[var(--text)] transition-colors hover:text-[var(--accent)]"
                    >
                      {phone}
                    </a>
                  </div>

                  <div className="flex items-center justify-between gap-4 rounded-[14px] border border-[var(--line)] bg-white px-4 py-3">
                    <span className="text-[0.78rem] uppercase tracking-[0.12em] text-[var(--muted)]">
                      {HERO_LABELS.formatLabel}
                    </span>
                    <span className="text-right text-sm text-[var(--text)]">
                      {HERO_LABELS.formatValue}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4 rounded-[14px] border border-[var(--line)] bg-white px-4 py-3">
                    <span className="text-[0.78rem] uppercase tracking-[0.12em] text-[var(--muted)]">
                      {HERO_LABELS.startLabel}
                    </span>
                    <span className="text-right text-sm text-[var(--text)]">
                      {HERO_LABELS.startValue}
                    </span>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          <div className="mt-8 h-px w-full bg-[var(--line)]" />

          <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map((stat) => {
              const hasCounter = typeof stat.target === "number";

              return (
                <article
                  key={stat.id}
                  className="reveal rounded-[18px] border border-[var(--line)] bg-white px-5 py-5 transition-all duration-300 ease-[var(--ease)] hover:-translate-y-1 hover:border-[color-mix(in_oklab,var(--accent)_35%,var(--line))]"
                  data-delay={stat.delay}
                  data-animate-counters={hasCounter ? "true" : undefined}
                >
                  <div
                    className="flex items-end gap-1 text-[clamp(1.85rem,2.8vw,2.5rem)] leading-none tracking-[-0.06em] text-[var(--text)]"
                    style={headingStyle}
                  >
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
                      <span className="text-[0.78em] text-[var(--muted)]">
                        {stat.suffix}
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-3 text-[0.8rem] uppercase tracking-[0.08em] text-[var(--muted)]">
                    {stat.label}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
