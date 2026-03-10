import { siteConfig } from "@/config/site";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
      <main className="flex flex-col items-center justify-center space-y-8 text-center max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-primary">
          {siteConfig.clinicName}
        </h1>
        <p className="text-lg text-foreground/80 leading-relaxed">
          Premium dental template ready for customization.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button className="rounded-full bg-primary px-8 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90">
            Book Appointment
          </button>
          <button className="rounded-full border border-foreground/20 px-8 py-3 text-sm font-medium hover:bg-foreground/5 transition-colors">
            Our Services
          </button>
        </div>
      </main>
    </div>
  );
}
