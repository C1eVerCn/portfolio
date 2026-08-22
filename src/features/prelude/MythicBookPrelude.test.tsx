import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MythicBookPrelude } from "./MythicBookPrelude";

describe("MythicBookPrelude", () => {
  it("renders the Chinese mythic book cover and three Norn threads while active", () => {
    render(
      <MythicBookPrelude
        active
        locale="zh"
        onSkip={vi.fn()}
      />,
    );

    expect(
      screen.getByText("INTELLIGENCE SHAPES EVERYTHING"),
    ).toBeInTheDocument();
    expect(document.querySelector(".mythic-book")).toBeInTheDocument();
    expect(document.querySelector(".cover-world-tree")).toBeInTheDocument();
    expect(document.querySelector(".book-leaf-left")).toHaveTextContent(
      "URÐR · VERÐANDI · SKULD",
    );
    expect(document.querySelector(".book-leaf-right")).toHaveTextContent(
      "智绘万物",
    );
    expect(document.querySelector(".book-leaf-right")).toHaveTextContent(
      "Intelligence Shapes Everything",
    );
    expect(document.querySelectorAll("[data-norn-thread]")).toHaveLength(3);
    expect(document.querySelector(".mythic-book-stage")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect(screen.getByRole("dialog", { name: "智绘万物" })).toHaveAttribute(
      "aria-modal",
      "true",
    );
  });

  it("calls onSkip exactly once when the Chinese skip button is clicked", () => {
    const onSkip = vi.fn();
    render(
      <MythicBookPrelude
        active
        locale="zh"
        onSkip={onSkip}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "跳过序章" }));

    expect(onSkip).toHaveBeenCalledTimes(1);
  });

  it("exposes an English skip button that calls onSkip", () => {
    const onSkip = vi.fn();
    render(
      <MythicBookPrelude
        active
        locale="en"
        onSkip={onSkip}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Skip Prelude" }));

    expect(onSkip).toHaveBeenCalledTimes(1);
  });

  it("does not render the prelude while inactive", () => {
    const { container } = render(
      <MythicBookPrelude
        active={false}
        locale="en"
        onSkip={vi.fn()}
      />,
    );

    expect(container.querySelector(".mythic-book-prelude")).not.toBeInTheDocument();
  });

  it("isolates the page, focuses skip, and restores focus and attributes", async () => {
    const shell = (active: boolean) => (
      <>
        <a className="skip-link" href="#content">Skip to content</a>
        <header className="score-header" aria-hidden="false">
          <button type="button">Replay</button>
        </header>
        <main className="mythic-book-site">
          <MythicBookPrelude active={active} locale="en" onSkip={vi.fn()} />
        </main>
        <footer className="score-footer">Footer</footer>
      </>
    );
    const view = render(shell(false));
    const replay = screen.getByRole("button", { name: "Replay" });
    replay.focus();

    view.rerender(shell(true));

    const skip = await screen.findByRole("button", { name: "Skip Prelude" });
    await waitFor(() => expect(skip).toHaveFocus());
    for (const selector of [".skip-link", ".score-header", ".mythic-book-site", ".score-footer"]) {
      const element = document.querySelector(selector);
      expect(element).toHaveAttribute("inert");
      expect(element).toHaveAttribute("aria-hidden", "true");
    }

    view.rerender(shell(false));

    await waitFor(() => expect(replay).toHaveFocus());
    expect(document.querySelector(".score-header")).toHaveAttribute("aria-hidden", "false");
    expect(document.querySelector(".score-header")).not.toHaveAttribute("inert");
    expect(document.querySelector(".skip-link")).not.toHaveAttribute("aria-hidden");
    expect(document.querySelector(".skip-link")).not.toHaveAttribute("inert");
    expect(document.querySelector(".mythic-book-site")).not.toHaveAttribute("aria-hidden");
    expect(document.querySelector(".score-footer")).not.toHaveAttribute("aria-hidden");
  });
});
