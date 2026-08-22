import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { zhContent } from "@/content/portfolio.zh";
import { SloganPrelude } from "./SloganPrelude";

describe("SloganPrelude", () => {
  it("leads with the bilingual slogan and keeps the profile in the byline", () => {
    const { container } = render(<SloganPrelude content={zhContent} />);

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1, name: "智绘万物" })).toBeInTheDocument();

    const heading = container.querySelector(".prelude h1");
    expect(heading).toHaveTextContent("智绘万物");
    expect(heading).not.toHaveTextContent("谌一航");
    expect(container.querySelector(".prelude-byline")).toHaveTextContent("谌一航");
    expect(container.querySelector(".score-staff")).not.toBeInTheDocument();
  });
});
