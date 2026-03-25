import { HeroSection } from "@/components/clinic/HeroSection";
import { StickyWhatsAppButton } from "@/components/clinic/StickyWhatsAppButton";
import { ServicesGrid } from "@/components/clinic/ServicesGrid";
import { DoctorsGrid } from "@/components/clinic/DoctorsGrid";
import { BookingForm } from "@/components/clinic/BookingForm";
import { ReviewsGrid } from "@/components/clinic/ReviewsGrid";
import { ContactCTA } from "@/components/clinic/ContactCTA";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getSiteConfig } from "@/lib/tenant";
import { normalizeHost } from "@/lib/site-url";
import { resolveClinicVariant, VARIANTS } from "@/lib/tenant/variants";
import {
  extractInstagramHandle,
  extractRating,
  extractReviewCount,
  getAverageRating,
} from "@/components/clinic/utils";

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
  const address = config.address?.trim() || null;
  const reviewCount = extractReviewCount([
    config.testimonialsSubtitle,
    config.heroSubtitle,
  ]);
  const averageRating = getAverageRating(config.reviews);
  const heroRating = extractRating([
    config.testimonialsSubtitle,
    config.heroSubtitle,
  ]) ?? averageRating;
  const instagramHandle = extractInstagramHandle(config.instagramUrl);
  const variant = resolveClinicVariant(config.theme?.variant);
  const labels = VARIANTS[variant].labels;
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
      <HeroSection
        variant={variant}
        name={config.clinicName}
        heroTitle={config.heroTitle}
        heroSubtitle={config.heroSubtitle}
        phone={config.contactPhone}
        labels={labels}
        stats={{
          reviews: reviewCount.value ?? config.reviews.length,
          reviewsSuffix: reviewCount.suffix,
          rating: heroRating,
          specialists: config.doctors.length,
          instagram: instagramHandle,
        }}
      />
      <ServicesGrid
        variant={variant}
        services={config.services}
        title={config.servicesTitle}
        subtitle={config.servicesSubtitle}
        labels={labels}
      />
      <DoctorsGrid
        variant={variant}
        doctors={config.doctors}
        title={config.doctorsTitle}
        subtitle={config.doctorsSubtitle}
        labels={labels}
      />
      <BookingForm config={config} slug={slug} />
      <ReviewsGrid
        variant={variant}
        reviews={config.reviews}
        testimonialsTitle={config.testimonialsTitle}
        testimonialsSubtitle={config.testimonialsSubtitle}
        labels={labels}
      />
      <ContactCTA
        variant={variant}
        phone={config.contactPhone}
        email={config.contactEmail}
        instagramUrl={config.instagramUrl ?? null}
        address={address}
        labels={labels}
      />
      <StickyWhatsAppButton phone={config.contactPhone} />
    </main>
  );
}
