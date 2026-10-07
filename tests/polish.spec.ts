import { test, expect } from '@playwright/test';
import process from 'node:process';

const base = (process.env.BASE_PATH || '').replace(/\/$/, '');
const route = `${base}/`;
const folder = `artifacts/phase-2e${base ? '/base' : ''}`;

test('homepage continuation links retain comfortable touch targets at 320px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto(route);
  await page.evaluate(() => document.fonts.ready);
  const links = page.locator('.home-page .text-link');
  await expect(links).toHaveCount(5);
  for (const link of await links.all()) {
    await link.focus();
    await expect(link).toBeFocused();
    await expect(link).toHaveCSS('outline-style', 'solid');
    const box = (await link.boundingBox())!;
    expect(box.height).toBeGreaterThanOrEqual(44);
    expect(box.x).toBeGreaterThanOrEqual(7);
    expect(box.x + box.width + 7).toBeLessThanOrEqual(320);
    expect(box.y).toBeGreaterThanOrEqual((await page.locator('.site-header').boundingBox())!.height);
  }
});

for (const width of [520, 640, 768, 1024, 1440]) {
  test(`collapsed topics have readable spacing and controlled wrapping at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    const summary = page.locator('.exploring summary');
    await expect(page.locator('.exploring details')).not.toHaveAttribute('open', '');
    const textBoxes = await summary.locator('.topic-name').evaluateAll(topics => topics.map(topic => {
      const range = document.createRange();
      range.selectNodeContents(topic.firstChild!);
      const box = range.getBoundingClientRect();
      return { left: box.left, right: box.right, top: box.top, lines: range.getClientRects().length };
    }));
    expect(textBoxes).toHaveLength(3);
    for (const [index, box] of textBoxes.entries()) {
      expect(box.lines).toBe(1);
      if (index && Math.abs(box.top - textBoxes[index - 1].top) < 1) {
        expect(box.left - textBoxes[index - 1].right).toBeGreaterThanOrEqual(16);
      }
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await summary.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('.exploring .topics')).toBeVisible();
    await page.keyboard.press('Space');
    await expect(page.locator('.exploring .topics')).not.toBeVisible();
    await page.locator('.exploring').screenshot({ path: `${folder}/exploring-collapsed-${width}.png`, animations: 'disabled', style: '.site-header { visibility: hidden; }' });
  });
}

test('whole-homepage review captures retain every section across the responsive range', async ({ page }) => {
  test.setTimeout(120_000);
  for (const width of [320, 360, 390, 430, 768, 1024, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('main > section')).toHaveCount(7);
    await expect(page.locator('.home-footer')).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: `${folder}/home-${width}.png`, fullPage: true, animations: 'disabled' });
    if (width === 1440) {
      const selectedTop = await page.locator('.selected-work').evaluate(el => el.getBoundingClientRect().top + scrollY);
      await page.screenshot({ path: `${folder}/top-1440.png`, fullPage: true, clip: { x: 0, y: 0, width, height: Math.ceil(selectedTop) }, animations: 'disabled' });
      const cropStyle = '.site-header, .skip-link { visibility: hidden; }';
      await page.locator('.selected-work').screenshot({ path: `${folder}/selected-work-1440.png`, animations: 'disabled', style: cropStyle });
      const clip = await page.locator('.experience-preview').evaluate(el => {
        const y = el.getBoundingClientRect().top + scrollY;
        return { x: 0, y, width: innerWidth, height: document.documentElement.scrollHeight - y };
      });
      await page.screenshot({ path: `${folder}/lower-home-1440.png`, fullPage: true, clip, animations: 'disabled', style: cropStyle });
    }
  }
});
