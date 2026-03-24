import { ClinicDoctor, ClinicReview, ClinicService } from "@/config/site";

export function toTelHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function toWhatsAppHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}`;
}

export function extractInstagramHandle(url: string | null | undefined): string | null {
  const trimmed = url?.trim();
  if (!trimmed) return null;

  try {
    const parsed = new URL(trimmed);
    const handle = parsed.pathname.replace(/\//g, "").trim();
    return handle ? `@${handle.replace(/^@/, "")}` : null;
  } catch {
    const handle = trimmed
      .replace(/^https?:\/\/(www\.)?instagram\.com\//i, "")
      .replace(/^@/, "")
      .replace(/\/+$/, "")
      .trim();

    return handle ? `@${handle}` : null;
  }
}

export function getDoctorInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function normalizeDoctorPhotoSrc(photoUrl: string | null | undefined): string | null {
  const trimmed = photoUrl?.trim();
  if (!trimmed) return null;

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

export function formatServicePrice(price: string | null | undefined): string {
  const raw = price?.trim();
  if (!raw) return "Цена по запросу";

  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) return raw;

  const amount = Number(digits);
  if (!Number.isFinite(amount) || amount <= 0) return raw;

  const formatted = `${Math.trunc(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ₸`;
  const isApproximate = /(^|\s)(от|from)|[~+]|[-–—]/i.test(raw);

  return isApproximate ? `от ${formatted}` : formatted;
}

export function isBracketService(service: Pick<ClinicService, "name">): boolean {
  return service.name.trim().toLowerCase().includes("брекет");
}

export function isFeaturedConsultation(service: ClinicService): boolean {
  const name = service.name.trim().toLowerCase();
  const price = service.price?.trim().toLowerCase() ?? "";

  return name.includes("консультац") || price.includes("бесплат");
}

export function getAverageRating(reviews: readonly ClinicReview[]): number | null {
  const values = reviews
    .map((review) => review.rating)
    .filter((rating): rating is number => Number.isFinite(rating) && rating > 0);

  if (values.length === 0) return null;

  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  return Math.round(average * 10) / 10;
}

export function extractReviewCount(
  texts: readonly (string | null | undefined)[]
): { value: number | null; suffix: string } {
  for (const text of texts) {
    const match = text?.match(/(\d[\d\s]*)\s*(\+)?\s*отзыв/iu);
    if (!match) continue;

    const digits = match[1].replace(/[^\d]/g, "");
    if (!digits) continue;

    return {
      value: Number(digits),
      suffix: match[2] ? "+" : "",
    };
  }

  return { value: null, suffix: "" };
}

export function extractRating(texts: readonly (string | null | undefined)[]): number | null {
  for (const text of texts) {
    const match = text?.match(/(?:рейтинг(?:ом)?\s*)?(\d[.,]\d)/iu);
    if (!match) continue;

    const value = Number(match[1].replace(",", "."));
    if (Number.isFinite(value) && value > 0) {
      return value;
    }
  }

  return null;
}

export function getVisibleServices(services: readonly ClinicService[]): ClinicService[] {
  return services.filter((service) => service.name?.trim());
}

export function getVisibleDoctors(doctors: readonly ClinicDoctor[]): ClinicDoctor[] {
  return doctors.filter((doctor) => doctor.name?.trim());
}

export function getVisibleReviews(reviews: readonly ClinicReview[]): ClinicReview[] {
  return reviews.filter((review) => review.author?.trim() && review.comment?.trim());
}
