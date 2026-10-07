import { test, expect } from '@playwright/test';
import process from 'node:process';
import type { CollectionEntry } from 'astro:content';
import { selectFeaturedProjects } from '../src/lib/project-selection';

const base = (process.env.BASE_PATH || '').replace(/\/$/, '');
const route = (path = '/') => `${base}${path}`;
const folder = 'artifacts/phase-2c';
const expectedProjects = [
  ['wfc-procedural-generator', 'WFC Procedural Generator'],
  ['tks-un-consulting', 'TKS / UN Consulting Challenge'],
  ['motion-lab', 'Motion Lab'],
  ['enem-prep-platform', 'ENEM Prep Platform / Startup'],
  ['asteroid-watchers', 'NASA Space Apps Challenge — Asteroid Watchers'],
  ['behring-ifood-hackathon', 'Behring Academy Camp — iFood Hackathon project'],
];

test('featured selection excludes archive-only entries and drafts and respects editorial order', () => {
  const fixture = (title: string, featured: boolean, draft: boolean, featuredOrder?: number): CollectionEntry<'projects'> => ({
    id: title, collection: 'projects', data: { title, summary: 'Test fixture', featured, draft, featuredOrder, categories: [], technologies: [], links: [] },
  });
  const projects = [fixture('Z', true, false, 2), fixture('Archive entry', false, false, 0), fixture('Draft', true, true, 0), fixture('First', true, false, 1), fixture('B', true, false), fixture('A', true, false)];
  const originalOrder = projects.map(project => project.id);
  expect(selectFeaturedProjects(projects).map(project => project.id)).toEqual(['First', 'Z', 'A', 'B']);
  expect(projects.map(project => project.id)).toEqual(originalOrder);
});

test(`selected entries, accessible titles, and links (base ${base || '/'})`, async ({ page }) => {
  await page.goto(route());
  const previews = page.locator('[data-context="selected"]');
  await expect(previews).toHaveCount(6);
  expect(await previews.evaluateAll(elements => elements.map(element => element.getAttribute('data-project')))).toEqual(expectedProjects.map(([id]) => id));
  for (const [index, [id, title]] of expectedProjects.entries()) {
    const preview = previews.nth(index);
    await expect(preview.getByRole('heading', { level: 3 })).not.toBeEmpty();
    const link = preview.getByRole('link', { name: `Open project: ${title}`, exact: true });
    await expect(link).toHaveAttribute('href', route(`/projects/${id}/`));
    await expect(preview.locator('.exhibit-meta')).toHaveText(`04.${index + 1}`);
    await expect(preview).not.toContainText('Year to be added');
    const response = await page.goto(await link.getAttribute('href') as string);
    expect(response?.status()).toBe(200);
    await page.goto(route());
  }
  await page.getByRole('link', { name: 'View all projects', exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`${base}/projects/$`));
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Projects');
  await expect(page.locator('.exhibit')).toHaveCount(0);
});

test('keyboard traversal reaches every preview and shows focus across its surface', async ({ page }) => {
  await page.goto(route());
  const links = page.locator('[data-context="selected"] h3 a');
  await page.getByRole('link', { name: 'More about me' }).focus();
  await page.keyboard.press('Tab');
  await expect(page.locator('summary')).toBeFocused();
  for (let index = 0; index < expectedProjects.length; index++) {
    await page.keyboard.press('Tab');
    await expect(links.nth(index)).toBeFocused();
    await expect(page.locator('[data-context="selected"]').nth(index)).toHaveCSS('outline-style', 'solid');
  }
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'View all projects', exact: true })).toBeFocused();
});

for (const width of [320, 360, 390, 430, 768, 1024, 1280, 1440, 1920]) {
  test(`exhibition composition at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width < 768 ? 800 : 900 });
    await page.goto(route());
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    const selected = page.locator('.selected-work');
    await selected.screenshot({ path: `${folder}/selected-work-${width}.png`, animations: 'disabled', style: '.site-header, .skip-link { visibility: hidden; }' });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `${folder}/home-${width}.png`, fullPage: true, animations: 'disabled' });
    const transition = await page.locator('.exploring').evaluate(element => element.getBoundingClientRect().bottom + window.scrollY - 240);
    await page.evaluate(y => window.scrollTo(0, y), transition);
    await page.screenshot({ path: `${folder}/transition-${width}.png`, animations: 'disabled' });
    for (const [id] of expectedProjects) {
      const preview = page.locator(`[data-project="${id}"]`);
      expect((await preview.boundingBox())!.width).toBeGreaterThan(100);
      await expect(preview.locator('figure')).toHaveAttribute('aria-hidden', 'true');
      await expect(preview.locator('figcaption')).toContainText('Abstract study');
    }
    if (width === 1440 || width === 320) {
      const first = page.locator('[data-context="selected"]').first();
      await first.locator('a').focus();
      await first.scrollIntoViewIfNeeded();
      await page.screenshot({ path: `${folder}/wfc-focus-${width}.png`, animations: 'disabled' });
      await first.locator('a').blur();
      await first.hover();
      await first.screenshot({ path: `${folder}/wfc-hover-${width}.png`, animations: 'disabled', style: '.site-header { visibility: hidden; }' });
    }
  });
}

test('reduced motion and touch retain usable previews', async ({ page, browser }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(route());
  const first = page.locator('[data-context="selected"]').first();
  await first.locator('a').focus();
  await expect(first.locator('svg')).toHaveCSS('transform', 'none');
  await expect(first.locator('svg')).toHaveCSS('transition-duration', '0s');
  await expect(first.locator('.exhibit-arrow')).toHaveCSS('transform', 'none');
  const context = await browser.newContext({ hasTouch: true, isMobile: true, viewport: { width: 320, height: 640 } });
  const touchPage = await context.newPage();
  await touchPage.goto(`http://127.0.0.1:4321${route()}`);
  const media = touchPage.locator('[data-context="selected"] .exhibit-media').first();
  await media.scrollIntoViewIfNeeded();
  const bounds = (await media.boundingBox())!;
  // The title's stretched link intentionally covers the media; tap its visible center.
  await touchPage.touchscreen.tap(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
  await expect(touchPage).toHaveURL(/\/projects\/wfc-procedural-generator\/$/);
  await context.close();
});
