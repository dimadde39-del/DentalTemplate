import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { BookingProvider } from "@/context/BookingContext";
import { BookingModal } from "@/components/BookingModal";
import { Header } from "@/components/Header";
import { headers } from "next/headers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const slug = headersList.get('x-tenant-slug') ?? 'default';
  
  // Mock config fetch for tenant. In production, await getSiteConfig(slug)
  const config = siteConfig;

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const slug = headersList.get('x-tenant-slug') ?? 'default';
  const config = siteConfig; // would fetch dynamically based on slug

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
    <html lang="en" style={{ "--primary": config.primaryColor } as React.CSSProperties}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <BookingProvider>
          <Header />
          {children}
          <BookingModal />
        </BookingProvider>
      </body>
    </html>
  );
}
