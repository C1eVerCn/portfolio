"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import type { Locale, PortfolioContent } from "@/content";
import { MusicGlyph } from "@/components/ui/MusicGlyph";
import { usePreludeReplay } from "@/features/prelude/PreludeReplayContext";

export function SiteHeader({ locale, content }: { locale: Locale; content: PortfolioContent }) {
  const pathname = usePathname();
  const { replayPrelude } = usePreludeReplay();
  const otherLocale: Locale = locale === "zh" ? "en" : "zh";
  const languageHref = pathname.replace(/^\/(zh|en)/, `/${otherLocale}`);
  const isHome = pathname === `/${locale}`;

  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
  }, [locale]);

  return (
    <header className="score-header">
      <Link className="score-brand" href={`/${locale}`}>
        <span>
          <b>{content.profile.englishName.toUpperCase()}</b>
          <i> / {content.profile.role.toUpperCase()}</i>
        </span>
      </Link>
      <nav aria-label={locale === "zh" ? "主导航" : "Primary navigation"}>
        <a href={`/${locale}#work`}>{content.nav.work}</a>
        <a href={`/${locale}#principles`}>{content.nav.principles}</a>
        <a href={`/${locale}#about`}>{content.nav.about}</a>
      </nav>
      <div className="score-header-actions">
        {isHome ? (
          <button
            type="button"
            data-replay-prelude
            onClick={replayPrelude}
          >
            {content.hero.replayPrelude}
          </button>
        ) : null}
        <Link className="language-switch" href={languageHref}>{otherLocale.toUpperCase()}</Link>
        <a className="score-contact" href={`mailto:${content.profile.email}`}>
          {content.nav.contact}<MusicGlyph name="coda" />
        </a>
      </div>
    </header>
  );
}
