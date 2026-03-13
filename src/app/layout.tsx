import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { BookingProvider } from "@/context/BookingContext";
import { BookingModal } from "@/components/BookingModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: siteConfig.clinicName,
  description: "Multitenant Dental Clinic Template",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ "--primary": siteConfig.primaryColor } as React.CSSProperties}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <BookingProvider>
          {children}
          <BookingModal />
        </BookingProvider>
      </body>
    </html>
  );
}
