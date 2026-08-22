import { expect, test } from "@playwright/test";

test("Hermes reaches commit only through the guarded flow", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/zh/work/hermes#execution");

  const execution = page.locator("#execution");
  await execution.getByRole("button", { name: "选择 MaaS 平台" }).click();
  await expect(execution.getByText(/缺少时间范围/)).toBeVisible();
  await execution.getByRole("button", { name: "补充时间范围" }).click();
  await execution.getByRole("button", { name: "选择脱敏车辆 E-17" }).click();
  await execution.getByRole("button", { name: "填写任务与地点" }).click();
  await execution.getByRole("button", { name: "执行 dry-run" }).click();
  await execution.getByRole("button", { name: "确认预订" }).click();

  await expect(execution.getByText("参数再次比对后执行确定性 commit。")).toBeVisible();
  await expect(execution.getByText("External Effect: COMMITTED")).toBeVisible();
  await expect(execution.locator(".feishu-product-plate")).toHaveAttribute(
    "data-plate-state",
    "committed",
  );

  const system = page.locator("#system");
  await expect(system.locator("[data-hermes-layer]")).toHaveCount(7);
  const pageText = await page.locator("body").innerText();
  expect(pageText).not.toMatch(/open_id\s*[:=]|emailAddress\s*[:=]|ou_[A-Za-z0-9]+/);
});
