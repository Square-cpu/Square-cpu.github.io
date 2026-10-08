import { test, expect } from '@playwright/test';
import process from 'node:process';
import { site } from '../src/data/site';
import { experiencePreview } from '../src/data/experiences';
import { getFeaturedRecognition } from '../src/data/recognition';

const base = (process.env.BASE_PATH || '').replace(/\/$/, '');
const route = (path = '/') => `${base}${path}`;
const folder = 'artifacts/phase-2d';
const cropStyle = '.site-header, .skip-link { visibility: hidden; }';
const destinations = [
  ['Explore experiences', '/experiences/', 'Experiences'],
  ['Visit the playground', '/playground/', 'Playground'],
  ['View recognition', '/awards/', 'Awards'],
] as const;

for (const [label, path, title] of destinations) {
  test(`${label} uses the deployment base and opens its existing page`, async ({ page }) => {
    await page.goto(route());
    const link = page.getByRole('link', { name: label, exact: true });
    await expect(link).toHaveAttribute('href', route(path));
    await link.click();
    await expect(page).toHaveURL(new RegExp(`${base}${path}$`));
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(title);
    await expect(page.locator('.home-footer')).toHaveCount(0);
  });
}

test('lower-page records and contact values come from supplied data', async ({ page }) => {
  await page.goto(route());
  const experience = page.locator('.experience-preview');
  await expect(experience).not.toContainText(/TODO|to add|to be confirmed/i);
  await expect(experience.locator('li')).toHaveCount(experiencePreview.length);
  for (const entry of experiencePreview) {
    await expect(experience).toContainText(entry.title);
    await expect(experience).toContainText(entry.period!);
    await expect(experience).toContainText(entry.summary);
  }
  await expect(page.locator('.recognition-record tbody tr')).toHaveCount(getFeaturedRecognition().length);
  await expect(page.locator('.recognition-preview')).not.toContainText(/TODO|to add|to come/i);
  const contacts = page.locator('.footer-contact-list');
  await expect(contacts.locator('li')).toHaveCount(3);
  expect(await contacts.locator('a').evaluateAll(links => links.map(link => link.getAttribute('href')))).toEqual(site.contactLinks.map(link => link.href));
  await expect(page.locator('.home-footer')).not.toContainText(/TODO|to add/i);
});

test('keyboard traversal skips decorative artifacts and reaches every preview continuation', async ({ page }) => {
  await page.goto(route());
  await page.getByRole('link', { name: 'View all projects', exact: true }).focus();
  for (const [label] of destinations) {
    await page.keyboard.press('Tab');
    const link = page.getByRole('link', { name: label, exact: true });
    await expect(link).toBeFocused();
    await expect(link).toHaveCSS('outline-style', 'solid');
  }
  await expect(page.locator('.workbench')).toHaveAttribute('aria-hidden', 'true');
  await expect(page.locator('.workbench a, .workbench button, .workbench [tabindex]')).toHaveCount(0);
  await expect(page.locator('.footer-mark')).toHaveAttribute('aria-hidden', 'true');
});

for (const width of [320, 360, 390, 430, 768, 1024, 1280, 1440, 1920]) {
  test(`lower homepage composition at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width < 768 ? 800 : 900 });
    await page.goto(route());
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    const wordLines = await page.locator('.journey-introduction h2').evaluate(heading => {
      const text = heading.firstChild!;
      const start = text.textContent!.indexOf('environments');
      const range = document.createRange();
      range.setStart(text, start);
      range.setEnd(text, start + 'environments'.length);
      return range.getClientRects().length;
    });
    expect(wordLines).toBe(1);
    for (const [name, selector] of [
      ['experience', '.experience-preview'], ['playground', '.playground-preview'],
      ['recognition', '.recognition-preview'], ['footer', '.home-footer'],
    ]) {
      const section = page.locator(selector);
      await section.screenshot({ path: `${folder}/${name}-${width}.png`, animations: 'disabled', style: cropStyle });
      await expect(section.getByRole('heading', { level: 2 })).toHaveCount(1);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `${folder}/home-${width}.png`, fullPage: true, animations: 'disabled' });
    const clip = await page.locator('.experience-preview').evaluate(element => {
      const y = element.getBoundingClientRect().top + window.scrollY;
      return { x: 0, y, width: window.innerWidth, height: document.documentElement.scrollHeight - y };
    });
    await page.screenshot({ path: `${folder}/lower-home-${width}.png`, fullPage: true, clip, animations: 'disabled', style: cropStyle });
    await expect(page.locator('.workbench figure')).toHaveCount(4);
    for (const caption of await page.locator('.workbench figcaption').allTextContents()) expect(caption).toContain('Placeholder /');
    if (width === 1440) {
      await page.locator('.artifact-wire').hover();
      await page.locator('.playground-preview').screenshot({ path: `${folder}/playground-hover-1440.png`, animations: 'disabled', style: cropStyle });
    }
  });
}

test('Playground feedback respects reduced motion and remains usable without JavaScript', async ({ page, browser, baseURL }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(route());
  await page.getByRole('link', { name: 'Visit the playground', exact: true }).focus();
  const wire = page.locator('.artifact-wire svg');
  await expect(wire).toHaveCSS('transform', 'none');
  await expect(wire).toHaveCSS('transition-duration', '0s');
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false, viewport: { width: 320, height: 800 } });
  const staticPage = await context.newPage();
  await staticPage.goto(route());
  await expect(staticPage.locator('.workbench figure')).toHaveCount(4);
  await staticPage.getByRole('link', { name: 'Visit the playground', exact: true }).click();
  await expect(staticPage.getByRole('heading', { level: 1 })).toHaveText('Playground');
  await context.close();
});
