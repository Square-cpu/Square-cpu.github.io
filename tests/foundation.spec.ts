import { test, expect } from '@playwright/test';
import process from 'node:process';

const base = (process.env.BASE_PATH || '').replace(/\/$/, '');
const route = (path = '/') => `${base}${path}`;

test('Index handles keyboard focus, Escape, scroll locking, and ordinary links', async ({ page }) => {
  await page.goto(route());
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  const trigger = page.getByRole('button', { name: 'INDEX', exact: true });
  await trigger.focus();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog', { name: 'Site index' });
  await expect(dialog).toBeVisible();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('button', { name: 'Close site index' })).toBeFocused();
  await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');
  await page.keyboard.press('Shift+Tab');
  await expect(dialog.getByRole('link', { name: 'About', exact: true })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Close site index' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
  await trigger.click();
  await page.getByRole('button', { name: 'Close site index' }).click();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await dialog.getByRole('link', { name: 'Projects', exact: true }).click();
  await expect(page).toHaveURL(/\/projects\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Projects');
});

test('Exploring topics stay visible when collapsed and expand with the keyboard', async ({ page }) => {
  await page.goto(route());
  const details = page.locator('details');
  const summary = details.locator('summary');
  await expect(summary).toContainText('Procedural generation · Animation · Creative coding');
  await expect(details.locator('.topics')).not.toBeVisible();
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(details.locator('.topics')).toBeVisible();
  await page.keyboard.press('Space');
  await expect(details.locator('.topics')).not.toBeVisible();
});

test('all routes, project links, and runtime scripts work', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(route());
  const selectedLinks = page.locator('[data-context="selected"] h3 a');
  await expect(selectedLinks).toHaveCount(6);
  const projectPaths = await selectedLinks.evaluateAll((links) => links.map((link) => link.getAttribute('href')!));
  for (const path of [...['/', '/projects/', '/experiences/', '/playground/', '/awards/', '/about/'].map(route), ...projectPaths]) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    await expect(page.locator('main')).toHaveCount(1);
  }
  expect(errors).toEqual([]);
});

for (const width of [320, 360, 390, 430, 768, 1280, 1440, 1920]) {
  test(`responsive layout and Index at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ['/', '/projects/', '/projects/behring-ifood-hackathon/', '/about/']) {
      await page.goto(route(path));
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    }
    await page.goto(route());
    await page.evaluate(() => document.fonts.ready);
    const identity = page.getByRole('link', { name: 'Arthur Milander — Home' });
    await expect(identity).toHaveText('Arthur Milander');
    await expect(identity).toBeInViewport();
    const identityBox = await identity.boundingBox();
    const triggerBox = await page.locator('#index-trigger').boundingBox();
    expect(identityBox!.x + identityBox!.width).toBeLessThan(triggerBox!.x);
    await page.screenshot({ path: `artifacts/phase-2a/home-${width}.png`, fullPage: true, animations: 'disabled' });
    await page.screenshot({ path: `artifacts/phase-2a/page-${width}.png`, animations: 'disabled' });
    await page.evaluate(() => window.scrollTo(0, 1200));
    expect((await page.locator('.site-header').boundingBox())!.y).toBe(0);
    await page.screenshot({ path: `artifacts/phase-2a/sticky-${width}.png`, animations: 'disabled' });
    await page.getByRole('button', { name: 'INDEX', exact: true }).click();
    const dialog = page.getByRole('dialog');
    expect(await dialog.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
    await expect(dialog.getByRole('link', { name: 'About', exact: true })).toBeInViewport();
    await page.screenshot({ path: `artifacts/phase-2a/index-${width}.png`, animations: 'disabled' });
  });
}

test('reduced motion disables decorative motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(route());
  await page.getByRole('button', { name: 'INDEX', exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCSS('animation-name', 'none');
  await expect(page.locator('.index-label').first()).toHaveCSS('transition-duration', '0s');
  await page.keyboard.press('Escape');
  await expect(page.locator('summary .indicator')).toHaveCSS('transition-duration', '0s');
});

test('navigation and topic disclosure remain available without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`http://127.0.0.1:4321${route()}`);
  await page.getByRole('link', { name: 'INDEX', exact: true }).click();
  await expect(page.locator('#footer-index')).toBeInViewport();
  await page.locator('summary').click();
  await expect(page.locator('.topics')).toBeVisible();
  await page.locator('#footer-index').getByRole('link', { name: 'About' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('About Arthur');
  await context.close();
});

test('sticky header stays usable after scrolling and closing the Index', async ({ page }) => {
  await page.goto(route());
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => window.scrollTo(0, 1200));
  const header = page.locator('.site-header');
  await expect(header).toHaveCSS('position', 'sticky');
  expect((await header.boundingBox())!.y).toBe(0);
  const scrollBefore = await page.evaluate(() => window.scrollY);
  await page.locator('#index-trigger').click();
  expect(await page.evaluate(() => window.scrollY)).toBe(scrollBefore);
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#index-trigger')).toBeFocused();
  await expect(page.locator('#index-trigger')).toHaveAttribute('aria-expanded', 'false');
  expect(await page.evaluate(() => window.scrollY)).toBe(scrollBefore);
  await expect(page.getByRole('link', { name: 'Arthur Milander — Home' })).toBeInViewport();
});

for (const [path, label, state] of [
  ['/', 'Home', 'page'],
  ['/projects/', 'Projects', 'page'],
  ['/projects/wfc-procedural-generator/', 'Projects', 'true'],
  ['/experiences/', 'Experiences', 'page'],
  ['/playground/', 'Playground', 'page'],
  ['/awards/', 'Awards', 'page'],
  ['/about/', 'About', 'page'],
]) {
  test(`current section: ${path} (base ${base || '/'})`, async ({ page }) => {
    await page.goto(route(path));
    await page.locator('#index-trigger').click();
    const current = page.locator('#site-index a[aria-current]');
    await expect(current).toHaveCount(1);
    await expect(current).toHaveAccessibleName(label);
    await expect(current).toHaveAttribute('aria-current', state);
    await expect(current.locator('.current-marker')).toHaveCSS('opacity', '1');
  });
}

test('Index remains navigable on a short mobile screen', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto(route());
  await page.locator('#index-trigger').click();
  await page.keyboard.press('Shift+Tab');
  await expect(page.getByRole('link', { name: 'About', exact: true })).toBeFocused();
  await expect(page.getByRole('link', { name: 'About', exact: true })).toBeInViewport();
  await page.keyboard.press('Escape');
  await expect(page.locator('#index-trigger')).toBeFocused();
});
