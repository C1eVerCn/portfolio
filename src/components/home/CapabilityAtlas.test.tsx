import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { zhContent } from "@/content/portfolio.zh";
import { CapabilityAtlas } from "./CapabilityAtlas";

describe("CapabilityAtlas", () => {
  it("presents all capability layers without project links", () => {
    const { container } = render(<CapabilityAtlas content={zhContent} />);

    expect(screen.getAllByRole("listitem")).toHaveLength(6);
    expect(screen.queryAllByRole("link")).toHaveLength(0);
    expect(screen.getByText("Agent 与 MCP")).toBeInTheDocument();
    expect(container.querySelectorAll("[data-voice]")).toHaveLength(6);
    expect(container.querySelector(".atlas-grid")).not.toBeInTheDocument();
  });
});
