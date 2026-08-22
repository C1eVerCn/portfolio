# Chromatic Less-is-More Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use subagent-driven-development (recommended) or executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the live portfolio as a modern, restrained, chromatic experience whose content remains visible and whose layout follows a 61.8/38.2 compositional system.

**Architecture:** Keep the existing Next.js, React, GSAP, Three.js, content, and case-study components. Refactor only the homepage composition, shared visual tokens, and scroll reveal orchestration; preserve project behavior and routes. CSS defines the chromatic system and responsive golden grid, while `HomeExperience` owns short section-local GSAP timelines.

**Tech Stack:** Next.js 16, React 19, TypeScript, vanilla CSS, GSAP/ScrollTrigger, R3F/Three.js, Vitest, Playwright, Docker Compose.

---

### Task 1: Lock the simplified hero contract

**Files:**
- Modify: `src/components/home/SloganPrelude.tsx`
- Modify: `src/components/home/HomeExperience.test.tsx`

- [ ] **Step 1: Write the failing structure test**

Add an assertion that `.prelude-folio` and `.prelude-byline` are absent, while the role, bilingual slogan, statement, and a `.prelude-scroll-cue` remain.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm run test:run -- src/components/home/HomeExperience.test.tsx`
Expected: FAIL because the old folio/byline still render and the scroll cue is missing.

- [ ] **Step 3: Simplify the component**

Remove the folio and byline markup. Add an accessible scroll cue using `content.hero.explore` and keep the existing `NornThreads` decoration.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run: `npm run test:run -- src/components/home/HomeExperience.test.tsx`
Expected: PASS.

### Task 2: Make scroll reveals local and fail-safe

**Files:**
- Modify: `src/components/home/HomeExperience.tsx`
- Modify: `src/components/home/HomeExperience.test.tsx`

- [ ] **Step 1: Add a reveal-contract unit test**

Export a `HOME_REVEAL_SELECTOR` constant equal to `[data-reveal]` and assert that the legacy document-length reveal target map is no longer required for content visibility.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm run test:run -- src/components/home/HomeExperience.test.tsx`
Expected: FAIL because the new constant and behavior are absent.

- [ ] **Step 3: Replace the global reveal timeline**

Keep the scene-state transitions in a page-level timeline, but create section-local GSAP reveal timelines with `ScrollTrigger.create({ trigger: section, start: "top 82%", once: true })`. Animate only descendants inside the entering section from `{ yPercent: 14, autoAlpha: 0 }` to `{ yPercent: 0, autoAlpha: 1 }`, immediately restoring visibility on cleanup and in reduced-motion mode.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run: `npm run test:run -- src/components/home/HomeExperience.test.tsx`
Expected: PASS.

### Task 3: Replace the paper tokens and hero layout

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Replace root color and type tokens**

Define `--aura: #afc7da`, `--teal: #0d6966`, `--melon: #e79061`, `--ink: #203044`, and `--ink-inverse: #e5eef2`. Point Chinese display headings to `var(--sans)` and increase the minimum body/label sizes.

- [ ] **Step 2: Implement the chromatic hero**

Use a full-width pseudo-element field split at `61.8%`, remove folio/byline styles, size the heading with `clamp(4.5rem, 9.2vw, 8.8rem)`, and place the statement/scroll cue in the 38.2% teal field.

- [ ] **Step 3: Recolor the book prelude**

Replace cream and old navy surfaces with the Aura/Teal/Muskmelon palette while retaining the existing 3D geometry and legible book inscriptions.

- [ ] **Step 4: Verify responsive layout manually**

Run the dev server and inspect 1440×1000, 768×1024, and 390×844. Expected: no horizontal overflow; hero fields stack below `768px`.

### Task 4: Recompose capability and project movements

**Files:**
- Modify: `src/app/globals.css`
- Verify: `src/components/home/CapabilityAtlas.tsx`
- Verify: `src/components/home/SelectedWork.tsx`

- [ ] **Step 1: Flatten the capability chain**

Remove the staircase margins and use one aligned editorial sequence with readable `0.92rem` supporting copy and strong `1.35–1.75rem` labels.

- [ ] **Step 2: Create full-bleed Hermes and BHMS fields**

Use Muskmelon/navy for Hermes and Teal/Aura for BHMS. Remove cream paper shadows around `.home-project-stage`, `.feishu-product-plate`, and `.bhms-workspace-plate`; integrate each visual into its movement field.

- [ ] **Step 3: Increase technical diagram legibility**

Raise interface labels below `0.72rem`, strengthen data-line contrast, and keep the compact diagrams within their existing component APIs.

- [ ] **Step 4: Verify interactions**

Exercise Hermes system layers, BHMS evidence nodes, language switch, case links, and focus view. Expected: all existing interactions remain functional.

### Task 5: Align principles, cases, and mobile styles

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Apply the modern sans hierarchy to shared case headings**

Replace Chinese serif headings in case heroes, component titles, principle rows, and coda with `var(--sans)` at weights `650–800`.

- [ ] **Step 2: Replace paper-card surfaces with tinted chromatic surfaces**

Use tonal Aura/Teal/Muskmelon fields and hue-matched shadows. Keep one accent per component and preserve WCAG AA contrast.

- [ ] **Step 3: Harden tablet and mobile breakpoints**

Collapse golden grids, remove sticky project stages, keep minimum text sizes, and ensure every technical visualization stays inside the viewport.

### Task 6: Verify, rebuild Docker, and inspect the live site

**Files:**
- Update baselines only after visual inspection: `e2e/visual.spec.ts-snapshots/*.png`
- Verify: `Dockerfile`, `compose.yaml`

- [ ] **Step 1: Run static and unit verification**

Run: `npm run lint && npm run typecheck && npm run test:run && npm run build`
Expected: all commands pass.

- [ ] **Step 2: Run browser flows**

Run: `npm run test:e2e`
Expected: functional tests pass; visual snapshots fail only where the intentional redesign changed pixels.

- [ ] **Step 3: Capture and inspect fresh screenshots**

Capture the homepage and both project sections at desktop, tablet, and mobile sizes. Reject any result with clipped text, single-word Chinese lines, over-dense color, or hidden reveal content.

- [ ] **Step 4: Accept reviewed visual baselines**

Run: `npm run test:e2e -- --update-snapshots`
Expected: updated snapshots match the reviewed redesign.

- [ ] **Step 5: Rebuild the persistent container**

Run: `docker compose up --build -d`
Expected: `chen-yihang-portfolio` is `Up` with port `3000` mapped.

- [ ] **Step 6: Verify live routes**

Run HTTP checks for `/zh`, `/en`, `/zh/work/hermes`, and `/zh/work/bhms`.
Expected: all return HTTP 200 and `/zh` contains the title `谌一航 — AI 全栈工程师`.
