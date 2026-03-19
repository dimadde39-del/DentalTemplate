import { BookingProvider } from "@/context/BookingContext";
import { BookingModal } from "@/components/BookingModal";
import { Header } from "@/components/Header";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getSiteConfig } from "@/lib/tenant";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const slug = headersList.get('x-tenant-slug') ?? 'default';
  if (!slug || (slug === 'default' && process.env.NODE_ENV === 'production')) notFound();
  
  const config = await getSiteConfig(slug);

  return {
    title: {
      default: `${config.clinicName} | Premium Dental Care`,
      template: `%s | ${config.clinicName}`
    },
    description: `Experience modern dentistry at ${config.clinicName}. State-of-the-art technology and compassionate care for your beautiful smile.`,
    openGraph: {
      title: `${config.clinicName} | Premium Dental Care`,
      description: `Experience modern dentistry at ${config.clinicName}. State-of-the-art technology and compassionate care for your beautiful smile.`,
      url: config.siteUrl || 'http://localhost:3000',
      siteName: config.clinicName,
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${config.clinicName} | Premium Dental Care`,
      description: `Experience modern dentistry at ${config.clinicName}. State-of-the-art technology and compassionate care for your beautiful smile.`,
    },
    metadataBase: new URL(config.siteUrl || 'http://localhost:3000'),
  };
}

export default async function TenantLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const slug = headersList.get('x-tenant-slug') ?? 'default';
  if (!slug || (slug === 'default' && process.env.NODE_ENV === 'production')) notFound();
  
  const config = await getSiteConfig(slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "Dentist"],
    "name": config.clinicName,
    "url": config.siteUrl || 'http://localhost:3000',
    "sameAs": [
      config.googleMapsUrl, 
      config.instagramUrl, 
      config.facebookUrl
    ].filter(Boolean)
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
