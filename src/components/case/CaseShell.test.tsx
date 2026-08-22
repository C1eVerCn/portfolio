import { fireEvent, render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import BhmsPage, { generateMetadata as generateBhmsMetadata } from "@/app/[locale]/work/bhms/page";
import HermesPage, { generateMetadata as generateHermesMetadata } from "@/app/[locale]/work/hermes/page";
import { mythicMotionState } from "@/components/scene/scene-state";
import { CaseShell } from "./CaseShell";

const props = {
  locale: "zh" as const,
  eyebrow: "Hermes",
  title: "从概率性对话走向确定性行动",
  thesis: "LLM 负责理解。",
  chapters: [{ id: "problem", label: "问题" }],
  heroVisual: <div data-testid="hero-product">product</div>,
};

describe("CaseShell", () => {
  afterEach(() => {
    mythicMotionState.focus = false;
    mythicMotionState.threads.focus = false;
    document.body.classList.remove("fermata-focus");
  });

  it("places a real product visual in the case hero", () => {
    const { container } = render(<CaseShell {...props}><p>内容</p></CaseShell>);
    expect(container.querySelector(".case-hero-visual")).toContainElement(
      screen.getByTestId("hero-product"),
    );
  });

  it("uses a measure index instead of a floating chapter capsule", () => {
    const { container } = render(<CaseShell {...props}><p>内容</p></CaseShell>);
    expect(container.querySelector(".measure-index")).toBeInTheDocument();
    expect(container.querySelector(".chapter-rail")).not.toBeInTheDocument();
  });

  it("toggles the fermata focus state", () => {
    const { container } = render(<CaseShell {...props}><p>内容</p></CaseShell>);
    const focusButton = screen.getByRole("button", { name: "进入 fermata 专注阅读" });
    focusButton.focus();
    fireEvent.click(focusButton);
    expect(container.querySelector(".case-page")).toHaveClass("is-focused");
    expect(container.querySelector(".measure-index")).toHaveAttribute("inert");
    expect(container.querySelector(".measure-index")).toHaveAttribute("aria-hidden", "true");
    expect(document.body).toHaveClass("fermata-focus");
    expect(mythicMotionState.focus).toBe(true);
    expect(mythicMotionState.threads.focus).toBe(true);
    const exitButton = screen.getByRole("button", { name: "退出 fermata 专注阅读" });
    expect(document.activeElement).toBe(exitButton);
    fireEvent.click(exitButton);
    expect(container.querySelector(".case-page")).not.toHaveClass("is-focused");
    expect(container.querySelector(".measure-index")).not.toHaveAttribute("inert");
    expect(document.body).not.toHaveClass("fermata-focus");
    expect(document.activeElement).toBe(focusButton);
    expect(mythicMotionState.focus).toBe(false);
    expect(mythicMotionState.threads.focus).toBe(false);
  });

  it("exits fermata focus with Escape and restores the toggle focus", () => {
    render(<CaseShell {...props}><p>内容</p></CaseShell>);
    const focusButton = screen.getByRole("button", { name: "进入 fermata 专注阅读" });

    fireEvent.click(focusButton);
    expect(document.body).toHaveClass("fermata-focus");

    fireEvent.keyDown(document, { key: "Escape" });
    expect(document.body).not.toHaveClass("fermata-focus");
    expect(document.activeElement).toBe(focusButton);
  });

  it("scopes every case query to its root and reverts dependency updates", () => {
    const source = readFileSync(join(process.cwd(), "src/components/case/CaseShell.tsx"), "utf8");
    expect(source).toContain('gsap.utils.toArray<HTMLElement>(".case-body .case-section", root.current)');
    expect(source).toContain('gsap.utils.toArray<HTMLElement>(".case-body [data-case-reveal]", root.current)');
    expect(source).toContain("revertOnUpdate: true");
  });

  it("clears both focus channels when it unmounts", () => {
    const view = render(<CaseShell {...props}><p>内容</p></CaseShell>);
    fireEvent.click(screen.getByRole("button", { name: "进入 fermata 专注阅读" }));
    view.unmount();
    expect(mythicMotionState.focus).toBe(false);
    expect(mythicMotionState.threads.focus).toBe(false);
  });

  it("orders Hermes around product evidence and explicit limits", async () => {
    const page = await HermesPage({ params: Promise.resolve({ locale: "zh" }) });
    const { container } = render(page);
    expect([...container.querySelectorAll(".case-section")].map((node) => node.id)).toEqual([
      "product", "execution", "system", "decisions", "verification", "limits",
    ]);
    expect(container.querySelector(".case-hero-visual [data-plate-state='dry_run']")).toBeInTheDocument();
    expect(container.querySelector(".case-hero-visual h2")).toHaveTextContent("Hermes · Feishu Agent");
    expect(container.querySelector("#product h3")).toHaveTextContent("Hermes · Feishu Agent");
  });

  it("orders BHMS around workspace, lifecycle, evidence and limits", async () => {
    const page = await BhmsPage({ params: Promise.resolve({ locale: "zh" }) });
    const { container } = render(page);
    expect([...container.querySelectorAll(".case-section")].map((node) => node.id)).toEqual([
      "product", "data", "lifecycle", "model", "evidence", "experiments", "limits",
    ]);
    expect(container.querySelector(".case-hero-visual .bhms-workspace-plate")).toBeInTheDocument();
    expect([...container.querySelectorAll("[data-model-stage]")].map((node) => node.getAttribute("data-model-stage"))).toEqual([
      "conditioning", "parallel", "fusion", "pooling", "decoder",
    ]);
    expect(container.querySelector("[data-fusion-mode='single-branch-safe']")).toBeInTheDocument();
    expect(container.querySelector(".case-hero-visual h2")).toHaveTextContent("CALCE-CS2-35");
    expect(container.querySelector("#product h3")).toHaveTextContent("CALCE-CS2-35");
    expect(container.textContent).toContain("并行时序视角");
    expect(container.textContent).not.toContain("parallel temporal views");
  });

  it("keeps the English BHMS route free of Chinese claim-boundary copy", async () => {
    const page = await BhmsPage({ params: Promise.resolve({ locale: "en" }) });
    const { container } = render(page);
    expect(container.textContent).toContain("Reconstructed portfolio display data");
    expect(container.textContent).not.toMatch(/当前工程封版|作品集可视化重建数据|周期/);
  });

  it("rejects unsupported locales consistently in metadata", async () => {
    await expect(generateHermesMetadata({ params: Promise.resolve({ locale: "fr" }) })).rejects.toThrow();
    await expect(generateBhmsMetadata({ params: Promise.resolve({ locale: "fr" }) })).rejects.toThrow();
  });
});
