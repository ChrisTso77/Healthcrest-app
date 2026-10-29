import { test, expect, type Page } from '@playwright/test';
import { FALLBACK_PRESETS } from './lib/presets/fallback';

const trigger = (page: Page) => page.getByRole('button', { name: 'Compare starting and current settings', exact: true });
const dialog = (page: Page) => page.getByRole('dialog', { name: 'Starting and current settings', exact: true });
async function boot(page: Page, query = 'pillar=sleep&view=2d') {
  await page.route('**/api/presets', route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: FALLBACK_PRESETS }) }));
  await page.goto('/engine?' + query);
  await expect(page.getByRole('heading', { name: 'HABIT EXPLORER', exact: true })).toBeVisible();
}

test('2D shows starting circles, current diamonds and exact changes without loading WebGL', async ({ page }) => {
  await boot(page);
  await page.getByRole('slider', { name: 'Sleep Duration', exact: true }).fill('7.5');
  const overview = page.getByRole('region', { name: '2D health overview', exact: true });
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
  await page.getByRole('navigation', { name: 'Health pillars', exact: true }).getByRole('button', { name: 'Nutrition', exact: true }).click();
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
