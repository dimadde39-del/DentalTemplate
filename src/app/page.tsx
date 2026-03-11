import { siteConfig } from "@/config/site";
import { Hero } from "@/components/Hero";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Hero />
      
      {/* Booking Section Placeholder */}
      <section id="booking" className="min-h-screen flex items-center justify-center p-8 bg-foreground/5">
        <h2 className="text-3xl font-bold">Booking Section Placeholder</h2>
      </section>
      
      {/* Services Section Placeholder */}
      <section id="services" className="min-h-screen flex items-center justify-center p-8">
        <h2 className="text-3xl font-bold">Services Section Placeholder</h2>
      </section>
    </div>
  );
}
