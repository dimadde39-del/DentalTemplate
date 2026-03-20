import { BookingProvider } from "@/context/BookingContext";
import { BookingModal } from "@/components/BookingModal";
import { Header } from "@/components/Header";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getSiteConfig } from "@/lib/tenant";
import { getClinicSiteUrl, normalizeHost } from "@/lib/site-url";
import type { Metadata } from "next";

async function getTenantRequestContext() {
  const headersList = await headers();
  const slug = headersList.get("x-tenant-slug") ?? "default";
  const pathPrefix = headersList.get("x-tenant-path-prefix");
  const requestHost = normalizeHost(headersList.get("x-forwarded-host") ?? headersList.get("host"));
  const protocol = headersList.get("x-forwarded-proto") ?? undefined;

  if (!slug || (slug === "default" && process.env.NODE_ENV === "production")) notFound();

  const config = await getSiteConfig(slug);
  if (!config) notFound();

  const siteUrl =
    headersList.get("x-tenant-site-url") ??
    getClinicSiteUrl({
      slug,
      requestHost,
      protocol,
      domain: config.siteUrl,
      pathPrefix,
    });

  return { slug, config, siteUrl };
}

export async function generateMetadata(): Promise<Metadata> {
  const { config, siteUrl } = await getTenantRequestContext();
  const description = config.heroSubtitle;

  return {
    title: {
      default: `${config.clinicName} | Premium Dental Care`,
      template: `%s | ${config.clinicName}`,
    },
    description,
    alternates: {
      canonical: siteUrl,
    },
    openGraph: {
      title: `${config.clinicName} | Premium Dental Care`,
      description,
      url: siteUrl,
      siteName: config.clinicName,
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${config.clinicName} | Premium Dental Care`,
      description,
    },
    metadataBase: new URL(siteUrl),
  };
}

export default async function TenantLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { slug, config, siteUrl } = await getTenantRequestContext();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "Dentist"],
    name: config.clinicName,
    url: siteUrl,
    sameAs: [config.googleMapsUrl, config.instagramUrl, config.facebookUrl].filter(Boolean),
  };

  return (
    <div style={{ "--primary": config.primaryColor } as React.CSSProperties} className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BookingProvider>
        <Header config={config} />
        {children}
        <BookingModal config={config} slug={slug} />
      </BookingProvider>
    </div>
  );
}
