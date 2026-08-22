import type { PortfolioContent } from "@/content";
import { NornThreads } from "@/features/prelude/NornThreads";

export function SloganPrelude({ content }: { content: PortfolioContent }) {
  return (
    <section className="prelude section-shell" data-chapter="prelude">
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
      <a className="prelude-scroll-cue" href="#work" data-reveal>
        <span>{content.hero.explore}</span>
        <i aria-hidden="true">↓</i>
      </a>
      <NornThreads decorative className="prelude-threads" />
    </section>
  );
}
