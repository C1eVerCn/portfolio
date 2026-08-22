import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NornThreads } from "./NornThreads";

describe("NornThreads", () => {
  it("renders the three semantic Norn threads as a decorative SVG", () => {
    const { container } = render(<NornThreads decorative />);
    const svg = container.querySelector("svg");
    const threads = Array.from(
      container.querySelectorAll<SVGPathElement>("[data-norn-thread]"),
    );

    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).not.toHaveAttribute("aria-label");
    expect(threads).toHaveLength(3);
    expect(threads.map((thread) => thread.dataset.nornThread)).toEqual([
      "past",
      "present",
      "future",
    ]);
  });

  it("exposes the threads as an accessible image by default", () => {
    render(<NornThreads className="  cover-norn-threads  " />);

    expect(
      screen.getByRole("img", {
        name: "Past, present and future engineering threads",
      }),
    ).toHaveClass("norn-threads", "cover-norn-threads");
  });

  it("preserves the Norn thread geometry and normalized path lengths", () => {
    const { container } = render(<NornThreads decorative />);
    const threads = Array.from(
      container.querySelectorAll<SVGPathElement>("[data-norn-thread]"),
    );

    expect(threads.map((thread) => thread.getAttribute("d"))).toEqual([
      "M-40 508 C210 466 380 526 598 438 C780 364 952 402 1240 328",
      "M-40 378 C226 382 384 324 600 360 C816 396 954 302 1240 290",
      "M-40 248 C210 312 392 214 604 276 C822 340 1004 208 1240 188",
    ]);
    expect(threads.every((thread) => thread.getAttribute("pathLength") === "1"))
      .toBe(true);
  });
});
