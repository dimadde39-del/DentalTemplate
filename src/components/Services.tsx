import { siteConfig } from "@/config/site";
import { ServiceCard } from "./atoms/ServiceCard";
import { Sparkles, Activity, ShieldCheck, Heart } from "lucide-react";

export function Services() {
  const icons = [
    <Sparkles key="1" className="w-8 h-8" />,
    <Activity key="2" className="w-8 h-8" />,
    <ShieldCheck key="3" className="w-8 h-8" />,
    <Heart key="4" className="w-8 h-8" />,
  ];

  return (
    <section id="services" className="py-24 bg-zinc-50 dark:bg-zinc-950">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-sm font-bold tracking-widest text-[var(--color-primary)] uppercase mb-3">
            Our Services
          </h2>
          <h3 className="text-4xl md:text-5xl font-extrabold text-foreground mb-6 line-tight tracking-tight">
            Comprehensive Care for Your Smile
          </h3>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            From routine checkups to advanced cosmetic procedures, our expert team provides personalized treatment tailored to your unique needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {siteConfig.defaultServices.map((service, index) => (
            <div
              key={service}
              className={
                index === 0
                  ? "md:col-span-2 lg:col-span-2"
                  : index === 3
                  ? "md:col-span-2 lg:col-span-2"
                  : "col-span-1"
              }
            >
              <ServiceCard
                title={service}
                icon={icons[index % icons.length]}
                delay={index * 0.1}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
