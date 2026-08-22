import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BhmsDemo } from "./BhmsDemo";

describe("BhmsDemo", () => {
  it("combines the workspace, lifecycle forecasts, and staged evidence decision", () => {
    const { container } = render(<BhmsDemo locale="zh" />);

    const demo = container.querySelector(".bhms-immersive-demo.bhms-demo");
    expect(demo).toHaveAttribute("data-case-reveal");
    expect(
      Array.from(demo?.children ?? []).map((child) => child.className),
    ).toEqual([
      "bhms-workspace-plate",
      "bhms-lifecycle-plate",
      "bhms-evidence-graph",
    ]);
    expect(screen.getByText("电池工作台")).toBeInTheDocument();
    expect(
      screen.getAllByRole("img", { name: /生命周期预测/ }),
    ).toHaveLength(2);

    const fullLifecyclePlate = demo?.children[1];
    expect(fullLifecyclePlate).toHaveClass("bhms-lifecycle-plate");
    fireEvent.click(screen.getByRole("button", { name: "BiLSTM" }));
    expect(
      fullLifecyclePlate?.querySelector('[data-series="bilstm"]'),
    ).toHaveAttribute("data-active", "true");
    expect(
      fullLifecyclePlate?.querySelector('[data-series="hybrid"]'),
    ).toHaveAttribute("data-active", "false");

    expect(screen.queryByText("优先安排检测")).not.toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: /分析电压偏差/ }),
    ).toHaveLength(1);
    fireEvent.click(screen.getByRole("button", { name: /分析电压偏差/ }));
    expect(screen.getByText("证据链已生成")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "查看决策依据" }));
    expect(screen.getByText("优先安排检测")).toBeInTheDocument();
  });
});
