"use client";

import { MessageCircle, PhoneCall } from "lucide-react";
import type { ClinicVariantLabels } from "@/lib/tenant/variants";
import { useBooking } from "@/context/BookingContext";
import { toTelHref } from "./utils";
import { useClinicSectionEffects } from "./useClinicSectionEffects";

interface HeroStats {
  readonly reviews: number | null;
  readonly reviewsSuffix?: string;
  readonly rating: number | null;
  readonly specialists?: number | null;
  readonly instagram?: string | null;
}

interface HeroSectionProps {
  readonly name: string;
  readonly heroTitle: string;
  readonly heroSubtitle: string;
  readonly phone: string;
  readonly stats: HeroStats;
  readonly labels: Pick<
    ClinicVariantLabels,
    | "heroEyebrow"
    | "heroPrimaryCta"
    | "heroSecondaryCta"
    | "heroPanelKicker"
    | "heroPanelTitle"
    | "heroPhoneLabel"
    | "heroFormatLabel"
    | "heroFormatValue"
    | "heroStartLabel"
    | "heroStartValue"
    | "heroReviewsLabel"
    | "heroRatingLabel"
    | "heroSpecialistsLabel"
    | "heroInstagramLabel"
  >;
}

interface StatCard {
  readonly id: string;
  readonly label: string;
  readonly valueText: string;
  readonly target?: number;
  readonly decimals?: number;
  readonly suffix?: string;
  readonly delay: string;
}

export function HeroSection({
  name,
  heroTitle,
  heroSubtitle,
  phone,
  stats,
  labels,
}: HeroSectionProps) {
  const { openBooking } = useBooking();
  const sectionRef = useClinicSectionEffects<HTMLDivElement>();

  const statCards: StatCard[] = [
    {
      id: "reviews",
      label: labels.heroReviewsLabel,
      valueText: stats.reviews !== null ? String(stats.reviews) : "0",
      target: stats.reviews ?? undefined,
      suffix: stats.reviewsSuffix ?? "",
      delay: "1",
    },
    {
      id: "rating",
      label: labels.heroRatingLabel,
      valueText: stats.rating !== null ? stats.rating.toFixed(1) : "0.0",
      target: stats.rating ?? undefined,
      decimals: 1,
      suffix: "★",
      delay: "2",
    },
    {
      id: "specialists",
      label: labels.heroSpecialistsLabel,
      valueText:
        typeof stats.specialists === "number" ? String(stats.specialists) : "0",
      target: stats.specialists ?? undefined,
      delay: "3",
    },
    {
      id: "instagram",
      label: labels.heroInstagramLabel,
      valueText: stats.instagram?.trim() || labels.heroInstagramLabel,
      delay: "4",
    },
  ];

  return (
    <section id="clinic-hero" className="relative pt-10 sm:pt-12 lg:pt-14">
      <div className="mx-auto w-full max-w-[1360px] px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[40px] border border-[var(--line)] bg-[linear-gradient(180deg,color-mix(in_oklab,var(--text)_4%,transparent),transparent_26%),linear-gradient(180deg,color-mix(in_oklab,var(--text)_2.5%,transparent),color-mix(in_oklab,var(--text)_1.5%,transparent)),var(--surface)] shadow-[var(--shadow-soft)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_22%,color-mix(in_oklab,var(--accent)_18%,transparent),transparent_20%),radial-gradient(circle_at_18%_28%,color-mix(in_oklab,var(--text)_8%,transparent),transparent_16%)]" />
          <div className="pointer-events-none absolute inset-[18px] rounded-[28px] border border-[color-mix(in_oklab,var(--line)_50%,transparent)]" />

          <div
            ref={sectionRef}
            className="relative px-5 py-10 sm:px-7 sm:py-12 lg:px-10 lg:py-14"
          >
            <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:gap-12">
              <div className="max-w-4xl">
                <p className="reveal inline-flex flex-wrap items-center gap-3 text-[0.8rem] uppercase tracking-[0.22em] text-[var(--muted)]">
                  <span className="h-px w-10 bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--accent)_80%,transparent))]" />
                  <span>{labels.heroEyebrow}</span>
                  <span className="text-[var(--muted-soft)]">{name}</span>
                </p>

                <h1
                  className="reveal mt-5 max-w-[12ch] text-[clamp(3rem,7vw,6.7rem)] font-bold leading-[0.92] tracking-[-0.065em] text-[var(--text)]"
                  data-delay="1"
                >
                  {heroTitle}
                </h1>

                {heroSubtitle.trim() ? (
                  <p
                    className="reveal mt-5 max-w-[61ch] text-base leading-8 text-[var(--muted)] sm:text-[1.05rem] lg:text-[1.18rem]"
                    data-delay="2"
                  >
                    {heroSubtitle}
                  </p>
                ) : null}

                <div className="reveal mt-8 flex flex-wrap gap-3" data-delay="3">
                  <button
                    type="button"
                    onClick={() => openBooking()}
                    className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full border border-[color-mix(in_oklab,var(--accent)_42%,transparent)] bg-[linear-gradient(180deg,color-mix(in_oklab,var(--accent)_24%,transparent),color-mix(in_oklab,var(--accent)_14%,transparent)),color-mix(in_oklab,var(--text)_3%,transparent)] px-6 text-sm font-semibold text-white shadow-[inset_0_1px_0_color-mix(in_oklab,var(--text)_10%,transparent),0_18px_38px_color-mix(in_oklab,var(--accent)_18%,transparent)] transition-all duration-300 ease-[var(--ease)] hover:-translate-y-0.5 hover:border-[var(--accent)]"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>{labels.heroPrimaryCta}</span>
                  </button>

                  <a
                    href={toTelHref(phone)}
                    className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full border border-[var(--line)] bg-[color-mix(in_oklab,var(--surface)_88%,transparent)] px-6 text-sm font-semibold text-[var(--text)] transition-all duration-300 ease-[var(--ease)] hover:-translate-y-0.5 hover:border-[color-mix(in_oklab,var(--text)_18%,var(--line))] hover:bg-[color-mix(in_oklab,var(--surface-strong)_80%,transparent)]"
                  >
                    <PhoneCall className="h-4 w-4 text-[var(--accent)]" />
                    <span>{labels.heroSecondaryCta}</span>
                  </a>
                </div>
              </div>

              <aside className="reveal" data-delay="2">
                <div className="relative grid gap-4 rounded-[28px] border border-[var(--line)] bg-[linear-gradient(180deg,color-mix(in_oklab,var(--accent)_10%,transparent),transparent_38%),var(--surface)] p-6">
                  <div className="absolute bottom-6 left-6 top-6 w-px bg-[linear-gradient(180deg,transparent,color-mix(in_oklab,var(--accent)_100%,transparent),transparent)]" />

                  <div className="pl-5">
                    <p className="text-[0.72rem] uppercase tracking-[0.18em] text-[var(--muted-soft)]">
                      {labels.heroPanelKicker}
                    </p>
                    <h2 className="mt-2 text-[1.45rem] font-semibold leading-tight text-[var(--text)]">
                      {labels.heroPanelTitle}
                    </h2>
                  </div>

                  <div className="grid gap-3 pl-5">
                    <div className="flex items-center justify-between gap-4 rounded-[18px] border border-[color-mix(in_oklab,var(--line)_70%,transparent)] bg-[color-mix(in_oklab,var(--surface)_92%,transparent)] px-4 py-3">
                      <span className="text-[0.78rem] uppercase tracking-[0.12em] text-[var(--muted-soft)]">
                        {labels.heroPhoneLabel}
                      </span>
                      <a
                        href={toTelHref(phone)}
                        className="text-right text-sm text-[var(--text)] transition-colors hover:text-[var(--accent)]"
                      >
                        {phone}
                      </a>
                    </div>

                    <div className="flex items-center justify-between gap-4 rounded-[18px] border border-[color-mix(in_oklab,var(--line)_70%,transparent)] bg-[color-mix(in_oklab,var(--surface)_92%,transparent)] px-4 py-3">
                      <span className="text-[0.78rem] uppercase tracking-[0.12em] text-[var(--muted-soft)]">
                        {labels.heroFormatLabel}
                      </span>
                      <span className="text-right text-sm text-[var(--text)]">
                        {labels.heroFormatValue}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4 rounded-[18px] border border-[color-mix(in_oklab,var(--line)_70%,transparent)] bg-[color-mix(in_oklab,var(--surface)_92%,transparent)] px-4 py-3">
                      <span className="text-[0.78rem] uppercase tracking-[0.12em] text-[var(--muted-soft)]">
                        {labels.heroStartLabel}
                      </span>
                      <span className="text-right text-sm text-[var(--text)]">
                        {labels.heroStartValue}
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
                    className="reveal rounded-[22px] border border-[var(--line)] bg-[linear-gradient(180deg,color-mix(in_oklab,var(--text)_4%,transparent),transparent_40%),var(--surface)] px-5 py-5 transition-all duration-300 ease-[var(--ease)] hover:-translate-y-1 hover:border-[color-mix(in_oklab,var(--accent)_30%,transparent)]"
                    data-delay={stat.delay}
                    data-animate-counters={hasCounter ? "true" : undefined}
                  >
                    <div className="flex items-end gap-1 font-display text-[clamp(1.8rem,2.7vw,2.6rem)] leading-none tracking-[-0.08em] text-[var(--text)]">
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
                        <span className="text-[0.8em] text-[var(--muted)]">
                          {stat.suffix}
                        </span>
                      ) : null}
                    </div>

                    <p className="mt-3 text-[0.82rem] uppercase tracking-[0.08em] text-[var(--muted-soft)]">
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
