import { siteConfig } from "@/config/site";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { Testimonials } from "@/components/Testimonials";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Hero />
      <Services />
      <Testimonials />
      
      {/* Booking Section Placeholder */}
      <section id="booking" className="min-h-screen flex items-center justify-center p-8 bg-foreground/5">
        <h2 className="text-3xl font-bold">Booking Section Placeholder</h2>
      </section>
    </div>
  );
}
