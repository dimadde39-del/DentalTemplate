"use client";

import type { ReviewsGridProps } from "@/components/clinic/template-props";
import { getVisibleReviews } from "@/components/clinic/utils";
import { useClinicSectionEffects } from "@/components/clinic/useClinicSectionEffects";
import {
  warmClinicBodyFont,
  warmClinicHeadingFont,
} from "./fonts";

const SECTION_LABELS = {
  eyebrow: "Отзывы",
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
    <section
      id="reviews"
      className={`${warmClinicBodyFont.className} pt-[clamp(88px,10vw,144px)]`}
    >
      <div
        ref={sectionRef}
        className="mx-auto w-full max-w-[1360px] px-4 sm:px-6 lg:px-8"
      >
        <div className="reveal mb-8 grid gap-4 lg:mb-10">
          <span className="inline-flex items-center gap-3 text-[0.8rem] uppercase tracking-[0.2em] text-[#5B7D8A]">
            <span className="h-px w-10 bg-[linear-gradient(90deg,transparent,var(--accent))]" />
            <span>{SECTION_LABELS.eyebrow}</span>
          </span>
          <h2
            className={`max-w-[14ch] text-[clamp(2.2rem,4vw,4rem)] leading-[1] tracking-[-0.04em] text-[#0F2A35] italic ${warmClinicHeadingFont.className}`}
          >
            {testimonialsTitle}
          </h2>
          {testimonialsSubtitle.trim() ? (
            <p className="max-w-[64ch] text-base leading-8 text-[#5B7D8A]">
              {testimonialsSubtitle}
            </p>
          ) : null}
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {visibleReviews.map((review, index) => (
            <article
              key={review.id}
              className="reveal grid min-h-[236px] gap-5 rounded-[26px] border border-[rgba(0,161,214,0.15)] bg-white p-6 shadow-[0_18px_42px_rgba(15,42,53,0.06)] transition-all duration-300 ease-[var(--ease)] hover:-translate-y-1 hover:border-[var(--accent)]"
              data-delay={String((index % 2) + 1)}
            >
              <div className="flex items-center justify-between gap-4">
                <h3
                  className={`text-[1.14rem] leading-[1.15] text-[#0F2A35] italic ${warmClinicHeadingFont.className}`}
                >
                  {review.author}
                </h3>
                <div className="inline-flex min-h-9 items-center rounded-full border border-[rgba(0,161,214,0.12)] bg-[#F4FCFF] px-3 text-[0.92rem] text-[#0F2A35]">
                  {formatRating(review.rating)}
                </div>
              </div>

              <p className="text-[1.04rem] leading-8 text-[#5B7D8A] italic">
                &ldquo;{review.comment}&rdquo;
              </p>

              <div className="mt-auto h-px w-full bg-[linear-gradient(90deg,var(--accent),transparent_78%)] opacity-35" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
