import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { BhmsLifecyclePlate } from "./BhmsLifecyclePlate";

describe("BhmsLifecyclePlate", () => {
  it("renders the active Hybrid lifecycle forecast with accessible series semantics", () => {
    const { container } = render(
      <BhmsLifecyclePlate locale="zh" activeModel="hybrid" />,
    );

    expect(
      screen.getByRole("img", { name: /生命周期预测/ }),
    ).toBeInTheDocument();
    expect(screen.getByText("Observed")).toBeInTheDocument();
    expect(screen.getByText("BiLSTM")).toBeInTheDocument();
    expect(screen.getByText("Hybrid")).toBeInTheDocument();
    expect(screen.getByText("KNEE · 538")).toBeInTheDocument();
    expect(screen.getByText("EOL · 642")).toBeInTheDocument();

    for (const series of ["observed", "bilstm", "hybrid", "uncertainty"]) {
      expect(
        container.querySelector(`[data-series="${series}"]`),
      ).toBeInTheDocument();
    }

    expect(container.querySelector("desc")?.textContent).toContain(
      "重建展示数据",
    );
  });

  it("keeps every series available in compact mode and reports model changes", () => {
    const onModelChange = vi.fn();
    const { container } = render(
      <BhmsLifecyclePlate
        locale="zh"
        activeModel="hybrid"
        compact
        onModelChange={onModelChange}
      />,
    );

    expect(container.querySelector(".bhms-lifecycle-plate")).toHaveAttribute(
      "data-compact",
      "true",
    );
    expect(screen.getByText("RUL · 162")).toBeInTheDocument();

    for (const series of ["observed", "bilstm", "hybrid", "uncertainty"]) {
      expect(
        container.querySelector(`[data-series="${series}"]`),
      ).toBeInTheDocument();
    }

    expect(container.querySelector('[data-series="bilstm"]')).toHaveAttribute(
      "data-active",
      "false",
    );
    expect(container.querySelector('[data-series="hybrid"]')).toHaveAttribute(
      "data-active",
      "true",
    );

    fireEvent.click(screen.getByRole("button", { name: "BiLSTM" }));
    expect(onModelChange).toHaveBeenCalledOnce();
    expect(onModelChange).toHaveBeenCalledWith("bilstm");
    expect(container.querySelector('[data-series="hybrid"]')).toBeInTheDocument();
  });

  it("localises the display-data boundary for English readers", () => {
    render(<BhmsLifecyclePlate locale="en" activeModel="hybrid" />);
    expect(screen.getByText("Reconstructed portfolio display data; not a measured performance claim.")).toBeInTheDocument();
    expect(screen.queryByText(/作品集可视化重建数据/)).not.toBeInTheDocument();
  });
});
