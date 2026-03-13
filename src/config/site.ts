export interface SiteConfig {
  clinicName: string;
  primaryColor: string;
  contactPhone: string;
  contactEmail: string;
  defaultServices: string[];
  googleMapsUrl?: string;
  instagramUrl?: string;
  facebookUrl?: string;
}

export const siteConfig: SiteConfig = {
  clinicName: process.env.NEXT_PUBLIC_CLINIC_NAME || "Premium Dental",
  primaryColor: process.env.NEXT_PUBLIC_PRIMARY_COLOR || "#0ea5e9",
  contactPhone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "+1 234 567 8900",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@dental.com",
  defaultServices: [
    "General Dentistry",
    "Cosmetic Dentistry",
    "Orthodontics",
    "Dental Implants",
  ],
  googleMapsUrl: process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL,
  instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL,
  facebookUrl: process.env.NEXT_PUBLIC_FACEBOOK_URL,
};
