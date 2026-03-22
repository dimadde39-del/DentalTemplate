export interface ClinicService {
  id: string;
  name: string;
  description: string | null;
  price: string | null;
}

export interface ClinicDoctor {
  id: string;
  name: string;
  specialty: string;
  photo_url: string | null;
}

export interface ClinicReview {
  id: string;
  author: string;
  rating: number;
  comment: string;
}

export interface SiteConfig {
  clinicName: string;
  primaryColor: string;
  contactPhone: string;
  contactEmail: string;
  domain?: string | null;
  heroTitle: string;
  heroSubtitle: string;
  servicesTitle: string;
  servicesSubtitle: string;
  doctorsTitle: string;
  doctorsSubtitle: string;
  testimonialsTitle: string;
  testimonialsSubtitle: string;
  services: ClinicService[];
  doctors: ClinicDoctor[];
  reviews: ClinicReview[];
  siteUrl?: string;
  googleMapsUrl?: string;
  instagramUrl?: string;
  facebookUrl?: string;
}

export const siteConfig: SiteConfig = {
  clinicName: process.env.NEXT_PUBLIC_CLINIC_NAME || "Premium Dental",
  primaryColor: process.env.NEXT_PUBLIC_PRIMARY_COLOR || "#0ea5e9",
  contactPhone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "+1 234 567 8900",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@dental.com",
  domain: null,
  heroTitle: "Premium Care for Confident Smiles",
  heroSubtitle:
    "Experience modern dentistry with a specialist team, thoughtful service, and treatment plans tailored to your goals.",
  servicesTitle: "Our Services",
  servicesSubtitle:
    "From preventive care to complex restorative work, every treatment is built around long-term oral health.",
  doctorsTitle: "Meet the Specialists",
  doctorsSubtitle:
    "Our clinicians combine advanced training with a patient-first approach to deliver clear, confident care.",
  testimonialsTitle: "Patient Reviews",
  testimonialsSubtitle:
    "Real feedback from patients who trusted our team with their smile, comfort, and long-term treatment journey.",
  services: [],
  doctors: [],
  reviews: [],
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  googleMapsUrl: process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL,
  instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL,
  facebookUrl: process.env.NEXT_PUBLIC_FACEBOOK_URL,
};
