import { reviews } from "@/constants/data";
import { ReviewMarquee } from "./atoms/ReviewMarquee";

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
      <div className="container mx-auto px-4 text-center mb-16">
         <h2 className="text-sm font-bold tracking-widest text-[var(--color-primary)] uppercase mb-3">
            Testimonials
          </h2>
          <h3 className="text-4xl md:text-5xl font-extrabold text-foreground mb-6 line-tight tracking-tight">
            Loved By Our Patients
          </h3>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Don't just take our word for it. Here is what our patients have to say about their experience with us.
          </p>
      </div>
      
      <ReviewMarquee reviews={reviews} />
    </section>
  );
}
