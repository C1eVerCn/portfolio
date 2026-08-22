import { expect, test, type Locator, type Page } from "@playwright/test";

const screenshotOptions = {
  animations: "disabled",
  caret: "hide",
  scale: "css",
  maxDiffPixelRatio: 0.002,
} as const;

async function settleVisual(page: Page, ready: Locator) {
  await expect(ready).toBeVisible();
  await ready.scrollIntoViewIfNeeded();
  await page.evaluate(() => document.fonts.ready);
}

test("book cover visual — desktop", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/zh?preludeFrame=cover");
  const prelude = page.locator(".mythic-book-prelude[data-prelude-state='cover']");
  await settleVisual(page, prelude);
  await expect(page).toHaveScreenshot("book-cover-desktop.png", screenshotOptions);
});

test("book opening visual — desktop", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/zh?preludeFrame=opening");
  const prelude = page.locator(".mythic-book-prelude[data-prelude-state='opening']");
  await settleVisual(page, prelude);
  await expect(page).toHaveScreenshot("book-opening-desktop.png", screenshotOptions);
});

const completedHomeViewports = [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 844 },
] as const;

for (const viewport of completedHomeViewports) {
  test(`completed mythic home visual — ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/zh?preludeFrame=complete");
    await settleVisual(page, page.getByRole("heading", { level: 1, name: "智绘万物" }));
    await expect(page).toHaveScreenshot(`home-mythic-${viewport.name}.png`, screenshotOptions);
  });
}

test("Hermes product visual — desktop", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/zh/work/hermes#product");
  const product = page.locator("#product .feishu-product-plate");
  await settleVisual(page, product);
  await expect(product).toHaveScreenshot("hermes-product-desktop.png", screenshotOptions);
});

test("Hermes system visual — desktop", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/zh/work/hermes#system");
  const system = page.locator("#system .hermes-system-cutaway");
  await settleVisual(page, system);
  await expect(system).toHaveScreenshot("hermes-system-desktop.png", screenshotOptions);
});

test("BHMS workspace visual — desktop", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/zh/work/bhms#product");
  const workspace = page.locator("#product .bhms-workspace-plate");
  await settleVisual(page, workspace);
  await expect(workspace).toHaveScreenshot("bhms-workspace-desktop.png", screenshotOptions);
});

test("BHMS evidence visual — desktop", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/zh/work/bhms#evidence");
  const evidence = page.locator("#evidence .bhms-evidence-graph");
  await evidence.getByRole("button", { name: "分析电压偏差" }).click();
  await evidence.getByRole("button", { name: "查看决策依据" }).click();
  await settleVisual(page, evidence.getByText("优先安排检测"));
  await expect(evidence).toHaveScreenshot("bhms-evidence-desktop.png", screenshotOptions);
});
