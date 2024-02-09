import { expect, test } from "@playwright/test"

test("match screenshot", async ({ page }) => {
  await page.goto("/")
  await expect(page).toHaveScreenshot()
})
