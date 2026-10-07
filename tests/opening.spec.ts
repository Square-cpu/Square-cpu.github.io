import { test, expect } from '@playwright/test';
import process from 'node:process';
import { exploringTopics } from '../src/data/exploring';

const route = `${(process.env.BASE_PATH || '').replace(/\/$/, '')}/`;
const folder = 'artifacts/phase-2b';

for (const width of [320, 360, 390, 430, 768, 1280, 1440, 1920]) {
  test(`opening sequence and disclosure at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width < 768 ? 800 : 900 });
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    const hero = page.locator('.hero');
    const exploring = page.locator('.exploring');
    const details = exploring.locator('details');
    const summary = details.locator('summary');
    await expect(hero.getByRole('heading', { level: 1 })).toHaveText('Arthur Milander');
    await expect(page.locator('.hero-visual')).toHaveAttribute('aria-hidden', 'true');
    await expect(page.locator('.hero-visual')).not.toContainText('reserved space');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await expect(details).not.toHaveAttribute('open');
    await expect(summary).toHaveAccessibleName(exploringTopics.map(topic => topic.title).join(', '));
    for (const topic of exploringTopics) await expect(summary).toContainText(topic.title);
    await expect(details.locator('.topics')).not.toBeVisible();
    await page.screenshot({ path: `${folder}/home-${width}.png`, fullPage: true, animations: 'disabled' });
    await page.screenshot({ path: `${folder}/hero-${width}.png`, animations: 'disabled' });
    const end = await exploring.evaluate(element => element.getBoundingClientRect().bottom + window.scrollY);
    await page.screenshot({ path: `${folder}/opening-${width}.png`, fullPage: true, clip: { x: 0, y: 0, width, height: Math.ceil(end) }, animations: 'disabled' });
    await page.locator('#introduction').scrollIntoViewIfNeeded();
    await page.screenshot({ path: `${folder}/about-${width}.png`, animations: 'disabled' });
    await exploring.scrollIntoViewIfNeeded();
    await page.screenshot({ path: `${folder}/exploring-collapsed-${width}.png`, animations: 'disabled' });
    await summary.focus();
    await page.keyboard.press('Enter');
    await expect(details).toHaveAttribute('open', '');
    for (const topic of exploringTopics) await expect(details.getByText(topic.description)).toBeVisible();
    await expect.poll(() => details.evaluate(element => getComputedStyle(element, '::details-content').opacity)).toBe('1');
    const layer = details.locator('.exploring-layer');
    await expect.poll(async () => {
      const layerBox = await layer.boundingBox();
      const detailsBox = await details.boundingBox();
      return layerBox!.y + layerBox!.height <= detailsBox!.y + detailsBox!.height;
    }).toBe(true);
    // A section crop can be taller than the viewport; exclude the sticky overlay from the crop.
    await exploring.screenshot({ path: `${folder}/exploring-expanded-${width}.png`, animations: 'disabled', style: '.site-header { visibility: hidden; }' });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await expect(page.locator('.site-header')).toHaveCSS('position', 'sticky');
    expect((await page.locator('.site-header').boundingBox())!.y).toBe(0);
    await page.keyboard.press('Space');
    await expect(details).not.toHaveAttribute('open');
    await expect(details.locator('.topics')).not.toBeVisible();
  });
}

test('opening decorative feedback respects reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(route);
  const mark = page.locator('.tile-mark').first();
  await expect(mark).toHaveCSS('transition-duration', '0s');
  await page.locator('.tile').first().hover();
  await expect(mark).toHaveCSS('translate', 'none');
  await page.locator('summary').click();
  await expect(page.locator('.topics')).toBeVisible();
  const duration = await page.locator('details').evaluate(element => getComputedStyle(element, '::details-content').transitionDuration);
  expect(duration.split(',').every(value => value.trim() === '0s')).toBe(true);
});

test('touch opening retains the static visual and usable disclosure', async ({ browser }) => {
  const context = await browser.newContext({ hasTouch: true, isMobile: true, viewport: { width: 320, height: 640 } });
  const page = await context.newPage();
  await page.goto(`http://127.0.0.1:4321${route}`);
  await page.locator('summary').tap();
  await expect(page.locator('.topics')).toBeVisible();
  await page.locator('summary').tap();
  await expect(page.locator('.topics')).not.toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await context.close();
});
