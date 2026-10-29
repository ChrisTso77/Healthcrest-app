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
      const art = await page.locator('.hc-hero-art').boundingBox();
      const media = await page.locator('.hc-bird-media').boundingBox();
      const notes = await page.locator('.hc-art-notes').boundingBox();
      expect(media!.width / media!.height).toBeCloseTo(16 / 9, 2);
      expect(notes!.y).toBeGreaterThanOrEqual(media!.y + media!.height);
      for (const note of await page.locator('.hc-art-note').all()) {
        const box = await note.boundingBox();
        expect(box!.x).toBeGreaterThanOrEqual(art!.x);
        expect(box!.x + box!.width).toBeLessThanOrEqual(art!.x + art!.width);
      }
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

  test('preview opens the selected pillar and the Habit Explorer links home', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('group', { name: 'Preview pillars' })
      .getByRole('button', { name: 'Sleep', exact: true }).click();
    await page.getByRole('link', { name: 'Explore sleep in the Habit Explorer', exact: true }).click();
    await expect(page).toHaveURL(/\/engine\?pillar=sleep$/);
    await expect(page.getByRole('navigation', { name: 'Habit topics' })
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
    await expect(page.getByRole('button', { name: 'Connected habits', exact: true })).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByRole('slider', { name: 'Sleep Duration', exact: true })).toHaveValue('8');
  });
});

test('hummingbird loads, pauses, resumes and respects changed motion preferences', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const logos = page.locator('.hc-brand img');
  await expect(logos).toHaveCount(2);
  for (const logo of await logos.all()) {
    await logo.scrollIntoViewIfNeeded();
    await expect.poll(() => logo.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
  }
  await page.locator('.hc-bird-media').scrollIntoViewIfNeeded();
  const video = page.locator('.hc-bird video');
  await expect(video).toBeVisible();
  await expect.poll(() => video.evaluate((media: HTMLVideoElement) => media.readyState)).toBeGreaterThanOrEqual(2);
  await expect.poll(() => video.evaluate((media: HTMLVideoElement) => media.currentTime)).toBeGreaterThan(0);
  expect(await video.evaluate((media: HTMLVideoElement) => media.videoWidth / media.videoHeight)).toBeCloseTo(16 / 9, 3);
  // The uploaded alpha track removed large pieces of the shield and lettering.
  // Check decoded pixels, so a playable but transparent/cut-out film fails.
  expect(await video.evaluate((media: HTMLVideoElement) => {
    const canvas = document.createElement('canvas');
    canvas.width = 160;
    canvas.height = 90;
    const context = canvas.getContext('2d')!;
    context.drawImage(media, 0, 0, 160, 90);
    const pixels = context.getImageData(0, 0, 160, 90).data;
    let minimumAlpha = 255;
    for (let index = 3; index < pixels.length; index += 4) minimumAlpha = Math.min(minimumAlpha, pixels[index]);
    return minimumAlpha;
  })).toBe(255);
  const frame = await page.locator('.hc-bird-media').boundingBox();
  expect(frame!.width / frame!.height).toBeCloseTo(16 / 9, 2);
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
  await expect(still).toHaveAttribute('src', '/media/healthcrest-hummingbird-still.jpg');
  await expect.poll(() => still.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
  await expect(page.getByRole('button', { name: /hummingbird animation/ })).toHaveCount(0);
});

test('hummingbird uses a matching video still when video fails', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  let attempted = false;
  await page.route('**/media/healthcrest-hummingbird-opaque.webm', route => { attempted = true; return route.abort(); });
  await page.goto('/');
  await expect.poll(() => attempted).toBe(true);
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

test('public navigation explains authorship and offers a working contact route', async ({ page }) => {
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Main navigation' });
  await expect(nav.getByRole('link')).toHaveText(['Learn', 'Habit Explorer', 'About', 'Contact']);
  await expect(page.getByRole('link', { name: 'Try the Habit Explorer', exact: true }).first()).toHaveAttribute('href', '/engine');
  await expect(page.locator('#engine-preview')).toBeVisible();
  expect(await page.locator('#engine-preview').evaluate(node => Boolean(node.compareDocumentPosition(document.querySelector('#purpose')!) & Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true);
  await nav.getByRole('link', { name: 'About', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('About Healthcrest');
  await expect(page.locator('main')).toContainText('Chris Tsoto');
  await expect(page.locator('main')).toContainText('2055329');
  await expect(page.locator('main time')).toHaveAttribute('dateTime', '2026-10-28');
  await expect(page.locator('main')).toContainText('not a claim of independent clinical review');
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Contact', exact: true }).click();
  await expect(page.getByRole('link', { name: 'chris@healthcrest.uk', exact: true })).toHaveAttribute('href', 'mailto:chris@healthcrest.uk');
});

test('start-here questions reach the relevant guidance and saved-plan controls remain manual', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /How much activity do adults need/ }).click();
  await expect(page).toHaveURL(/\/learn\/movement-and-strength$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Movement and strength: a manageable starting point');
  await expect(page.locator('#guide-sources').getByRole('link', { name: /NHS: physical activity for adults aged 19–64/ })).toBeVisible();
  await page.getByRole('navigation', { name: 'Footer navigation' }).getByRole('link', { name: 'Browser storage', exact: true }).click();
  await expect(page.locator('main')).toContainText('Saving and restoring are manual.');
  await page.getByRole('link', { name: 'Open the save, restore and remove controls', exact: true }).click();
  await expect(page).toHaveURL(/\/next-step#saved-draft-controls$/);
  await expect(page.getByRole('region', { name: 'Keep your draft' })).toBeInViewport();
  expect(await page.evaluate(() => localStorage.getItem('healthcrest.habit-draft.v1'))).toBeNull();
});

test('stress guidance exposes local urgent-help routes and keyboard preview selection works', async ({ page }) => {
  await page.goto('/');
  const choices = page.getByRole('group', { name: 'Preview pillars' });
  await choices.getByRole('button', { name: 'Sleep', exact: true }).focus();
  await page.keyboard.press('Tab');
  const stress = choices.getByRole('button', { name: 'Stress & support', exact: true });
  await expect(stress).toBeFocused();
  await page.keyboard.press('Space');
  await expect(stress).toHaveAttribute('aria-pressed', 'true');
  const support = page.locator('#engine-preview').getByRole('complementary', { name: 'Urgent mental health support' });
  await expect(support).toBeVisible();
  await expect(support.getByRole('link', { name: '111', exact: true })).toHaveAttribute('href', 'tel:111');
  await expect(support.getByRole('link', { name: '111', exact: true })).toHaveCSS('text-decoration-line', 'underline');
  await expect(support.getByRole('link', { name: '116 123', exact: true })).toHaveAttribute('href', 'tel:116123');
  await expect(support.getByRole('link', { name: '999', exact: true })).toHaveAttribute('href', 'tel:999');
  await page.goto('/learn#topic-stress');
  for (const query of ['Samaritans', '111', '116123']) {
    await page.getByRole('searchbox', { name: 'Search health topics and terms', exact: true }).fill(query);
    await expect(page.getByRole('article')).toHaveCount(1);
    await expect(page.locator('#topic-stress').getByRole('complementary', { name: 'Urgent mental health support' })).toBeVisible();
  }
  await page.goto('/next-step?pillar=stress');
  await expect(page.getByRole('complementary', { name: 'Urgent mental health support' })).toBeVisible();
});

test('supplied logo is delivered responsively in a modern image format', async ({ page }) => {
  await page.goto('/');
  const logo = page.locator('.hc-header .hc-brand img');
  await expect(logo).toHaveAttribute('alt', 'Healthcrest');
  await expect(logo).toHaveAttribute('srcset', /w=/);
  const response = await page.request.get((await logo.getAttribute('src'))!, {
    headers: { Accept: 'image/avif,image/webp' },
  });
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toMatch(/^image\/(avif|webp)/);
});

test('canonical and sharing metadata use the confirmed domain and publish working discovery files', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /^https:\/\/www\.healthcrest\.uk\/?$/);
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', /^https:\/\/www\.healthcrest\.uk\/?$/);
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
  const schema = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!);
  expect(schema['@type']).toBe('WebSite');
  expect(schema.url).toBe('https://www.healthcrest.uk');
  expect(schema.creator.name).toBe('Chris Tsoto');

  const explorer = await page.request.get('/engine?pillar=sleep');
  expect(explorer.ok()).toBe(true);
  expect(await explorer.text()).toContain('rel="canonical" href="https://www.healthcrest.uk/engine"');
});

test('discovery files list the public pages on the confirmed domain', async ({ page }) => {
  const sitemap = await page.request.get('/sitemap.xml');
  expect(sitemap.ok()).toBe(true);
  const xml = await sitemap.text();
  for (const path of ['/start', '/learn', '/engine', '/next-step', '/about', '/contact', '/storage']) {
    expect(xml).toContain('<loc>https://www.healthcrest.uk' + path + '</loc>');
  }
  const robots = await page.request.get('/robots.txt');
  expect(await robots.text()).toContain('Sitemap: https://www.healthcrest.uk/sitemap.xml');

});

test('social sharing image renders as a complete PNG', async ({ page }) => {
  const image = await page.request.get('/opengraph-image');
  expect(image.status()).toBe(200);
  expect(image.headers()['content-type']).toContain('image/png');
  const bytes = await image.body();
  expect(bytes.readUInt32BE(16)).toBe(1200);
  expect(bytes.readUInt32BE(20)).toBe(630);
});
