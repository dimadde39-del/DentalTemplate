"use client";

import { MessageCircle, PhoneCall } from "lucide-react";
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
}: HeroSectionProps) {
  const { openBooking } = useBooking();
  const sectionRef = useClinicSectionEffects<HTMLDivElement>();

  const statCards: StatCard[] = [
    {
      id: "reviews",
      label: "отзывов",
      valueText:
        stats.reviews !== null ? String(stats.reviews) : "0",
      target: stats.reviews ?? undefined,
      suffix: stats.reviewsSuffix ?? "",
      delay: "1",
    },
    {
      id: "rating",
      label: "рейтинг",
      valueText: stats.rating !== null ? stats.rating.toFixed(1) : "0.0",
      target: stats.rating ?? undefined,
      decimals: 1,
      suffix: "★",
      delay: "2",
    },
    {
      id: "specialists",
      label: "специалистов",
      valueText:
        typeof stats.specialists === "number" ? String(stats.specialists) : "0",
      target: stats.specialists ?? undefined,
      delay: "3",
    },
    {
      id: "instagram",
      label: "Instagram",
      valueText: stats.instagram?.trim() || "Instagram",
      delay: "4",
    },
  ];

  return (
    <section id="clinic-hero" className="relative pt-10 sm:pt-12 lg:pt-14">
      <div className="mx-auto w-full max-w-[1360px] px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[40px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.025),rgba(255,255,255,0.015)),rgba(5,6,8,0.74)] shadow-[var(--shadow-soft)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_22%,rgba(0,161,214,0.13),transparent_20%),radial-gradient(circle_at_18%_28%,rgba(255,255,255,0.07),transparent_16%)]" />
          <div className="pointer-events-none absolute inset-[18px] rounded-[28px] border border-white/[0.04]" />

          <div
            ref={sectionRef}
            className="relative px-5 py-10 sm:px-7 sm:py-12 lg:px-10 lg:py-14"
          >
            <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:gap-12">
              <div className="max-w-4xl">
                <p className="reveal inline-flex items-center gap-3 text-[0.8rem] uppercase tracking-[0.22em] text-white/80">
                  <span className="h-px w-10 bg-[linear-gradient(90deg,transparent,rgba(0,161,214,0.9))]" />
                  <span>{name}</span>
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

                <div
                  className="reveal mt-8 flex flex-wrap gap-3"
                  data-delay="3"
                >
                  <button
                    type="button"
                    onClick={() => openBooking()}
                    className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full border border-[rgba(0,161,214,0.4)] bg-[linear-gradient(180deg,rgba(0,161,214,0.24),rgba(0,161,214,0.14)),rgba(255,255,255,0.03)] px-6 text-sm font-semibold text-[#eaf8fd] shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_18px_38px_rgba(0,161,214,0.1)] transition-all duration-300 ease-[var(--ease)] hover:-translate-y-0.5 hover:border-[rgba(0,161,214,0.52)]"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Записаться на консультацию</span>
                  </button>

                  <a
                    href={toTelHref(phone)}
                    className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full border border-[var(--line)] bg-white/[0.02] px-6 text-sm font-semibold text-[var(--text)] transition-all duration-300 ease-[var(--ease)] hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.05]"
                  >
                    <PhoneCall className="h-4 w-4 text-[var(--accent)]" />
                    <span>Позвонить</span>
                  </a>
                </div>
              </div>

              <aside className="reveal" data-delay="2">
                <div className="relative grid gap-4 rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(0,161,214,0.07),transparent_38%),rgba(255,255,255,0.03)] p-6">
                  <div className="absolute bottom-6 left-6 top-6 w-px bg-[linear-gradient(180deg,rgba(0,161,214,0),rgba(0,161,214,1),rgba(0,161,214,0))]" />

                  <div className="pl-5">
                    <p className="text-[0.72rem] uppercase tracking-[0.18em] text-[var(--muted-soft)]">
                      direct line
                    </p>
                    <h2 className="mt-2 text-[1.45rem] font-semibold leading-tight text-[var(--text)]">
                      Контакт с клиникой без лишних шагов
                    </h2>
                  </div>

                  <div className="grid gap-3 pl-5">
                    <div className="flex items-center justify-between gap-4 rounded-[18px] border border-white/6 bg-white/[0.02] px-4 py-3">
                      <span className="text-[0.78rem] uppercase tracking-[0.12em] text-[var(--muted-soft)]">
                        Телефон
                      </span>
                      <a
                        href={toTelHref(phone)}
                        className="text-right text-sm text-[var(--text)] transition-colors hover:text-[var(--accent)]"
                      >
                        {phone}
                      </a>
                    </div>

                    <div className="flex items-center justify-between gap-4 rounded-[18px] border border-white/6 bg-white/[0.02] px-4 py-3">
                      <span className="text-[0.78rem] uppercase tracking-[0.12em] text-[var(--muted-soft)]">
                        Формат
                      </span>
                      <span className="text-right text-sm text-[var(--text)]">
                        WhatsApp / звонок
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4 rounded-[18px] border border-white/6 bg-white/[0.02] px-4 py-3">
                      <span className="text-[0.78rem] uppercase tracking-[0.12em] text-[var(--muted-soft)]">
                        Старт
                      </span>
                      <span className="text-right text-sm text-[var(--text)]">
                        С бесплатной консультации
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
                    className="reveal rounded-[22px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent_40%),rgba(255,255,255,0.025)] px-5 py-5 transition-all duration-300 ease-[var(--ease)] hover:-translate-y-1 hover:border-[rgba(0,161,214,0.32)]"
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
                        <span className="text-[0.8em] text-white/80">{stat.suffix}</span>
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
