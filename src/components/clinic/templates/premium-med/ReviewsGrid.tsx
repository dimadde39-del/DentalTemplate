"use client";

import type { CSSProperties } from "react";
import type { ReviewsGridProps } from "@/components/clinic/template-props";
import { getVisibleReviews } from "@/components/clinic/utils";
import { useClinicSectionEffects } from "@/components/clinic/useClinicSectionEffects";

const headingStyle: CSSProperties = {
  fontFamily: "var(--font-heading), Georgia, serif",
};

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
    <section id="reviews" className="pt-[clamp(88px,10vw,144px)]">
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
            className="max-w-[14ch] text-[clamp(2.1rem,4vw,4rem)] leading-[0.98] tracking-[-0.045em] text-[var(--text)]"
            style={headingStyle}
          >
            {testimonialsTitle}
          </h2>
          {testimonialsSubtitle.trim() ? (
            <p className="max-w-[64ch] text-base leading-8 text-[var(--muted)]">
              {testimonialsSubtitle}
            </p>
          ) : null}
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {visibleReviews.map((review, index) => (
            <article
              key={review.id}
              className="reveal grid min-h-[244px] gap-5 rounded-[18px] border border-[var(--line)] bg-white p-6 shadow-[var(--shadow-card)] transition-all duration-300 ease-[var(--ease)] hover:-translate-y-1 hover:border-[color-mix(in_oklab,var(--accent)_35%,var(--line))]"
              data-delay={String((index % 2) + 1)}
            >
              <div className="flex items-center justify-between gap-4 border-b border-[var(--line)] pb-4">
                <span className="text-[0.76rem] uppercase tracking-[0.16em] text-[var(--muted)]">
                  {formatRating(review.rating)}
                </span>
                <span
                  className="text-[2.2rem] leading-none text-[color-mix(in_oklab,var(--accent)_22%,black)]"
                  style={headingStyle}
                >
                  “
                </span>
              </div>

              <p
                className="text-[1.2rem] leading-8 text-[var(--text)] sm:text-[1.34rem]"
                style={headingStyle}
              >
                {review.comment}
              </p>

              <div className="mt-auto pt-4 text-sm uppercase tracking-[0.16em] text-[var(--muted)]">
                {review.author}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
