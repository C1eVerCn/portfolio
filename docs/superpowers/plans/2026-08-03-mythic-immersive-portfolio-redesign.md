# Mythic Immersive Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use subagent-driven-development (recommended) or executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current name-led score cover and text-heavy project summaries with a session-aware mythic-book prelude, the bilingual `智绘万物 / Intelligence Shapes Everything` hero, three Norn threads, and evidence-rich interactive Hermes/BHMS product visualisations.

**Architecture:** Keep Next.js, React, GSAP, Three.js/R3F and the existing static routes. Add a pure prelude session module, focused visual components for the book, threads and each project, then let `HomeExperience` and `CaseShell` own the only top-level animation timelines. Product plates remain HTML/SVG for clarity and accessibility; WebGL is limited to book/paper geometry and lighting, with static SVG fallbacks.

**Tech Stack:** Next.js 16, React 19, TypeScript, GSAP 3 with `@gsap/react`, Three.js/R3F, Vitest, Testing Library, Playwright.

---

## Execution notes

- Approved design: `docs/superpowers/specs/2026-08-03-mythic-immersive-portfolio-redesign-design.md`.
- Hermes source of truth: `/Users/chris/IM-Test/hermes-feishu-agent_副本`.
- BHMS source of truth: `/Users/chris/Documents/trae_projects/BHMS`.
- The portfolio workspace currently fails `git rev-parse --show-toplevel`; do not initialise Git, create a remote or deploy without explicit user approval.
- Suggested checkpoint messages are included for provenance, but they are not executable commit steps in the current workspace.
- Use `apply_patch` for all source edits.
- Follow red-green-refactor for every task. Do not update visual snapshots until the final visual design has been inspected.

## File map

### New shared prelude and myth files

- `src/features/prelude/types.ts` — prelude states and public props.
- `src/features/prelude/prelude-session.ts` — session-only playback policy.
- `src/features/prelude/prelude-session.test.ts` — pure session policy tests.
- `src/features/prelude/MythicBookPrelude.tsx` — accessible closed-book/open-book DOM.
- `src/features/prelude/MythicBookPrelude.test.tsx` — cover, skip and completion contract.
- `src/features/prelude/NornThreads.tsx` — the three semantic SVG paths.
- `src/features/prelude/NornThreads.test.tsx` — line identity and accessibility contract.
- `src/components/home/SloganPrelude.tsx` — completed hero after the book becomes the page.
- `src/components/home/ThreeThreadsSection.tsx` — one-time explanation of past/present/future.

### New Hermes visual files

- `src/features/hermes/portfolio-data.ts` — anonymised UI and architecture facts.
- `src/features/hermes/portfolio-data.test.ts` — invariants and sensitive-data guard.
- `src/features/hermes/HermesProductPlate.tsx` — Feishu conversation, draft and confirmation card.
- `src/features/hermes/HermesProductPlate.test.tsx` — visible product evidence.
- `src/features/hermes/HermesSystemCutaway.tsx` — layered architecture with inspectable nodes.
- `src/features/hermes/HermesSystemCutaway.test.tsx` — architecture node contract.

### New BHMS visual files

- `src/features/bhms/portfolio-data.ts` — curated lifecycle, risk and evidence display data.
- `src/features/bhms/portfolio-data.test.ts` — lifecycle and claim-boundary invariants.
- `src/features/bhms/BhmsWorkspacePlate.tsx` — product dashboard/workspace reconstruction.
- `src/features/bhms/BhmsWorkspacePlate.test.tsx` — visible product evidence.
- `src/features/bhms/BhmsLifecyclePlate.tsx` — observed/forecast/uncertainty/knee/EOL/RUL SVG.
- `src/features/bhms/BhmsLifecyclePlate.test.tsx` — chart semantics.
- `src/features/bhms/BhmsEvidenceGraph.tsx` — inspectable GraphRAG evidence graph.
- `src/features/bhms/BhmsEvidenceGraph.test.tsx` — evidence-to-decision contract.

### New scene files

- `src/components/scene/MythicPaperScene.tsx` — paper/book shader without staff-line relief.
- `src/components/scene/MythicPaperFallback.tsx` — static open-page/world-tree SVG.
- `src/components/scene/MythicPaperFallback.test.tsx` — fallback contract.

### Existing files to modify

- `src/content/types.ts`, `portfolio.zh.ts`, `portfolio.en.ts`, `content.test.ts` — bilingual slogan, thread and replay copy.
- `src/components/home/HomeExperience.tsx` — prelude orchestration and one master scroll timeline.
- `src/components/home/CapabilityAtlas.tsx` — retain six non-linking voices, connect them to threads.
- `src/components/home/SelectedWork.tsx` — replace paper project summaries with two visual movements.
- `src/components/layout/SiteHeader.tsx`, `SiteFooter.tsx` — small identity and replay entry.
- `src/components/scene/scene-state.ts`, `SceneCanvas.tsx`, `SceneLayer.tsx` — new mythic motion state and scene.
- `src/components/case/CaseShell.tsx` — shared case transition, Norn focus and master timeline.
- `src/features/hermes/HermesDemo.tsx`, `HermesArchitecture.tsx` — four-column execution evidence and cutaway.
- `src/features/bhms/BhmsDemo.tsx`, `ModelArchitecture.tsx` — workspace/lifecycle/evidence/model visuals.
- `src/app/[locale]/work/hermes/page.tsx`, `src/app/[locale]/work/bhms/page.tsx` — new section order and claims.
- `src/app/globals.css` — full layout, book, thread, product plate and responsive styling.
- `e2e/navigation.spec.ts`, `hermes-demo.spec.ts`, `bhms-demo.spec.ts`, `visual.spec.ts` — session, interaction, fallback and screenshot coverage.

---

### Task 1: Lock the bilingual content contract

**Files:**
- Modify: `src/content/types.ts`
- Modify: `src/content/portfolio.zh.ts`
- Modify: `src/content/portfolio.en.ts`
- Modify: `src/content/content.test.ts`
- Modify: `src/components/home/HomeExperience.tsx`

- [ ] **Step 1: Write the failing bilingual slogan and controls test**

Add these assertions to `src/content/content.test.ts`:

```ts
it("publishes the approved mythic prelude copy in both languages", () => {
  expect(zhContent.hero.slogan).toBe("智绘万物");
  expect(zhContent.hero.sloganEn).toBe("Intelligence Shapes Everything.");
  expect(zhContent.hero.statement).toContain("可解释、可执行、可交付");
  expect(zhContent.hero.skipPrelude).toBe("跳过序章");
  expect(zhContent.hero.replayPrelude).toBe("重播序章");

  expect(enContent.hero.slogan).toBe("Intelligence Shapes Everything.");
  expect(enContent.hero.sloganEn).toBe("智绘万物");
  expect(enContent.hero.statement).toContain("explained, executed and delivered");
  expect(enContent.hero.skipPrelude).toBe("Skip Prelude");
  expect(enContent.hero.replayPrelude).toBe("Replay Prelude");
});

it("defines all three Norn threads in both languages", () => {
  for (const content of [zhContent, enContent]) {
    expect(content.threads).toHaveLength(3);
    expect(content.threads.map((thread) => thread.id)).toEqual(["past", "present", "future"]);
  }
});
```

- [ ] **Step 2: Run the content test and verify red**

Run:

```bash
npm run test:run -- src/content/content.test.ts
```

Expected: FAIL because `slogan`, `sloganEn`, prelude controls and `threads` do not exist.

- [ ] **Step 3: Add the exact content types**

Replace the `hero` member in `PortfolioContent` and add `NornThreadContent`:

```ts
export type NornThreadId = "past" | "present" | "future";

export interface NornThreadContent {
  id: NornThreadId;
  norseName: "Urðr" | "Verðandi" | "Skuld";
  label: string;
  body: string;
}

export interface HeroContent {
  slogan: string;
  sloganEn: string;
  statement: string;
  explore: string;
  skipPrelude: string;
  replayPrelude: string;
}

export interface PortfolioContent {
  profile: ProfileContent;
  nav: { work: string; principles: string; about: string; contact: string };
  hero: HeroContent;
  threads: NornThreadContent[];
  capabilityIntro: { label: string; title: string; body: string };
  capabilities: CapabilityGroup[];
  workIntro: { label: string; title: string; body: string; openCase: string };
  projects: ProjectSummary[];
  principleIntro: { label: string; title: string };
  principles: PrincipleContent[];
  about: { label: string; title: string; body: string; email: string; github: string };
  footer: string;
}
```

- [ ] **Step 4: Populate exact Chinese and English content**

Set the Chinese values to:

```ts
hero: {
  slogan: "智绘万物",
  sloganEn: "Intelligence Shapes Everything.",
  statement: "将不确定的智能，编织成可解释、可执行、可交付的系统。",
  explore: "翻阅作品",
  skipPrelude: "跳过序章",
  replayPrelude: "重播序章",
},
threads: [
  { id: "past", norseName: "Urðr", label: "过去保存证据", body: "数据、日志与上下文让每个结论保留来路。" },
  { id: "present", norseName: "Verðandi", label: "现在执行决策", body: "状态、权限与工具调用共同约束正在发生的动作。" },
  { id: "future", norseName: "Skuld", label: "未来表达不确定性", body: "预测、风险与待确认副作用必须被准确描述。" },
],
```

Set the English values to:

```ts
hero: {
  slogan: "Intelligence Shapes Everything.",
  sloganEn: "智绘万物",
  statement: "Weaving uncertain intelligence into systems that can be explained, executed and delivered.",
  explore: "Enter the work",
  skipPrelude: "Skip Prelude",
  replayPrelude: "Replay Prelude",
},
threads: [
  { id: "past", norseName: "Urðr", label: "The past preserves evidence", body: "Data, logs and context keep every conclusion traceable." },
  { id: "present", norseName: "Verðandi", label: "The present executes decisions", body: "State, permissions and tool calls constrain the action in progress." },
  { id: "future", norseName: "Skuld", label: "The future expresses uncertainty", body: "Forecasts, risks and unconfirmed side effects must remain explicit." },
],
```

- [ ] **Step 5: Run content tests and typecheck**

Before typechecking, make the one mechanical compatibility edit in the existing hero: replace
`content.hero.title` with `content.hero.slogan`. Task 5 will replace that temporary hero DOM in full.
There is no runtime use of `hero.availability` in `HomeExperience`; remove the field from both locale
objects together with the old type.

```bash
npm run test:run -- src/content/content.test.ts && npm run typecheck
```

Expected: content tests PASS and TypeScript reports no errors; `rg "hero\\.(title|availability)" src` returns no matches.

**Checkpoint message:** `feat: define mythic bilingual content contract`

---

### Task 2: Implement the session-only prelude policy

**Files:**
- Create: `src/features/prelude/types.ts`
- Create: `src/features/prelude/prelude-session.ts`
- Create: `src/features/prelude/prelude-session.test.ts`

- [ ] **Step 1: Write the failing pure policy tests**

```ts
import { describe, expect, it } from "vitest";
import { markPreludePlayed, shouldAutoPlayPrelude } from "./prelude-session";

const memoryStorage = () => {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value); },
  };
};

describe("prelude session policy", () => {
  it("plays once per session when motion is allowed", () => {
    const storage = memoryStorage();
    expect(shouldAutoPlayPrelude(storage, false)).toBe(true);
    markPreludePlayed(storage);
    expect(shouldAutoPlayPrelude(storage, false)).toBe(false);
  });

  it("does not autoplay for reduced motion or unavailable storage", () => {
    const storage = memoryStorage();
    expect(shouldAutoPlayPrelude(storage, true)).toBe(false);
    expect(shouldAutoPlayPrelude(null, false)).toBe(false);
  });
});
```

- [ ] **Step 2: Run and verify red**

```bash
npm run test:run -- src/features/prelude/prelude-session.test.ts
```

Expected: FAIL because the module does not exist.

- [ ] **Step 3: Implement types and policy**

`src/features/prelude/types.ts`:

```ts
export type PreludeState =
  | "idle"
  | "summoning"
  | "opening"
  | "inscribing"
  | "entering"
  | "complete"
  | "skipped";

export interface PreludePlayback {
  state: PreludeState;
  shouldPlay: boolean;
  replayToken: number;
}
```

`src/features/prelude/prelude-session.ts`:

```ts
export const PRELUDE_SESSION_KEY = "cy-portfolio:mythic-prelude-played";

export interface SessionStorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export function shouldAutoPlayPrelude(
  storage: SessionStorageLike | null,
  reducedMotion: boolean,
): boolean {
  if (reducedMotion || !storage) return false;
  return storage.getItem(PRELUDE_SESSION_KEY) !== "1";
}

export function markPreludePlayed(storage: SessionStorageLike | null): void {
  storage?.setItem(PRELUDE_SESSION_KEY, "1");
}
```

- [ ] **Step 4: Run and verify green**

```bash
npm run test:run -- src/features/prelude/prelude-session.test.ts && npm run typecheck
```

Expected: 2 tests PASS.

**Checkpoint message:** `feat: add session-aware prelude policy`

---

### Task 3: Build the accessible mythic book DOM

**Files:**
- Create: `src/features/prelude/MythicBookPrelude.tsx`
- Create: `src/features/prelude/MythicBookPrelude.test.tsx`

- [ ] **Step 1: Write the failing component contract**

```tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MythicBookPrelude } from "./MythicBookPrelude";

describe("MythicBookPrelude", () => {
  it("renders a book cover with the slogan, tree and three threads", () => {
    const { container } = render(
      <MythicBookPrelude locale="zh" active onComplete={() => undefined} onSkip={() => undefined} />,
    );
    expect(screen.getByRole("heading", { name: "智绘万物" })).toBeInTheDocument();
    expect(screen.getByText("INTELLIGENCE SHAPES EVERYTHING")).toBeInTheDocument();
    expect(container.querySelector(".mythic-book")).toBeInTheDocument();
    expect(container.querySelector(".cover-world-tree")).toBeInTheDocument();
    expect(container.querySelectorAll("[data-norn-thread]")).toHaveLength(3);
  });

  it("provides an immediate skip action", () => {
    const onSkip = vi.fn();
    render(<MythicBookPrelude locale="zh" active onComplete={() => undefined} onSkip={onSkip} />);
    fireEvent.click(screen.getByRole("button", { name: "跳过序章" }));
    expect(onSkip).toHaveBeenCalledOnce();
  });

  it("is absent from interaction when inactive", () => {
    const { container } = render(
      <MythicBookPrelude locale="en" active={false} onComplete={() => undefined} onSkip={() => undefined} />,
    );
    expect(container.querySelector(".mythic-book-prelude")).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run and verify red**

```bash
npm run test:run -- src/features/prelude/MythicBookPrelude.test.tsx
```

Expected: FAIL because the component does not exist.

- [ ] **Step 3: Implement the semantic book structure**

Use this public interface and DOM contract:

```tsx
"use client";

import type { Locale } from "@/content";

interface MythicBookPreludeProps {
  locale: Locale;
  active: boolean;
  onComplete(): void;
  onSkip(): void;
}

export function MythicBookPrelude({ locale, active, onComplete, onSkip }: MythicBookPreludeProps) {
  void onComplete;
  if (!active) return null;
  const skip = locale === "zh" ? "跳过序章" : "Skip Prelude";
  return (
    <div className="mythic-book-prelude" data-prelude-state="idle" aria-label={skip}>
      <div className="mythic-book-stage" aria-hidden="true">
        <div className="mythic-book">
          <div className="book-pages book-pages-left" />
          <div className="book-pages book-pages-right" />
          <div className="book-cover">
            <svg className="cover-world-tree" viewBox="0 0 320 420">
              <path d="M160 340 C154 270 164 210 160 82" />
              <path d="M160 162 C112 126 82 106 48 84" />
              <path d="M160 196 C212 156 240 122 278 98" />
              <path d="M160 338 C116 362 86 378 54 404" />
              <path d="M160 338 C204 364 238 380 270 402" />
            </svg>
            <svg className="cover-norn-threads" viewBox="0 0 1200 720" preserveAspectRatio="none">
              <path pathLength={1} data-norn-thread="past" d="M-40 508 C210 466 380 526 598 438 C780 364 952 402 1240 328" />
              <path pathLength={1} data-norn-thread="present" d="M-40 378 C226 382 384 324 600 360 C816 396 954 302 1240 290" />
              <path pathLength={1} data-norn-thread="future" d="M-40 248 C210 312 392 214 604 276 C822 340 1004 208 1240 188" />
            </svg>
            <div className="book-cover-copy">
              <h1>智绘万物</h1>
              <p>INTELLIGENCE SHAPES EVERYTHING</p>
              <span>OPUS I</span>
            </div>
          </div>
          <div className="book-leaf book-leaf-left" />
          <div className="book-leaf book-leaf-right" />
          <div className="book-spine" />
        </div>
      </div>
      <button className="prelude-skip" type="button" onClick={onSkip}>{skip}</button>
    </div>
  );
}
```

The `onComplete` prop is intentionally consumed by the GSAP integration in Task 11; keep it in the interface and add `void onComplete` until then to satisfy lint.

- [ ] **Step 4: Run component tests**

```bash
npm run test:run -- src/features/prelude/MythicBookPrelude.test.tsx
```

Expected: all 3 component tests PASS. Task 4 extracts the inline cover paths into the shared semantic component without changing this contract.

**Checkpoint message:** `feat: scaffold accessible mythic book prelude`

---

### Task 4: Create the semantic Norn thread system

**Files:**
- Create: `src/features/prelude/NornThreads.tsx`
- Create: `src/features/prelude/NornThreads.test.tsx`
- Modify: `src/components/scene/scene-state.ts`
- Modify: `src/components/scene/scene-state.test.ts`

- [ ] **Step 1: Write the failing SVG and state tests**

```tsx
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NornThreads } from "./NornThreads";

it("renders past, present and future as exactly three paths", () => {
  const { container } = render(<NornThreads decorative />);
  expect(container.querySelectorAll("[data-norn-thread]")).toHaveLength(3);
  expect([...container.querySelectorAll("[data-norn-thread]")].map((node) => node.getAttribute("data-norn-thread")))
    .toEqual(["past", "present", "future"]);
  expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
});
```

Extend `scene-state.test.ts`:

```ts
it("creates neutral Norn thread tension", () => {
  const state = createMythicMotionState();
  expect(state.threads).toEqual({ past: 0, present: 0, future: 0, tension: 0, focus: false });
  expect(state.book).toEqual({ open: 1, pageTurn: 1, depth: 0 });
});
```

- [ ] **Step 2: Run and verify red**

```bash
npm run test:run -- src/features/prelude/NornThreads.test.tsx src/components/scene/scene-state.test.ts
```

Expected: FAIL for missing component and state factory.

- [ ] **Step 3: Implement the three SVG paths**

```tsx
interface NornThreadsProps {
  decorative?: boolean;
  className?: string;
}

export function NornThreads({ decorative = false, className = "" }: NornThreadsProps) {
  return (
    <svg
      className={`norn-threads ${className}`.trim()}
      viewBox="0 0 1200 720"
      preserveAspectRatio="none"
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : "Past, present and future engineering threads"}
    >
      <path pathLength={1} data-norn-thread="past" d="M-40 508 C210 466 380 526 598 438 C780 364 952 402 1240 328" />
      <path pathLength={1} data-norn-thread="present" d="M-40 378 C226 382 384 324 600 360 C816 396 954 302 1240 290" />
      <path pathLength={1} data-norn-thread="future" d="M-40 248 C210 312 392 214 604 276 C822 340 1004 208 1240 188" />
    </svg>
  );
}
```

Replace the inline `cover-norn-threads` SVG in `MythicBookPrelude` with
`<NornThreads decorative className="cover-norn-threads" />`; rerun the Task 3 book test to prove the extraction is behaviour-preserving.

- [ ] **Step 4: Replace score state with mythic state**

Keep the existing movement union and add `threads` and `book`:

```ts
export interface MythicMotionState extends ScoreMotionState {
  threads: {
    past: number;
    present: number;
    future: number;
    tension: number;
    focus: boolean;
  };
  book: {
    open: number;
    pageTurn: number;
    depth: number;
  };
}

export function createMythicMotionState(): MythicMotionState {
  return {
    ...createScoreMotionState(),
    threads: { past: 0, present: 0, future: 0, tension: 0, focus: false },
    book: { open: 1, pageTurn: 1, depth: 0 },
  };
}

export const mythicMotionState = createMythicMotionState();
```

Retain `scoreMotionState` as a deprecated alias during migration:

```ts
export const scoreMotionState = mythicMotionState;
```

- [ ] **Step 5: Run all Task 3–4 tests**

```bash
npm run test:run -- src/features/prelude/MythicBookPrelude.test.tsx src/features/prelude/NornThreads.test.tsx src/components/scene/scene-state.test.ts && npm run typecheck
```

Expected: all tests PASS.

**Checkpoint message:** `feat: add three semantic Norn threads`

---

### Task 5: Replace the name-led hero with the slogan and thread exposition

**Files:**
- Create: `src/components/home/SloganPrelude.tsx`
- Create: `src/components/home/SloganPrelude.test.tsx`
- Create: `src/components/home/ThreeThreadsSection.tsx`
- Create: `src/components/home/ThreeThreadsSection.test.tsx`
- Modify: `src/components/home/HomeExperience.tsx`
- Modify: `src/components/layout/SiteHeader.tsx`
- Modify: `src/components/layout/SiteFooter.tsx`

- [ ] **Step 1: Write failing structural tests**

```tsx
it("makes the slogan the only hero heading and keeps the name in the byline", () => {
  const { container } = render(<SloganPrelude content={zhContent} />);
  expect(screen.getByRole("heading", { level: 1, name: "智绘万物" })).toBeInTheDocument();
  expect(container.querySelector(".prelude h1")).toHaveTextContent("智绘万物");
  expect(container.querySelector(".prelude h1")).not.toHaveTextContent("谌一航");
  expect(container.querySelector(".prelude-byline")).toHaveTextContent("谌一航");
  expect(container.querySelector(".score-staff")).not.toBeInTheDocument();
});
```

```tsx
it("explains the three threads once", () => {
  const { container } = render(<ThreeThreadsSection content={zhContent} />);
  expect(container.querySelectorAll("[data-thread-explanation]")).toHaveLength(3);
  expect(screen.getByText("过去保存证据")).toBeInTheDocument();
  expect(screen.getByText("现在执行决策")).toBeInTheDocument();
  expect(screen.getByText("未来表达不确定性")).toBeInTheDocument();
});
```

- [ ] **Step 2: Verify red**

```bash
npm run test:run -- src/components/home/SloganPrelude.test.tsx src/components/home/ThreeThreadsSection.test.tsx
```

Expected: FAIL because both components are missing.

- [ ] **Step 3: Implement `SloganPrelude`**

The final DOM must be:

```tsx
export function SloganPrelude({ content }: { content: PortfolioContent }) {
  return (
    <section className="prelude section-shell" data-chapter="prelude">
      <div className="prelude-folio" data-reveal>
        <span>Portfolio for software engineering</span>
        <span>2026 · Opus I</span>
      </div>
      <div className="prelude-slogan">
        <p className="prelude-role" data-reveal>{content.profile.role}</p>
        <h1 data-reveal aria-label={content.hero.slogan}>
          {content.hero.slogan.split("").map((character, index) => (
            <span key={`${character}-${index}`} className="slogan-character">{character}</span>
          ))}
        </h1>
        <p className="prelude-slogan-en" data-reveal>{content.hero.sloganEn}</p>
      </div>
      <p className="prelude-statement" data-reveal>{content.hero.statement}</p>
      <p className="prelude-byline" data-reveal>
        <span>{content.profile.name} / {content.profile.englishName}</span>
        <span>{content.profile.role}</span>
      </p>
      <NornThreads decorative className="prelude-threads" />
    </section>
  );
}
```

- [ ] **Step 4: Implement `ThreeThreadsSection`**

```tsx
export function ThreeThreadsSection({ content }: { content: PortfolioContent }) {
  return (
    <section className="thread-exposition section-shell" data-chapter="threads" id="threads">
      <p className="section-kicker">The Norns · Three engineering times</p>
      <ol>
        {content.threads.map((thread) => (
          <li key={thread.id} data-thread-explanation={thread.id} data-reveal>
            <span>{thread.norseName}</span>
            <h2>{thread.label}</h2>
            <p>{thread.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
```

- [ ] **Step 5: Replace the old prelude DOM in `HomeExperience`**

Render in this order:

```tsx
<main ref={root} className="mythic-book-site">
  <SceneLayer />
  <SloganPrelude content={content} />
  <ThreeThreadsSection content={content} />
  <CapabilityAtlas content={content} />
  <SelectedWork content={content} locale={locale} />
  {recapitulation}
  {coda}
</main>
```

Keep `recapitulation` and `coda` markup functionally unchanged until Task 14 styles them. Remove all `.score-staff` DOM. Task 11 inserts `MythicBookPrelude` once its session state and callbacks exist; do not introduce placeholder state here.

- [ ] **Step 6: Make identity small**

Keep the header brand as `Chen Yihang / Op. I` and remove any visually dominant name treatment outside the byline. Task 11 adds the replay control together with its working provider so no inert button ships between tasks.

- [ ] **Step 7: Run home and layout tests**

```bash
npm run test:run -- src/components/home/SloganPrelude.test.tsx src/components/home/ThreeThreadsSection.test.tsx src/components/layout/SiteHeader.test.tsx && npm run typecheck
```

Expected: PASS; no hero test expects the author name as the main heading.

**Checkpoint message:** `feat: make 智绘万物 the portfolio hero`

---

### Task 6: Curate anonymised Hermes portfolio evidence

**Files:**
- Create: `src/features/hermes/portfolio-data.ts`
- Create: `src/features/hermes/portfolio-data.test.ts`

- [ ] **Step 1: Write failing invariants**

```ts
import { describe, expect, it } from "vitest";
import { hermesArchitectureLayers, hermesProductScenario } from "./portfolio-data";

describe("Hermes portfolio evidence", () => {
  it("contains the real execution path", () => {
    expect(hermesArchitectureLayers.map((layer) => layer.id)).toEqual([
      "websocket", "dedup-queue", "routing", "agent-mcp", "acl", "ocl", "commit",
    ]);
  });

  it("keeps identity server-controlled and display data anonymised", () => {
    expect(hermesProductScenario.vehicle).toBe("E-17");
    expect(hermesProductScenario.user).toBe("飞书用户 A");
    expect(JSON.stringify(hermesProductScenario)).not.toMatch(/@163\.com|open_id|19943221833/);
    expect(hermesProductScenario.securityBoundary).toContain("服务端注入");
  });
});
```

- [ ] **Step 2: Verify red**

```bash
npm run test:run -- src/features/hermes/portfolio-data.test.ts
```

Expected: FAIL because the data module does not exist.

- [ ] **Step 3: Add exact curated data**

```ts
export const hermesProductScenario = {
  user: "飞书用户 A",
  request: "帮我预约 8 月 4 日 09:00–11:00 的园区演示车辆",
  platform: "MaaS",
  vehicle: "E-17",
  time: "09:00–11:00",
  task: "园区演示",
  location: "测试场",
  securityBoundary: "emailAddress 由服务端按已核验身份注入",
} as const;

export const hermesArchitectureLayers = [
  { id: "websocket", label: "Feishu WebSocket", detail: "主动推送，无需公网回调入口" },
  { id: "dedup-queue", label: "Dedup & Queue", detail: "回调立即返回，事件去重后串行消费" },
  { id: "routing", label: "Layered Routing", detail: "Layer 0 / 0.5 / 0.6 与语义 Agent 分流" },
  { id: "agent-mcp", label: "Agent & MCP", detail: "每用户 Agent、上下文传播与工具调度" },
  { id: "acl", label: "ACL Guard", detail: "五角色显式权限与双层工具防御" },
  { id: "ocl", label: "OCL Pipeline", detail: "格式、内容、长度与卡片输出控制" },
  { id: "commit", label: "Deterministic Commit", detail: "dry-run、相邻确认、参数复核后写入" },
] as const;
```

- [ ] **Step 4: Run tests**

```bash
npm run test:run -- src/features/hermes/portfolio-data.test.ts
```

Expected: 2 tests PASS.

**Checkpoint message:** `feat: curate Hermes portfolio evidence`

---

### Task 7: Draw Hermes product and system plates

**Files:**
- Create: `src/features/hermes/HermesProductPlate.tsx`
- Create: `src/features/hermes/HermesProductPlate.test.tsx`
- Create: `src/features/hermes/HermesSystemCutaway.tsx`
- Create: `src/features/hermes/HermesSystemCutaway.test.tsx`
- Modify: `src/features/hermes/HermesDemo.tsx`
- Modify: `src/features/hermes/HermesArchitecture.tsx`

- [ ] **Step 1: Write failing product evidence tests**

```tsx
it("shows a Feishu request, structured draft, guard and confirmation card", () => {
  const { container } = render(<HermesProductPlate locale="zh" state="dry_run" />);
  expect(screen.getByText(/帮我预约/)).toBeInTheDocument();
  expect(screen.getByText("E-17")).toBeInTheDocument();
  expect(screen.getByText("dry-run 通过")).toBeInTheDocument();
  expect(screen.getByText("等待确认")).toBeInTheDocument();
  expect(container.querySelector(".feishu-product-plate")).toBeInTheDocument();
});
```

```tsx
it("renders all seven inspectable architecture layers", () => {
  const { container } = render(<HermesSystemCutaway locale="zh" />);
  expect(container.querySelectorAll("[data-hermes-layer]")).toHaveLength(7);
  expect(screen.getByText("ACL Guard")).toBeInTheDocument();
  expect(screen.getByText(/五角色显式权限/)).toBeInTheDocument();
});
```

- [ ] **Step 2: Verify red**

```bash
npm run test:run -- src/features/hermes/HermesProductPlate.test.tsx src/features/hermes/HermesSystemCutaway.test.tsx
```

Expected: FAIL because both components are missing.

- [ ] **Step 3: Implement `HermesProductPlate` public state**

```ts
export type HermesPlateState =
  | "intent"
  | "time_gate"
  | "vehicle"
  | "dry_run"
  | "confirmation"
  | "committed";

interface HermesProductPlateProps {
  locale: Locale;
  state: HermesPlateState;
}

interface HermesSystemCutawayProps {
  locale: Locale;
  compact?: boolean;
}
```

Define every state message explicitly so the UI and tests cannot drift:

```ts
const agentMessage: Record<HermesPlateState, Record<Locale, string>> = {
  intent: { zh: "我会先核对执行所需参数。", en: "I will verify the required execution parameters first." },
  time_gate: { zh: "缺少明确时间范围，查询已停止。", en: "The query stopped because an exact time range is missing." },
  vehicle: { zh: "已找到脱敏可用车辆 E-17。", en: "An anonymised available vehicle, E-17, was found." },
  dry_run: { zh: "草稿校验通过，尚未发生真实写入。", en: "The draft passed validation; no real write has occurred." },
  confirmation: { zh: "请确认本次预约；修改草稿会使确认失效。", en: "Confirm this booking; editing the draft invalidates confirmation." },
  committed: { zh: "参数再次比对后完成写入。", en: "The write completed after the parameters were compared again." },
};

const guardMessage: Record<HermesPlateState, Record<Locale, string>> = {
  intent: { zh: "意图已识别 · 等待必填参数", en: "Intent recognised · required fields pending" },
  time_gate: { zh: "时间硬门已阻断工具调用", en: "Time hard gate blocked the tool call" },
  vehicle: { zh: "候选资源已脱敏", en: "Candidate resource anonymised" },
  dry_run: { zh: "dry-run 已通过 · 外部副作用为 0", en: "Dry run passed · zero external side effects" },
  confirmation: { zh: "相邻确认有效 · 等待用户动作", en: "Adjacent confirmation valid · awaiting user action" },
  committed: { zh: "身份由服务端注入 · 参数复核一致", en: "Identity injected by server · parameters matched" },
};

const cardTitle: Record<HermesPlateState, Record<Locale, string>> = {
  intent: { zh: "预约草稿", en: "Booking draft" },
  time_gate: { zh: "需要补充时间", en: "Time required" },
  vehicle: { zh: "候选车辆", en: "Vehicle candidate" },
  dry_run: { zh: "dry-run 通过", en: "Dry run passed" },
  confirmation: { zh: "确认预约", en: "Confirm booking" },
  committed: { zh: "预约已提交", en: "Booking committed" },
};

const cardStatus: Record<HermesPlateState, Record<Locale, string>> = {
  intent: { zh: "解析中", en: "Parsing" },
  time_gate: { zh: "已阻断", en: "Blocked" },
  vehicle: { zh: "待校验", en: "Validation pending" },
  dry_run: { zh: "等待确认", en: "Awaiting confirmation" },
  confirmation: { zh: "确认窗口开启", en: "Confirmation window open" },
  committed: { zh: "External Effect: COMMITTED", en: "External Effect: COMMITTED" },
};
```

Render these stable regions in the component:

```tsx
<div className="feishu-product-plate" data-plate-state={state}>
  <header><span>Hermes · Feishu Agent</span><span>WebSocket connected</span></header>
  <div className="feishu-conversation">
    <article className="message message-user">{scenario.request}</article>
    <article className="message message-agent">{agentMessage[state][locale]}</article>
  </div>
  <dl className="booking-draft">
    <div><dt>platform</dt><dd>{scenario.platform}</dd></div>
    <div><dt>time</dt><dd>{state === "intent" || state === "time_gate" ? "—" : scenario.time}</dd></div>
    <div><dt>vehicle</dt><dd>{["vehicle", "dry_run", "confirmation", "committed"].includes(state) ? scenario.vehicle : "—"}</dd></div>
    <div><dt>revision</dt><dd>{state === "committed" ? "2" : "1"}</dd></div>
  </dl>
  <div className="execution-guard" data-guard={state === "time_gate" ? "blocked" : "ready"}>
    {guardMessage[state][locale]}
  </div>
  <div className="confirmation-card">
    <strong>{cardTitle[state][locale]}</strong>
    <span>{cardStatus[state][locale]}</span>
  </div>
</div>
```

Keep the four records above exhaustive; no state may render an undefined message.

- [ ] **Step 4: Implement `HermesSystemCutaway`**

Map `hermesArchitectureLayers` to seven keyboard-focusable buttons. Clicking a node updates a visible detail panel with the exact `detail`; use `aria-pressed` on the selected node.

- [ ] **Step 5: Integrate into the existing demo**

Map `HermesDemoState.step` to `HermesPlateState`, render `HermesProductPlate` above the four evidence columns, and keep the existing reducer/buttons intact. Replace `HermesArchitecture` internals with `HermesSystemCutaway` while retaining the exported component name for route compatibility.

- [ ] **Step 6: Run all Hermes tests**

```bash
npm run test:run -- src/features/hermes && npm run typecheck
```

Expected: product, system, reducer and guarded-flow tests PASS.

**Checkpoint message:** `feat: draw Hermes product and system evidence`

---

### Task 8: Curate truthful BHMS lifecycle evidence

**Files:**
- Create: `src/features/bhms/portfolio-data.ts`
- Create: `src/features/bhms/portfolio-data.test.ts`

- [ ] **Step 1: Write failing data-boundary tests**

```ts
import { describe, expect, it } from "vitest";
import { bhmsDataSources, bhmsLifecycleSeries, bhmsReleaseClaim } from "./portfolio-data";

describe("BHMS portfolio evidence", () => {
  it("distinguishes training, auxiliary and enhancement-only sources", () => {
    expect(bhmsDataSources.filter((source) => source.role === "lifecycle").map((source) => source.id))
      .toEqual(["nasa", "calce", "kaggle", "hust", "matr"]);
    expect(bhmsDataSources.find((source) => source.id === "oxford")?.role).toBe("trajectory-auxiliary");
    expect(bhmsDataSources.find((source) => source.id === "pulsebat")?.role).toBe("enhancement-only");
  });

  it("contains observed, predicted and uncertainty values without a superiority claim", () => {
    expect(bhmsLifecycleSeries.some((point) => point.observed !== undefined)).toBe(true);
    expect(bhmsLifecycleSeries.some((point) => point.hybrid !== undefined)).toBe(true);
    expect(bhmsLifecycleSeries.some((point) => point.lower !== undefined && point.upper !== undefined)).toBe(true);
    expect(bhmsReleaseClaim).toContain("不宣称 Hybrid 全面优于 BiLSTM");
  });
});
```

- [ ] **Step 2: Verify red**

```bash
npm run test:run -- src/features/bhms/portfolio-data.test.ts
```

Expected: FAIL because the module does not exist.

- [ ] **Step 3: Implement curated data**

Use these exact source roles and deterministic nine-point display series. The values are reconstruction
data for the portfolio visual, not claimed benchmark scores:

```ts
export const bhmsDataSources = [
  { id: "nasa", label: "NASA PCoE", role: "lifecycle" },
  { id: "calce", label: "CALCE", role: "lifecycle" },
  { id: "kaggle", label: "Kaggle Battery", role: "lifecycle" },
  { id: "hust", label: "HUST", role: "lifecycle" },
  { id: "matr", label: "MATR", role: "lifecycle" },
  { id: "oxford", label: "Oxford Battery Degradation", role: "trajectory-auxiliary" },
  { id: "pulsebat", label: "PulseBat", role: "enhancement-only" },
] as const;

export const bhmsLifecycleSeries = [
  { cycle: 0, observed: 1.000 },
  { cycle: 120, observed: 0.978 },
  { cycle: 240, observed: 0.947 },
  { cycle: 360, observed: 0.908 },
  { cycle: 480, observed: 0.854 },
  { cycle: 560, bilstm: 0.813, hybrid: 0.805, lower: 0.782, upper: 0.828 },
  { cycle: 640, bilstm: 0.764, hybrid: 0.747, lower: 0.712, upper: 0.782 },
  { cycle: 720, bilstm: 0.721, hybrid: 0.688, lower: 0.641, upper: 0.735 },
  { cycle: 800, bilstm: 0.687, hybrid: 0.623, lower: 0.552, upper: 0.694 },
] as const;

export const bhmsMarkers = { knee: 538, eol: 642, rul: 162 } as const;
export const bhmsReleaseClaim =
  "当前工程封版保留真实实验边界，不宣称 Hybrid 全面优于 BiLSTM。";
```

```ts
export const bhmsReleaseClaim =
  "当前工程封版保留真实实验边界，不宣称 Hybrid 全面优于 BiLSTM。";
```

- [ ] **Step 4: Run tests**

```bash
npm run test:run -- src/features/bhms/portfolio-data.test.ts
```

Expected: 2 tests PASS.

**Checkpoint message:** `feat: curate truthful BHMS visual evidence`

---

### Task 9: Draw the BHMS product, lifecycle and evidence views

**Files:**
- Create: `src/features/bhms/BhmsWorkspacePlate.tsx`
- Create: `src/features/bhms/BhmsWorkspacePlate.test.tsx`
- Create: `src/features/bhms/BhmsLifecyclePlate.tsx`
- Create: `src/features/bhms/BhmsLifecyclePlate.test.tsx`
- Create: `src/features/bhms/BhmsEvidenceGraph.tsx`
- Create: `src/features/bhms/BhmsEvidenceGraph.test.tsx`
- Modify: `src/features/bhms/BhmsDemo.tsx`

- [ ] **Step 1: Write failing product and chart tests**

```tsx
it("shows the real BHMS workspace vocabulary", () => {
  render(<BhmsWorkspacePlate locale="zh" selectedBattery="CALCE-CS2-35" />);
  expect(screen.getByText("电池工作台")).toBeInTheDocument();
  expect(screen.getByText("容量退化趋势")).toBeInTheDocument();
  expect(screen.getByText("生命周期预测")).toBeInTheDocument();
  expect(screen.getByText("GraphRAG 机理解释")).toBeInTheDocument();
});
```

```tsx
it("describes observed, BiLSTM, Hybrid, uncertainty, knee and EOL", () => {
  render(<BhmsLifecyclePlate locale="zh" activeModel="hybrid" />);
  const chart = screen.getByRole("img", { name: /生命周期预测/ });
  expect(chart).toBeInTheDocument();
  expect(screen.getByText("Observed")).toBeInTheDocument();
  expect(screen.getByText("BiLSTM")).toBeInTheDocument();
  expect(screen.getByText("Hybrid")).toBeInTheDocument();
  expect(screen.getByText("KNEE · 538")).toBeInTheDocument();
  expect(screen.getByText("EOL · 642")).toBeInTheDocument();
});
```

```tsx
it("reveals a decision only after evidence is selected", () => {
  render(<BhmsEvidenceGraph locale="zh" />);
  expect(screen.queryByText("优先安排检测")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /电压偏差/ }));
  expect(screen.getByText("优先安排检测")).toBeInTheDocument();
  expect(screen.getByText(/生命周期证据/)).toBeInTheDocument();
});
```

- [ ] **Step 2: Verify red**

```bash
npm run test:run -- src/features/bhms/BhmsWorkspacePlate.test.tsx src/features/bhms/BhmsLifecyclePlate.test.tsx src/features/bhms/BhmsEvidenceGraph.test.tsx
```

Expected: FAIL because all three components are missing.

- [ ] **Step 3: Implement `BhmsWorkspacePlate`**

Render a fixed product reconstruction with these regions and labels:

```tsx
<div className="bhms-workspace-plate">
  <aside className="battery-list" aria-label={locale === "zh" ? "电池列表" : "Battery list"}>
    <strong>{locale === "zh" ? "电池工作台" : "Battery workspace"}</strong>
    {batteryIds.map((id) => <button aria-pressed={id === selectedBattery} key={id}>{id}</button>)}
  </aside>
  <div className="workspace-main">
    <header><h3>{selectedBattery}</h3><span>CALCE · 684 cycles</span></header>
    <nav><span>{locale === "zh" ? "概览" : "Overview"}</span><span>{locale === "zh" ? "生命周期预测" : "Lifecycle prediction"}</span><span>{locale === "zh" ? "GraphRAG 机理解释" : "GraphRAG mechanism"}</span></nav>
    <section aria-label={locale === "zh" ? "容量退化趋势" : "Capacity degradation trend"}>
      <h4>{locale === "zh" ? "容量退化趋势" : "Capacity degradation trend"}</h4>
      <BhmsLifecyclePlate locale={locale} activeModel="hybrid" compact />
    </section>
  </div>
</div>
```

- [ ] **Step 4: Implement `BhmsLifecyclePlate`**

Use public props `{ locale: Locale; activeModel: "bilstm" | "hybrid"; compact?: boolean; onModelChange?(model: "bilstm" | "hybrid"): void }` and one accessible SVG. Generate observed, BiLSTM and Hybrid paths from `bhmsLifecycleSeries`; create a closed uncertainty area from upper points followed by reversed lower points. Include `<title>` and `<desc>`. Render textual legend buttons that call `onModelChange` when supplied; otherwise render them as non-interactive legend labels. Never hide chart semantics from screen readers.

- [ ] **Step 5: Implement `BhmsEvidenceGraph`**

Use public props `{ locale: Locale; compact?: boolean }`, SVG lines for relations and HTML buttons for nodes. The initial state has no decision card. Selecting `voltage-deviation` highlights anomaly, lifecycle and model evidence and reveals the decision basis. Every node must have a visible label and accessible button name. `compact` hides secondary prose only; it preserves every node and the evidence-to-decision interaction.

- [ ] **Step 6: Compose the new BHMS demo**

Render in order:

```tsx
<div className="bhms-immersive-demo" data-case-reveal>
  <BhmsWorkspacePlate locale={locale} selectedBattery="CALCE-CS2-35" />
  <BhmsLifecyclePlate locale={locale} activeModel={activeModel} />
  <BhmsEvidenceGraph locale={locale} />
</div>
```

Preserve the existing `分析电压偏差 → 证据链已生成 → 查看决策依据` Playwright-visible flow through the new evidence component.

- [ ] **Step 7: Run all BHMS tests**

```bash
npm run test:run -- src/features/bhms && npm run typecheck
```

Expected: data, product, lifecycle, evidence and existing demo tests PASS.

**Checkpoint message:** `feat: draw BHMS workspace lifecycle and evidence`

---

### Task 10: Replace homepage project summaries with visual movements

**Files:**
- Modify: `src/components/home/SelectedWork.tsx`
- Modify: `src/components/home/SelectedWork.test.tsx`

- [ ] **Step 1: Extend the failing home project test**

```tsx
it("renders both projects as visual product movements", () => {
  const { container } = render(<SelectedWork content={zhContent} locale="zh" />);
  expect(container.querySelector(".hermes-home-movement .feishu-product-plate")).toBeInTheDocument();
  expect(container.querySelector(".hermes-home-movement [data-hermes-layer]")).toBeInTheDocument();
  expect(container.querySelector(".bhms-home-movement .bhms-workspace-plate")).toBeInTheDocument();
  expect(container.querySelector(".bhms-home-movement [data-evidence-node]")).toBeInTheDocument();
  expect(container.querySelector(".movement-notation")).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Verify red**

```bash
npm run test:run -- src/components/home/SelectedWork.test.tsx
```

Expected: FAIL because the old component only contains text paper movements.

- [ ] **Step 3: Build two explicit sections**

Do not map both projects into a generic card. Render:

```tsx
<section className="project-movements" id="work" data-chapter="movements">
  <header className="score-section-heading movements-heading">{heading}</header>
  <article className="home-project-movement hermes-home-movement" data-movement="hermes">
    <ProjectMovementHeading project={hermes} movement="I" />
    <div className="home-project-stage">
      <HermesProductPlate locale={locale} state="dry_run" />
      <HermesSystemCutaway locale={locale} compact />
    </div>
    <Link href={`/${locale}/work/hermes`}>{content.workIntro.openCase}</Link>
  </article>
  <article className="home-project-movement bhms-home-movement" data-movement="bhms">
    <ProjectMovementHeading project={bhms} movement="II" />
    <div className="home-project-stage">
      <BhmsWorkspacePlate locale={locale} selectedBattery="CALCE-CS2-35" />
      <BhmsEvidenceGraph locale={locale} compact />
    </div>
    <Link href={`/${locale}/work/bhms`}>{content.workIntro.openCase}</Link>
  </article>
</section>
```

Define `ProjectMovementHeading` in the same file because it is local presentational markup. `compact` props must be added to the system/evidence components and only reduce annotations, never semantic nodes.

- [ ] **Step 4: Run home tests**

```bash
npm run test:run -- src/components/home/SelectedWork.test.tsx src/components/home/CapabilityAtlas.test.tsx && npm run typecheck
```

Expected: PASS; capability voices still contain no project links.

**Checkpoint message:** `feat: turn homepage projects into product movements`

---

### Task 11: Orchestrate the prelude and one master home timeline

**Files:**
- Modify: `src/components/home/HomeExperience.tsx`
- Create: `src/components/home/HomeExperience.test.tsx`
- Create: `src/features/prelude/PreludeReplayContext.tsx`
- Create: `src/features/prelude/PreludeReplayContext.test.tsx`
- Modify: `src/components/layout/SiteHeader.tsx`
- Modify: `src/app/[locale]/layout.tsx`

- [ ] **Step 1: Write failing session/replay tests**

Mock `sessionStorage` and `matchMedia` in a focused `HomeExperience` test. Render the header and
home inside the locale-level provider so the test mirrors the production component boundary:

```tsx
it("autoplays once in a session and exposes replay", async () => {
  window.sessionStorage.clear();
  const view = render(
    <PreludeReplayProvider>
      <SiteHeader content={zhContent} locale="zh" />
      <HomeExperience content={zhContent} locale="zh" />
    </PreludeReplayProvider>,
  );
  expect(await screen.findByRole("button", { name: "跳过序章" })).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "跳过序章" }));
  expect(window.sessionStorage.getItem(PRELUDE_SESSION_KEY)).toBe("1");
  view.unmount();
  render(
    <PreludeReplayProvider>
      <SiteHeader content={zhContent} locale="zh" />
      <HomeExperience content={zhContent} locale="zh" />
    </PreludeReplayProvider>,
  );
  expect(document.querySelector(".mythic-book-prelude")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "重播序章" }));
  expect(await screen.findByRole("button", { name: "跳过序章" })).toBeInTheDocument();
});
```

In `PreludeReplayContext.test.tsx`, render a tiny consumer that prints `replayToken`, click a button
bound to `replayPrelude`, and assert the text changes from `0` to `1`. This isolates the provider
contract from the session/animation test above.

- [ ] **Step 2: Verify red**

```bash
npm run test:run -- src/components/home/HomeExperience.test.tsx
```

Expected: FAIL because replay context and session orchestration do not exist.

- [ ] **Step 3: Add replay context**

Expose only:

```tsx
"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

interface PreludeReplayValue {
  replayToken: number;
  replayPrelude(): void;
}

const PreludeReplayContext = createContext<PreludeReplayValue | null>(null);

export function PreludeReplayProvider({ children }: { children: React.ReactNode }) {
  const [replayToken, setReplayToken] = useState(0);
  const replayPrelude = useCallback(() => setReplayToken((token) => token + 1), []);
  const value = useMemo(() => ({ replayToken, replayPrelude }), [replayToken, replayPrelude]);
  return <PreludeReplayContext.Provider value={value}>{children}</PreludeReplayContext.Provider>;
}

export function usePreludeReplay(): PreludeReplayValue {
  const value = useContext(PreludeReplayContext);
  if (!value) throw new Error("usePreludeReplay must be used within PreludeReplayProvider");
  return value;
}
```

`PreludeReplayProvider` owns a monotonically increasing replay token. It wraps the header, page content
and footer in `src/app/[locale]/layout.tsx`, because `SiteHeader` is a sibling of `HomeExperience`.
`SiteHeader` calls `replayPrelude`; `HomeExperience` observes `replayToken` and activates the prelude.
Hide the replay button unless `usePathname()` is exactly `/${locale}`, so case pages do not offer a
control that has no home experience to receive it.

Wrap the existing locale layout fragment:

```tsx
<PreludeReplayProvider>
  <a className="skip-link" href="#main-content">{locale === "zh" ? "跳到正文" : "Skip to content"}</a>
  <SiteHeader locale={locale} content={content} />
  <div id="main-content">{children}</div>
  <SiteFooter content={content} />
</PreludeReplayProvider>
```

Add this home-only action to `SiteHeader`:

```tsx
const { replayPrelude } = usePreludeReplay();
const isHome = pathname === `/${locale}`;

{isHome ? (
  <button type="button" data-replay-prelude onClick={replayPrelude}>
    {content.hero.replayPrelude}
  </button>
) : null}
```

- [ ] **Step 4: Implement session state in `HomeExperience`**

On mount, read `window.matchMedia("(prefers-reduced-motion: reduce)").matches` and `sessionStorage` through `shouldAutoPlayPrelude`. `skipPrelude` and `completePrelude` both mark the session and set `active=false`. When the context `replayToken` increases, set `active=true`, reset `mythicMotionState.book`, and do not clear the session key. Ignore replay requests under reduced motion and keep the completed page visible.

Insert the overlay directly after `SceneLayer` so it shares the page animation scope without changing
the document reading order of the completed portfolio:

```tsx
<SceneLayer />
<MythicBookPrelude
  key={replayToken}
  locale={locale}
  active={preludeActive}
  onComplete={completePrelude}
  onSkip={skipPrelude}
/>
<SloganPrelude content={content} />
```

- [ ] **Step 5: Build the non-scroll intro timeline**

Inside `useGSAP`, create one intro timeline only when `preludeActive` and motion is allowed:

```ts
const intro = gsap.timeline({
  defaults: { ease: "power3.inOut" },
  onComplete: completePrelude,
});

intro
  .addLabel("summon", 0)
  .set(".mythic-book-prelude", { autoAlpha: 1 })
  .fromTo(".mythic-book-stage", { autoAlpha: 0, filter: "blur(12px)" }, { autoAlpha: 1, filter: "blur(0px)", duration: .35 })
  .addLabel("awaken", .22)
  .fromTo(".book-cover [data-norn-thread]", { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: .62, stagger: .08 }, "awaken")
  .addLabel("open", .72)
  .to(".book-cover", { rotationY: -168, transformOrigin: "left center", duration: .86, ease: "power3.inOut" }, "open")
  .to(".book-leaf-left", { rotationY: -8, duration: .7 }, "open+=.1")
  .to(".book-leaf-right", { rotationY: 5, duration: .7 }, "open+=.1")
  .addLabel("inscribe", 1.2)
  .fromTo(".prelude .slogan-character", { yPercent: 112 }, { yPercent: 0, duration: .62, stagger: .07, ease: "power3.out" }, "inscribe")
  .fromTo(".prelude-slogan-en, .prelude-statement", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: .45, stagger: .09 }, "inscribe+=.28")
  .addLabel("enter", 1.72)
  .to(".mythic-book", { scale: 2.6, z: 280, duration: .64, ease: "power2.in" }, "enter")
  .to(".mythic-book-prelude", { autoAlpha: 0, duration: .35 }, "enter+=.3");
```

Use the SVG `pathLength={1}` attribute from Task 4 plus CSS `stroke-dasharray: 1; stroke-dashoffset: 1` so normalized drawing works. Replace filter animation with opacity-only on low-power/mobile media conditions.

- [ ] **Step 6: Rebuild the single home ScrollTrigger timeline**

Use labels in this order:

```text
prelude → threads → exposition → hermes → interlude → bhms → recapitulation → coda
```

The timeline owns all `[data-reveal]`, Norn thread progress, product plate transformations and scene uniforms. Do not add ScrollTrigger in any child component.

- [ ] **Step 7: Run session, header and home tests**

```bash
npm run test:run -- src/features/prelude src/components/home src/components/layout/SiteHeader.test.tsx && npm run typecheck
```

Expected: PASS; the second render does not autoplay and explicit replay works.

**Checkpoint message:** `feat: orchestrate mythic prelude and home motion`

---

### Task 12: Replace the staff shader with the mythic paper/book scene

**Files:**
- Create: `src/components/scene/MythicPaperScene.tsx`
- Create: `src/components/scene/MythicPaperFallback.tsx`
- Create: `src/components/scene/MythicPaperFallback.test.tsx`
- Modify: `src/components/scene/SceneCanvas.tsx`
- Modify: `src/components/scene/SceneLayer.tsx`
- Delete after references are removed: `src/components/scene/PaperScoreScene.tsx`
- Delete after references are removed: `src/components/scene/PaperScoreFallback.tsx`
- Delete after references are removed: `src/components/scene/PaperScoreFallback.test.tsx`

- [ ] **Step 1: Write the failing fallback test**

```tsx
it("renders paper, a world-tree relief and exactly three threads without staff lines", () => {
  const { container } = render(<MythicPaperFallback />);
  expect(container.querySelector(".mythic-paper-fallback")).toHaveAttribute("aria-hidden", "true");
  expect(container.querySelector(".fallback-world-tree")).toBeInTheDocument();
  expect(container.querySelectorAll("[data-norn-thread]")).toHaveLength(3);
  expect(container.querySelector(".fallback-staff")).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Verify red**

```bash
npm run test:run -- src/components/scene/MythicPaperFallback.test.tsx
```

Expected: FAIL because the fallback is missing.

- [ ] **Step 3: Implement static fallback**

Use an SVG with one irregular paper sheet, one five-branch abstract tree relief and `NornThreads`. Do not include repeated horizontal lines. Keep `aria-hidden="true"` and no duplicate text.

- [ ] **Step 4: Implement the new shader**

Copy the stable procedural grain and edge alpha from `PaperScoreScene`, then remove both `staff` calculations from vertex and fragment shaders. Add uniforms:

```ts
uBookOpen: { value: mythicMotionState.book.open },
uPageTurn: { value: mythicMotionState.book.pageTurn },
uThreadTension: { value: mythicMotionState.threads.tension },
```

Vertex displacement must combine fibre, a broad centre fold and page-turn curl. Fragment colour must combine ivory paper, grain, side light and a subtle Prussian-blue root relief; no periodic staff cosine.

- [ ] **Step 5: Wire canvas and fallback**

`SceneCanvas` renders `MythicPaperScene`. `SceneLayer` always renders `MythicPaperFallback` and conditionally mounts Canvas only when WebGL is available and reduced motion is off. Preserve the `requestAnimationFrame` state update that satisfies lint.

- [ ] **Step 6: Remove old scene files and run tests**

After `rg "PaperScore" src` returns only old test paths, delete old scene/test files with `apply_patch`. Then run:

```bash
npm run test:run -- src/components/scene && npm run lint && npm run typecheck
```

Expected: scene tests PASS, lint reports zero errors, and no shader source contains `staff`.

**Checkpoint message:** `feat: replace score relief with mythic paper scene`

---

### Task 13: Restructure both case-study pages around product evidence

**Files:**
- Modify: `src/components/case/CaseShell.tsx`
- Modify: `src/components/case/CaseShell.test.tsx`
- Modify: `src/app/[locale]/work/hermes/page.tsx`
- Modify: `src/app/[locale]/work/bhms/page.tsx`
- Modify: `src/features/bhms/ModelArchitecture.tsx`

- [ ] **Step 1: Update failing case structure tests**

Add assertions that the case hero accepts a `heroVisual`, that Focus View toggles `mythicMotionState.threads.focus`, and that each page has product, process, architecture/model, decision/evidence, verification and limits sections.

```tsx
it("places a real product visual in the case hero", () => {
  const { container } = render(
    <CaseShell
      locale="zh"
      accent="cyan"
      eyebrow="Hermes"
      title="从概率性对话走向确定性行动"
      thesis="LLM 负责理解；确定性代码控制真实写入。"
      chapters={[]}
      heroVisual={<div data-testid="hero-product">product</div>}
    >body</CaseShell>,
  );
  expect(container.querySelector(".case-hero-visual")).toContainElement(screen.getByTestId("hero-product"));
});
```

- [ ] **Step 2: Verify red**

```bash
npm run test:run -- src/components/case/CaseShell.test.tsx
```

Expected: FAIL because `heroVisual` is not a prop.

- [ ] **Step 3: Add `heroVisual` and Norn focus**

Add `heroVisual: React.ReactNode` to `CaseShellProps`, render it beside the title, and mirror focus to both `mythicMotionState.focus` and `mythicMotionState.threads.focus`. Keep the visible fixed exit button.

- [ ] **Step 4: Reorder Hermes sections**

Use exact IDs:

```text
product → execution → system → decisions → verification → limits
```

Hero visual: `HermesProductPlate state="dry_run"`. Product section: complete plate. Execution: `HermesDemo`. System: `HermesSystemCutaway`. Decisions: the five-field engineering decision notes. Verification: test-category ledger. Limits: in-memory state, low-concurrency consumer and non-SLA language.

- [ ] **Step 5: Reorder BHMS sections**

Use exact IDs:

```text
product → data → lifecycle → model → evidence → experiments → limits
```

Hero visual: `BhmsWorkspacePlate`. Lifecycle: `BhmsLifecyclePlate`. Model: expanded `ModelArchitecture`. Evidence: `BhmsEvidenceGraph`. Experiments: source roles and truthful benchmark status. Limits: research prototype and paper-gate language.

- [ ] **Step 6: Preserve one case timeline**

Update the single `CaseShell` ScrollTrigger timeline to label each section and drive product SVG paths, scene uniforms and Norn tension. Child case components must not import ScrollTrigger.

- [ ] **Step 7: Run component and route-level build checks**

```bash
npm run test:run -- src/components/case src/features/hermes src/features/bhms && npm run typecheck && npm run build
```

Expected: tests and production build PASS.

**Checkpoint message:** `feat: rebuild case studies around real product evidence`

---

### Task 14: Implement the complete visual layout and responsive system

**Files:**
- Modify: `src/app/globals.css`
- Create: `src/app/globals.test.ts`

- [ ] **Step 1: Add a CSS source guard test**

Create `src/app/globals.test.ts` that reads the CSS directly from disk:

```ts
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(resolve(process.cwd(), "src/app/globals.css"), "utf8");

describe("mythic visual system", () => {
  it("contains the book, thread and product layouts without legacy staff/card selectors", () => {
    expect(css).toContain(".mythic-book-prelude");
    expect(css).toContain(".norn-threads");
    expect(css).toContain(".feishu-product-plate");
    expect(css).toContain(".bhms-workspace-plate");
    expect(css).not.toContain(".prelude-staff");
    expect(css).not.toContain(".movement-notation");
    expect(css).not.toContain(".score-movement::before");
  });
});
```

- [ ] **Step 2: Verify red before removing old selectors**

```bash
npm run test:run -- src/app/globals.test.ts
```

Expected: FAIL because legacy selectors still exist and new product selectors are incomplete.

- [ ] **Step 3: Rebuild global layout sections in this order**

Organise `globals.css` into:

```text
tokens and reset
header and footer
paper scene
book prelude
Norn threads
slogan prelude
thread exposition
capability voices
Hermes home movement
BHMS home movement
recapitulation and coda
case shell and measure index
Hermes product/execution/system
BHMS workspace/lifecycle/evidence/model
desktop/tablet/mobile queries
reduced motion and feature fallbacks
```

Use these fixed layout values:

```css
:root {
  --paper: #f0eee7;
  --paper-high: #f7f5ef;
  --ink: #252725;
  --muted: #72756f;
  --blue: #263e63;
  --frost: #b9c3ce;
  --metal: #99988f;
  --page: min(86vw, 1280px);
  --reading: 65ch;
}

.mythic-book-stage { perspective: 1600px; transform-style: preserve-3d; }
.mythic-book { width: min(58vw, 760px); aspect-ratio: 1.42; transform-style: preserve-3d; }
.book-cover { transform-origin: left center; backface-visibility: hidden; }
.norn-threads path { fill: none; vector-effect: non-scaling-stroke; stroke-dasharray: 1; }
.prelude { min-height: 100svh; display: grid; grid-template-columns: minmax(0, 1.35fr) minmax(280px, .65fr); }
.prelude-slogan h1 { font-size: clamp(5rem, 11vw, 11rem); line-height: .84; }
.home-project-movement { min-height: 140svh; }
.home-project-stage { position: sticky; top: 10vh; min-height: 80vh; }
```

The page background may use procedural grain but no repeated horizontal line background.

- [ ] **Step 4: Implement tablet and mobile rules**

At `max-width: 768px`, use a four-column content grid, `智绘 / 万物` wrapping, top-opening book transform, non-sticky product stages, vertical Hermes state and scrollable-inner BHMS chart. Enforce `max-width: 100%` and `min-width: 0` on grid children. At reduced motion, remove transition durations, show completed content and hide only the animated prelude overlay.

- [ ] **Step 5: Run CSS guard, unit suite and build**

```bash
npm run test:run -- src/app/globals.test.ts && npm run test:run && npm run lint && npm run typecheck && npm run build
```

Expected: all commands PASS and legacy selector guard is green.

**Checkpoint message:** `style: complete mythic responsive layout`

---

### Task 15: Add functional, accessibility and visual browser coverage

**Files:**
- Modify: `e2e/navigation.spec.ts`
- Modify: `e2e/hermes-demo.spec.ts`
- Modify: `e2e/bhms-demo.spec.ts`
- Modify: `e2e/visual.spec.ts`
- Modify: `playwright.config.ts`
- Update after visual inspection: `e2e/visual.spec.ts-snapshots/*.png`

- [ ] **Step 1: Add prelude session tests**

```ts
test("mythic prelude plays once per session and can be replayed", async ({ page }) => {
  await page.goto("/zh");
  await expect(page.locator(".mythic-book-prelude")).toBeVisible();
  await page.getByRole("button", { name: "跳过序章" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "智绘万物" })).toBeVisible();
  await page.reload();
  await expect(page.locator(".mythic-book-prelude")).toHaveCount(0);
  await page.getByRole("button", { name: "重播序章" }).click();
  await expect(page.locator(".mythic-book-prelude")).toBeVisible();
});
```

- [ ] **Step 2: Add reduced-motion and fallback tests**

```ts
test("reduced motion enters the completed book without waiting", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/zh");
  await expect(page.locator(".mythic-book-prelude")).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1, name: "智绘万物" })).toBeVisible();
  await expect(page.locator(".mythic-paper-fallback")).toBeVisible();
});
```

- [ ] **Step 3: Extend Hermes flow assertions**

After the guarded flow reaches commit, assert the visible product plate shows `External Effect: COMMITTED`, the system cutaway has seven nodes, and no private identity string is present in page text.

- [ ] **Step 4: Extend BHMS flow assertions**

Assert the workspace is visible before interaction, the lifecycle SVG has an accessible name, evidence precedes decision, and the result-boundary statement is visible.

- [ ] **Step 5: Add visual states**

Capture these deterministic states with reduced motion except where the animation state itself is under test:

```text
book-cover-desktop.png           1440×1000, animation paused at cover
book-opening-desktop.png         1440×1000, timeline progress at 0.48
home-mythic-desktop.png          1440×1000, completed
home-mythic-tablet.png           768×1024, completed
home-mythic-mobile.png           390×844, completed
hermes-product-desktop.png       1440×1000
hermes-system-desktop.png        1440×1000
bhms-workspace-desktop.png       1440×1000
bhms-evidence-desktop.png        1440×1000
```

Expose a test-only timeline handle only when `process.env.NODE_ENV === "test"` is insufficient for Playwright production bundles; instead support a URL query `?preludeFrame=cover|opening|complete` only when `NEXT_PUBLIC_VISUAL_TEST_MODE=1` is present at build/dev time. Do not expose arbitrary timeline seeking in normal builds.

Set the Playwright `webServer.command` to `NEXT_PUBLIC_VISUAL_TEST_MODE=1 npm run dev` so only the isolated
test server accepts these deterministic frame queries. Normal `npm run dev`, `npm run build` and
`npm run start` remain unaffected.

- [ ] **Step 6: Run Playwright red before updating snapshots**

```bash
PLAYWRIGHT_CHROME_EXECUTABLE="/Users/chris/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing" npm run test:e2e
```

Expected: functional tests PASS; visual tests FAIL only because new baselines do not exist or intentionally changed.

- [ ] **Step 7: Inspect actual images before accepting**

Use `view_image` on every actual screenshot. Check slogan hierarchy, book perspective, no staff background, product legibility, line continuity, Chinese wrapping, mobile overflow and case density. Fix source CSS/components before snapshot updates.

- [ ] **Step 8: Update and rerun visual baselines**

```bash
PLAYWRIGHT_CHROME_EXECUTABLE="/Users/chris/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing" npx playwright test e2e/visual.spec.ts --update-snapshots
PLAYWRIGHT_CHROME_EXECUTABLE="/Users/chris/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing" npm run test:e2e
```

Expected: all functional and visual tests PASS.

**Checkpoint message:** `test: cover mythic prelude and product visual journeys`

---

### Task 16: Final requirements audit and production verification

**Files:**
- Modify only files required by failures found in this task.
- Write generated Lighthouse JSON to `.artifacts/lighthouse-mythic.json`.

- [ ] **Step 1: Search for forbidden legacy visual language**

```bash
rg -n "score-staff|prelude-staff|movement-notation|SystemUniverse|Sparkles|icosahedron|sphereGeometry|demo-shell|project-shell|chapter-rail|contact-pill|atlas-grid|#050706|#53f4ff|#ffb35a|bloom|particle|neon" src --glob '!**/*.test.*'
```

Expected: no matches.

- [ ] **Step 2: Verify animation ownership**

```bash
rg -n "scrollTrigger" src
```

Expected: one home owner in `HomeExperience.tsx` and one case owner in `CaseShell.tsx`; no child visual component creates ScrollTrigger.

- [ ] **Step 3: Run the complete local verification chain**

```bash
npm run test:run && npm run lint && npm run typecheck && npm run build
```

Expected: zero failed tests, zero lint errors, zero type errors, successful static build for `/zh`, `/en` and four case routes.

- [ ] **Step 4: Run all browser tests**

```bash
PLAYWRIGHT_CHROME_EXECUTABLE="/Users/chris/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing" npm run test:e2e
```

Expected: all Playwright functional and visual tests PASS.

- [ ] **Step 5: Run Lighthouse gates**

Start the verified build in a separate terminal/session with `npm run start`, wait until
`http://localhost:3000/zh` responds, then run:

```bash
mkdir -p .artifacts
npx --yes lighthouse http://localhost:3000/zh \
  --chrome-path="/Users/chris/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing" \
  --only-categories=accessibility,seo \
  --output=json \
  --output-path=.artifacts/lighthouse-mythic.json \
  --quiet \
  --chrome-flags="--headless --no-sandbox"
node -e "const r=require('./.artifacts/lighthouse-mythic.json'); const s={accessibility:Math.round(r.categories.accessibility.score*100),seo:Math.round(r.categories.seo.score*100)}; console.log(s); if(s.accessibility<95||s.seo<95)process.exit(1)"
```

Expected: Accessibility ≥ 95 and SEO ≥ 95.

- [ ] **Step 6: Verify the approved requirements manually**

Confirm all of the following against the browser and source:

```text
智绘万物 is the first visual subject.
The author name is a small byline only.
The full staff background is absent.
The book prelude plays once per session and is skippable/replayable.
The three Norn threads retain past/present/future meaning.
Hermes visibly demonstrates product, state guard, architecture and commit.
BHMS visibly demonstrates workspace, lifecycle prediction, evidence and decision basis.
No project claim exceeds the inspected source material.
Mobile has no document-level horizontal overflow.
Reduced motion and no-WebGL fallbacks remain readable.
No remote repository or deployment was created.
```

**Checkpoint message:** `chore: verify mythic immersive portfolio redesign`
