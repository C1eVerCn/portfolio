import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { zhContent } from "@/content/portfolio.zh";
import {
  PreludeReplayProvider,
  usePreludeReplay,
} from "@/features/prelude/PreludeReplayContext";
import { SiteHeader } from "./SiteHeader";

let pathname = "/zh";

vi.mock("next/navigation", () => ({ usePathname: () => pathname }));

function ReplayToken() {
  const { replayToken } = usePreludeReplay();
  return <output aria-label="header replay token">{replayToken}</output>;
}

function renderHeader() {
  return render(
    <PreludeReplayProvider>
      <SiteHeader locale="zh" content={zhContent} />
      <ReplayToken />
    </PreludeReplayProvider>,
  );
}

describe("SiteHeader", () => {
  beforeEach(() => {
    pathname = "/zh";
    vi.clearAllMocks();
  });

  it("uses a real profile byline without making the name a page heading", () => {
    const { container } = renderHeader();
    const brandName = `${zhContent.profile.englishName.toUpperCase()} / ${zhContent.profile.role.toUpperCase()}`;
    const brand = screen.getByRole("link", {
      name: /CHEN YIHANG.*AI 全栈工程师/,
    });

    expect(container.querySelector(".score-header")).toBeInTheDocument();
    expect(container.querySelector(".contact-pill")).not.toBeInTheDocument();
    expect(brand).toHaveTextContent(brandName);
    expect(screen.queryByRole("heading", { level: 1, name: /谌一航/ })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "EN" })).toHaveAttribute("href", "/en");
    expect(screen.getByRole("link", { name: "联系" })).toHaveAttribute("href", `mailto:${zhContent.profile.email}`);
  });

  it("offers replay on the locale home page and increments the shared token", () => {
    renderHeader();

    const replay = screen.getByRole("button", {
      name: zhContent.hero.replayPrelude,
    });
    expect(replay).toHaveAttribute("data-replay-prelude");
    expect(screen.getByLabelText("header replay token")).toHaveTextContent("0");

    fireEvent.click(replay);

    expect(screen.getByLabelText("header replay token")).toHaveTextContent("1");
  });

  it("hides replay on case pages", () => {
    pathname = "/zh/work/hermes";

    renderHeader();

    expect(
      screen.queryByRole("button", { name: zhContent.hero.replayPrelude }),
    ).not.toBeInTheDocument();
  });
});
