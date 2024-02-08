import { expect, test } from "@playwright/test"

test("match screenshot", async ({ page }) => {
  await page.goto("http://localhost:8080")
  await expect(page).toHaveScreenshot()
})
