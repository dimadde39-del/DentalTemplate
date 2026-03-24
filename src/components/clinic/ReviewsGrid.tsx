"use client";

import { ClinicReview } from "@/config/site";
import { getVisibleReviews } from "./utils";
import { useClinicSectionEffects } from "./useClinicSectionEffects";

export interface ReviewsGridProps {
  readonly reviews: readonly ClinicReview[];
  readonly testimonialsTitle: string;
  readonly testimonialsSubtitle: string;
}

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
          <span className="inline-flex items-center gap-3 text-[0.8rem] uppercase tracking-[0.22em] text-white/80">
            <span className="h-px w-10 bg-[linear-gradient(90deg,transparent,rgba(0,161,214,0.9))]" />
            <span>Reviews / social proof</span>
          </span>
          <h2 className="max-w-[14ch] text-[clamp(2.1rem,4vw,4rem)] font-bold leading-[0.98] tracking-[-0.06em] text-[var(--text)]">
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
              className="reveal grid min-h-[236px] gap-5 rounded-[24px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent_34%),rgba(255,255,255,0.028)] p-6 shadow-[var(--shadow-card)] transition-all duration-300 ease-[var(--ease)] hover:-translate-y-1 hover:border-[rgba(0,161,214,0.28)]"
              data-delay={String((index % 2) + 1)}
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-[1.06rem] font-semibold leading-[1.15] text-[var(--text)]">
                  {review.author}
                </h3>
                <div className="inline-flex min-h-9 items-center rounded-full border border-white/8 bg-white/[0.03] px-3 text-[0.92rem] text-white/84">
                  {formatRating(review.rating)}
                </div>
              </div>

              <p className="text-base leading-8 text-[var(--muted)]">
                &ldquo;{review.comment}&rdquo;
              </p>

              <div className="mt-auto h-px w-full bg-[linear-gradient(90deg,rgba(0,161,214,0.7),transparent_78%)]" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
