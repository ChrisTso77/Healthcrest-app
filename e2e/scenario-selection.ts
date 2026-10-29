import { expect, type Locator, type Page, type TestInfo } from '@playwright/test';
import { FALLBACK_PRESETS } from '../lib/presets/fallback';

async function expectForcedColourPaint(page: Page, dialog?: Locator) {
  if (!await page.evaluate(() => matchMedia('(forced-colors: active)').matches)) return;
  // Chromium can lose static text after closing a modal over blurred surfaces.
  // Check the compiled, rendered preference and retain post-close screenshots.
  const blurred = await page.evaluate(() => Array.from(document.querySelectorAll('body *'))
    .filter(element => element.getClientRects().length > 0 && !['', 'none'].includes(getComputedStyle(element).backdropFilter))
    .map(element => element.tagName + ' ' + element.getAttribute('aria-label')));
  expect(blurred, 'Forced colours must not retain decorative backdrop blur').toEqual([]);
  if (dialog) expect(await dialog.evaluate(element => getComputedStyle(element, '::backdrop').backdropFilter)).toBe('none');
}

async function expectScenarioMark(group: Locator, button: Locator) {
  await expect(button).toHaveAttribute('aria-pressed', 'true');
  await expect(group.locator('.hc-selection-mark[data-selected="true"]')).toHaveCount(1);
  const mark = button.locator('.hc-selection-mark');
  await expect(mark).toBeVisible();
  await expect(mark).toBeInViewport({ ratio: 1 });
  await expect(mark).toHaveAttribute('aria-hidden', 'true');
  const control = (await button.boundingBox())!, icon = (await mark.boundingBox())!;
  expect(icon.x).toBeGreaterThanOrEqual(control.x);
  expect(icon.x + icon.width).toBeLessThanOrEqual(control.x + control.width + 0.01);
  expect(icon.y + icon.height).toBeLessThanOrEqual(control.y + control.height + 0.01);
  for (const other of await group.getByRole('button', { pressed: false }).all()) {
    await expect(other.locator('.hc-selection-mark')).toBeHidden();
  }
}

export async function checkScenarioSelection(page: Page, testInfo: TestInfo, mode: '2d' | '3d' = '2d', screenshots = false) {
  await page.route('**/api/presets', route => route.fulfill({
    status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: FALLBACK_PRESETS }),
  }));
  await page.goto('/engine' + (mode === '2d' ? '?view=2d' : ''));
  const canvas = mode === '3d' ? await page.locator('canvas').elementHandle() : null;
  if (mode === '3d') await expect(page.locator('canvas')).toBeVisible();
  else await expect(page.locator('canvas')).toHaveCount(0);
  await expectForcedColourPaint(page);
  const group = page.getByRole('group', { name: 'Example scenarios', exact: true });
  await expect(group.getByRole('button')).toHaveCount(FALLBACK_PRESETS.length);
  for (const preset of FALLBACK_PRESETS) {
    await expect(group.getByRole('button', { name: preset.title + ' ' + preset.education!.category, exact: true })).toHaveCount(1);
  }
  const sleep = page.getByRole('slider', { name: 'Sleep Duration', exact: true });
  const research = FALLBACK_PRESETS.find(preset => preset.education?.category === 'Research example')!;
  const examples = [FALLBACK_PRESETS[0], FALLBACK_PRESETS[1], research];
  let selected: Locator | undefined;
  await page.keyboard.press('Tab');
  for (const preset of examples) {
    selected = group.getByRole('button', { name: preset.title + ' ' + preset.education!.category, exact: true });
    await selected.focus();
    await page.keyboard.press('Enter');
    await expect(selected).toBeFocused();
    await expectScenarioMark(group, selected);
    await expect(sleep).toHaveValue(String(preset.parameters.sleepDuration));
  }
  const forced = await page.evaluate(() => matchMedia('(forced-colors: active)').matches
    ? 'forced-' + (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : 'normal');
  const attach = async (state: string) => {
    if (screenshots) await testInfo.attach('scenario-' + state + '-' + mode + '-' + forced + '-' + page.viewportSize()!.width,
      { body: await page.screenshot(), contentType: 'image/png' });
  };
  await selected!.scrollIntoViewIfNeeded();
  await attach('selected');
  if (mode === '3d') {
    await page.getByRole('region', { name: 'Camera controls', exact: true }).getByRole('button', { name: /^Raised view/ }).click();
    await expectScenarioMark(group, selected!);
  }
  const camera = mode === '3d' ? await page.locator('[data-camera-shot]').getAttribute('data-camera-shot') : null;
  await sleep.focus();
  await page.keyboard.press('ArrowLeft');
  await expect(group.getByRole('button', { pressed: true })).toHaveCount(0);
  await expect(group.locator('.hc-selection-mark[data-selected="true"]')).toHaveCount(0);
  const compare = page.getByRole('button', { name: 'Compare starting and current settings', exact: true });
  await compare.click();
  const dialog = page.getByRole('dialog', { name: 'Starting and current settings', exact: true });
  await expectForcedColourPaint(page, dialog);
  const restore = dialog.getByRole('button', { name: 'Restore starting settings', exact: true });
  await expect(restore).toHaveAttribute('aria-disabled', 'false');
  await restore.click();
  await page.keyboard.press('Escape');
  await expect(compare).toBeFocused();
  await expectForcedColourPaint(page);
  await expect(sleep).toHaveValue(String(research.parameters.sleepDuration));
  // Matching an example's numbers after restore must not reapply its attribution.
  await expect(group.getByRole('button', { pressed: true })).toHaveCount(0);
  for (const mark of await group.locator('.hc-selection-mark').all()) await expect(mark).toBeHidden();
  if (mode === '3d') {
    await expect(page.locator('[data-camera-shot]')).toHaveAttribute('data-camera-shot', camera!);
    expect(await canvas!.evaluate(element => element === document.querySelector('canvas'))).toBe(true);
  } else {
    await expect(page.getByRole('group', { name: 'Render mode', exact: true }).getByRole('button', { name: '2D diagram', exact: true })).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('canvas')).toHaveCount(0);
  }
  const guide = page.getByRole('button', { name: 'Guide: understand this view', exact: true });
  await guide.click();
  const guideDialog = page.getByRole('dialog', { name: 'Understand this view', exact: true });
  await expect(guideDialog).toContainText('Manual settings: no evidence preset is currently applied.');
  await expectForcedColourPaint(page, guideDialog);
  await page.keyboard.press('Escape');
  await expectForcedColourPaint(page);
  await group.scrollIntoViewIfNeeded();
  await attach('manual-after-restore');
  await selected!.focus();
  await page.keyboard.press('Enter');
  await expectScenarioMark(group, selected!);
  expect(await page.evaluate(() => localStorage.getItem('healthcrest.habit-draft.v1'))).toBeNull();
}
