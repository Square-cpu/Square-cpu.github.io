import { test, expect } from '@playwright/test';
import process from 'node:process';
import { experienceEntries, getFeaturedExperiences } from '../src/data/experiences';
import { recognitionEntries, getFeaturedRecognition } from '../src/data/recognition';

const base = (process.env.BASE_PATH || '').replace(/\/$/, '');
const folder = `artifacts/phase-3cd${base ? '/base' : ''}`;
const contacts = [
  ['GitHub', 'https://github.com/Square-cpu'],
  ['LinkedIn', 'https://www.linkedin.com/in/arthur-milander/'],
  ['YouTube', 'https://www.youtube.com/@Square_SQ'],
] as const;
const experiences = [
  ['Behring Academy', '2024 — 2026', 'A multi-year technology program and community where I grew through programming, mathematics, projects, competitive programming, mentoring, and annual university camps.'],
  ['The Knowledge Society (TKS)', '2025 — 2026', 'A 10-month global program that pushed me into unfamiliar technologies, real-world challenges, expert outreach, presentations, and building with students around the world.'],
  ['Future Lab', '2026', 'A creative technology experience centered on animation, where I built Motion Lab to explore timing and spacing and iterated through feedback from working professionals.'],
] as const;

test('featured content selection excludes future records, respects order, and preserves source arrays', () => {
  const experienceSource = [...experienceEntries].reverse();
  const originalExperiences = [...experienceSource];
  expect(getFeaturedExperiences(experienceSource).map(entry => entry.id)).toEqual(['behring-academy', 'tks', 'future-lab']);
  expect(experienceSource).toEqual(originalExperiences);
  const recognitionSource = [...recognitionEntries].reverse();
  const originalRecognition = [...recognitionSource];
  expect(getFeaturedRecognition(recognitionSource).map(entry => entry.id)).toEqual(['obi', 'obmep', 'nasa-space-apps', 'oboi', 'onc']);
  expect(recognitionSource).toEqual(originalRecognition);
  for (const id of ['ufu-math-marathon', 'ccl']) {
    expect(recognitionEntries.find(entry => entry.id === id)!.results[0].year).toBeUndefined();
  }
  expect(recognitionEntries.flatMap(entry => [entry.name, ...entry.results.map(result => result.result)]).join(' ')).not.toContain('Hotel de Hilbert');
  expect(experienceEntries.find(entry => entry.id === 'pic-jr')!.highlights!.join(' ')).toContain('Hotel de Hilbert');
  expect(recognitionEntries.find(entry => entry.id === 'obmep')!.results).toContainEqual({ result: 'Bronze', year: 2023, level: 'Regional' });
});

test('exact supplied experience copy and five compact recognition groups appear on the homepage', async ({ page }) => {
  await page.goto(`${base}/`);
  const entries = page.locator('.journey-path li');
  await expect(entries).toHaveCount(3);
  for (const [index, [title, period, summary]] of experiences.entries()) {
    await expect(entries.nth(index).locator('h3')).toHaveText(title);
    await expect(entries.nth(index).locator('.journey-date')).toHaveText(period);
    await expect(entries.nth(index).locator('.journey-entry p')).toHaveText(summary);
  }
  await expect(page.locator('.experience-preview')).not.toContainText('PIC Jr.');
  const rows = page.locator('.recognition-record tbody tr');
  await expect(rows).toHaveCount(5);
  expect(await rows.evaluateAll(elements => elements.map(element => element.getAttribute('data-recognition')))).toEqual(['obi', 'obmep', 'nasa-space-apps', 'oboi', 'onc']);
  const obi = page.locator('[data-recognition="obi"]');
  await expect(obi).toContainText('Bronze 2024 · 30th nationally in Programming Level 1');
  await expect(obi).toContainText('HM 2023');
  await expect(page.locator('[data-recognition="obmep"]')).toContainText('HM 2022, 2024, 2025');
  await expect(page.locator('[data-recognition="obmep"]')).not.toContainText('Regional');
  await expect(page.locator('[data-recognition="nasa-space-apps"]')).toContainText('Global Nominee 2025');
  await expect(page.locator('[data-recognition="nasa-space-apps"]')).toContainText('Asteroid Watchers');
  await expect(page.locator('[data-recognition="oboi"]')).toContainText('Silver 2025 · Bronze 2024');
  await expect(page.locator('[data-recognition="onc"]')).toContainText('Bronze 2022, 2023');
  for (const selector of ['.experience-preview', '.recognition-preview', '.home-footer']) {
    await expect(page.locator(selector)).not.toContainText(/TODO|To add|unconfirmed|to be confirmed|to come/i);
  }
});

test('shared public contacts have exact URLs, decorative icons, and no private destinations', async ({ page }) => {
  await page.goto(`${base}/`);
  const footer = page.locator('.footer-contact-list');
  await expect(footer.getByRole('link')).toHaveCount(3);
  for (const [label, url] of contacts) {
    const link = footer.getByRole('link', { name: `${label} (external destination)`, exact: true });
    await expect(link).toHaveAttribute('href', url);
    await expect(link).not.toHaveAttribute('target', '_blank');
    await expect(link.locator('svg')).toHaveAttribute('aria-hidden', 'true');
    await expect(link.locator('svg')).toHaveAttribute('focusable', 'false');
    await expect(link.getByRole('img')).toHaveCount(0);
    await expect(link.locator('svg title')).toHaveCount(0);
  }
  await expect(page.locator('a[href^="mailto:"], a[href^="tel:"], a[href*="instagram.com"], a[href*="substack.com"]')).toHaveCount(0);
  await expect(page.locator('.home-footer')).not.toContainText('Email');
  await page.getByRole('button', { name: 'INDEX', exact: true }).click();
  const dialog = page.getByRole('dialog');
  for (const [label, url] of contacts) await expect(dialog.getByRole('link', { name: `${label} (external destination)`, exact: true })).toHaveAttribute('href', url);
  await page.keyboard.press('Escape');
  await page.goto(`${base}/about/`);
  for (const [label, url] of contacts) await expect(page.locator('main').getByRole('link', { name: `${label} (external destination)`, exact: true })).toHaveAttribute('href', url);
});

test('footer links remain keyboard usable and comfortably sized at 320px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(`${base}/`);
  await page.getByRole('link', { name: 'View recognition', exact: true }).focus();
  for (const [label] of contacts) {
    await page.keyboard.press('Tab');
    const link = page.locator('.footer-contact-list').getByRole('link', { name: `${label} (external destination)`, exact: true });
    await expect(link).toBeFocused();
    await expect(link).toHaveCSS('outline-style', 'solid');
    const box = (await link.boundingBox())!;
    expect(box.height).toBeGreaterThanOrEqual(44);
    expect(box.x).toBeGreaterThanOrEqual(5);
    expect(box.x + box.width + 5).toBeLessThanOrEqual(320);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

for (const width of [320, 390, 768, 1024, 1440, 1920]) {
  test(`populated lower homepage at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(`${base}/`);
    await page.evaluate(() => document.fonts.ready);
    for (const image of await page.locator('.selected-work img').all()) {
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    for (const [name, selector] of [['experience', '.experience-preview'], ['recognition', '.recognition-preview'], ['footer', '.home-footer']]) {
      await page.locator(selector).screenshot({ path: `${folder}/${name}-${width}.png`, style: '.site-header, .skip-link { visibility: hidden; }' });
    }
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: `${folder}/home-${width}.png`, fullPage: true });
  });
}
