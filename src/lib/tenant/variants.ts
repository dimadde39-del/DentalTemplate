export type ClinicVariant = "dark-tech" | "warm-clinic" | "premium-med";

export type VariantFontName =
  | "Jura"
  | "Onest"
  | "Playfair Display"
  | "Nunito"
  | "DM Serif Display"
  | "DM Sans";

export interface ClinicVariantLabels {
  heroEyebrow: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
  heroPanelKicker: string;
  heroPanelTitle: string;
  heroPhoneLabel: string;
  heroFormatLabel: string;
  heroFormatValue: string;
  heroStartLabel: string;
  heroStartValue: string;
  heroReviewsLabel: string;
  heroRatingLabel: string;
  heroSpecialistsLabel: string;
  heroInstagramLabel: string;
  servicesEyebrow: string;
  featuredServiceBadge: string;
  servicePriceLabel: string;
  serviceMoreLabel: string;
  bracesBadge: string;
  bracesTitle: string;
  bracesDescription: string;
  doctorsEyebrow: string;
  doctorPrefix: string | null;
  reviewsEyebrow: string;
  contactEyebrow: string;
  contactTitle: string;
  contactPrimaryCta: string;
  contactSecondaryCta: string;
}

export interface ClinicVariantDefinition {
  readonly colorScheme: "dark" | "light";
  readonly fonts: {
    readonly heading: VariantFontName;
    readonly body: VariantFontName;
  };
  readonly tokens: Record<`--${string}`, string>;
  readonly labels: ClinicVariantLabels;
  readonly buttonShape: "rounded" | "pill";
  readonly headingStyle: "serif-italic" | "sans";
}

export const DEFAULT_CLINIC_VARIANT: ClinicVariant = "dark-tech";

export const FONT_VARIABLES: Record<VariantFontName, string> = {
  Jura: "var(--font-jura)",
  Onest: "var(--font-onest)",
  "Playfair Display": "var(--font-playfair-display)",
  Nunito: "var(--font-nunito)",
  "DM Serif Display": "var(--font-dm-serif-display)",
  "DM Sans": "var(--font-dm-sans)",
};

export const VARIANTS = {
  "dark-tech": {
    colorScheme: "dark",
    fonts: { heading: "Jura", body: "Onest" },
    tokens: {
      "--bg": "#050608",
      "--bg-soft": "#0a0c0f",
      "--surface": "rgba(255,255,255,0.045)",
      "--surface-strong": "rgba(255,255,255,0.075)",
      "--line": "rgba(255,255,255,0.12)",
      "--line-strong": "rgba(255,255,255,0.18)",
      "--text": "#f5f7fa",
      "--muted": "rgba(245,247,250,0.65)",
      "--muted-soft": "rgba(245,247,250,0.5)",
      "--ambient": "rgba(255,255,255,0.055)",
      "--page-top": "#07090c",
      "--page-bottom": "#080a0d",
      "--grid-line": "rgba(255,255,255,0.018)",
      "--grid-opacity": "0.46",
      "--noise-dot": "rgba(255,255,255,0.05)",
      "--noise-opacity": "0.06",
      "--shadow-soft": "0 22px 64px rgba(0,0,0,0.34)",
      "--shadow-card": "0 16px 42px rgba(0,0,0,0.28)",
    },
    buttonShape: "rounded",
    headingStyle: "sans",
    labels: {
      heroEyebrow: "Clinic / precision care",
      heroPrimaryCta: "Записаться на консультацию",
      heroSecondaryCta: "Позвонить",
      heroPanelKicker: "direct line",
      heroPanelTitle: "Контакт с клиникой без лишних шагов",
      heroPhoneLabel: "Телефон",
      heroFormatLabel: "Формат",
      heroFormatValue: "WhatsApp / звонок",
      heroStartLabel: "Старт",
      heroStartValue: "С бесплатной консультации",
      heroReviewsLabel: "отзывов",
      heroRatingLabel: "рейтинг",
      heroSpecialistsLabel: "специалистов",
      heroInstagramLabel: "Instagram",
      servicesEyebrow: "Services / precision",
      featuredServiceBadge: "Featured service",
      servicePriceLabel: "стоимость",
      serviceMoreLabel: "подробнее",
      bracesBadge: "Ортодонтический пакет",
      bracesTitle: "Брекеты в одном раскрывающемся блоке",
      bracesDescription:
        "Все варианты брекет-систем собраны в одном месте, чтобы не дробить сетку на несколько однотипных карточек.",
      doctorsEyebrow: "Doctors / expertise",
      doctorPrefix: "Doctor",
      reviewsEyebrow: "Reviews / social proof",
      contactEyebrow: "Contact / direct line",
      contactTitle: "Связаться быстро, без лишних шагов",
      contactPrimaryCta: "Написать в WhatsApp",
      contactSecondaryCta: "Позвонить сейчас",
    },
  },
  "warm-clinic": {
    colorScheme: "light",
    fonts: { heading: "Playfair Display", body: "Nunito" },
    tokens: {
      "--bg": "#F8FAFC",
      "--bg-soft": "#EAF7FC",
      "--surface": "#FFFFFF",
      "--surface-strong": "#C8EEFA",
      "--line": "rgba(0,161,214,0.15)",
      "--line-strong": "rgba(0,161,214,0.28)",
      "--text": "#0F2A35",
      "--muted": "#5B7D8A",
      "--muted-soft": "rgba(91,125,138,0.72)",
      "--ambient": "rgba(0,161,214,0.08)",
      "--page-top": "#FEFFFF",
      "--page-bottom": "#E9F6FC",
      "--grid-line": "rgba(0,161,214,0.06)",
      "--grid-opacity": "0.22",
      "--noise-dot": "rgba(15,42,53,0.05)",
      "--noise-opacity": "0.03",
      "--shadow-soft": "0 22px 54px rgba(16,74,94,0.08)",
      "--shadow-card": "0 14px 36px rgba(16,74,94,0.08)",
    },
    buttonShape: "pill",
    headingStyle: "serif-italic",
    labels: {
      heroEyebrow: "Добро пожаловать",
      heroPrimaryCta: "Записаться",
      heroSecondaryCta: "Позвонить нам",
      heroPanelKicker: "на связи",
      heroPanelTitle: "Поможем подобрать удобный формат консультации",
      heroPhoneLabel: "Телефон",
      heroFormatLabel: "Как удобно",
      heroFormatValue: "WhatsApp или звонок",
      heroStartLabel: "Первый шаг",
      heroStartValue: "С тёплой консультации",
      heroReviewsLabel: "отзывов",
      heroRatingLabel: "средняя оценка",
      heroSpecialistsLabel: "специалистов",
      heroInstagramLabel: "Instagram",
      servicesEyebrow: "Что мы лечим",
      featuredServiceBadge: "С чего начать",
      servicePriceLabel: "стоимость",
      serviceMoreLabel: "посмотреть",
      bracesBadge: "Ортодонтия",
      bracesTitle: "Варианты брекет-систем в одном разделе",
      bracesDescription:
        "Мы собираем все варианты брекетов в одном раскрывающемся блоке, чтобы выбор был спокойным и понятным.",
      doctorsEyebrow: "Наша команда",
      doctorPrefix: null,
      reviewsEyebrow: "Отзывы",
      contactEyebrow: "Как с нами связаться",
      contactTitle: "Мы рядом и всегда готовы ответить",
      contactPrimaryCta: "Написать в WhatsApp",
      contactSecondaryCta: "Позвонить",
    },
  },
  "premium-med": {
    colorScheme: "light",
    fonts: { heading: "DM Serif Display", body: "DM Sans" },
    tokens: {
      "--bg": "#F7F7F5",
      "--bg-soft": "#F0F0EC",
      "--surface": "#FFFFFF",
      "--surface-strong": "#FFFFFF",
      "--line": "rgba(0,0,0,0.08)",
      "--line-strong": "rgba(0,0,0,0.14)",
      "--text": "#111110",
      "--muted": "#6B6B6B",
      "--muted-soft": "rgba(107,107,107,0.72)",
      "--ambient": "rgba(30,58,138,0.05)",
      "--page-top": "#FAFAF8",
      "--page-bottom": "#F1F1ED",
      "--grid-line": "rgba(17,17,16,0.025)",
      "--grid-opacity": "0.08",
      "--noise-dot": "rgba(17,17,16,0.04)",
      "--noise-opacity": "0.012",
      "--shadow-soft": "0 18px 44px rgba(17,17,16,0.08)",
      "--shadow-card": "0 12px 26px rgba(17,17,16,0.06)",
    },
    buttonShape: "rounded",
    headingStyle: "serif-italic",
    labels: {
      heroEyebrow: "Private medical office",
      heroPrimaryCta: "Записаться на приём",
      heroSecondaryCta: "Связаться",
      heroPanelKicker: "private line",
      heroPanelTitle: "Координируем запись точно и без лишней суеты",
      heroPhoneLabel: "Телефон",
      heroFormatLabel: "Связь",
      heroFormatValue: "WhatsApp / звонок",
      heroStartLabel: "Первичный этап",
      heroStartValue: "С консультации врача",
      heroReviewsLabel: "отзывов",
      heroRatingLabel: "рейтинг",
      heroSpecialistsLabel: "специалистов",
      heroInstagramLabel: "Instagram",
      servicesEyebrow: "Услуги клиники",
      featuredServiceBadge: "Базовый вход",
      servicePriceLabel: "стоимость",
      serviceMoreLabel: "детали",
      bracesBadge: "Ортодонтические решения",
      bracesTitle: "Брекет-системы собраны в одном блоке",
      bracesDescription:
        "Все варианты брекетов сведены в единый раскрывающийся блок, чтобы сохранить строгую иерархию страницы.",
      doctorsEyebrow: "Специалисты",
      doctorPrefix: null,
      reviewsEyebrow: "Пациенты о нас",
      contactEyebrow: "Контакты",
      contactTitle: "Прямой контакт с клиникой",
      contactPrimaryCta: "Написать в WhatsApp",
      contactSecondaryCta: "Позвонить",
    },
  },
} satisfies Record<ClinicVariant, ClinicVariantDefinition>;

export function resolveClinicVariant(value: unknown): ClinicVariant {
  if (typeof value === "string" && value in VARIANTS) {
    return value as ClinicVariant;
  }

  return DEFAULT_CLINIC_VARIANT;
}
