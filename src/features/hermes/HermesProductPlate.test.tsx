import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HermesProductPlate } from "./HermesProductPlate";

describe("HermesProductPlate", () => {
  it("shows the guarded dry-run product state from the shared scenario", () => {
    const { container } = render(
      <HermesProductPlate locale="zh" state="dry_run" />,
    );

    expect(container.querySelector(".feishu-product-plate")).toHaveAttribute(
      "data-plate-state",
      "dry_run",
    );
    expect(screen.getByText(/帮我预约 8 月 4 日 09:00–11:00 的园区演示车辆/)).toBeInTheDocument();
    expect(screen.getByText("E-17")).toBeInTheDocument();
    expect(screen.getByText("dry-run 通过")).toBeInTheDocument();
    expect(screen.getByText("等待确认")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: "Hermes · Feishu Agent" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 4, name: "dry-run 通过" }),
    ).toBeInTheDocument();
  });

  it("uses a supplied draft and revision instead of inferred display values", () => {
    const { container } = render(
      <HermesProductPlate locale="zh" state="intent" draft={{}} revision={0} />,
    );
    const values = Array.from(container.querySelectorAll(".booking-draft dd"));

    expect(values.map((value) => value.textContent)).toEqual(["—", "—", "—", "0"]);
  });

  it("uses an intentionally incomplete request until the time gate passes", () => {
    const { container, rerender } = render(
      <HermesProductPlate locale="zh" state="time_gate" />,
    );
    const conversation = container.querySelector(".product-conversation");

    expect(conversation).not.toBeNull();
    expect(within(conversation as HTMLElement).getByText(/帮我预约园区演示车辆/)).toBeInTheDocument();
    expect(within(conversation as HTMLElement).queryByText(/09:00–11:00/)).not.toBeInTheDocument();

    rerender(<HermesProductPlate locale="zh" state="vehicle" />);
    expect(within(conversation as HTMLElement).getByText(/09:00–11:00/)).toBeInTheDocument();
  });

  it("supports a level-two product heading for case heroes", () => {
    render(<HermesProductPlate locale="en" state="dry_run" headingLevel={2} />);
    expect(screen.getByRole("heading", { level: 2, name: "Hermes · Feishu Agent" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Dry run passed" })).toBeInTheDocument();
  });
});
