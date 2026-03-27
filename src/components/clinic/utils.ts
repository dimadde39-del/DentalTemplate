import type { ClinicDoctor, ClinicReview, ClinicService } from "@/config/site";

const PRICE_FORMATTER = new Intl.NumberFormat("ru-RU", {
  maximumFractionDigits: 2,
});

const REVIEW_WORD_PATTERN = new RegExp(
  "(\\d[\\d\\s]*)\\s*(\\+)?\\s*\\u043E\\u0442\\u0437\\u044B\\u0432",
  "iu"
);

const RATING_PATTERN = new RegExp(
  "(?:\\u0440\\u0435\\u0439\\u0442\\u0438\\u043D\\u0433(?:\\u043E\\u043C)?\\s*)?(\\d[.,]\\d)",
  "iu"
);

function formatNumericAmount(value: string): string | null {
  if (!/^\d[\d\s]*(?:[.,]\d+)?$/.test(value)) return null;

  const amount = Number(value.replace(/\s+/g, "").replace(",", "."));
  if (!Number.isFinite(amount) || amount <= 0) return null;

  return PRICE_FORMATTER.format(amount);
}

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
  if (!raw) return "\u0426\u0435\u043D\u0430 \u043F\u043E \u0437\u0430\u043F\u0440\u043E\u0441\u0443";

  const normalized = raw.replace(/\u00A0/g, " ").replace(/\s+/g, " ").trim();

  const rangeMatch = normalized.match(
    /^(\d[\d\s]*(?:[.,]\d+)?)\s*[–—-]\s*(\d[\d\s]*(?:[.,]\d+)?)\s*(?:₸|тг)?$/iu
  );
  if (rangeMatch) {
    const start = formatNumericAmount(rangeMatch[1]);
    const end = formatNumericAmount(rangeMatch[2]);

    if (start && end) {
      return `${start} – ${end} ₸`;
    }
  }

  const approximateMatch = normalized.match(
    /^(от|from)\s+(\d[\d\s]*(?:[.,]\d+)?)\s*(?:₸|тг)?$/iu
  );
  if (approximateMatch) {
    const amount = formatNumericAmount(approximateMatch[2]);

    if (amount) {
      return `${approximateMatch[1].toLowerCase() === "from" ? "from" : "от"} ${amount} ₸`;
    }
  }

  const exactMatch = normalized.match(/^(\d[\d\s]*(?:[.,]\d+)?)\s*(?:₸|тг)?$/iu);
  if (exactMatch) {
    const amount = formatNumericAmount(exactMatch[1]);

    if (amount) {
      return `${amount} ₸`;
    }
  }

  return normalized;
}

export function isBracketService(service: Pick<ClinicService, "name">): boolean {
  return service.name.trim().toLowerCase().includes("\u0431\u0440\u0435\u043A\u0435\u0442");
}

export function isFeaturedConsultation(service: ClinicService): boolean {
  const name = service.name.trim().toLowerCase();
  const price = service.price?.trim().toLowerCase() ?? "";

  return (
    name.includes("\u043A\u043E\u043D\u0441\u0443\u043B\u044C\u0442\u0430\u0446") ||
    price.includes("\u0431\u0435\u0441\u043F\u043B\u0430\u0442")
  );
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
    const match = text?.match(REVIEW_WORD_PATTERN);
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
    const match = text?.match(RATING_PATTERN);
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
