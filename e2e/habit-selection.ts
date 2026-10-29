import { expect, type Locator, type Page, type TestInfo } from '@playwright/test';

async function expectSelectedMark(buttons: Locator, selected: Locator) {
  await expect(selected).toHaveAttribute('aria-pressed', 'true');
  await expect(buttons.locator('[data-selected="true"]')).toHaveCount(1);
  const mark = selected.locator('.hc-selection-mark');
  await expect(mark).toBeVisible();
  await expect(mark).toHaveAttribute('aria-hidden', 'true');
  const rendered = await mark.evaluate(element => {
    const style = getComputedStyle(element), box = element.getBoundingClientRect();
    return { visibility: style.visibility, stroke: style.stroke, width: box.width, height: box.height };
  });
  expect(rendered.visibility).toBe('visible');
  expect(rendered.stroke).not.toBe('none');
  expect(rendered.stroke).not.toBe('rgba(0, 0, 0, 0)');
  expect(rendered.width).toBeGreaterThanOrEqual(16);
  expect(rendered.height).toBeGreaterThanOrEqual(16);
  for (const button of await buttons.all()) {
    const box = await button.boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(button.page().viewportSize()!.width);
    expect(box!.height).toBeGreaterThanOrEqual(44);
    if (await button.getAttribute('aria-pressed') !== 'true') await expect(button.locator('.hc-selection-mark')).toBeHidden();
  }
}

export async function checkHabitSelection(page: Page, testInfo: TestInfo, screenshots = false) {
  const labels = ['Movement', 'Food', 'Sleep', 'Stress & support'];
  const mode = await page.evaluate(() => matchMedia('(forced-colors: active)').matches
    ? 'forced-' + (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : 'normal');
  const attach = async (name: string) => {
    if (screenshots) await testInfo.attach(name + '-' + mode + '-' + page.viewportSize()!.width, { body: await page.screenshot(), contentType: 'image/png' });
  };
  const activate = async (button: Locator) => {
    await button.focus();
    await page.keyboard.press('Enter');
  };
  await page.goto('/');
  await page.keyboard.press('Tab');
  const preview = page.getByRole('group', { name: 'Preview pillars', exact: true });
  for (const label of labels) {
    const button = preview.getByRole('button', { name: label, exact: true });
    await activate(button);
    await expectSelectedMark(preview.getByRole('button'), button);
    await expect(page.getByRole('region', { name: 'Selected habit', exact: true })).toContainText(label);
  }
  await activate(preview.getByRole('button', { name: 'Sleep', exact: true }));
  await attach('habit-selection-home');
  await page.getByRole('link', { name: 'Make a manageable next step', exact: true }).click();
  await expect(page).toHaveURL(/\/next-step\?pillar=sleep$/);
  const choices = page.getByRole('group', { name: 'Choose a habit pillar', exact: true });
  const action = page.getByRole('textbox', { name: 'One manageable action', exact: true });
  await action.fill('A small sleep action on this page');
  for (const label of labels) {
    const button = choices.getByRole('button', { name: label, exact: true });
    await activate(button);
    await expectSelectedMark(choices.getByRole('button'), button);
  }
  await activate(choices.getByRole('button', { name: 'Sleep', exact: true }));
  await expect(action).toHaveValue('A small sleep action on this page');
  await attach('habit-selection-planner');
  const overview = page.getByRole('region', { name: 'Pillar draft overview', exact: true });
  await overview.getByRole('button', { name: 'See all four pillar drafts', exact: true }).click();
  const openButtons = overview.getByRole('button', { name: /^Open .* draft$/ });
  for (const label of labels) {
    const button = overview.getByRole('button', { name: 'Open ' + label.toLowerCase() + ' draft', exact: true });
    await activate(button);
    await expect(action).toBeFocused();
    await expectSelectedMark(openButtons, button);
    await expectSelectedMark(choices.getByRole('button'), choices.getByRole('button', { name: label, exact: true }));
  }
  const currentCard = overview.getByRole('article', { name: 'Stress & support', exact: true });
  await currentCard.scrollIntoViewIfNeeded();
  await attach('habit-selection-overview');
  await activate(choices.getByRole('button', { name: 'Sleep', exact: true }));
  await expect(action).toHaveValue('A small sleep action on this page');
  expect(await page.evaluate(() => localStorage.getItem('healthcrest.habit-draft.v1'))).toBeNull();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}
