import { test, expect } from '@playwright/test';

test('body scan covers four habits, manual regions and return to original view', async ({ page }) => {
  await page.goto('/engine?view=scan');
  await expect(page.getByRole('region', { name: 'Habit body scan' })).toBeVisible();
  const habit = page.getByLabel('Habit', { exact: true });
  const manual = page.getByRole('slider', { name: /Move scanner manually/ });
  for (const [choice, title, setting] of [
    ['Fitness', 'Metabolic health', 'Moderate activity per week'],
    ['Nutrition', 'Digestion and fibre', 'Fruit and vegetable portions per day'],
    ['Sleep', 'Metabolic regulation', 'Typical sleep per night'],
    ['Stress', 'Gut and routines', 'Time for calming practice each day'],
  ]) {
    await habit.selectOption(choice);
    await expect(page.getByRole('slider', { name: new RegExp(setting) })).toBeVisible();
    await manual.fill('49');
    await expect(page.getByRole('heading', { name: title })).toBeVisible();
    await expect(manual).toHaveAttribute('aria-valuetext', 'Abdomen');
  }
  await page.getByLabel('Body illustration').selectOption('male');
  await expect(page.getByAltText(/Illustrative male anatomy/)).toBeVisible();
  await page.getByRole('button', { name: 'Start scan' }).click();
  await expect(page.getByRole('button', { name: 'Pause scan' })).toBeVisible();
  await page.getByRole('button', { name: 'Pause scan' }).click();
  await page.getByRole('button', { name: 'Original view' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'HABIT EXPLORER' })).toBeVisible();
});

test('mobile body scan keeps view switch in the controls and announces keyboard regions', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/engine?view=scan&pillar=sleep');
  const scan = page.getByRole('region', { name: 'Habit body scan' });
  const figure = scan.locator('img[alt*="anatomy"]');
  const original = scan.getByRole('button', { name: 'Original view' });
  const figureBox = await figure.boundingBox();
  const buttonBox = await original.boundingBox();
  expect(figureBox).not.toBeNull();
  expect(buttonBox).not.toBeNull();
  expect(buttonBox!.y).toBeGreaterThan(figureBox!.y + figureBox!.height);
  const manual = scan.getByRole('slider', { name: /Move scanner manually/ });
  await manual.fill('49');
  await manual.press('ArrowRight');
  await expect(manual).toHaveAttribute('aria-valuetext', 'Abdomen');
  await expect(scan.getByRole('status').last()).toContainText('Metabolic regulation');
  await expect(scan.getByRole('link', { name: 'NIH sleep and health' })).toHaveAttribute('href', 'https://www.nhlbi.nih.gov/health/sleep-deprivation/health-effects');
});

test('speech failure returns to announced captions', async ({ page }) => {
  await page.addInitScript(() => {
    class MockUtterance {
      lang = '';
      rate = 1;
      onerror: (() => void) | null = null;
      constructor(public text: string) {}
    }
    Object.defineProperty(window, 'SpeechSynthesisUtterance', { value: MockUtterance });
    Object.defineProperty(window, 'speechSynthesis', {
      value: { cancel() {}, speak(utterance: MockUtterance) { setTimeout(() => utterance.onerror?.(), 0); } },
    });
  });
  await page.goto('/engine?view=scan');
  await page.getByRole('button', { name: 'Voice off' }).click();
  await page.getByRole('button', { name: 'Start scan' }).click();
  await expect(page.getByRole('status').last()).toContainText('continuing with captions');
  await expect(page.getByRole('button', { name: 'Voice off' })).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('.hc-body-scan [aria-live="polite"]')).toBeVisible();
});
