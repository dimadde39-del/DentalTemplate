import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { siteConfig } from "@/config/site";
import { BookingProvider } from "@/context/BookingContext";
import { Header } from "@/components/Header";
import { BookingModal } from "@/components/BookingModal";
import "./globals.css";

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
  description: `Premium dental care at ${siteConfig.clinicName}`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={
          {
            "--primary": siteConfig.primaryColor,
          } as React.CSSProperties
        }
      >
        <BookingProvider>
          <Header />
          {children}
          <BookingModal />
        </BookingProvider>
      </body>
    </html>
  );
}
