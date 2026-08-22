import { enContent } from "./portfolio.en";
import { zhContent } from "./portfolio.zh";
import type { Locale } from "./types";

export const portfolioContent = { zh: zhContent, en: enContent } as const;

export function getPortfolioContent(locale: Locale) {
  return portfolioContent[locale];
}

export * from "./types";
