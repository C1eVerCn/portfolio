import type { PortfolioContent } from "@/content";
import { NornThreads } from "@/features/prelude/NornThreads";

export function SloganPrelude({ content }: { content: PortfolioContent }) {
  return (
    <section className="prelude section-shell" data-chapter="prelude">
      <div className="prelude-folio" data-reveal>
        <span>Portfolio for software engineering</span>
        <span>2026 · Opus I</span>
      </div>

      <div className="prelude-slogan">
        <p className="prelude-role" data-reveal>{content.profile.role}</p>
        <h1 data-reveal aria-label={content.hero.slogan}>
          {content.hero.slogan.split("").map((character, index) => (
            <span className="slogan-character" key={`${character}-${index}`}>
              {character}
            </span>
          ))}
        </h1>
        <p className="prelude-secondary" data-reveal>{content.hero.sloganEn}</p>
      </div>

      <p className="prelude-statement" data-reveal>{content.hero.statement}</p>
      <div className="prelude-byline" data-reveal>
        <span>{content.profile.name} / {content.profile.englishName}</span>
        <span>{content.profile.role}</span>
      </div>
      <NornThreads decorative className="prelude-threads" />
    </section>
  );
}
