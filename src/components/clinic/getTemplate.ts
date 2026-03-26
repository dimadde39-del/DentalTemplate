import * as DarkTech from "./templates/dark-tech";
import * as PremiumMed from "./templates/premium-med";
import * as WarmClinic from "./templates/warm-clinic";

export type ClinicVariant = "dark-tech" | "warm-clinic" | "premium-med";

const TEMPLATES = {
  "dark-tech": DarkTech,
  "warm-clinic": WarmClinic,
  "premium-med": PremiumMed,
} as const;

export function getTemplate(variant?: string | null) {
  return TEMPLATES[variant as ClinicVariant] ?? TEMPLATES["dark-tech"];
}
