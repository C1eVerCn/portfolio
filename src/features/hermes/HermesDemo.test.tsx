import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HermesDemo } from "./HermesDemo";

describe("HermesDemo", () => {
  it("walks through guarded booking before committing", () => {
    const { container } = render(<HermesDemo locale="zh" />);

    expect(container.querySelector(".execution-score")).toBeInTheDocument();
    expect(container.querySelectorAll(".score-measure")).toHaveLength(6);
    expect(container.querySelector(".demo-shell")).not.toBeInTheDocument();
    expect(container.querySelector(".feishu-product-plate")).toHaveAttribute(
      "data-plate-state",
      "intent",
    );
    expect(
      Array.from(container.querySelectorAll(".feishu-product-plate .booking-draft dd"))
        .map((value) => value.textContent),
    ).toEqual(["—", "—", "—", "0"]);

    fireEvent.click(screen.getByRole("button", { name: "选择 MaaS 平台" }));
    expect(screen.getByText(/缺少时间范围/)).toBeInTheDocument();
    expect(container.querySelector(".product-conversation")).not.toHaveTextContent("09:00–11:00");
    fireEvent.click(screen.getByRole("button", { name: "补充时间范围" }));
    expect(container.querySelector(".product-conversation")).toHaveTextContent("09:00–11:00");
    fireEvent.click(screen.getByRole("button", { name: "选择脱敏车辆 E-17" }));
    fireEvent.click(screen.getByRole("button", { name: "填写任务与地点" }));
    fireEvent.click(screen.getByRole("button", { name: "执行 dry-run" }));
    expect(screen.getByText(/等待紧邻确认/)).toBeInTheDocument();
    expect(container.querySelector(".feishu-product-plate")).toHaveAttribute(
      "data-plate-state",
      "confirmation",
    );
    expect(screen.getByText("确认窗口开启")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "确认预订" }));
    expect(screen.getByText(/确定性 commit/)).toBeInTheDocument();
    expect(container.querySelector(".feishu-product-plate")).toHaveAttribute(
      "data-plate-state",
      "committed",
    );
    expect(screen.getByText("External Effect: COMMITTED")).toBeInTheDocument();
    expect(
      Array.from(container.querySelectorAll(".feishu-product-plate .booking-draft dd"))
        .at(-1),
    ).toHaveTextContent("4");
  });

  it("localises guard output in English", () => {
    render(<HermesDemo locale="en" />);
    fireEvent.click(screen.getByRole("button", { name: "Select MaaS platform" }));
    expect(screen.getByText(/Missing time range/)).toBeInTheDocument();
    expect(screen.queryByText(/缺少时间范围/)).not.toBeInTheDocument();
  });
});
