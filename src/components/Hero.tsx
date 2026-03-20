import { CTAButton } from "./CTAButton";
import Image from "next/image";
import { FloatingBlobs } from "./FloatingBlobs";
import { SiteConfig } from "@/config/site";

interface HeroProps {
  readonly config: SiteConfig;
}

export function Hero({ config }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      <FloatingBlobs />
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=1920"
          alt="Modern Dental Clinic"
          fill
          className="object-cover opacity-10 dark:opacity-20 pointer-events-none"
          priority={true}
          sizes="100vw"
        />
      </div>
      
      <div className="container mx-auto px-4 z-10 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-foreground">
          {config.heroTitle}
        </h1>
        
        <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-10">
          {config.heroSubtitle}
        </p>
        
        <CTAButton>Book Appointment</CTAButton>
      </div>
    </section>
  );
}
