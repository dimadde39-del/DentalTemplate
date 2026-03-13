import { siteConfig } from "@/config/site";
import { CTAButton } from "./CTAButton";
import { FloatingBlobs } from "./FloatingBlobs";

export async function Hero() {
  const config = siteConfig;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      <FloatingBlobs />
      
      <div className="container mx-auto px-4 z-10 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-foreground">
          Premium Care at <br />
          <span className="text-[var(--color-primary)]">{config.clinicName}</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-10">
          Experience modern dentistry with state-of-the-art technology and compassionate care.
        </p>
        
        <CTAButton>Book Appointment</CTAButton>
      </div>
    </section>
  );
}
