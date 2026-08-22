import Link from "next/link";
import type { Locale, PortfolioContent } from "@/content";
import { MusicGlyph } from "@/components/ui/MusicGlyph";
import { BhmsEvidenceGraph } from "@/features/bhms/BhmsEvidenceGraph";
import { BhmsWorkspacePlate } from "@/features/bhms/BhmsWorkspacePlate";
import { HermesProductPlate } from "@/features/hermes/HermesProductPlate";
import { HermesSystemCutaway } from "@/features/hermes/HermesSystemCutaway";

function ProjectMovementHeading({
  project,
  movement,
}: {
  project: PortfolioContent["projects"][number];
  movement: "I" | "II";
}) {
  return (
    <header className="project-movement-heading" data-reveal>
      <div className="movement-folio">
        <span>Movement {movement}</span>
        <span>{project.eyebrow}</span>
      </div>
      <div className="movement-copy">
        <p>{project.thesis}</p>
        <h3>{project.title}</h3>
        <p className="movement-summary">{project.summary}</p>
      </div>
    </header>
  );
}

export function SelectedWork({ content, locale }: { content: PortfolioContent; locale: Locale }) {
  const hermes = content.projects.find((project) => project.slug === "hermes");
  const bhms = content.projects.find((project) => project.slug === "bhms");

  if (!hermes || !bhms) return null;

  return (
    <section className="project-movements score-section section-shell" id="work" data-chapter="movements">
      <header className="score-section-heading movements-heading" data-reveal>
        <div className="movement-mark"><MusicGlyph name="caesura" /><span>III–IV</span></div>
        <div>
          <p className="section-kicker">Movements · {content.workIntro.label}</p>
          <h2>{content.workIntro.title}</h2>
        </div>
        <p>{content.workIntro.body}</p>
      </header>

      <article className="home-project-movement hermes-home-movement" data-movement="hermes">
        <ProjectMovementHeading project={hermes} movement="I" />
        <div className="home-project-stage" data-reveal>
          <HermesProductPlate locale={locale} state="dry_run" headingLevel={4} />
          <HermesSystemCutaway locale={locale} compact headingLevel={4} />
        </div>
        <Link
          href={`/${locale}/work/hermes`}
          className="home-project-link"
          aria-label={`${content.workIntro.openCase}: ${hermes.title}`}
        >
          {content.workIntro.openCase}
        </Link>
      </article>

      <article className="home-project-movement bhms-home-movement" data-movement="bhms">
        <ProjectMovementHeading project={bhms} movement="II" />
        <div className="home-project-stage" data-reveal>
          <BhmsWorkspacePlate
            locale={locale}
            selectedBattery="CALCE-CS2-35"
            headingLevel={4}
          />
          <BhmsEvidenceGraph locale={locale} compact />
        </div>
        <Link
          href={`/${locale}/work/bhms`}
          className="home-project-link"
          aria-label={`${content.workIntro.openCase}: ${bhms.title}`}
        >
          {content.workIntro.openCase}
        </Link>
      </article>
    </section>
  );
}
