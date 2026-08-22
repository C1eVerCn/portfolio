import type { PortfolioContent } from "@/content";
import { MusicGlyph } from "@/components/ui/MusicGlyph";

export function SiteFooter({ content }: { content: PortfolioContent }) {
  return (
    <footer className="score-footer">
      <MusicGlyph name="coda" />
      <p>{content.footer}</p>
      <p>© 2026 · {content.profile.englishName}</p>
    </footer>
  );
}
