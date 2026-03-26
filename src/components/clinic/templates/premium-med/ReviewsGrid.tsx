"use client";

import type { ReviewsGridProps } from "@/components/clinic/template-props";
import { getVisibleReviews } from "@/components/clinic/utils";
import { useClinicSectionEffects } from "@/components/clinic/useClinicSectionEffects";
import { premiumHeading } from "./fonts";

const SECTION_LABELS = {
  eyebrow: "Пациенты о нас",
} as const;

function formatRating(value: number): string {
  if (!Number.isFinite(value) || value <= 0) {
    return "0.0 ★";
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

  return (
    <section id="reviews" className="pt-[clamp(92px,10vw,148px)]">
      <div
        ref={sectionRef}
        className="mx-auto w-full max-w-[1380px] px-4 sm:px-6 lg:px-8"
      >
        <div className="mb-10 grid gap-5 border-b border-[var(--line)] pb-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,0.7fr)] lg:items-end">
          <div className="reveal">
            <span className="inline-flex items-center gap-3 text-[0.76rem] uppercase tracking-[0.22em] text-[var(--muted)]">
              <span className="h-px w-10 bg-[linear-gradient(90deg,transparent,var(--accent))]" />
              <span>{SECTION_LABELS.eyebrow}</span>
            </span>
            <h2
              className={`mt-4 max-w-[13ch] text-[clamp(2.4rem,4.2vw,4.7rem)] leading-[0.92] tracking-[-0.05em] text-[var(--text)] italic ${premiumHeading.className}`}
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

        <div className="grid gap-5 xl:grid-cols-2">
          {visibleReviews.map((review, index) => {
            const isFeatured = index === 0 && visibleReviews.length > 2;

            return (
              <article
                key={review.id}
                className={`reveal grid gap-6 rounded-[24px] border border-[var(--line)] bg-white p-6 shadow-[var(--shadow-card)] transition-all duration-300 ease-[var(--ease)] hover:-translate-y-1 hover:border-[color-mix(in_oklab,var(--accent)_22%,var(--line))] hover:shadow-[0_24px_34px_rgba(26,26,25,0.06)] sm:p-7 ${
                  isFeatured ? "xl:col-span-2 xl:grid-cols-[minmax(0,1.1fr)_auto]" : ""
                }`}
                data-delay={String((index % 2) + 1)}
              >
                <div className="grid gap-5">
                  <div className="flex items-center justify-between gap-4 border-b border-[var(--line)] pb-4">
                    <span className="text-[0.74rem] uppercase tracking-[0.2em] text-[var(--muted)]">
                      {formatRating(review.rating)}
                    </span>
                    <span
                      className={`text-[2.8rem] leading-none text-[color-mix(in_oklab,var(--accent)_18%,var(--text))] ${premiumHeading.className}`}
                    >
                      “
                    </span>
                  </div>

                  <p
                    className={`max-w-[30ch] text-[1.42rem] leading-[1.5] text-[var(--text)] italic sm:text-[1.62rem] ${premiumHeading.className} ${
                      isFeatured ? "sm:text-[1.9rem]" : ""
                    }`}
                  >
                    {review.comment}
                  </p>
                </div>

                <div className="flex items-end justify-between gap-4 border-t border-[var(--line)] pt-4">
                  <span className="text-[0.76rem] uppercase tracking-[0.18em] text-[var(--muted)]">
                    {review.author}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
