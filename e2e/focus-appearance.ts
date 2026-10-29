import { expect, type Locator, type Page, type TestInfo } from '@playwright/test';

// Test the rendered outline against the surrounding surface, outside the control.
async function expectFocusRing(control: Locator, minimumContrast = 3, ring = control) {
  await control.scrollIntoViewIfNeeded();
  await control.focus();
  await expect(control).toBeFocused();
  expect(await control.evaluate(element => element.matches(':focus-visible'))).toBe(true);
  const appearance = await ring.evaluate(element => {
    const style = getComputedStyle(element);
    let parent = element.parentElement;
    let background = '';
    while (parent) {
      const candidate = getComputedStyle(parent).backgroundColor;
      if (!candidate.includes('rgba') && candidate !== 'transparent') { background = candidate; break; }
      parent = parent.parentElement;
    }
    return { color: style.outlineColor, style: style.outlineStyle,
      width: parseFloat(style.outlineWidth), offset: parseFloat(style.outlineOffset), background };
  });
  const luminance = (color: string) => {
    const channels = color.match(/^rgb\((\d+), (\d+), (\d+)\)$/);
    expect(channels, 'An opaque sRGB outline/surrounding surface must be measurable').not.toBeNull();
    const values = channels!.slice(1).map(value => {
      const channel = Number(value) / 255;
      return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    });
    return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
  };
  const first = luminance(appearance.color), second = luminance(appearance.background);
  const contrast = (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
  expect(appearance.style).toBe('solid');
  expect(appearance.width).toBeGreaterThanOrEqual(3);
  expect(appearance.offset).toBeGreaterThanOrEqual(3);
  expect(contrast, 'Rendered outline contrast against ' + appearance.background).toBeGreaterThanOrEqual(minimumContrast);
}

export async function checkPublicFocus(page: Page, testInfo: TestInfo, screenshots = false) {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const sleep = page.getByRole('group', { name: 'Preview pillars', exact: true }).getByRole('button', { name: 'Sleep', exact: true });
  await expectFocusRing(sleep, 7);
  await page.keyboard.press('Enter');
  await expect(sleep).toHaveAttribute('aria-pressed', 'true');
  if (screenshots) await testInfo.attach('homepage-dark-focus-' + page.viewportSize()!.width, { body: await page.screenshot(), contentType: 'image/png' });

  await page.goto('/learn');
  await page.keyboard.press('Tab');
  const search = page.getByRole('searchbox', { name: 'Search health topics and terms', exact: true });
  await expectFocusRing(search);
  await page.keyboard.type('sleep');
  await expect(search).toHaveValue('sleep');
  await page.getByRole('article', { name: 'Sleep', exact: true }).getByRole('link', { name: /Read.*guide/i }).click();
  await page.keyboard.press('Tab');
  const idea = page.getByRole('link', { name: /^Use this idea in my plan:/ }).first();
  await expectFocusRing(idea);
  if (screenshots) await testInfo.attach('guide-light-focus-' + page.viewportSize()!.width, { body: await page.screenshot(), contentType: 'image/png' });
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/next-step\?/);
  await page.keyboard.press('Tab');
  const action = page.getByRole('textbox', { name: 'One manageable action', exact: true });
  await expectFocusRing(action);
  await action.fill('A small step for this browser test');
  const guidance = page.getByRole('complementary', { name: 'Why this habit matters', exact: true });
  await expectFocusRing(guidance.getByRole('link', { name: 'Explore sleep in the Habit Explorer', exact: true }), 7);
  if (screenshots) await testInfo.attach('planner-dark-focus-' + page.viewportSize()!.width, { body: await page.screenshot(), contentType: 'image/png' });
  expect(await page.evaluate(() => localStorage.getItem('healthcrest.habit-draft.v1'))).toBeNull();

  await page.goto('/start');
  await page.keyboard.press('Tab');
  const radio = page.getByRole('radio').first();
  await expectFocusRing(radio, 3, radio.locator('..'));
  await page.keyboard.press('Space');
  await expect(radio).toBeChecked();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}
