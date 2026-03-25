import * as DarkTech from "./templates/dark-tech";
import * as WarmClinic from "./templates/warm-clinic";

export type ClinicVariant = "dark-tech" | "warm-clinic";

const TEMPLATES = {
  "dark-tech": DarkTech,
  "warm-clinic": WarmClinic,
} as const;

export function getTemplate(variant?: string | null) {
  return TEMPLATES[variant as ClinicVariant] ?? TEMPLATES["dark-tech"];
}
