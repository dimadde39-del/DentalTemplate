import { Nunito, Playfair_Display } from "next/font/google";

export const warmClinicHeadingFont = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  style: ["normal", "italic"],
  weight: ["600", "700"],
  display: "swap",
});

export const warmClinicBodyFont = Nunito({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});
