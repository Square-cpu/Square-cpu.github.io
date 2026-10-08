import { test, expect } from '@playwright/test';
import process from 'node:process';
import { experienceEntries } from '../src/data/experiences';
import { recognitionEntries } from '../src/data/recognition';
import { openingCopy } from '../src/data/opening';

const base = (process.env.BASE_PATH || '').replace(/\/$/, '');
const origin = process.env.SITE_URL || 'https://square-cpu.github.io';
const route = (path: string) => `${base}${path}`;
const folder = `artifacts/phase-3_5${base ? '/base' : ''}`;
const projects = [
  ['wfc-procedural-generator', 'WFC Procedural Generator'],
  ['tks-un-consulting', 'Pasture Intelligence'],
  ['motion-lab', 'Motion Lab'],
  ['enem-prep-platform', 'ENEM Prep Platform'],
  ['asteroid-watchers', 'Asteroid Watchers'],
  ['behring-ifood-hackathon', 'iFood Hackathon'],
] as const;
const destinations = [
  ['about', '/about/'], ['projects', '/projects/'], ['experiences', '/experiences/'],
  ['awards', '/awards/'], ['playground', '/playground/'],
  ...projects.map(([slug]) => [slug, `/projects/${slug}/`]),
];

test('About reuses approved copy and exposes one shared contact group', async ({ page }) => {
  await page.goto(route('/about/'));
  for (const copy of [openingCopy.aboutHeading, openingCopy.aboutIntroduction, openingCopy.aboutSupporting]) {
    await expect(page.locator('main')).toContainText(copy);
  }
  await expect(page.locator('main .contact-links')).toHaveCount(0);
  await expect(page.getByRole('contentinfo').getByRole('link')).toHaveCount(3);
  for (const name of ['GitHub', 'LinkedIn', 'YouTube']) {
    await expect(page.getByRole('link', { name: `${name} (external destination)`, exact: true })).toHaveCount(1);
  }
});

test('Experiences renders all verified records and keeps Hotel de Hilbert an experience', async ({ page }) => {
  await page.goto(route('/experiences/'));
  await expect(page.locator('[data-experience]')).toHaveCount(experienceEntries.length);
  for (const entry of experienceEntries) {
    const record = page.locator(`[data-experience="${entry.id}"]`);
    await expect(record.getByRole('heading', { level: 2 })).toHaveText(entry.title);
    await expect(record).toContainText(entry.summary);
    if (entry.period) await expect(record).toContainText(entry.period);
    for (const highlight of entry.highlights ?? []) await expect(record).toContainText(highlight);
  }
  await expect(page.locator('[data-experience="pic-jr"]')).toContainText('8th Encontro do Hotel de Hilbert');
});

test('Awards preserves every result, qualification, and absent date', async ({ page }) => {
  await page.goto(route('/awards/'));
  await expect(page.locator('[data-award]')).toHaveCount(recognitionEntries.length);
  await expect(page.locator('main h2')).toHaveCount(new Set(recognitionEntries.map(entry => entry.category)).size);
  for (const entry of recognitionEntries) {
    const record = page.locator(`[data-award="${entry.id}"]`);
    await expect(record.getByRole('heading', { level: 3 })).toHaveText(entry.name);
    if (entry.fullName) await expect(record).toContainText(entry.fullName);
    const results = record.locator('li');
    await expect(results).toHaveCount(entry.results.length);
    for (const [index, result] of entry.results.entries()) {
      await expect(results.nth(index).locator('strong')).toHaveText(result.result);
      await expect(results.nth(index).locator('.award-date')).toHaveText(String(result.year ?? result.period ?? 'Year not recorded'));
      for (const detail of [result.level, result.project, result.detail].filter(Boolean) as string[]) {
        await expect(results.nth(index)).toContainText(detail);
      }
    }
  }
  await expect(page.locator('[data-award="obi"]')).toContainText('30th nationally in the 2024 Programming Level 1 final ranking.');
  await expect(page.locator('main')).not.toContainText('Hotel de Hilbert');
});

test('Playground is intentionally unfinished without invented project entries', async ({ page }) => {
  await page.goto(route('/playground/'));
  await expect(page.locator('main')).toContainText('experiments, animation, drawings, procedural systems');
  await expect(page.locator('main')).toContainText('More experiments coming soon.');
  await expect(page.locator('main article, main img, main video')).toHaveCount(0);
});

for (const [slug, title] of projects) {
  test(`public project page: ${slug}`, async ({ page, request }) => {
    const response = await page.goto(route(`/projects/${slug}/`));
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(title);
    await expect(page.locator('.project-body')).toHaveText('Detailed case study coming soon. I’m still documenting the process behind this project.');
    await expect(page.getByRole('link', { name: 'Back to Projects' })).toHaveAttribute('href', route('/projects/'));
    const image = page.locator('main img');
    await expect(image).toHaveCount(1);
    await expect(image).toHaveAttribute('alt', /\S.{15,}/);
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
    const sources = await image.evaluate((element: HTMLImageElement) => [element.src, ...element.srcset.split(',').map(source => new URL(source.trim().split(/\s+/)[0], location.href).href)]);
    for (const source of new Set(sources)) {
      expect(new URL(source).pathname).toMatch(new RegExp(`^${base}/_astro/`));
      expect(source).not.toContain('artifacts');
      expect((await request.get(source)).ok()).toBe(true);
    }
  });
}

for (const [name, path] of destinations) {
  test(`public content, metadata, and review captures: ${path}`, async ({ page }) => {
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      expect((await page.goto(route(path)))?.status()).toBe(200);
      await page.evaluate(() => document.fonts.ready);
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      await expect(page.locator('main')).not.toContainText(/TODO|placeholder|To be added|To add|Content to come|dates unconfirmed/i);
      await expect(page).not.toHaveTitle(/^Arthur Milander$/);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${origin}${route(path)}`);
      await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', `${origin}${route(path)}`);
      await expect(page.locator('a[href^="mailto:"], a[href^="tel:"]')).toHaveCount(0);
      for (const image of await page.locator('main img').all()) {
        await image.scrollIntoViewIfNeeded();
        await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({ path: `${folder}/${name}-${width}.png`, fullPage: true });
    }
  });
}

test('dedicated pages keep mobile keyboard navigation, focus, and reduced motion', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const [, path] of destinations) {
    await page.goto(route(path));
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  const trigger = page.locator('#index-trigger');
  await trigger.focus();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog', { name: 'Site index' });
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveCSS('animation-name', 'none');
  await expect(page.getByRole('button', { name: 'Close site index' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveCSS('outline-style', 'solid');
  await trigger.click();
  await dialog.getByRole('link', { name: 'Awards', exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`${base}/awards/$`));
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Awards');
});
