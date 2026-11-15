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
