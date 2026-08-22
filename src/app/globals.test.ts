import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(resolve(process.cwd(), "src/app/globals.css"), "utf8");

describe("mythic visual system", () => {
  it("contains the book, thread and product layouts without legacy staff/card selectors", () => {
    expect(css).toContain(".mythic-book-prelude");
    expect(css).toContain(".norn-threads");
    expect(css).toContain(".feishu-product-plate");
    expect(css).toContain(".bhms-workspace-plate");
    expect(css).not.toContain(".prelude-staff");
    expect(css).not.toContain(".movement-notation");
    expect(css).not.toContain(".score-movement::before");
  });

  it("keeps the prelude above the page stack and mobile controls touchable", () => {
    expect(css).not.toMatch(
      /\.mythic-book-site\s*,\s*\.case-page\s*\{[^}]*z-index/s,
    );
    expect(css).toContain("min-height: 44px");
  });
});
