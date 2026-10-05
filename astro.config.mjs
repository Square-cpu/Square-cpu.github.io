import { defineConfig } from 'astro/config';

// Leave the production origin unset until the actual GitHub Pages URL is known.
export default defineConfig({
  site: process.env.SITE_URL || undefined,
  base: process.env.BASE_PATH || '/',
  output: 'static',
  trailingSlash: 'always',
});
