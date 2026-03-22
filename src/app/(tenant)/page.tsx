import { HeroSection } from "@/components/clinic/HeroSection";
import { StickyWhatsAppButton } from "@/components/clinic/StickyWhatsAppButton";
import { ServicesGrid } from "@/components/clinic/ServicesGrid";
import { DoctorsRail } from "@/components/clinic/DoctorsRail";
import { BookingForm } from "@/components/clinic/BookingForm";
import { ReviewsSection } from "@/components/clinic/ReviewsSection";
import { FinalContactCTA } from "@/components/clinic/FinalContactCTA";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getSiteConfig } from "@/lib/tenant";
import { normalizeHost } from "@/lib/site-url";

function getCanonicalClinicUrl(slug: string, domain?: string | null): string {
  const normalizedDomain = normalizeHost(domain);
  if (normalizedDomain) {
    return `https://${normalizedDomain}`;
  }

  return `https://${slug}.dental-saas-platform.vercel.app`;
}

export default async function Home() {
  const headersList = await headers();
  const slug = headersList.get('x-tenant-slug') ?? 'default';
  if (!slug || (slug === 'default' && process.env.NODE_ENV === 'production')) notFound();
  
  const config = await getSiteConfig(slug);
  if (!config) notFound();

  const canonicalUrl = getCanonicalClinicUrl(slug, config.domain);
  const address =
    "address" in config && typeof config.address === "string" && config.address.trim()
      ? config.address.trim()
      : null;
  const schema = {
    "@context": "https://schema.org",
    "@type": ["MedicalOrganization", "Dentist", "LocalBusiness"],
    name: config.clinicName,
    telephone: config.contactPhone,
    url: canonicalUrl,
    priceRange: "₸₸₸",
    employee: config.doctors.map((doctor) => ({
      "@type": "Physician",
      name: doctor.name,
      jobTitle: doctor.specialty,
    })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: config.servicesTitle,
      itemListElement: config.services.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.name,
        },
        ...(service.price?.trim() ? { price: service.price.trim() } : {}),
      })),
    },
    ...(address
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: address,
            addressLocality: "Алматы",
            addressCountry: "KZ",
          },
        }
      : {}),
  };

  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <HeroSection config={config} />
      <ServicesGrid config={config} />
      <DoctorsRail config={config} />
      <BookingForm config={config} slug={slug} />
      <ReviewsSection config={config} />
      <FinalContactCTA config={config} />
      <StickyWhatsAppButton phone={config.contactPhone} />
    </main>
  );
}
