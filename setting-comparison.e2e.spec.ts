import { test, expect, type Page } from '@playwright/test';
import { FALLBACK_PRESETS } from './lib/presets/fallback';

const trigger = (page: Page) => page.getByRole('button', { name: 'Compare starting and current settings', exact: true });
const dialog = (page: Page) => page.getByRole('dialog', { name: 'Starting and current settings', exact: true });
async function boot(page: Page, query = 'pillar=sleep&view=2d') {
  await page.route('**/api/presets', route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: FALLBACK_PRESETS }) }));
  await page.goto('/engine?' + query);
  await expect(page.getByRole('heading', { name: 'HABIT EXPLORER', exact: true })).toBeVisible();
}

for (const viewport of [{ width: 320, height: 568 }, { width: 390, height: 844 }, { width: 1350, height: 940 }]) {
  test('comparison values lead the reading order at ' + viewport.width + 'px', async ({ page }, testInfo) => {
    await page.setViewportSize(viewport);
    await boot(page);
    for (const [label, value] of [['Weekly aerobic activity', '200'], ['Sleep Duration', '6'], ['Whole Food Ratio', '50'], ['Perceived Stress Level', '5']]) {
      await page.getByRole('slider', { name: label, exact: true }).fill(value);
    }
    await trigger(page).click();
    const comparison = dialog(page);
    const table = comparison.getByRole('table', { name: 'Settings at a glance', exact: true });
    await expect(table.getByRole('columnheader')).toHaveText(['Input', 'Starting', 'Current']);
    await expect(table.getByRole('row')).toHaveCount(5);
    for (const [label, unit, start, current] of [['Weekly aerobic activity', 'minutes/week', '180', '200'], ['Whole-food setting', '%', '80', '50'], ['Sleep duration', 'hours/night', '8', '6'], ['Perceived stress', 'out of 10', '2', '5']]) {
      const row = table.getByRole('row').filter({ hasText: label });
      await expect(row.getByRole('rowheader')).toContainText(unit);
      await expect(row.getByRole('cell').first()).toHaveText(start);
      await expect(row.getByRole('cell').nth(1)).toHaveText(new RegExp('^' + current + '\\s*Changed$'));
    }
    const content = comparison.getByRole('region', { name: 'Settings comparison content', exact: true });
    const contentBox = (await content.boundingBox())!;
    const firstRow = (await table.getByRole('row').nth(1).boundingBox())!;
    expect(firstRow.y).toBeGreaterThanOrEqual(contentBox.y);
    expect(firstRow.y + firstRow.height).toBeLessThanOrEqual(contentBox.y + contentBox.height);
    if (viewport.width !== 320) {
      const lastRow = (await table.getByRole('row').last().boundingBox())!;
      expect(lastRow.y + lastRow.height).toBeLessThanOrEqual(contentBox.y + contentBox.height);
    }
    await expect(comparison.getByText('Changes in settings do not measure changes in health.', { exact: true })).toBeInViewport();
    expect(await content.evaluate(node => node.scrollWidth <= node.clientWidth)).toBe(true);
    await testInfo.attach(`comparison-summary-${viewport.width}px`, { body: await page.screenshot(), contentType: 'image/png' });
    const help = comparison.getByText('How to read this comparison', { exact: true }).locator('..');
    await expect(help).toHaveJSProperty('open', false);
    await help.locator('summary').focus();
    await page.keyboard.press('Enter');
    await expect(help).toHaveJSProperty('open', true);
    await expect(help).toContainText('a higher value is not automatically better');
    await page.keyboard.press('Enter');
    await expect(help).toHaveJSProperty('open', false);
    await expect(comparison.getByRole('status')).toContainText('4 settings differ');
    await page.keyboard.press('Escape');
    await expect(trigger(page)).toBeFocused();
    await expect(page.getByRole('slider', { name: 'Sleep Duration', exact: true })).toHaveValue('6');
  });
}

for (const width of [320, 768, 1350]) {
  test('restore starting settings works by keyboard without touching saved plans at ' + width + 'px', async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: width === 320 ? 568 : 940 });
    await boot(page);
    const saved = 'PRIVATE-SAVED-PLAN';
    await page.evaluate(value => localStorage.setItem('healthcrest.habit-draft.v1', value), saved);
    for (const [label, value] of [['Weekly aerobic activity', '200'], ['Sleep Duration', '6'], ['Whole Food Ratio', '50'], ['Perceived Stress Level', '5']]) {
      await page.getByRole('slider', { name: label, exact: true }).fill(value);
    }
    await trigger(page).click();
    const comparison = dialog(page);
    await expect(comparison.getByRole('status')).toContainText('4 settings differ');
    const summarySleep = comparison.getByRole('table', { name: 'Settings at a glance', exact: true }).getByRole('row').filter({ hasText: 'Sleep duration' });
    await expect(summarySleep.getByRole('cell').first()).toHaveText('8');
    await expect(summarySleep.getByRole('cell').nth(1)).toHaveText(/^6\s*Changed$/);
    const restore = comparison.getByRole('button', { name: 'Restore starting settings', exact: true });
    await expect(restore).toBeEnabled();
    await expect(restore).toBeInViewport();
    await restore.focus();
    await page.keyboard.press('Enter');
    await expect(comparison.getByRole('status')).toContainText('No settings have changed');
    await expect(summarySleep.getByRole('cell').first()).toHaveText('8');
    await expect(summarySleep.getByRole('cell').nth(1)).toHaveText(/^8\s*Unchanged$/);
    await expect(restore).toBeDisabled();
    await expect(restore).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(comparison).toContainText('Starting point: Settings when you opened the Explorer');
    expect(await comparison.evaluate(node => node.scrollWidth <= node.clientWidth)).toBe(true);
    await testInfo.attach(`restored-settings-${width}px`, { body: await page.screenshot(), contentType: 'image/png' });
    await page.keyboard.press('Escape');
    await expect(trigger(page)).toBeFocused();
    for (const [label, value] of [['Weekly aerobic activity', '180'], ['Sleep Duration', '8'], ['Whole Food Ratio', '80'], ['Perceived Stress Level', '2']]) {
      await expect(page.getByRole('slider', { name: label, exact: true })).toHaveValue(value);
    }
    await expect(page.getByRole('button', { name: 'Sleep', exact: true })).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByRole('button', { name: /2d diagram/i })).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('canvas')).toHaveCount(0);
    expect(await page.evaluate(() => localStorage.getItem('healthcrest.habit-draft.v1'))).toBe(saved);
  });
}

test('restoring a chosen reference keeps the 3D topic, camera, canvas and comparison reference', async ({ page }) => {
  await page.setViewportSize({ width: 1350, height: 940 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await boot(page, 'pillar=sleep');
  const canvas = await page.locator('canvas').elementHandle();
  await page.getByRole('slider', { name: 'Sleep Duration', exact: true }).fill('5');
  await page.getByRole('navigation', { name: 'Habit topics', exact: true }).getByRole('button', { name: 'Food', exact: true }).click();
  await page.getByRole('button', { name: /Angled view/i }).click();
  await page.getByRole('button', { name: /lite 3d/i }).click();
  const viewport = page.locator('[data-camera-request-revision]');
  const revision = await viewport.getAttribute('data-camera-request-revision');
  await trigger(page).click();
  await dialog(page).getByRole('button', { name: 'Use current settings as starting point', exact: true }).click();
  const summarySleep = dialog(page).getByRole('table', { name: 'Settings at a glance', exact: true }).getByRole('row').filter({ hasText: 'Sleep duration' });
  await expect(summarySleep.getByRole('cell').first()).toHaveText('5');
  await expect(summarySleep.getByRole('cell').nth(1)).toHaveText(/^5\s*Unchanged$/);
  await page.keyboard.press('Escape');
  await page.getByRole('slider', { name: 'Sleep Duration', exact: true }).fill('6');
  await page.getByRole('slider', { name: 'Whole Food Ratio', exact: true }).fill('20');
  await trigger(page).click();
  await expect(summarySleep.getByRole('cell').first()).toHaveText('5');
  await expect(summarySleep.getByRole('cell').nth(1)).toHaveText(/^6\s*Changed$/);
  await dialog(page).getByRole('button', { name: 'Restore starting settings', exact: true }).click();
  await expect(dialog(page).getByRole('status')).toContainText('No settings have changed');
  await expect(summarySleep.getByRole('cell').first()).toHaveText('5');
  await expect(summarySleep.getByRole('cell').nth(1)).toHaveText(/^5\s*Unchanged$/);
  await expect(dialog(page)).toContainText('Starting point: Your selected settings');
  await expect(dialog(page).getByRole('region', { name: '3D appearance comparison', exact: true })).toContainText('The 3D appearance is unchanged');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('slider', { name: 'Sleep Duration', exact: true })).toHaveValue('5');
  await expect(page.getByRole('slider', { name: 'Whole Food Ratio', exact: true })).toHaveValue('80');
  await expect(page.getByRole('button', { name: 'Food', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('button', { name: /lite 3d/i })).toHaveAttribute('aria-pressed', 'true');
  await expect(viewport).toHaveAttribute('data-camera-shot', 'shot-2-failure');
  await expect(viewport).toHaveAttribute('data-camera-request-revision', revision!);
  expect(await canvas!.evaluate(node => node === document.querySelector('canvas'))).toBe(true);
});

test('an unchanged example is not cleared, while restoring edited values remains a manual scenario', async ({ page }) => {
  await boot(page);
  const example = FALLBACK_PRESETS.find(item => item.slug === 'single-pillar-failure')!;
  const exampleButton = page.getByRole('button').filter({ has: page.getByText(example.title, { exact: true }) });
  await exampleButton.click();
  await trigger(page).click();
  const restore = dialog(page).getByRole('button', { name: 'Restore starting settings', exact: true });
  await expect(restore).toBeDisabled();
  await restore.focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Escape');
  await expect(exampleButton).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('slider', { name: 'Sleep Duration', exact: true }).fill('6');
  await trigger(page).click();
  await restore.click();
  await expect(dialog(page)).toContainText('Starting point: ' + example.title);
  await expect(dialog(page).getByRole('status')).toContainText('No settings have changed');
  await page.keyboard.press('Escape');
  await expect(exampleButton).toHaveAttribute('aria-pressed', 'false');
  await expect(page.getByRole('slider', { name: 'Sleep Duration', exact: true })).toHaveValue('4.5');
  await expect(page.getByRole('region', { name: '2D health overview', exact: true }).getByText('MANUAL', { exact: true })).toBeVisible();
});

test('2D shows starting circles, current diamonds and exact changes without loading WebGL', async ({ page }) => {
  await boot(page);
  await page.getByRole('slider', { name: 'Sleep Duration', exact: true }).fill('7.5');
  await page.getByRole('slider', { name: 'Perceived Stress Level', exact: true }).fill('4');
  const overview = page.getByRole('region', { name: '2D health overview', exact: true });
  await expect(overview.getByRole('img', { name: 'Current parameter illustration', exact: true }))
    .toHaveAccessibleDescription(/Perceived stress: 4 out of 10.*Starting values:.*perceived stress 2 out of 10/);
  await expect(overview).toContainText('Starting: 8 hours/night');
  await expect(overview).toContainText('Change: -0.5 hours/night');
  await expect(overview.locator('svg circle')).toHaveCount(4);
  await expect(overview.locator('svg path')).toHaveCount(4);
  const sleepSvg = overview.locator('svg').nth(2);
  const startingX = Number(await sleepSvg.locator('circle').getAttribute('cx'));
  const currentPath = await sleepSvg.locator('path').getAttribute('d');
  expect(startingX).toBe(196);
  expect(currentPath).toContain('M 173 5');
  await overview.getByRole('button', { name: 'Compare settings and habit guidance', exact: true }).click();
  const row = dialog(page).getByRole('region', { name: 'Sleep duration comparison', exact: true });
  await expect(row).toContainText('-0.5 hours/night');
  await expect(row.getByRole('definition').nth(0)).toContainText('8');
  await expect(row.getByRole('definition').nth(1)).toContainText('7.5');
  await expect(page.locator('canvas')).toHaveCount(0);
});

test('the starting point survives scene, mode and camera changes until explicitly replaced', async ({ page }) => {
  await boot(page);
  await page.getByRole('slider', { name: 'Sleep Duration', exact: true }).fill('5');
  await page.getByRole('navigation', { name: 'Habit topics', exact: true }).getByRole('button', { name: 'Food', exact: true }).click();
  await page.getByRole('button', { name: /lite 3d/i }).click();
  await page.getByRole('button', { name: /^Wide view/i }).click();
  await trigger(page).click();
  const row = dialog(page).getByRole('region', { name: 'Sleep duration comparison', exact: true });
  await expect(row).toContainText('-3 hours/night');
  await expect(row).toContainText('This setting is not used by the current 3D scene.');
  await dialog(page).getByRole('button', { name: 'Use current settings as starting point', exact: true }).click();
  await expect(dialog(page).getByRole('status')).toContainText('No settings have changed');
  await expect(row.getByRole('definition').nth(0)).toContainText('5');
  await dialog(page).getByRole('button', { name: 'Close settings comparison', exact: true }).click();
  await expect(trigger(page)).toBeFocused();
  await page.getByRole('button', { name: /2d diagram/i }).click();
  await page.getByRole('slider', { name: 'Sleep Duration', exact: true }).fill('6');
  await trigger(page).click();
  await expect(dialog(page).getByRole('region', { name: 'Sleep duration comparison', exact: true })).toContainText('+1 hours/night');
});

test('loading an example starts a fresh comparison and includes additional model inputs later changed by examples', async ({ page }) => {
  await boot(page);
  await page.getByRole('slider', { name: 'Sleep Duration', exact: true }).fill('5');
  const preset = FALLBACK_PRESETS.find(item => item.slug === 'single-pillar-failure')!;
  await page.getByRole('button').filter({ has: page.getByText(preset.title, { exact: true }) }).click();
  await trigger(page).click();
  await expect(dialog(page)).toContainText('Starting point: ' + preset.title);
  await expect(dialog(page).getByRole('status')).toContainText('No settings have changed');
  await dialog(page).getByRole('button', { name: 'Close settings comparison', exact: true }).click();
  await page.getByRole('slider', { name: 'Sleep Duration', exact: true }).fill('6');
  await trigger(page).click();
  await expect(dialog(page).getByRole('region', { name: 'Sleep duration comparison', exact: true })).toContainText('+1.5 hours/night');
  await expect(dialog(page)).toContainText('Starting point: ' + preset.title);
});

test('3D comparisons distinguish numerical changes from real scene changes', async ({ page }) => {
  await boot(page, 'pillar=sleep');
  const canvas = await page.locator('canvas').elementHandle();
  await page.getByRole('slider', { name: 'Sleep Duration', exact: true }).fill('7.5');
  await trigger(page).click();
  await expect(dialog(page).getByRole('region', { name: '3D appearance comparison', exact: true })).toContainText('The 3D appearance is unchanged');
  await expect(dialog(page).getByRole('region', { name: 'Sleep duration comparison', exact: true })).toContainText('-0.5 hours/night');
  await dialog(page).getByRole('button', { name: 'Close settings comparison', exact: true }).click();
  await page.getByRole('slider', { name: 'Sleep Duration', exact: true }).fill('5');
  await trigger(page).click();
  const visual = dialog(page).getByRole('region', { name: '3D appearance comparison', exact: true });
  await expect(visual).toContainText('Violet core');
  await expect(visual).toContainText('Dimmer glow');
  await expect(visual).toContainText('The graphic appearance differs');
  await dialog(page).getByRole('button', { name: 'Close settings comparison', exact: true }).click();
  expect(await canvas!.evaluate(node => node.isConnected)).toBe(true);
  await expect(page.getByRole('slider', { name: 'Sleep Duration', exact: true })).toHaveValue('5');
});

test('a combined scene explains why changed food values leave its appearance unchanged', async ({ page }) => {
  await boot(page, 'pillar=systems');
  await page.getByRole('slider', { name: 'Whole Food Ratio', exact: true }).fill('20');
  await trigger(page).click();
  await expect(dialog(page).getByRole('region', { name: 'Whole-food setting comparison', exact: true })).toContainText('-60 percentage points');
  await expect(dialog(page).getByRole('region', { name: 'Whole-food setting comparison', exact: true })).toContainText('This setting is not used by the current 3D scene.');
  await expect(dialog(page).getByRole('region', { name: '3D appearance comparison', exact: true })).toContainText('Food and strength settings do not change this combined 3D colour.');
  await expect(dialog(page).getByRole('region', { name: '3D appearance comparison', exact: true })).toContainText('The 3D appearance is unchanged');
});

test('guidance links preserve the guided preference and never turn slider values into a plan', async ({ page }) => {
  await boot(page, 'pillar=sleep&view=2d&idea=routine');
  await page.getByRole('slider', { name: 'Sleep Duration', exact: true }).fill('5');
  await trigger(page).click();
  const row = dialog(page).getByRole('region', { name: 'Sleep duration comparison', exact: true });
  await row.locator('summary').click();
  await expect(row).toContainText('Adults generally need 7–9 hours');
  await expect(row.getByRole('link', { name: /NHS: sleep needs/ })).toHaveAttribute('href', 'https://www.nhs.uk/conditions/insomnia/');
  const link = row.getByRole('link', { name: 'Plan a manageable next step', exact: true });
  await expect(link).toHaveAttribute('href', '/next-step?pillar=sleep&idea=routine');
  await link.click();
  await expect(page.getByRole('textbox', { name: 'One manageable action', exact: true })).toHaveValue('Choose a wind-down cue around my main sleep period, adapting it to my work or caring routine.');
});

test('comparisons do not read or overwrite saved habit plans and reload starts a new comparison', async ({ page }) => {
  await boot(page);
  const saved = 'SAVED-PLAN-AND-CHECK-INS';
  await page.evaluate(value => localStorage.setItem('healthcrest.habit-draft.v1', value), saved);
  await page.getByRole('slider', { name: 'Sleep Duration', exact: true }).fill('5');
  await trigger(page).click();
  await dialog(page).getByRole('button', { name: 'Use current settings as starting point', exact: true }).click();
  expect(await page.evaluate(() => localStorage.getItem('healthcrest.habit-draft.v1'))).toBe(saved);
  await page.reload();
  await trigger(page).click();
  await expect(dialog(page).getByRole('status')).toContainText('No settings have changed');
  await expect(dialog(page).getByRole('region', { name: 'Sleep duration comparison', exact: true }).getByRole('definition').first()).toContainText('8');
  expect(await page.evaluate(() => localStorage.getItem('healthcrest.habit-draft.v1'))).toBe(saved);
});

for (const width of [320, 390, 768, 1440]) {
  test('comparison controls remain reachable by keyboard at ' + width + 'px', async ({ page }) => {
    await page.setViewportSize({ width, height: width === 320 ? 568 : 900 });
    await boot(page);
    const compare = trigger(page);
    await expect(compare).toBeVisible();
    const box = await compare.boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(width);
    const render = page.getByRole('group', { name: 'Render mode', exact: true });
    const renderBox = await render.boundingBox();
    expect(renderBox!.x + renderBox!.width).toBeLessThanOrEqual(width);
    await compare.focus();
    await page.keyboard.press('Enter');
    const close = dialog(page).getByRole('button', { name: 'Close settings comparison', exact: true });
    await expect(close).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(dialog(page).getByRole('button', { name: 'Close and keep exploring', exact: true })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(close).toBeFocused();
    const content = dialog(page).getByRole('region', { name: 'Settings comparison content', exact: true });
    await content.focus();
    await page.keyboard.press('End');
    await expect(dialog(page).getByRole('button', { name: 'Use current settings as starting point', exact: true })).toBeInViewport();
    expect(await content.evaluate(node => node.scrollWidth <= node.clientWidth)).toBe(true);
    await page.keyboard.press('Escape');
    await expect(dialog(page)).toHaveCount(0);
    await expect(compare).toBeFocused();
    await test.info().attach('comparison-layout.png', { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' });
  });
}

test('a graphics failure and reduced motion still leave comparison available', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
      value: function (this: HTMLCanvasElement, kind: string, ...args: unknown[]) {
        if (kind === 'webgl' || kind === 'webgl2' || kind === 'experimental-webgl') return null;
        return Reflect.apply(original, this, [kind, ...args]);
      },
    });
  });
  await boot(page, 'pillar=sleep');
  await expect(page.getByRole('button', { name: /2d diagram/i })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('slider', { name: 'Sleep Duration', exact: true }).fill('5');
  await trigger(page).click();
  await expect(dialog(page).getByRole('region', { name: 'Sleep duration comparison', exact: true })).toContainText('-3 hours/night');
  await expect(dialog(page).getByRole('region', { name: '3D appearance comparison', exact: true })).toHaveCount(0);
});
