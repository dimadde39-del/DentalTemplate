import { ServiceCard } from "./atoms/ServiceCard";
import { Sparkles, Activity, ShieldCheck, Heart } from "lucide-react";
import { SiteConfig } from "@/config/site";

interface ServicesProps {
  readonly config: SiteConfig;
}

export function Services({ config }: ServicesProps) {
  if (config.services.length === 0) return null;

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
          <p className="text-sm font-bold tracking-widest text-[var(--color-primary)] uppercase mb-3">
            {config.servicesTitle}
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-6 line-tight tracking-tight">
            {config.servicesTitle}
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            {config.servicesSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {config.services.map((service, index) => (
            <div
              key={service.id}
              className={
                index === 0
                  ? "md:col-span-2 lg:col-span-2"
                  : index === 3
                  ? "md:col-span-2 lg:col-span-2"
                  : "col-span-1"
              }
            >
              <ServiceCard
                title={service.name}
                description={service.description}
                price={service.price}
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
