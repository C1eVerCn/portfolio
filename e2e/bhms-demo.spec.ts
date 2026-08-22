import { expect, test } from "@playwright/test";

test("BHMS builds evidence before the decision basis", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/zh/work/bhms#product");

  await expect(page.locator("#product .bhms-workspace-plate")).toBeVisible();
  await expect(
    page.locator("#lifecycle").getByRole("img", { name: /电池生命周期预测/ }),
  ).toBeVisible();

  const evidence = page.locator("#evidence");
  await expect(evidence.getByText("决策依据", { exact: true })).toHaveCount(0);
  await evidence.getByRole("button", { name: "分析电压偏差" }).click();
  await expect(evidence.getByText("证据链已生成")).toBeVisible();
  await expect(evidence.getByText("决策依据", { exact: true })).toHaveCount(0);

  await evidence.getByRole("button", { name: "查看决策依据" }).click();
  await expect(evidence.getByText("决策依据", { exact: true })).toBeVisible();
  await expect(evidence.getByText("优先安排检测")).toBeVisible();
  await expect(page.locator("#limits")).toContainText("不宣称 Hybrid 全面优于 BiLSTM");
});
