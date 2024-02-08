import { expect, test } from "@playwright/test"

test("match screenshot", async ({ page }) => {
  await page.goto("http://localhost:4172")
  await expect(page).toHaveScreenshot()
})
