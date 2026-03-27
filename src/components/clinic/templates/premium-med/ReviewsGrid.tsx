"use client";

import type { ReviewsGridProps } from "@/components/clinic/template-props";
import { getVisibleReviews } from "@/components/clinic/utils";
import { useClinicSectionEffects } from "@/components/clinic/useClinicSectionEffects";
import { premiumHeading } from "./fonts";

const SECTION_LABELS = {
  eyebrow: "Пациенты о нас",
  quoteMark: "“",
} as const;

function formatRating(value: number): string {
  if (!Number.isFinite(value) || value <= 0) {
    return "5.0 ★";
  }

  return `${Math.min(5, value).toFixed(1)} ★`;
}

export function ReviewsGrid({
  reviews,
  testimonialsTitle,
  testimonialsSubtitle,
}: ReviewsGridProps) {
  const sectionRef = useClinicSectionEffects<HTMLDivElement>();
  const visibleReviews = getVisibleReviews(reviews);

  if (visibleReviews.length === 0) return null;

  const [featuredReview, ...secondaryReviews] = visibleReviews;

  return (
    <section id="reviews" className="pt-[clamp(92px,10vw,148px)]">
      <div
        ref={sectionRef}
        className="mx-auto w-full max-w-[1380px] px-4 sm:px-6 lg:px-8"
      >
        <div className="mb-10 grid gap-5 border-b border-[var(--line)] pb-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,0.68fr)] lg:items-end">
          <div className="reveal">
            <span className="inline-flex items-center gap-3 text-[0.76rem] uppercase tracking-[0.22em] text-[var(--muted)]">
              <span className="h-px w-10 bg-[linear-gradient(90deg,transparent,var(--accent),transparent)]" />
              <span>{SECTION_LABELS.eyebrow}</span>
            </span>
            <h2
              className={`mt-4 max-w-[13ch] text-[clamp(2.5rem,4.3vw,4.8rem)] leading-[0.92] tracking-[-0.05em] text-[var(--text)] italic ${premiumHeading.className}`}
            >
              {testimonialsTitle}
            </h2>
          </div>

          {testimonialsSubtitle.trim() ? (
            <p className="reveal max-w-[56ch] text-[1rem] leading-8 text-[var(--muted)] lg:justify-self-end lg:text-[1.05rem]">
              {testimonialsSubtitle}
            </p>
          ) : null}
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)]">
          <article className="reveal relative overflow-hidden rounded-[28px] border border-[var(--line)] bg-white px-6 py-7 shadow-[var(--shadow-card)] sm:px-8 sm:py-9">
            <div className="absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--accent),transparent)]" />

            <div className="flex items-start justify-between gap-5 border-b border-[var(--line)] pb-5">
              <span className="text-[0.74rem] uppercase tracking-[0.2em] text-[var(--muted)]">
                {formatRating(featuredReview.rating)}
              </span>
              <span
                className={`text-[4.4rem] leading-none text-[color-mix(in_oklab,var(--accent)_22%,var(--text))] ${premiumHeading.className}`}
                aria-hidden="true"
              >
                {SECTION_LABELS.quoteMark}
              </span>
            </div>

            <div className="pt-6">
              <p
                className={`max-w-[24ch] text-[clamp(1.7rem,2.9vw,3rem)] leading-[1.12] text-[var(--text)] italic ${premiumHeading.className}`}
              >
                {featuredReview.comment}
              </p>

              <div className="mt-8 flex items-center justify-between gap-4 border-t border-[var(--line)] pt-5">
                <span className="text-[0.76rem] uppercase tracking-[0.2em] text-[var(--muted)]">
                  {featuredReview.author}
                </span>
              </div>
            </div>
          </article>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-1">
            {secondaryReviews.map((review, index) => (
              <article
                key={review.id}
                className="reveal relative overflow-hidden rounded-[24px] border border-[var(--line)] bg-white px-5 py-6 shadow-[var(--shadow-card)] transition-all duration-300 ease-[var(--ease)] hover:-translate-y-1 hover:border-[var(--line-strong)] hover:shadow-[0_22px_34px_rgba(26,26,25,0.05)] sm:px-6"
                data-delay={String((index % 3) + 1)}
              >
                <div className="absolute inset-x-6 top-0 h-px bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--accent)_68%,transparent),transparent)]" />

                <div className="flex items-center justify-between gap-4 border-b border-[var(--line)] pb-4">
                  <span className="text-[0.74rem] uppercase tracking-[0.18em] text-[var(--muted)]">
                    {formatRating(review.rating)}
                  </span>
                  <span
                    className={`text-[2.8rem] leading-none text-[color-mix(in_oklab,var(--accent)_18%,var(--text))] ${premiumHeading.className}`}
                    aria-hidden="true"
                  >
                    {SECTION_LABELS.quoteMark}
                  </span>
                </div>

                <p
                  className={`pt-5 text-[1.4rem] leading-[1.35] text-[var(--text)] italic ${premiumHeading.className}`}
                >
                  {review.comment}
                </p>

                <div className="mt-6 border-t border-[var(--line)] pt-4">
                  <span className="text-[0.76rem] uppercase tracking-[0.18em] text-[var(--muted)]">
                    {review.author}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
