import { Star } from "lucide-react";
import { ClinicReview, SiteConfig } from "@/config/site";

interface ReviewsSectionProps {
  readonly config: SiteConfig;
}

function getVisibleReviews(reviews: readonly ClinicReview[]): ClinicReview[] {
  return reviews.filter(
    (review) => review.author?.trim() && review.comment?.trim()
  );
}

function getSafeRating(rating: number): number {
  if (!Number.isFinite(rating) || rating <= 0) return 0;
  return Math.min(5, Math.round(rating));
}

export function ReviewsSection({ config }: ReviewsSectionProps) {
  const reviews = getVisibleReviews(config.reviews);

  if (reviews.length === 0) return null;

  return (
    <section id="reviews" className="bg-background py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-left sm:text-center">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-[var(--color-primary)]/80">
            {config.testimonialsTitle}
          </p>
          <h2 className="mt-3 text-3xl font-black leading-[0.98] tracking-[-0.04em] text-foreground sm:text-4xl lg:text-5xl">
            {config.testimonialsTitle}
          </h2>
          {config.testimonialsSubtitle?.trim() ? (
            <p className="mt-4 text-base leading-7 text-foreground/72 sm:text-lg">
              {config.testimonialsSubtitle}
            </p>
          ) : null}
        </div>

        <div className="-mx-4 mt-10 overflow-x-auto px-4 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:mx-0 lg:mt-14 lg:overflow-visible lg:px-0">
          <div className="flex snap-x snap-mandatory gap-4 pb-2 lg:grid lg:grid-cols-3 lg:gap-6 lg:pb-0">
            {reviews.map((review) => {
              const rating = getSafeRating(review.rating);

              return (
                <article
                  key={review.id}
                  className="group flex w-[18rem] shrink-0 snap-start flex-col justify-between overflow-hidden rounded-[28px] border border-foreground/8 bg-foreground/[0.03] p-5 ring-1 ring-white/5 transition-[transform,box-shadow,border-color] duration-200 lg:w-auto lg:shrink lg:hover:scale-[1.02] lg:hover:border-[var(--color-primary)] lg:hover:shadow-[0_18px_50px_color-mix(in_oklab,var(--color-primary)_14%,transparent)]"
                >
                  <div>
                    {rating > 0 ? (
                      <div className="flex items-center gap-1 text-[var(--color-primary)]">
                        {Array.from({ length: rating }).map((_, index) => (
                          <Star
                            key={`${review.id}-star-${index}`}
                            className="h-4 w-4 fill-current"
                          />
                        ))}
                      </div>
                    ) : null}

                    <blockquote className="mt-5 text-lg leading-8 tracking-[-0.02em] text-foreground sm:text-[1.15rem]">
                      &ldquo;{review.comment}&rdquo;
                    </blockquote>
                  </div>

                  <div className="mt-8 border-t border-foreground/8 pt-4">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground/78">
                      {review.author}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
