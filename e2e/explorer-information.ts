import { expect, type Locator, type Page, type TestInfo } from '@playwright/test';
import { FALLBACK_PRESETS } from '../lib/presets/fallback';

async function expectTouchTarget(control: Locator) {
  await expect(control).toBeInViewport({ ratio: 1 });
  const box = (await control.boundingBox())!;
  expect(box.height).toBeGreaterThanOrEqual(44 - 0.01);
  expect(box.width).toBeGreaterThanOrEqual(44 - 0.01);
}

export async function checkExplorerInformation(page: Page, testInfo: TestInfo, mode: '2d' | '3d' = '2d', screenshots = false) {
  const posts: string[] = [];
  page.on('request', request => { if (request.method() === 'POST') posts.push(new URL(request.url()).pathname); });
  await page.route('**/api/presets', route => route.fulfill({
    status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: FALLBACK_PRESETS }),
  }));
  await page.goto('/engine?pillar=sleep' + (mode === '2d' ? '&view=2d' : ''));
  if (mode === '3d') await expect(page.locator('canvas')).toBeVisible();
  else await expect(page.locator('canvas')).toHaveCount(0);
  const canvas = mode === '3d' ? await page.locator('canvas').elementHandle() : null;
  const sleep = page.getByRole('slider', { name: 'Sleep Duration', exact: true });
  await sleep.fill('7.5');
  if (mode === '3d') {
    const camera = page.getByRole('region', { name: 'Camera controls', exact: true });
    await camera.getByRole('button', { name: /^Raised view/ }).click();
    await expect(page.locator('[data-camera-shot]')).toHaveAttribute('data-camera-shot', 'shot-4-resonance');
  }
  const originalURL = page.url();
  const storage = await page.evaluate(() => ({ ...localStorage }));
  const footer = page.locator('footer');
  const attach = async (name: string) => {
    if (screenshots) await testInfo.attach('explorer-information-' + name + '-' + page.viewportSize()!.width,
      { body: await page.screenshot(), contentType: 'image/png' });
  };
  for (const name of ['About this Explorer', 'Important information']) {
    const trigger = footer.getByRole('button', { name, exact: true });
    await expectTouchTarget(trigger);
    await expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
  }
  await expect(footer.getByRole('link', { name: 'Privacy choices', exact: true })).toHaveAttribute('href', '/privacy');
  await attach('footer');
  for (const item of [
    { name: 'About this Explorer', close: 'Close about this Explorer', content: 'About this Explorer content' },
    { name: 'Important information', close: 'Close important information', content: 'Important information content' },
  ]) {
    const trigger = footer.getByRole('button', { name: item.name, exact: true });
    await trigger.focus();
    await page.keyboard.press('Enter');
    const dialog = page.getByRole('dialog', { name: item.name, exact: true });
    const close = dialog.getByRole('button', { name: item.close, exact: true });
    const done = dialog.getByRole('button', { name: 'Close and keep exploring', exact: true });
    await expect(close).toBeFocused();
    await expectTouchTarget(close);
    await expectTouchTarget(done);
    const heading = dialog.getByRole('heading', { level: 2, name: item.name, exact: true });
    const titleBox = (await heading.boundingBox())!, closeBox = (await close.boundingBox())!;
    expect(titleBox.x).toBeGreaterThanOrEqual(0);
    expect(titleBox.x + titleBox.width).toBeLessThanOrEqual(closeBox.x + 0.01);
    expect(await dialog.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
    const content = dialog.getByRole('region', { name: item.content, exact: true });
    if (item.name === 'About this Explorer') {
      await expect(content.getByRole('link', { name: /^NHS:/ })).toHaveCount(4);
      await expect(content).toContainText('it does not model the body as a complete biological system or predict health outcomes.');
    } else {
      await expect(content).toContainText('It does not provide medical diagnoses or treatment plans.');
      await expect(dialog.getByRole('button', { name: /acknowledge/i })).toHaveCount(0);
    }
    await attach(item.name === 'About this Explorer' ? 'about' : 'important');
    await content.focus();
    await page.keyboard.press('End');
    const scrollable = await content.evaluate(element => element.scrollHeight > element.clientHeight);
    if (scrollable) await expect.poll(() => content.evaluate(element => element.scrollTop)).toBeGreaterThan(0);
    await done.focus();
    await page.keyboard.press('Enter');
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
    expect(page.url()).toBe(originalURL);
    await expect(sleep).toHaveValue('7.5');
    await expect(page.getByRole('navigation', { name: 'Habit topics', exact: true }).getByRole('button', { name: 'Sleep', exact: true })).toHaveAttribute('aria-pressed', 'true');
    if (mode === '3d') {
      await expect(page.locator('[data-camera-shot]')).toHaveAttribute('data-camera-shot', 'shot-4-resonance');
      expect(await canvas!.evaluate(element => element === document.querySelector('canvas'))).toBe(true);
    } else await expect(page.locator('canvas')).toHaveCount(0);
  }
  expect(await page.evaluate(() => ({ ...localStorage }))).toEqual(storage);
  expect(posts).toEqual([]);
  await page.getByRole('link', { name: 'Healthcrest home', exact: true }).click();
  await expect(page).toHaveURL(new URL('/', originalURL).href);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
}
