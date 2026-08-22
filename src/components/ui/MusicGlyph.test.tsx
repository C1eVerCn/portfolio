import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MUSIC_GLYPHS, MusicGlyph } from "./MusicGlyph";

describe("MusicGlyph", () => {
  it("maps semantic names to SMuFL code points", () => {
    expect(MUSIC_GLYPHS).toEqual({
      fermata: "\uE4C0",
      breath: "\uE4CE",
      caesura: "\uE4D1",
      repeat: "\uE041",
      coda: "\uE048",
      piano: "\uE520",
      mezzoForte: "\uE52D",
      forte: "\uE522",
    });
  });

  it("is decorative by default and can expose an accessible label", () => {
    const { rerender } = render(<MusicGlyph name="fermata" />);
    expect(screen.getByText("\uE4C0")).toHaveAttribute("aria-hidden", "true");

    rerender(<MusicGlyph name="fermata" label="关键停留" />);
    expect(screen.getByLabelText("关键停留")).toBeInTheDocument();
  });
});
