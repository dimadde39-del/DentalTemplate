import { SiteConfig } from "@/config/site";
import { ReviewMarquee } from "./atoms/ReviewMarquee";

interface TestimonialsProps {
  readonly config: SiteConfig;
}

export function Testimonials({ config }: TestimonialsProps) {
  if (config.reviews.length === 0) return null;

  return (
    <section id="testimonials" className="py-24 bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
      <div className="container mx-auto px-4 text-center mb-16">
         <p className="text-sm font-bold tracking-widest text-[var(--color-primary)] uppercase mb-3">
            {config.testimonialsTitle}
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-6 line-tight tracking-tight">
            {config.testimonialsTitle}
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            {config.testimonialsSubtitle}
          </p>
      </div>
      
      <ReviewMarquee reviews={config.reviews} />
    </section>
  );
}
