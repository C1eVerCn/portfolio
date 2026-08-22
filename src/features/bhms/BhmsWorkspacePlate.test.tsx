import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BhmsWorkspacePlate } from "./BhmsWorkspacePlate";

describe("BhmsWorkspacePlate", () => {
  it("presents the selected CALCE battery in the Chinese workspace", () => {
    const { container } = render(
      <BhmsWorkspacePlate locale="zh" selectedBattery="CALCE-CS2-35" />,
    );

    expect(screen.getByText("电池工作台")).toBeInTheDocument();
    const batteryList = screen.getByRole("list", { name: "电池列表" });
    const batteryItems = within(batteryList).getAllByRole("listitem");
    expect(batteryItems).toHaveLength(3);
    expect(within(batteryList).getByText("CALCE-CS2-35")).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(within(batteryList).getByText("CALCE-CS2-35")).toHaveAttribute(
      "data-selected",
      "true",
    );
    expect(
      batteryItems
        .filter((item) => item.textContent !== "CALCE-CS2-35")
        .every(
          (item) =>
            item.getAttribute("aria-current") === "false" &&
            item.dataset.selected === "false",
        ),
    ).toBe(true);
    expect(within(batteryList).queryByRole("button")).not.toBeInTheDocument();

    expect(container.querySelector("main")).not.toBeInTheDocument();
    expect(container.querySelector("nav")).not.toBeInTheDocument();
    expect(
      screen.getByRole("list", { name: "工作台视图" }),
    ).toBeInTheDocument();
    expect(screen.getByText("容量退化趋势")).toBeInTheDocument();
    expect(screen.getByText("生命周期预测")).toBeInTheDocument();
    expect(screen.getByText("GraphRAG 机理解释")).toBeInTheDocument();
    expect(screen.getByText("CALCE · 684 次循环")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: "CALCE-CS2-35" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 4, name: "容量退化趋势" }),
    ).toBeInTheDocument();
  });

  it("supports a level-two battery heading for case heroes", () => {
    render(<BhmsWorkspacePlate locale="en" selectedBattery="NASA-B0005" headingLevel={2} />);
    expect(screen.getByRole("heading", { level: 2, name: "NASA-B0005" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Capacity degradation trend" })).toBeInTheDocument();
  });

  it("keeps ids unique and every labelled reference valid across instances", () => {
    const { container } = render(
      <>
        <BhmsWorkspacePlate locale="zh" selectedBattery="CALCE-CS2-35" />
        <BhmsWorkspacePlate locale="en" selectedBattery="NASA-B0005" />
      </>,
    );

    const ids = Array.from(container.querySelectorAll("[id]"), (element) =>
      element.getAttribute("id"),
    ).filter((id): id is string => id !== null);

    expect(new Set(ids).size).toBe(ids.length);

    for (const labelledElement of container.querySelectorAll(
      "[aria-labelledby]",
    )) {
      const references =
        labelledElement.getAttribute("aria-labelledby")?.split(/\s+/) ?? [];

      expect(references.length).toBeGreaterThan(0);
      for (const reference of references) {
        expect(
          container.querySelector(`[id="${reference}"]`),
        ).toBeInTheDocument();
      }
    }
  });
});
