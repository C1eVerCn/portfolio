import { notFound } from "next/navigation";
import type { Locale } from "@/content";
import { getPortfolioContent } from "@/content";
import { HomeExperience } from "@/components/home/HomeExperience";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: value } = await params;
  if (value !== "zh" && value !== "en") notFound();
  const locale = value as Locale;
  return <HomeExperience locale={locale} content={getPortfolioContent(locale)} />;
}
