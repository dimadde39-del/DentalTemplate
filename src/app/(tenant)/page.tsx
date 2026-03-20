import { HeroSection } from "@/components/clinic/HeroSection";
import { StickyWhatsAppButton } from "@/components/clinic/StickyWhatsAppButton";
import { ServicesGrid } from "@/components/clinic/ServicesGrid";
import { DoctorsRail } from "@/components/clinic/DoctorsRail";
import { ReviewsSection } from "@/components/clinic/ReviewsSection";
import { FinalContactCTA } from "@/components/clinic/FinalContactCTA";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getSiteConfig } from "@/lib/tenant";

export default async function Home() {
  const headersList = await headers();
  const slug = headersList.get('x-tenant-slug') ?? 'default';
  if (!slug || (slug === 'default' && process.env.NODE_ENV === 'production')) notFound();
  
  const config = await getSiteConfig(slug);
  if (!config) notFound();

  return (
    <main className="min-h-screen bg-background">
      <HeroSection config={config} />
      <ServicesGrid config={config} />
      <DoctorsRail config={config} />
      <ReviewsSection config={config} />
      <FinalContactCTA config={config} />
      <StickyWhatsAppButton phone={config.contactPhone} />
    </main>
  );
}
