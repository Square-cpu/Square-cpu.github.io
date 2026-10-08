import { test, expect } from '@playwright/test';
import process from 'node:process';
import { openingCopy } from '../src/data/opening';

const base = (process.env.BASE_PATH || '').replace(/\/$/, '');
const route = `${base}/`;
const folder = `artifacts/phase-3ab${base ? '/base' : ''}`;
const cropStyle = '.site-header, .skip-link { visibility: hidden; }';
const summaries = [
  'A directed Wave Function Collapse system for generating 3D environments from local edge and socket constraints.',
  'A geospatial machine-learning pipeline using satellite imagery to detect cattle camps and model possible movement routes in South Sudan.',
  'An interactive tool for studying animation timing and spacing through visual experimentation.',
  'A full-stack study platform for creating and taking ENEM-style mock exams and tracking performance.',
  'An interactive asteroid explorer and impact simulator combining NASA near-Earth-object data, procedural 3D generation, and planetary-defense scenarios.',
  'A 1st-place hackathon project using customer-behavior data and machine learning to recommend more appropriate coupons.',
];

test('supplied homepage copy replaces current-interest and selected-project placeholders', async ({ page }) => {
  await page.goto(route);
  await expect(page.locator('.hero')).toContainText(openingCopy.heroStatement);
  await expect(page.locator('.introduction-lead')).toHaveText(openingCopy.aboutIntroduction);
  await expect(page.locator('.introduction-support > p')).toHaveText(openingCopy.aboutSupporting);
  await expect(page.locator('.topic-name')).toHaveText(['Procedural Generation ·', 'Animation ·', 'Machine Learning']);
  await expect(page.locator('.exploring')).not.toContainText(/Creative coding/i);
  await expect(page.locator('.exhibit-summary')).toHaveText(summaries);
  await expect(page.locator('.selected-work')).not.toContainText(/TODO|Abstract study|media to come/);
});

test('responsive images, posters, and video paths resolve under the deployment base', async ({ page, request }) => {
  await page.goto(route);
  const previews = page.locator('[data-context="selected"]');
  await expect(previews.locator('.project-media')).toHaveCount(6);
  await expect(previews.getByRole('img')).toHaveCount(5);
  await expect(previews.locator('video')).toHaveCount(1);
  const urls = await previews.evaluateAll(elements => elements.flatMap(element => {
    const image = element.querySelector('img')!;
    const video = element.querySelector('video');
    return [image.src, ...image.srcset.split(',').map(candidate => new URL(candidate.trim().split(/\s+/)[0], location.href).href), ...(video ? [new URL(video.dataset.src!, location.href).href, new URL(video.dataset.poster!, location.href).href] : [])];
  }));
  for (const url of new Set(urls)) {
    expect(new URL(url).pathname).toMatch(new RegExp(`^${base}/(?:_astro|media)/`));
    expect(url).not.toContain('artifacts');
    const response = await request.get(url);
    expect(response.ok(), url).toBe(true);
  }
  for (const image of await previews.locator('img').all()) {
    await expect(image).toHaveAttribute('loading', 'lazy');
    await expect(image).toHaveAttribute('width', /[1-9]\d*/);
    await expect(image).toHaveAttribute('height', /[1-9]\d*/);
    await expect(image).toHaveAttribute('srcset', /\d+w/);
  }
});

test('video loads only on visibility, can be paused, and follows live motion preferences', async ({ page }) => {
  await page.goto(route);
  const preview = page.locator('[data-project-video]');
  const video = page.locator('[data-project-video] video');
  await expect(video).not.toHaveAttribute('src');
  await expect(video).not.toHaveAttribute('autoplay');
  await preview.scrollIntoViewIfNeeded();
  await expect.poll(() => video.evaluate((el: HTMLVideoElement) => !el.paused && el.currentTime > 0)).toBe(true);
  expect(await video.evaluate((el: HTMLVideoElement) => el.muted && el.loop && el.playsInline)).toBe(true);
  await page.getByRole('button', { name: 'Pause Motion Lab preview' }).click();
  await expect.poll(() => video.evaluate((el: HTMLVideoElement) => el.paused)).toBe(true);
  await page.locator('.hero').scrollIntoViewIfNeeded();
  await preview.scrollIntoViewIfNeeded();
  await expect(page.getByRole('button', { name: 'Play Motion Lab preview' })).toBeVisible();
  await page.getByRole('button', { name: 'Play Motion Lab preview' }).click();
  await expect.poll(() => video.evaluate((el: HTMLVideoElement) => !el.paused)).toBe(true);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect.poll(() => video.evaluate((el: HTMLVideoElement) => el.paused && !el.loop && !el.autoplay)).toBe(true);
  await expect(page.locator('.video-poster')).toBeVisible();
});

test('reduced motion and no-JavaScript visitors receive a stable real poster', async ({ page, browser, baseURL }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(route);
  const preview = page.locator('[data-project-video]');
  await preview.scrollIntoViewIfNeeded();
  await expect(preview.locator('video')).not.toHaveAttribute('src');
  await expect(preview.locator('video')).not.toHaveAttribute('autoplay');
  await expect(preview.locator('video')).not.toHaveAttribute('loop');
  await expect(preview.locator('.video-poster')).toBeVisible();
  await preview.screenshot({ path: `${folder}/motion-lab-poster-1440.png`, style: cropStyle });
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  const staticPage = await context.newPage();
  await staticPage.goto(route);
  await expect(staticPage.locator('.video-poster')).toBeVisible();
  await expect(staticPage.locator('.preview-toggle')).toBeHidden();
  await expect(staticPage.locator('[data-project-video] video')).not.toHaveAttribute('src');
  await context.close();
});

for (const width of [320, 360, 390, 430, 768, 1024, 1280, 1440, 1920]) {
  test(`real homepage media at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const selected = page.locator('.selected-work');
    for (const image of await selected.locator('img').all()) {
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
    }
    await selected.screenshot({ path: `${folder}/selected-work-${width}.png`, style: cropStyle });
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: `${folder}/home-${width}.png`, fullPage: true });
    if (width === 1440) {
      for (const [id, filename] of [
        ['wfc-procedural-generator', 'wfc'], ['tks-un-consulting', 'pasture'], ['motion-lab', 'motion-lab'],
        ['enem-prep-platform', 'enem'], ['asteroid-watchers', 'asteroid-watchers'], ['behring-ifood-hackathon', 'ifood'],
      ]) await page.locator(`[data-project="${id}"]`).screenshot({ path: `${folder}/${filename}-1440.png`, style: cropStyle });
      const exploring = page.locator('.exploring');
      await exploring.screenshot({ path: `${folder}/exploring-collapsed-1440.png`, style: cropStyle });
      await exploring.locator('summary').click();
      await exploring.screenshot({ path: `${folder}/exploring-expanded-1440.png`, style: cropStyle });
    }
  });
}
