import { defineConfig } from '@playwright/test';
import process from 'node:process';

export default defineConfig({
  testDir: './tests',
  outputDir: './artifacts/test-results',
  reporter: 'list',
  use: {
    baseURL: `http://127.0.0.1:4321${process.env.BASE_PATH || ''}/`,
    browserName: 'chromium',
    // Use an installed browser locally, or Playwright's Chromium in CI.
    channel: process.env.PLAYWRIGHT_CHANNEL || undefined,
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1',
    url: `http://127.0.0.1:4321${process.env.BASE_PATH || ''}/`,
    reuseExistingServer: false,
  },
});
