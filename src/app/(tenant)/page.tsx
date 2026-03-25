import { StickyWhatsAppButton } from "@/components/clinic/StickyWhatsAppButton";
import { BookingForm } from "@/components/clinic/BookingForm";
import { getTemplate } from "@/components/clinic/getTemplate";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getSiteConfig } from "@/lib/tenant";
import { normalizeHost } from "@/lib/site-url";
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
  const { HeroSection, ServicesGrid, DoctorsGrid, ReviewsGrid, ContactCTA } =
    getTemplate(config.theme?.variant);
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
        name={config.clinicName}
        heroTitle={config.heroTitle}
        heroSubtitle={config.heroSubtitle}
        phone={config.contactPhone}
        stats={{
          reviews: reviewCount.value ?? config.reviews.length,
          reviewsSuffix: reviewCount.suffix,
          rating: heroRating,
          specialists: config.doctors.length,
          instagram: instagramHandle,
        }}
      />
      <ServicesGrid
        services={config.services}
        title={config.servicesTitle}
        subtitle={config.servicesSubtitle}
      />
      <DoctorsGrid
        doctors={config.doctors}
        title={config.doctorsTitle}
        subtitle={config.doctorsSubtitle}
      />
      <BookingForm config={config} slug={slug} />
      <ReviewsGrid
        reviews={config.reviews}
        testimonialsTitle={config.testimonialsTitle}
        testimonialsSubtitle={config.testimonialsSubtitle}
      />
      <ContactCTA
        phone={config.contactPhone}
        email={config.contactEmail}
        instagramUrl={config.instagramUrl ?? null}
        address={address}
      />
      <StickyWhatsAppButton phone={config.contactPhone} />
    </main>
  );
}
