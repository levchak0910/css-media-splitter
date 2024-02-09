import { defineConfig, devices } from "@playwright/test"

const url = "http://localhost:4172"

export default defineConfig({
  testMatch: "tests/**/*.visual.test.ts",
  fullyParallel: true,
  reporter: "list",
  use: {
    trace: "on-first-retry",
    baseURL: url,
  },
  projects: [
    { name: "chromium-small", use: { ...devices["Desktop Chrome"], viewport: { height: 100, width: 500 } } },
    { name: "chromium-medium", use: { ...devices["Desktop Chrome"], viewport: { height: 100, width: 1500 } } },
    { name: "chromium-large", use: { ...devices["Desktop Chrome"], viewport: { height: 100, width: 2500 } } },
  ],
  webServer: {
    command: "pnpm preview",
    url,
  },
})
