import { notFound } from "next/navigation";
import type { Locale } from "@/content";
import { getPortfolioContent } from "@/content";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PreludeReplayProvider } from "@/features/prelude/PreludeReplayContext";

const locales: Locale[] = ["zh", "en"];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale: value } = await params;
  if (!locales.includes(value as Locale)) notFound();
  const locale = value as Locale;
  const content = getPortfolioContent(locale);
  return (
    <PreludeReplayProvider>
      <a className="skip-link" href="#main-content">{locale === "zh" ? "跳到正文" : "Skip to content"}</a>
      <SiteHeader locale={locale} content={content} />
      <div id="main-content">{children}</div>
      <SiteFooter content={content} />
    </PreludeReplayProvider>
  );
}
