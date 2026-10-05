import { test, expect } from '@playwright/test';

test('Index handles keyboard focus, Escape, scroll locking, and ordinary links', async ({ page }) => {
  await page.goto('/');
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
  await page.goto('/');
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
  await page.goto('/');
  const selectedLinks = page.locator('[data-context="selected"] h3 a');
  await expect(selectedLinks).toHaveCount(6);
  const projectPaths = await selectedLinks.evaluateAll((links) => links.map((link) => link.getAttribute('href')!));
  for (const path of ['/', '/projects/', '/experiences/', '/playground/', '/awards/', '/about/', ...projectPaths]) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    await expect(page.locator('main')).toHaveCount(1);
  }
  expect(errors).toEqual([]);
});

for (const width of [320, 390, 768, 1280, 1920]) {
  test(`responsive layout and Index at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ['/', '/projects/', '/projects/behring-ifood-hackathon/', '/about/']) {
      await page.goto(path);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    }
    await page.goto('/');
    await page.screenshot({ path: `artifacts/home-${width}.png`, fullPage: true, animations: 'disabled' });
    await page.getByRole('button', { name: 'INDEX', exact: true }).click();
    const dialog = page.getByRole('dialog');
    expect(await dialog.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
    await expect(dialog.getByRole('link', { name: 'About', exact: true })).toBeInViewport();
    await page.screenshot({ path: `artifacts/index-${width}.png`, animations: 'disabled' });
  });
}

test('reduced motion disables decorative motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByRole('button', { name: 'INDEX', exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCSS('animation-name', 'none');
  await page.keyboard.press('Escape');
  await expect(page.locator('summary .indicator')).toHaveCSS('transition-duration', '0s');
});

test('navigation and topic disclosure remain available without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4321/');
  await page.getByRole('link', { name: 'INDEX', exact: true }).click();
  await expect(page.locator('#footer-index')).toBeInViewport();
  await page.locator('summary').click();
  await expect(page.locator('.topics')).toBeVisible();
  await page.locator('#footer-index').getByRole('link', { name: 'About' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('About Arthur');
  await context.close();
});
