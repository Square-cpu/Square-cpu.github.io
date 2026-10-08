import { defineConfig } from '@playwright/test';
import process from 'node:process';
const port = process.env.PLAYWRIGHT_PORT || '4321';

export default defineConfig({
  testDir: './tests',
  outputDir: './artifacts/test-results',
  reporter: 'list',
  use: {
    baseURL: `http://127.0.0.1:${port}${process.env.BASE_PATH || ''}/`,
    browserName: 'chromium',
    // Use an installed browser locally, or Playwright's Chromium in CI.
    channel: process.env.PLAYWRIGHT_CHANNEL || undefined,
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: `npm run preview -- --host 127.0.0.1 --port ${port}`,
    url: `http://127.0.0.1:${port}${process.env.BASE_PATH || ''}/`,
    reuseExistingServer: false,
  },
});
