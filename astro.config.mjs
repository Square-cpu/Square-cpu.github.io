import { defineConfig } from 'astro/config';

// The intended user site lives at the root; environment overrides support local base-path checks.
export default defineConfig({
  site: process.env.SITE_URL || 'https://square-cpu.github.io',
  base: process.env.BASE_PATH || '/',
  output: 'static',
  trailingSlash: 'always',
});
