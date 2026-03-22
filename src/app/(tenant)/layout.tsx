import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getSiteConfig } from "@/lib/tenant";
import { normalizeHost } from "@/lib/site-url";
import type { Metadata } from "next";
import { BookingProvider } from "@/context/BookingContext";
import { BookingModal } from "@/components/BookingModal";

function getCanonicalClinicUrl(slug: string, domain?: string | null): string {
  const normalizedDomain = normalizeHost(domain);
  if (normalizedDomain) {
    return `https://${normalizedDomain}`;
  }

  return `https://${slug}.dental-saas-platform.vercel.app`;
}

async function getTenantRequestContext() {
  const headersList = await headers();
  const slug = headersList.get("x-tenant-slug") ?? "default";

  if (!slug || (slug === "default" && process.env.NODE_ENV === "production")) notFound();

  const config = await getSiteConfig(slug);
  if (!config) notFound();

  const siteUrl = getCanonicalClinicUrl(slug, config.domain);

  return { slug, config, siteUrl };
}

export async function generateMetadata(): Promise<Metadata> {
  const { config, siteUrl } = await getTenantRequestContext();
  const description =
    config.heroSubtitle?.trim() ||
    "Современная стоматология в Алматы с консультацией, имплантацией и комплексным лечением.";
  const title = `${config.clinicName} | Стоматология в Алматы`;

  return {
    title,
    description,
    alternates: {
      canonical: siteUrl,
    },
    openGraph: {
      title,
      description,
      url: siteUrl,
      siteName: config.clinicName,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
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
  const { slug, config } = await getTenantRequestContext();

  return (
    <div style={{ "--primary": config.primaryColor } as React.CSSProperties} className="min-h-screen">
      <BookingProvider>
        {children}
        <BookingModal config={config} slug={slug} />
      </BookingProvider>
    </div>
  );
}
