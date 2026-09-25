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

  test('render mode controls stay synchronized with the rendered viewport', async ({ page }) => {
    const high3d = page.getByRole('button', { name: /high 3d/i });
    const lite3d = page.getByRole('button', { name: /lite 3d/i });
    const canvas2d = page.getByRole('button', { name: /2d canvas/i });

    await expect(high3d).toHaveClass(/border-emerald-500\/30/);

    await lite3d.click();
    await expect(lite3d).toHaveClass(/border-emerald-500\/30/);
    await expect(page.locator('canvas')).toBeVisible();

    await canvas2d.click();
    await expect(canvas2d).toHaveClass(/border-emerald-500\/30/);
    await expect(
      page.getByText('Interactive 2D Vector Health Engine')
    ).toBeVisible();

    await high3d.click();
    await expect(high3d).toHaveClass(/border-emerald-500\/30/);
    await expect(page.locator('canvas')).toBeVisible();
  });

  test('active pillar control stays synchronized with canonical state', async ({ page }) => {
    const sleepPreset = page.getByRole('button', {
      name: /Sleep Rung 1/i,
    });

    await sleepPreset.click();

    const sleep = page.getByRole('button', {
      name: 'Sleep',
      exact: true,
    });

    await expect(sleep).toHaveClass(/border-slate-700\/50/);

    const fitness = page.getByRole('button', {
      name: 'Fitness',
      exact: true,
    });

    await fitness.click();

    await expect(fitness).toHaveClass(/border-slate-700\/50/);
    await expect(sleep).not.toHaveClass(/border-slate-700\/50/);
  });

  test('active preset presentation follows canonical reducer state', async ({ page }) => {
    const sleepPreset = page.getByRole('button', {
      name: /Sleep Rung 1/i,
    });

    await sleepPreset.click();

    await expect(sleepPreset).toHaveClass(/border-emerald-500\/50/);
    await expect(
      page.getByText('7-9h Restorative Sleep & Substance Cut-offs')
    ).toBeVisible();

    await page.getByRole('button', {
      name: 'Fitness',
      exact: true,
    }).click();

    await expect(sleepPreset).not.toHaveClass(/border-emerald-500\/50/);
    await expect(page.getByText('MANUAL', { exact: true })).toBeVisible();
  });

  test('manual pillar selection does not leave a stale preset selected', async ({ page }) => {
    const integratedPreset = page.getByRole('button', {
      name: /Integrated Harmony/i,
    });

    await integratedPreset.click();

    await expect(
      page.getByText('Maximum Allostatic Resilience & Systemic Equilibrium')
    ).toBeVisible();

    await page.getByRole('button', {
      name: 'Fitness',
      exact: true,
    }).click();

    await expect(
      page.getByRole('button', {
        name: 'Fitness',
        exact: true,
      })
    ).toBeVisible();

    // Manual navigation must not leave the previous preset presented
    // as though it still describes the active state.
    await expect(integratedPreset).not.toHaveClass(/border-emerald-500\/50/);
  });

  test('alcohol units stay synchronized with canonical preset state', async ({ page }) => {
    const hud = page.locator('[data-alcohol-units]');

    await expect(hud).toHaveAttribute('data-alcohol-units', '2');

    await page.getByRole('button', {
      name: /Single-Pillar Failure/i,
    }).click();

    await expect(hud).toHaveAttribute('data-alcohol-units', '18');

    await page.getByRole('button', {
      name: /Sleep Rung 1/i,
    }).click();

    await expect(hud).toHaveAttribute('data-alcohol-units', '0');
  });

  test('parameter controls stay synchronized with canonical preset state', async ({ page }) => {
    const sliders = page.getByRole('slider');

    await page.getByRole('button', {
      name: /Sleep Rung 1/i,
    }).click();

    await expect(sliders.nth(0)).toHaveValue('150');
    await expect(sliders.nth(1)).toHaveValue('8');
    await expect(sliders.nth(2)).toHaveValue('75');
    await expect(sliders.nth(3)).toHaveValue('3');

    await sliders.nth(0).fill('220');
    await expect(sliders.nth(0)).toHaveValue('220');
  });

  test('manual parameter change clears the active preset', async ({ page }) => {
    const integratedPreset = page.getByRole('button', {
      name: /Integrated Harmony/i,
    });

    await integratedPreset.click();

    await expect(integratedPreset).toHaveClass(/border-emerald-500\/50/);

    const aerobicSlider = page.getByRole('slider').first();
    await aerobicSlider.fill('220');

    await expect(integratedPreset).not.toHaveClass(
      /border-emerald-500\/50/
    );

    await expect(page.getByText('MANUAL', { exact: true })).toBeVisible();
  });

  test('manual changes clear stale preset status in 2D fallback', async ({ page }) => {
    await page.getByRole('button', {
      name: /Single-Pillar Failure/i,
    }).click();

    await page.getByRole('button', {
      name: 'Fitness',
      exact: true,
    }).click();

    await page.getByRole('button', {
      name: /2d canvas/i,
    }).click();

    const fallback = page.getByTestId('health-engine-2d-fallback');

    await expect(
      fallback.getByText('MANUAL', { exact: true })
    ).toBeVisible();

    await expect(
      fallback.getByText('Not classified', { exact: false })
    ).toBeVisible();

    await expect(
      fallback.getByText('WARNING', { exact: true })
    ).toHaveCount(0);
  });

  test('camera controls stay synchronized with canonical camera state', async ({ page }) => {
    const viewport = page.locator('[data-camera-shot]');

    const failureShot = page.getByRole('button', {
      name: /Shot 2: Single-Pillar Strain/i,
    });

    await failureShot.click();

    await expect(failureShot).toHaveClass(/border-cyan-500\/40/);
    await expect(viewport).toHaveAttribute(
      'data-camera-shot',
      'shot-2-failure'
    );

    await page.getByRole('button', {
      name: /Sleep Rung 1/i,
    }).click();

    const macroShot = page.getByRole('button', {
      name: /Shot 3: Core Deformation/i,
    });

    await expect(macroShot).toHaveClass(/border-cyan-500\/40/);
    await expect(viewport).toHaveAttribute(
      'data-camera-shot',
      'shot-3-macro'
    );
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

  test('reapplies the active camera shot after manual orbit', async ({ page }) => {
    const viewport = page.locator('[data-camera-request-revision]');
    const shot = page.getByRole('button', {
      name: /Shot 1: Equilibrium Orbit/i,
    });

    await expect(viewport).toHaveAttribute('data-camera-request-revision', '0');

    await shot.click();
    await expect(viewport).toHaveAttribute('data-camera-request-revision', '1');

    const canvas = page.locator('canvas');
    const box = await canvas.boundingBox();

    if (!box) {
      throw new Error('WebGL canvas bounding box unavailable');
    }

    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(
      box.x + box.width / 2 + 80,
      box.y + box.height / 2 + 40,
      { steps: 5 }
    );
    await page.mouse.up();

    // The same active shot must issue a fresh camera command.
    await shot.click();

    await expect(viewport).toHaveAttribute('data-camera-request-revision', '2');
    await expect(viewport).toHaveAttribute(
      'data-camera-shot',
      'shot-1-orbit'
    );
    await expect(canvas).toBeVisible();
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

  test('Sanity preset synchronizes clinical state and camera', async ({ page }) => {
    const preset = page.getByRole('button', {
      name: /Integrated Harmony/i,
    });

    await expect(preset).toBeVisible();
    await preset.click();

    await expect(
      page.getByText('Maximum Allostatic Resilience & Systemic Equilibrium')
    ).toBeVisible();

    await expect(
      page.getByRole('button', { name: /Shot 1: Equilibrium Orbit/i })
    ).toBeVisible();

    await expect(page.locator('canvas')).toBeVisible();
  });


  test('HUD consumes presets returned by the API', async ({ page }) => {
    let intercepted = false;

    await page.route('**/api/presets', async (route) => {
      intercepted = true;

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          count: 1,
          data: [
            {
              id: 'test-cms-only',
              slug: 'test-cms-only',
              title: 'CMS Only Test Preset',
              pillar: 'Sleep',
              status: 'optimal',
              evidenceLevel: 'Guideline-level',
              parameters: {
                aerobicMins: 160,
                strengthDays: 2,
                sleepDuration: 9,
                wholeFoodRatio: 88,
                stressLevel: 2,
                alcoholUnits: 0
              },
              headline: 'CMS-only preset loaded successfully',
              outcomes: ['CMS data path verified'],
              cameraShot: 'shot-3-macro'
            }
          ]
        })
      });
    });

    // Force a fresh navigation after the mock has been installed.
    await page.goto('/?cms-test=1', { waitUntil: 'networkidle' });

    expect(intercepted).toBeTruthy();

    const preset = page.getByRole('button', {
      name: /CMS Only Test Preset/i
    });

    await expect(preset).toBeVisible();
    await preset.click();

    await expect(
      page.getByText('CMS-only preset loaded successfully')
    ).toBeVisible();

    await expect(page.locator('canvas')).toBeVisible();
  });


  test('warning preset synchronizes reducer state into 2D fallback', async ({ page }) => {
    await page.route('**/api/presets', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          count: 1,
          data: [
            {
              id: 'test-warning-preset',
              slug: 'test-warning-preset',
              title: 'Warning State Test Preset',
              pillar: 'Systems',
              status: 'warning',
              evidenceLevel: 'High-quality review',
              parameters: {
                aerobicMins: 300,
                strengthDays: 4,
                sleepDuration: 4.5,
                wholeFoodRatio: 50,
                stressLevel: 8,
                alcoholUnits: 18
              },
              headline: 'Warning state synchronization test',
              outcomes: ['Reducer overlay synchronization verified'],
              cameraShot: 'shot-2-failure'
            }
          ]
        })
      });
    });

    await page.goto('/?warning-state-test=1', {
      waitUntil: 'networkidle'
    });

    const preset = page.getByRole('button', {
      name: /Warning State Test Preset/i
    });

    await expect(preset).toBeVisible();
    await preset.click();

    await expect(
      page.getByText('Warning state synchronization test')
    ).toBeVisible();

    await page.getByRole('button', { name: /2d canvas/i }).click();

    await expect(
      page.getByText('Interactive 2D Vector Health Engine')
    ).toBeVisible();

    const fallback = page.getByText(
      'Interactive 2D Vector Health Engine'
    ).locator('..').locator('..');

    await expect(
      fallback.getByText('WARNING', { exact: true })
    ).toBeVisible();

    await expect(
      page.getByText('4.5h Restorative', { exact: true })
    ).toBeVisible();

    await expect(
      page.getByText('Lvl 8/10', { exact: true })
    ).toBeVisible();
  });

});

