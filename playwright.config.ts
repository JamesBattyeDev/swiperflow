import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 10_000,
  retries: 0,
  use: {
    baseURL: 'http://localhost:4173',
    viewport: { width: 1280, height: 720 },
  },
  projects: [
    { name: 'chromium', use: { channel: 'chrome' } },
  ],
  webServer: {
    command: 'pnpm build && npx serve . -l 4173',
    port: 4173,
    reuseExistingServer: !process.env.CI,
  },
});
