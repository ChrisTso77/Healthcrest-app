import { test, expect } from '@playwright/test';

test.describe('Healthcrest production regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('HEALTH OPTIMISATION')).toBeVisible();
  });

  test('renders the WebGL health engine', async ({ page }) => {
    const canvas = page.locator('canvas');

    await expect(canvas).toBeVisible();
    await expect(canvas).toHaveCount(1);
  });

  test('pillar controls remain interactive', async ({ page }) => {
    for (const pillar of [
      'Fitness',
      'Nutrition',
      'Sleep',
      'Stress',
      'Systems',
    ]) {
      const pillarButton = page.getByRole('button', {
        name: pillar,
        exact: true,
      });

      await pillarButton.click();
      await expect(pillarButton).toBeVisible();
    }

    await expect(page.locator('canvas')).toBeVisible();
  });

  test('health parameter sliders remain interactive', async ({ page }) => {
    const sliders = page.locator('input[type="range"]');

    await expect(sliders).toHaveCount(4);

    const aerobic = sliders.nth(0);
    await aerobic.fill('250');
    await expect(aerobic).toHaveValue('250');

    const sleep = sliders.nth(1);
    await sleep.fill('7.5');
    await expect(sleep).toHaveValue('7.5');

    const nutrition = sliders.nth(2);
    await nutrition.fill('85');
    await expect(nutrition).toHaveValue('85');

    const stress = sliders.nth(3);
    await stress.fill('4');
    await expect(stress).toHaveValue('4');
  });

  test('switches between WebGL and 2D fallback', async ({ page }) => {
    await page.getByRole('button', { name: /2d canvas/i }).click();

    await expect(
      page.getByText('Interactive 2D Vector Health Engine')
    ).toBeVisible();

    await page.getByRole('button', { name: /high 3d/i }).click();

    await expect(page.locator('canvas')).toBeVisible();
  });

  test('camera director shots and reset remain usable', async ({ page }) => {
    const shots = [
      /Shot 1: Equilibrium Orbit/i,
      /Shot 2: Single-Pillar Strain/i,
      /Shot 3: Core Deformation/i,
      /Shot 4: Systemic Resonance/i,
    ];

    for (const shot of shots) {
      await page.getByRole('button', { name: shot }).click();
      await expect(page.locator('canvas')).toBeVisible();
    }

    await page
      .getByRole('button', { name: /reset camera viewport/i })
      .click();

    await expect(page.locator('canvas')).toBeVisible();
  });

  test('preset selection keeps WebGL alive', async ({ page }) => {
    await page
      .getByRole('button', { name: /Integrated Harmony/i })
      .click();

    await expect(page.locator('canvas')).toBeVisible();

    await page
      .getByRole('button', { name: /Sleep Rung 1/i })
      .click();

    await expect(page.locator('canvas')).toBeVisible();
  });

  test('presets API responds successfully', async ({ request }) => {
    const response = await request.get('/api/presets');

    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(body).toHaveProperty('success', true);
    expect(Array.isArray(body.data)).toBeTruthy();
  });
});
