import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { zhContent } from "@/content/portfolio.zh";
import { ThreeThreadsSection } from "./ThreeThreadsSection";

describe("ThreeThreadsSection", () => {
  it("explains the three engineering times in narrative order", () => {
    const { container } = render(<ThreeThreadsSection content={zhContent} />);

    expect(
      screen.getByRole("region", { name: "The Norns · Three engineering times" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "The Norns · Three engineering times",
      }),
    ).toBeInTheDocument();
    expect(
      Array.from(container.querySelectorAll("ol h3"), (heading) => heading.textContent),
    ).toEqual(["过去保存证据", "现在执行决策", "未来表达不确定性"]);
    expect(container.querySelectorAll("[data-thread-explanation]")).toHaveLength(3);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(3);
  });
});
