import type { PortfolioContent } from "@/content";
import { MusicGlyph } from "@/components/ui/MusicGlyph";

export function CapabilityAtlas({ content }: { content: PortfolioContent }) {
  return (
    <section className="exposition score-section section-shell" id="capabilities" data-chapter="exposition">
      <header className="score-section-heading" data-reveal>
        <div className="movement-mark">
          <MusicGlyph name="breath" />
          <span>II</span>
        </div>
        <div>
          <p className="section-kicker">Exposition · {content.capabilityIntro.label}</p>
          <h2>{content.capabilityIntro.title}</h2>
        </div>
        <p>{content.capabilityIntro.body}</p>
      </header>
      <ol className="score-voices">
        {content.capabilities.map((group, index) => (
          <li key={group.id} data-voice={group.id} data-reveal>
            <span className="voice-number">{String(index + 1).padStart(2, "0")}</span>
            <div className="voice-rule" aria-hidden="true"><i /></div>
            <h3>{group.label}</h3>
            <p>{group.items.join(" · ")}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
