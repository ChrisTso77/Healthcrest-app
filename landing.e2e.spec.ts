import { test, expect } from '@playwright/test';

test.describe('Healthcrest introduction', () => {
  for (const viewport of [
    { width: 320, height: 568 },
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1440, height: 900 },
  ]) {
    test(`landing page introduces Healthcrest and stays usable at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);
      let presetRequests = 0;
      page.on('request', (request) => {
        if (new URL(request.url()).pathname === '/api/presets') presetRequests += 1;
      });
      await page.goto('/');
      await expect(page).toHaveTitle('Healthcrest | Health through everyday habits');
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Small habits\.\s*Connected health\./);
      await expect(page.getByRole('heading', { name: /Prevention starts with understanding/ })).toBeVisible();
      await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
      await expect(page.locator('canvas')).toHaveCount(0);
      expect(presetRequests).toBe(0);

      for (const name of ['Movement', 'Food', 'Sleep', 'Stress & support']) {
        await expect(page.getByRole('link').filter({ has: page.getByRole('heading', { name, exact: true }) })).toHaveCount(1);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      const nav = await page.getByRole('navigation', { name: 'Main navigation' }).boundingBox();
      expect(nav!.x).toBeGreaterThanOrEqual(0);
      expect(nav!.x + nav!.width).toBeLessThanOrEqual(viewport.width);

      const preview = page.getByRole('region', { name: /See the connections/ });
      const choices = preview.getByRole('group', { name: 'Preview pillars' });
      for (const label of ['Movement', 'Food', 'Sleep', 'Stress & support']) {
        const button = choices.getByRole('button', { name: label, exact: true });
        await button.click();
        await expect(button).toHaveAttribute('aria-pressed', 'true');
        await expect(choices.locator('button[aria-pressed="true"]')).toHaveCount(1);
        const reading = preview.getByRole('region', { name: 'Selected habit' });
        await expect(reading).toContainText('One possible first step:');
        const box = await reading.boundingBox();
        expect(box!.x).toBeGreaterThanOrEqual(0);
        expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width);
      }
      await test.info().attach('landing-preview.png', {
        body: await page.screenshot(),
        contentType: 'image/png',
      });
      await expect(page.locator('canvas')).toHaveCount(0);
      expect(presetRequests).toBe(0);
    });
  }

  test('preview opens the selected pillar and the engine links home', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('group', { name: 'Preview pillars' })
      .getByRole('button', { name: 'Sleep', exact: true }).click();
    await page.getByRole('link', { name: 'Explore sleep in the engine', exact: true }).click();
    await expect(page).toHaveURL(/\/engine\?pillar=sleep$/);
    await expect(page.getByRole('navigation', { name: 'Health pillars' })
      .getByRole('button', { name: 'Sleep', exact: true })).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('canvas')).toBeVisible();
    await page.getByRole('button', { name: 'Guide: understand this view', exact: true }).click();
    const dialog = page.getByRole('dialog', { name: 'Understand this view' });
    await expect(dialog.getByRole('heading', { name: 'Sleep: Support sleep and recovery', exact: true })).toBeVisible();
    await page.keyboard.press('Escape');
    await page.getByRole('link', { name: 'Healthcrest home', exact: true }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Small habits.');
  });

  test('landing works with keyboard and reduced motion; unknown pillar links are safe', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: 'Skip to content', exact: true });
    await expect(skip).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#main-content')).toBeFocused();

    const choices = page.getByRole('group', { name: 'Preview pillars' });
    const sleep = choices.getByRole('button', { name: 'Sleep', exact: true });
    await sleep.focus();
    await page.keyboard.press('Enter');
    await expect(sleep).toHaveAttribute('aria-pressed', 'true');
    expect(await page.evaluate(() => document.getAnimations().filter((animation) => animation.playState === 'running').length)).toBe(0);

    await page.goto('/engine?pillar=__proto__');
    await expect(page.getByRole('button', { name: 'Systems', exact: true })).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByRole('slider', { name: 'Sleep Duration', exact: true })).toHaveValue('8');
  });
});

test('hummingbird loads, pauses, resumes and respects changed motion preferences', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const logos = page.locator('.hc-brand img');
  await expect(logos).toHaveCount(2);
  for (const logo of await logos.all()) {
    await expect.poll(() => logo.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
  }
  const video = page.locator('.hc-bird video');
  await expect(video).toBeVisible();
  await expect.poll(() => video.evaluate((media: HTMLVideoElement) => media.readyState)).toBeGreaterThanOrEqual(2);
  await expect.poll(() => video.evaluate((media: HTMLVideoElement) => media.currentTime)).toBeGreaterThan(0);
  await page.getByRole('button', { name: 'Pause hummingbird animation', exact: true }).click();
  await expect.poll(() => video.evaluate((media: HTMLVideoElement) => media.paused)).toBe(true);
  const stopped = await video.evaluate((media: HTMLVideoElement) => media.currentTime);
  await page.waitForTimeout(250);
  expect(await video.evaluate((media: HTMLVideoElement) => media.currentTime)).toBeCloseTo(stopped, 1);
  await page.getByRole('button', { name: 'Play hummingbird animation', exact: true }).click();
  await expect.poll(() => video.evaluate((media: HTMLVideoElement) => media.paused)).toBe(false);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(video).toHaveCount(0);
  const still = page.locator('.hc-bird img');
  await expect(still).toBeVisible();
  await expect.poll(() => still.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
  await expect(page.getByRole('button', { name: /hummingbird animation/ })).toHaveCount(0);
});

test('hummingbird uses supplied static artwork when video fails', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.route('**/media/healthcrest-hummingbird.webm', route => route.abort());
  await page.goto('/');
  await expect(page.locator('.hc-bird video')).toHaveCount(0);
  const still = page.locator('.hc-bird img');
  await expect(still).toBeVisible();
  await expect.poll(() => still.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
});

test('branding and static hero remain available without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.locator('.hc-brand img')).toHaveCount(2);
  const still = page.locator('.hc-bird img');
  await expect(still).toBeVisible();
  await expect.poll(() => still.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
  await expect(page.locator('video')).toHaveCount(0);
  await context.close();
});
