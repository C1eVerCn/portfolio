import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MythicPaperFallback } from "./MythicPaperFallback";

describe("MythicPaperFallback", () => {
  it("renders paper, a world-tree relief and exactly three threads without staff lines", () => {
    const { container } = render(<MythicPaperFallback />);

    expect(container.querySelector(".mythic-paper-fallback")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect(container.querySelector(".fallback-world-tree")).toBeInTheDocument();
    expect(container.querySelectorAll("[data-norn-thread]")).toHaveLength(3);
    expect(container.querySelector(".fallback-staff")).not.toBeInTheDocument();
  });
});
