import type { ClinicDoctor, ClinicReview, ClinicService } from "@/config/site";

export interface HeroStats {
  readonly reviews: number | null;
  readonly reviewsSuffix?: string;
  readonly rating: number | null;
  readonly specialists?: number | null;
  readonly instagram?: string | null;
}

export interface HeroSectionProps {
  readonly name: string;
  readonly heroTitle: string;
  readonly heroSubtitle: string;
  readonly phone: string;
  readonly stats: HeroStats;
}

export interface ServicesGridProps {
  readonly services: readonly ClinicService[];
  readonly title?: string;
  readonly subtitle?: string;
}

export interface DoctorsGridProps {
  readonly doctors: readonly ClinicDoctor[];
  readonly title?: string;
  readonly subtitle?: string;
}

export interface ReviewsGridProps {
  readonly reviews: readonly ClinicReview[];
  readonly testimonialsTitle: string;
  readonly testimonialsSubtitle: string;
}

export interface ContactCTAProps {
  readonly phone: string;
  readonly email: string | null;
  readonly instagramUrl: string | null;
  readonly address: string | null;
}
