import { expect, test } from "@playwright/test";

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

test("reduced motion enters the completed book without waiting", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/zh");

  await expect(page.locator(".mythic-book-prelude")).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1, name: "智绘万物" })).toBeVisible();
  await expect(page.locator(".mythic-paper-fallback")).toBeVisible();
  await expect(page.locator(".scene-canvas")).toHaveCount(0);
});

test("language switching preserves the page and document language", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/zh");
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
  await expect(page.getByRole("heading", { level: 1, name: "智绘万物" })).toBeVisible();

  await page.getByRole("link", { name: "EN", exact: true }).click();
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 1, name: "Intelligence Shapes Everything" })).toBeVisible();
});

test("mobile home has no horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/zh?preludeFrame=complete");

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBe(0);
});

test("fermata focus is keyboard escapable and restores focus", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/zh/work/hermes#execution");

  const focusButton = page.getByRole("button", { name: "进入 fermata 专注阅读" });
  await focusButton.click();
  await expect(page.locator("body")).toHaveClass(/fermata-focus/);
  await expect(page.locator(".measure-index")).toHaveCSS("pointer-events", "none");
  await expect(page.getByRole("button", { name: "退出 fermata 专注阅读" })).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(page.locator("body")).not.toHaveClass(/fermata-focus/);
  await expect(focusButton).toBeFocused();
});

test("direct chapter hash exposes readable static mythic paper", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/zh/work/bhms#model");

  await expect(page.locator("#model")).toBeVisible();
  await expect(page.locator(".mythic-paper-fallback")).toBeVisible();
  await expect(page.locator(".scene-canvas")).toHaveCount(0);
});
