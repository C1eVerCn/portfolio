import type { HTMLAttributes } from "react";

export type MusicGlyphName =
  | "fermata"
  | "breath"
  | "caesura"
  | "repeat"
  | "coda"
  | "piano"
  | "mezzoForte"
  | "forte";

export const MUSIC_GLYPHS: Record<MusicGlyphName, string> = {
  fermata: "\uE4C0",
  breath: "\uE4CE",
  caesura: "\uE4D1",
  repeat: "\uE041",
  coda: "\uE048",
  piano: "\uE520",
  mezzoForte: "\uE52D",
  forte: "\uE522",
};

interface MusicGlyphProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  name: MusicGlyphName;
  label?: string;
}

export function MusicGlyph({ name, label, className = "", ...props }: MusicGlyphProps) {
  return (
    <span
      {...props}
      className={`music-glyph ${className}`.trim()}
      aria-hidden={label ? undefined : true}
      aria-label={label}
    >
      {MUSIC_GLYPHS[name]}
    </span>
  );
}
