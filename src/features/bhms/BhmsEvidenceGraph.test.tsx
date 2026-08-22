import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BhmsEvidenceGraph } from "./BhmsEvidenceGraph";

describe("BhmsEvidenceGraph", () => {
  it("builds lifecycle evidence before revealing the inspection decision", () => {
    const { container } = render(<BhmsEvidenceGraph locale="zh" />);
    const nodes = Array.from(
      container.querySelectorAll("[data-evidence-node]"),
    );
    const analysisButton = screen.getByRole("button", { name: /电压偏差/ });

    expect(nodes).toHaveLength(5);
    expect(nodes.filter((node) => node.tagName === "BUTTON")).toHaveLength(1);
    expect(nodes.every((node) => !node.hasAttribute("id"))).toBe(true);
    expect(
      nodes.every(
        (node) => node.getAttribute("data-evidence-active") === "false",
      ),
    ).toBe(true);
    expect(analysisButton).toHaveAttribute("aria-pressed", "false");

    expect(screen.queryByText("优先安排检测")).not.toBeInTheDocument();
    fireEvent.click(analysisButton);

    expect(analysisButton).toHaveAttribute("aria-pressed", "true");
    expect(
      nodes.every(
        (node) => node.getAttribute("data-evidence-active") === "true",
      ),
    ).toBe(true);
    expect(screen.getByText("证据链已生成")).toBeInTheDocument();
    expect(screen.getByText("生命周期证据 · KNEE 538")).toBeInTheDocument();
    expect(screen.queryByText("优先安排检测")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "查看决策依据" }));
    expect(screen.getByText("优先安排检测")).toBeInTheDocument();
  });

  it("preserves every evidence and decision interaction in compact mode", () => {
    const { container } = render(<BhmsEvidenceGraph locale="zh" compact />);

    expect(container.querySelector(".bhms-evidence-graph")).toHaveAttribute(
      "data-compact",
      "true",
    );
    const nodes = Array.from(
      container.querySelectorAll("[data-evidence-node]"),
    );
    expect(nodes).toHaveLength(5);
    expect(nodes.filter((node) => node.tagName === "BUTTON")).toHaveLength(1);
    expect(
      nodes.every(
        (node) => node.getAttribute("data-evidence-active") === "false",
      ),
    ).toBe(true);
    expect(
      container.querySelector(".bhms-evidence-relations"),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /电压偏差/ }));
    expect(
      nodes.every(
        (node) => node.getAttribute("data-evidence-active") === "true",
      ),
    ).toBe(true);
    expect(screen.getByText("证据链已生成")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "查看决策依据" }));
    expect(screen.getByText("优先安排检测")).toBeInTheDocument();
  });
});
