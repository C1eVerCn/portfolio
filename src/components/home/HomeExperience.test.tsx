import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Locale, PortfolioContent } from "@/content";
import { enContent } from "@/content/portfolio.en";
import { zhContent } from "@/content/portfolio.zh";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { mythicMotionState } from "@/components/scene/scene-state";
import { PreludeReplayProvider } from "@/features/prelude/PreludeReplayContext";
import { PRELUDE_SESSION_KEY } from "@/features/prelude/prelude-session";
import {
  getPreludeBookAxis,
  getPreludeLayerDepth,
  getVisualPreludeComposition,
  getPreludeStageEntrance,
  resolveVisualPreludeFrame,
  resolvePreludeIntroTargets,
  HOME_SCROLL_REVEAL_TARGETS,
  HOME_TIMELINE_LABELS,
  HomeExperience,
} from "./HomeExperience";

let reducedMotion = false;
let desktopViewport = true;
type MotionChangeListener = (event: { matches: boolean }) => void;
let reducedMotionListeners = new Set<MotionChangeListener>();
let reducedMotionQueries: Array<{
  matches: boolean;
  removeEventListener: ReturnType<typeof vi.fn>;
}> = [];

vi.mock("next/navigation", () => ({ usePathname: () => "/zh" }));

function installMatchMedia() {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: vi.fn((query: string) => {
      const isReducedMotionQuery = query === "(prefers-reduced-motion: reduce)";
      const mediaQuery = {
      matches: isReducedMotionQuery
        ? reducedMotion
        : query.includes("prefers-reduced-motion: no-preference")
          ? !reducedMotion
        : query.includes("min-width")
          ? desktopViewport
          : false,
      media: query,
      onchange: null,
      addListener: vi.fn((listener: MotionChangeListener) => {
        if (isReducedMotionQuery) reducedMotionListeners.add(listener);
      }),
      removeListener: vi.fn((listener: MotionChangeListener) => {
        if (isReducedMotionQuery) reducedMotionListeners.delete(listener);
      }),
      addEventListener: vi.fn((type: string, listener: MotionChangeListener) => {
        if (isReducedMotionQuery && type === "change") {
          reducedMotionListeners.add(listener);
        }
      }),
      removeEventListener: vi.fn((type: string, listener: MotionChangeListener) => {
        if (isReducedMotionQuery && type === "change") {
          reducedMotionListeners.delete(listener);
        }
      }),
      dispatchEvent: vi.fn(() => false),
      };

      if (isReducedMotionQuery) reducedMotionQueries.push(mediaQuery);
      return mediaQuery;
    }),
  });
}

function emitReducedMotion(matches: boolean) {
  act(() => {
    reducedMotion = matches;
    for (const query of reducedMotionQueries) query.matches = matches;
    for (const listener of [...reducedMotionListeners]) listener({ matches });
  });
}

function renderHome(content = zhContent, locale: Locale = "zh") {
  return render(
    <PreludeReplayProvider>
      <SiteHeader content={content} locale={locale} />
      <HomeExperience content={content} locale={locale} />
    </PreludeReplayProvider>,
  );
}

async function waitForNextFrame() {
  await act(async () => {
    await new Promise<void>((resolve) => {
      window.requestAnimationFrame(() => resolve());
    });
  });
}

describe("HomeExperience", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    reducedMotion = false;
    desktopViewport = true;
    reducedMotionListeners = new Set();
    reducedMotionQueries = [];
    installMatchMedia();
  });

  it("accepts deterministic prelude frames only in visual-test mode", () => {
    expect(resolveVisualPreludeFrame("?preludeFrame=cover", true)).toBe("cover");
    expect(resolveVisualPreludeFrame("?preludeFrame=opening", true)).toBe("opening");
    expect(resolveVisualPreludeFrame("?preludeFrame=complete", true)).toBe("complete");
    expect(resolveVisualPreludeFrame("?preludeFrame=opening", false)).toBeNull();
    expect(resolveVisualPreludeFrame("?preludeFrame=arbitrary", true)).toBeNull();
  });

  it("freezes visual-test frames at explicit cover and opening compositions", () => {
    expect(getVisualPreludeComposition("cover", true)).toMatchObject({
      coverRotationY: 0,
      leafOpacity: 0,
      pageTurn: 0,
    });
    expect(getVisualPreludeComposition("opening", true)).toMatchObject({
      coverRotationY: -132,
      leafOpacity: 1,
      leafRotation: 0,
      pageTurn: 0.48,
    });
    expect(getVisualPreludeComposition("opening", false)).toMatchObject({
      coverRotationX: -132,
      pageTurn: 0.48,
    });
  });

  it.each([
    ["zh", zhContent],
    ["en", enContent],
  ] satisfies Array<[Locale, PortfolioContent]>) (
    "keeps profile names out of %s homepage headings",
    (locale, content) => {
      render(
        <PreludeReplayProvider>
          <HomeExperience content={content} locale={locale} />
        </PreludeReplayProvider>,
      );

      for (const heading of screen.getAllByRole("heading")) {
        expect(heading).not.toHaveTextContent(content.profile.name);
        expect(heading).not.toHaveTextContent(content.profile.englishName);
      }
    },
  );

  it("autoplays once per session and records a skip", async () => {
    const first = renderHome();
    const skip = await screen.findByRole("button", { name: "跳过序章" });

    fireEvent.click(skip);

    expect(window.sessionStorage.getItem(PRELUDE_SESSION_KEY)).toBe("1");
    expect(
      screen.queryByRole("button", { name: "跳过序章" }),
    ).not.toBeInTheDocument();

    first.unmount();
    renderHome();
    await waitForNextFrame();

    expect(
      screen.queryByRole("button", { name: "跳过序章" }),
    ).not.toBeInTheDocument();
  });

  it("replays from the header without clearing the played session marker", async () => {
    renderHome();
    fireEvent.click(await screen.findByRole("button", { name: "跳过序章" }));

    fireEvent.click(screen.getByRole("button", { name: "重播序章" }));
    await waitForNextFrame();

    expect(
      screen.getByRole("button", { name: "跳过序章" }),
    ).toBeInTheDocument();
    expect(window.sessionStorage.getItem(PRELUDE_SESSION_KEY)).toBe("1");
  });

  it("honors replay requested before motion preference resolution", async () => {
    window.sessionStorage.setItem(PRELUDE_SESSION_KEY, "1");
    renderHome();

    fireEvent.click(screen.getByRole("button", { name: "重播序章" }));
    await waitForNextFrame();

    expect(
      screen.getByRole("button", { name: "跳过序章" }),
    ).toBeInTheDocument();
  });

  it("closes replay when reduced motion turns on and cleans up its listener", async () => {
    window.sessionStorage.setItem(PRELUDE_SESSION_KEY, "1");
    const view = renderHome();
    await waitForNextFrame();

    expect(reducedMotionListeners.size).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole("button", { name: "重播序章" }));
    await waitForNextFrame();
    expect(screen.getByRole("button", { name: "跳过序章" })).toBeInTheDocument();

    emitReducedMotion(true);
    expect(screen.queryByRole("button", { name: "跳过序章" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "重播序章" }));
    expect(screen.queryByRole("button", { name: "跳过序章" })).not.toBeInTheDocument();

    emitReducedMotion(false);
    expect(screen.queryByRole("button", { name: "跳过序章" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "重播序章" }));
    await waitForNextFrame();
    expect(screen.getByRole("button", { name: "跳过序章" })).toBeInTheDocument();

    view.unmount();
    expect(
      reducedMotionQueries.some((query) =>
        query.removeEventListener.mock.calls.some(
          ([type]) => type === "change",
        ),
      ),
    ).toBe(true);
  });

  it("keeps the slogan visible and never opens the overlay for reduced motion", async () => {
    reducedMotion = true;

    renderHome();
    await waitForNextFrame();

    expect(
      screen.getByRole("heading", { name: zhContent.hero.slogan }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "跳过序章" }),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "重播序章" }));

    expect(
      screen.queryByRole("button", { name: "跳过序章" }),
    ).not.toBeInTheDocument();
  });

  it("exports the approved movement labels in score order", () => {
    expect(HOME_TIMELINE_LABELS).toEqual([
      "prelude",
      "threads",
      "exposition",
      "hermes",
      "interlude",
      "bhms",
      "recapitulation",
      "coda",
    ]);
  });

  it("reveals an existing movements heading during the interlude", () => {
    const { container } = renderHome();

    expect(HOME_SCROLL_REVEAL_TARGETS.interlude).toBe(".movements-heading");
    expect(
      container.querySelector(HOME_SCROLL_REVEAL_TARGETS.interlude),
    ).toBeInTheDocument();
  });

  it("opens the mythic book from the side on desktop and from the top on mobile", () => {
    expect(getPreludeBookAxis(true)).toEqual({ rotationX: 0, rotationY: -168 });
    expect(getPreludeBookAxis(false)).toEqual({ rotationX: -168, rotationY: 0 });
  });

  it("keeps the cover, leaves, and page stack on distinct 3D planes", () => {
    expect(getPreludeLayerDepth()).toEqual({
      cover: 12,
      leaves: 40,
      pages: -4,
    });
  });

  it("uses opacity-only staging for the intro", () => {
    expect(getPreludeStageEntrance()).toEqual({ opacity: 0 });
  });

  it("sets the completed mythic state for reduced motion on mobile", async () => {
    reducedMotion = true;
    desktopViewport = false;
    Object.assign(mythicMotionState, {
      dynamic: "f",
      movement: "prelude",
      progress: 0,
    });
    Object.assign(mythicMotionState.threads, {
      future: 0,
      past: 0,
      present: 0,
    });
    Object.assign(mythicMotionState.book, {
      depth: 0,
      open: 0,
      pageTurn: 0,
    });

    renderHome();
    await waitForNextFrame();

    expect(mythicMotionState).toMatchObject({
      dynamic: "p",
      movement: "coda",
      progress: 1,
    });
    expect(mythicMotionState.threads).toMatchObject({
      future: 1,
      past: 1,
      present: 1,
    });
    expect(mythicMotionState.book).toMatchObject({
      depth: 1,
      open: 1,
      pageTurn: 1,
    });
  });

  it("resolves every portal book target used by the intro timeline", async () => {
    renderHome();
    await screen.findByRole("button", { name: "跳过序章" });

    const targets = resolvePreludeIntroTargets(document);

    expect(targets.overlay).toBe(document.querySelector(".mythic-book-prelude"));
    expect(targets.stage).toBe(document.querySelector(".mythic-book-stage"));
    expect(targets.cover).toBe(document.querySelector(".book-cover"));
    expect(targets.book).toBe(document.querySelector(".mythic-book"));
    expect(targets.coverThreads).toHaveLength(3);
    expect(targets.leaves).toHaveLength(2);
    expect(targets.leafInscriptions).toHaveLength(2);
    expect(targets.sloganCharacters).toHaveLength(4);
    expect(targets.secondary).toHaveLength(1);
  });
});
