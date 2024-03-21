import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./src",
  fullyParallel: true,
  reporter: [["html", { open: "never" }]],
  use: {
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], headless: false },
    },
  ],
});
