import { test, expect, type Request, type Route } from '@playwright/test';
import { FALLBACK_PRESETS } from './lib/presets/fallback';

type DrawCounts = { points: number; triangles: number; lines: number };

test.describe('Healthcrest production regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/engine');
    await expect(page.getByText('HABIT EXPLORER')).toBeVisible();
  });

  test('pillar goals lead to contextual habit guidance without resetting the Habit Explorer', async ({ page }) => {
    await page.route('**/api/presets', (route) => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, data: FALLBACK_PRESETS }),
    }));
    await page.goto('/engine?pillar-health-guide-test=1');
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
    const originalCanvas = await canvas.elementHandle();
    const sleep = page.getByRole('slider', { name: 'Sleep Duration', exact: true });
    await sleep.fill('7.5');

    for (const [pillar, goal, source] of [
      ['Fitness', 'Move more and build capacity', 'https://www.nhs.uk/live-well/exercise/physical-activity-guidelines-for-adults-aged-19-to-64/'],
      ['Nutrition', 'Build a balanced eating pattern', 'https://www.nhs.uk/live-well/eat-well/food-guidelines-and-food-labels/the-eatwell-guide/'],
      ['Sleep', 'Support sleep and recovery', 'https://www.nhs.uk/conditions/insomnia/'],
      ['Stress', 'Make room for coping and recovery', 'https://www.nhs.uk/mental-health/feelings-symptoms-behaviours/feelings-and-symptoms/stress/'],
      ['Systems', 'Connect the habits', 'https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/five-steps-to-mental-wellbeing/'],
    ]) {
      await page.getByRole('navigation', { name: 'Health pillars' })
        .getByRole('button', { name: pillar, exact: true }).click();
      const summary = page.getByRole('region', { name: 'Scenario summary', exact: true });
      const goalCard = summary.getByRole('region', { name: 'Health goal', exact: true });
      await expect(goalCard.getByRole('heading', { name: goal, exact: true })).toBeVisible();
      const why = goalCard.getByRole('button', { name: 'Why this matters', exact: true });
      await why.click();
      const dialog = page.getByRole('dialog', { name: 'Understand this view', exact: true });
      await expect(dialog.getByRole('heading', { name: `${pillar}: ${goal}`, exact: true })).toBeVisible();
      await expect(dialog.getByRole('link', { name: /^NHS:/ })).toHaveAttribute('href', source);
      await expect(dialog.getByRole('link', { name: 'Make a manageable next step', exact: true }))
        .toHaveAttribute('href', pillar === 'Systems' ? '/next-step' : '/next-step?pillar=' + pillar.toLowerCase());
      await expect(dialog.getByText('7.5 hours/night', { exact: true })).toBeVisible();
      await expect(dialog).toContainText('Manual settings: no evidence preset is currently applied.');
      await dialog.getByText('How this scene responds', { exact: true }).click();
      if (pillar === 'Systems') {
        await expect(dialog.getByText(/Nutrition and strength do not change its combined colour/)).toBeVisible();
      }
      await page.keyboard.press('Escape');
      await expect(dialog).toHaveCount(0);
      await expect(why).toBeFocused();
      await expect(sleep).toHaveValue('7.5');
      expect(await originalCanvas!.evaluate((element) => element === document.querySelector('canvas'))).toBe(true);
    }
  });

  test('guide explains experimental evidence and follows manual changes on a phone', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.route('**/api/presets', (route) => route.fulfill({ status: 503, body: 'unavailable' }));
    await page.goto('/engine?guide-evidence-test=1');
    const experimental = page.getByRole('button', { name: /Research example: timed sound/i });
    await experimental.click();
    const sleep = page.getByRole('slider', { name: 'Sleep Duration', exact: true });
    await expect(sleep).toHaveValue('8.5');
    const guide = page.getByRole('button', { name: 'Guide: understand this view', exact: true });
    await guide.click();
    const dialog = page.getByRole('dialog', { name: 'Understand this view', exact: true });
    const selected = dialog.getByRole('group', { name: 'Selected scenario', exact: true });
    await expect(selected).toContainText('Research example: timed sound during sleep');
    await expect(selected).toContainText('Experimental');
    await expect(selected).toContainText('Exploratory content. It does not establish a proven health intervention or a routine recommendation.');
    await expect(dialog.getByRole('region', { name: 'Current pillar' })).toContainText('Choose a consistent getting-up time');
    const content = dialog.getByRole('region', { name: 'Health guide content', exact: true });
    expect(await content.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
    await page.keyboard.press('Escape');
    await expect(experimental).toHaveAttribute('aria-pressed', 'true');
    await expect(guide).toBeFocused();

    await sleep.scrollIntoViewIfNeeded();
    await sleep.fill('7.5');
    await page.getByRole('button', { name: /2d canvas/i }).click();
    await guide.click();
    await expect(selected).toHaveCount(0);
    await expect(dialog).toContainText('Manual settings: no evidence preset is currently applied.');
    await expect(dialog.getByText('7.5 hours/night', { exact: true })).toBeVisible();
    await dialog.getByText('Visual cues and unfamiliar terms', { exact: true }).click();
    await expect(dialog.getByText('Heart-rate variability: variation in the time between heartbeats. This app does not measure it.', { exact: true })).toBeVisible();
    await dialog.getByRole('button', { name: 'Close & explore', exact: true }).click();
    await expect(page.getByRole('button', { name: /2d canvas/i })).toHaveAttribute('aria-pressed', 'true');
    await expect(sleep).toHaveValue('7.5');
  });

  test('2D overview exposes current values and preset status without invented scores', async ({ page }) => {
    await page.route('**/api/presets', (route) => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, data: FALLBACK_PRESETS }),
    }));
    await page.goto('/engine?accessible-2d-overview-test=1');
    await page.getByRole('button', { name: /Short sleep and higher stress example/i }).click();
    await page.getByRole('button', { name: /2d canvas/i }).click();

    const overview = page.getByRole('region', { name: '2D health overview', exact: true });
    const illustration = overview.getByRole('img', { name: 'Current parameter illustration', exact: true });
    await expect(illustration).toHaveAccessibleDescription(
      /Selected pillar: Systems\. Scenario: example settings\..*Sleep duration: 4\.5 hours per night/
    );
    await expect(overview.getByText('EXAMPLE', { exact: true })).toBeVisible();
    await expect(overview.getByRole('definition')).toHaveText([
      '300 minutes/week', '50%', '4.5 hours/night', '8 / 10',
    ]);
    await expect(overview).not.toContainText(/Interdependence Score|92\/100|64\/100|38\/100|Restorative/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);

    for (const [name, value] of [
      ['Weekly aerobic activity', '220'],
      ['Whole Food Ratio', '75'],
      ['Sleep Duration', '7.5'],
      ['Perceived Stress Level', '3'],
    ]) {
      await page.getByRole('slider', { name, exact: true }).fill(value);
    }
    await page.getByRole('button', { name: 'Sleep', exact: true }).click();
    await expect(overview.getByText('MANUAL', { exact: true })).toBeVisible();
    await expect(overview.getByRole('definition')).toHaveText([
      '220 minutes/week', '75%', '7.5 hours/night', '3 / 10',
    ]);
    await expect(illustration).toHaveAccessibleDescription(
      /Selected pillar: Sleep\. Scenario: manual settings\..*Aerobic activity: 220 minutes per week\..*Whole food ratio: 75 percent\..*Sleep duration: 7\.5 hours per night\..*Perceived stress: 3 out of 10/
    );

    for (const mode of [/lite 3d/i, /high 3d/i, /2d canvas/i]) {
      await page.getByRole('button', { name: mode }).click();
    }
    await expect(overview.getByRole('definition')).toHaveText([
      '220 minutes/week', '75%', '7.5 hours/night', '3 / 10',
    ]);
  });

  for (const viewport of [
    { width: 320, height: 568 },
    { width: 390, height: 844 },
    { width: 1280, height: 720 },
  ]) {
    test(`2D overview stays reachable with dock and CMS notices at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);
      let attempts = 0;
      await page.route('**/api/presets', (route) => {
        attempts += 1;
        return route.fulfill({
          status: attempts === 1 ? 503 : 200,
          contentType: 'application/json',
          body: JSON.stringify(attempts === 1
            ? { error: 'unavailable' }
            : { success: true, data: FALLBACK_PRESETS }),
        });
      });
      // Include automatic graphics fallback in the smallest viewport.
      if (viewport.width === 320) {
        await page.addInitScript(() => {
          const getContext = HTMLCanvasElement.prototype.getContext;
          Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
            value: function (this: HTMLCanvasElement, type: string, ...args: unknown[]) {
              if (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl') return null;
              return Reflect.apply(getContext, this, [type, ...args]);
            },
          });
        });
      }
      await page.goto('/engine?2d-layout-test=1');
      await expect(page.getByRole('status')).toBeVisible();
      if (viewport.width !== 320) {
        await page.getByRole('button', { name: /2d canvas/i }).click();
      }

      const overview = page.getByRole('region', { name: '2D health overview', exact: true });
      const dock = page.getByRole('button', {
        name: /Explore habits & scenarios/i,
      });
      const expectClearLayout = async () => {
        await expect.poll(async () => {
          const regionBox = await overview.boundingBox();
          const headerBox = await page.locator('header').boundingBox();
          const dockBox = await dock.locator('..').boundingBox();
          const footerBox = await page.locator('footer').boundingBox();
          if (!regionBox || !headerBox || !dockBox || !footerBox) return false;
          return regionBox.height > 32
            && regionBox.x >= 0
            && regionBox.x + regionBox.width <= viewport.width
            && regionBox.y >= headerBox.y + headerBox.height
            && regionBox.y + regionBox.height <= dockBox.y
            && dockBox.y + dockBox.height <= footerBox.y;
        }).toBe(true);
        expect(await overview.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
      };
      await expectClearLayout();
      const expandedDockHeight = (await overview.boundingBox())!.height;
      await overview.focus();
      await expect(overview).toBeFocused();
      await page.keyboard.press('End');
      await expect.poll(() => overview.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
      await page.keyboard.press('Home');
      await expect.poll(() => overview.evaluate((element) => element.scrollTop)).toBe(0);

      await dock.click();
      await expect(dock).toHaveAttribute('aria-expanded', 'false');
      await expect.poll(async () => (await overview.boundingBox())!.height).toBeGreaterThan(expandedDockHeight + 60);
      await expectClearLayout();
      const value = overview.getByRole('definition').last();
      await value.scrollIntoViewIfNeeded();
      expect(await value.evaluate((element) => {
        const box = element.getBoundingClientRect();
        return element.contains(document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2));
      })).toBe(true);
      await test.info().attach('2d-overview.png', {
        body: await page.screenshot(),
        contentType: 'image/png',
      });

      const beforeRecovery = (await overview.boundingBox())!.height;
      await page.getByRole('button', { name: 'Retry presets', exact: true }).click();
      await expect(page.getByRole('status')).toHaveCount(0);
      await expect.poll(async () => (await overview.boundingBox())!.height).toBeGreaterThan(beforeRecovery + 30);
      await expectClearLayout();
      await dock.click();
      await expect(dock).toHaveAttribute('aria-expanded', 'true');
      await expectClearLayout();
    });
  }

  for (const initialMotion of ['reduce', 'no-preference'] as const) {
    test(`respects ${initialMotion} on load and live motion preference changes`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: initialMotion });
      await page.addInitScript(() => {
        let draws = 0;
        Object.defineProperty(window, '__healthcrestDraws', { get: () => draws });
        for (const method of ['drawArrays', 'drawElements'] as const) {
          const original = WebGL2RenderingContext.prototype[method];
          Object.defineProperty(WebGL2RenderingContext.prototype, method, {
            value: function (this: WebGL2RenderingContext, ...args: number[]) {
              draws += 1;
              return Reflect.apply(original, this, args);
            },
          });
        }
      });
      await page.goto('/engine?motion-preference-test=1');
      const canvas = page.locator('canvas');
      const renderer = page.locator('[data-reduced-motion]');
      const drawCount = () => page.evaluate(() =>
        (window as unknown as { __healthcrestDraws: number }).__healthcrestDraws
      );
      // Sample over time to distinguish an idle renderer from automatic animation.
      const expectIdle = async () => {
        await expect.poll(async () => {
          const before = await drawCount();
          await page.waitForTimeout(250);
          return await drawCount() === before;
        }).toBe(true);
      };
      await expect(canvas).toBeVisible();
      await expect.poll(drawCount).toBeGreaterThan(0);
      await expect(renderer).toHaveAttribute('data-reduced-motion', String(initialMotion === 'reduce'));
      if (initialMotion === 'reduce') {
        await expectIdle();
      } else {
        const beforeAnimation = await drawCount();
        await expect.poll(drawCount).toBeGreaterThan(beforeAnimation + 20);
      }
      const originalCanvas = await canvas.elementHandle();
      const sleep = page.getByRole('slider', { name: 'Sleep Duration', exact: true });
      await sleep.fill('7.5');

      await page.emulateMedia({ reducedMotion: 'reduce' });
      await expect(renderer).toHaveAttribute('data-reduced-motion', 'true');
      await expectIdle();
      const beforeEdit = await drawCount();
      await sleep.fill('6');
      await expect.poll(drawCount).toBeGreaterThan(beforeEdit);
      await expectIdle();

      const beforeGesture = await drawCount();
      await page.mouse.move(620, 280);
      await page.mouse.down();
      await page.mouse.move(700, 320, { steps: 5 });
      await page.mouse.up();
      await expect.poll(drawCount).toBeGreaterThan(beforeGesture);
      await expectIdle();

      const beforeCamera = await drawCount();
      await page.getByRole('button', { name: /Shot 3: Core Deformation/i }).click();
      await expect.poll(drawCount).toBeGreaterThan(beforeCamera);
      await expectIdle();

      await page.getByRole('button', { name: /lite 3d/i }).click();
      await expectIdle();
      await expect(sleep).toHaveValue('6');
      expect(await originalCanvas!.evaluate((element) => element === document.querySelector('canvas'))).toBe(true);
      await expect.poll(() => page.evaluate(() =>
        document.getAnimations().filter((animation) => animation.playState === 'running').length
      )).toBe(0);

      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await expect(renderer).toHaveAttribute('data-reduced-motion', 'false');
      const beforeResume = await drawCount();
      await expect.poll(drawCount).toBeGreaterThan(beforeResume + 20);
      await expect(sleep).toHaveValue('6');
      expect(await originalCanvas!.evaluate((element) => element === document.querySelector('canvas'))).toBe(true);

      await page.emulateMedia({ reducedMotion: 'reduce' });
      await expect(renderer).toHaveAttribute('data-reduced-motion', 'true');
      await expectIdle();
      await page.getByRole('button', { name: /2d canvas/i }).click();
      await expect(page.getByText('6h / night', { exact: true })).toBeVisible();
      await page.getByRole('button', { name: /high 3d/i }).click();
      await expect(canvas).toBeVisible();
      await expectIdle();
      await expect(sleep).toHaveValue('6');
    });
  }

  for (const pixelRatio of [1, 2]) {
    test.describe(`render quality at ${pixelRatio}x pixel density`, () => {
      test.use({ deviceScaleFactor: pixelRatio, viewport: { width: 390, height: 844 } });

      test('Lite 3D reduces actual graphics work and restores High detail', async ({ page }) => {
        await page.addInitScript(() => {
          const counts = { points: 0, triangles: 0, lines: 0 };
          Object.defineProperty(window, '__healthcrestDrawCounts', { value: counts });
          for (const prototype of [WebGLRenderingContext.prototype, WebGL2RenderingContext.prototype]) {
            for (const method of ['drawArrays', 'drawElements'] as const) {
              const original = prototype[method];
              Object.defineProperty(prototype, method, {
                value: function (this: WebGLRenderingContext, ...args: number[]) {
                  const mode = args[0];
                  const count = args[method === 'drawElements' ? 1 : 2];
                  if (mode === this.POINTS) counts.points = count;
                  if (mode === this.TRIANGLES) counts.triangles = count;
                  if (mode === this.LINES) counts.lines = count;
                  return Reflect.apply(original, this, args);
                },
              });
            }
          }
        });
        await page.goto('/engine?render-quality-test=1');
        const canvas = page.locator('canvas');
        await expect(canvas).toBeVisible();
        const sleep = page.getByRole('slider', { name: 'Sleep Duration', exact: true });
        await sleep.scrollIntoViewIfNeeded();
        await sleep.fill('7.5');

        const drawCounts = () => page.evaluate(() =>
          (window as unknown as { __healthcrestDrawCounts: DrawCounts }).__healthcrestDrawCounts
        );
        const bufferRatio = () => canvas.evaluate((element: HTMLCanvasElement) => element.width / element.clientWidth);
        await expect.poll(async () => {
          const counts = await drawCounts();
          return counts.points > 0 && counts.triangles > 0 && counts.lines > 0;
        }).toBe(true);
        await expect.poll(bufferRatio).toBeCloseTo(pixelRatio, 1);
        const high = await drawCounts();
        const originalCanvas = await canvas.elementHandle();

        await page.getByRole('button', { name: /lite 3d/i }).click();
        await expect.poll(bufferRatio).toBeCloseTo(1, 1);
        await expect.poll(async () => {
          const lite = await drawCounts();
          return lite.points < high.points && lite.triangles < high.triangles && lite.lines < high.lines;
        }).toBe(true);
        await test.info().attach('render-workload.json', {
          body: JSON.stringify({ pixelRatio, high, lite: await drawCounts() }),
          contentType: 'application/json',
        });
        await expect(sleep).toHaveValue('7.5');
        expect(await originalCanvas!.evaluate((element) => element === document.querySelector('canvas'))).toBe(true);

        await page.getByRole('button', { name: /high 3d/i }).click();
        await expect.poll(bufferRatio).toBeCloseTo(pixelRatio, 1);
        await expect.poll(drawCounts).toEqual(high);
        await expect(sleep).toHaveValue('7.5');
        expect(await originalCanvas!.evaluate((element) => element === document.querySelector('canvas'))).toBe(true);
      });
    });
  }

  for (const viewport of [{ width: 1280, height: 720 }, { width: 320, height: 568 }]) {
    for (const scenario of [
      {
        trigger: 'Home & Global Narrative',
        title: 'HEALTH THROUGH EVERYDAY HABITS',
        close: 'Close global narrative',
        content: 'Global narrative content',
        done: 'Close & Return to the Habit Explorer',
      },
      {
        trigger: 'Guide: understand this view',
        title: 'Understand this view',
        close: 'Close health guide',
        content: 'Health guide content',
        done: 'Close & explore',
      },
      {
        trigger: 'Clinical & Legal Disclaimer',
        title: 'CLINICAL & MEDICO-LEGAL DISCLAIMER',
        close: 'Close clinical disclaimer',
        content: 'Clinical disclaimer content',
        done: 'I Understand & Acknowledge',
      },
    ]) {
      test(`${scenario.trigger} manages modal focus and dismissal at ${viewport.width}px`, async ({ page }) => {
        await page.setViewportSize(viewport);
        const trigger = page.getByRole('button', { name: scenario.trigger, exact: true });
        await trigger.click();
        const dialog = page.getByRole('dialog', { name: scenario.title, exact: true });
        const close = dialog.getByRole('button', { name: scenario.close, exact: true });
        const done = dialog.getByRole('button', { name: scenario.done, exact: true });
        await expect(dialog).toBeVisible();
        await expect(close).toBeFocused();
        await page.keyboard.press('Shift+Tab');
        await expect(done).toBeFocused();
        await page.keyboard.press('Tab');
        await expect(close).toBeFocused();

        // Native modal inertness must reject focus on background engine controls.
        await page.locator('input[type="range"]').nth(1).evaluate((input) => input.focus());
        await expect(close).toBeFocused();
        if (viewport.width === 320) {
          const content = dialog.getByRole('region', { name: scenario.content, exact: true });
          await content.focus();
          await page.keyboard.press('End');
          await expect.poll(() => content.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
        }
        await page.keyboard.press('Escape');
        await expect(dialog).toHaveCount(0);
        await expect(trigger).toBeFocused();

        await trigger.click();
        await close.click();
        await expect(dialog).toHaveCount(0);
        await expect(trigger).toBeFocused();
        await trigger.click();
        await done.click();
        await expect(dialog).toHaveCount(0);
        await expect(trigger).toBeFocused();
      });
    }
  }

  for (const viewport of [
    { width: 320, height: 568 },
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1024, height: 768 },
  ]) {
    test(`compact layout keeps engine controls usable at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/engine?compact-layout-test=1');
      const navigation = page.getByRole('navigation', { name: 'Health pillars' });
      await expect(navigation).toBeVisible();
      for (const pillar of ['Fitness', 'Nutrition', 'Sleep', 'Stress', 'Systems']) {
        const button = navigation.getByRole('button', { name: pillar, exact: true });
        await button.click();
        await expect(button).toHaveAttribute('aria-pressed', 'true');
      }

      const clinicalToggle = page.getByRole('button', { name: 'Scenario summary', exact: true });
      const cameraToggle = page.getByRole('button', { name: 'Camera controls', exact: true });
      await clinicalToggle.click();
      await expect(page.getByRole('region', { name: 'Scenario summary' })).toBeVisible();
      await cameraToggle.click();
      await expect(page.getByRole('region', { name: 'Scenario summary' })).toBeHidden();
      await page.getByRole('button', { name: /Shot 3: Core Deformation/i }).click();
      await cameraToggle.click();
      await expect(page.getByRole('region', { name: 'Camera controls' })).toBeHidden();

      await page.getByRole('button', { name: /2d canvas/i }).click();
      const sleep = page.getByRole('slider', { name: 'Sleep Duration', exact: true });
      await sleep.scrollIntoViewIfNeeded();
      await sleep.fill('7.5');
      const footer = await page.locator('footer').boundingBox();
      const slider = await sleep.boundingBox();
      expect(footer).not.toBeNull();
      expect(slider).not.toBeNull();
      expect(slider!.y + slider!.height).toBeLessThan(footer!.y);

      const dock = page.getByRole('button', { name: /Explore habits & scenarios/i });
      await dock.click();
      await expect(dock).toHaveAttribute('aria-expanded', 'false');
      await expect(page.getByText('7.5h / night', { exact: true })).toBeVisible();
      const controls = [navigation, page.getByRole('group', { name: 'Render mode' }), page.locator('footer')];
      for (const control of controls) {
        const box = await control.boundingBox();
        expect(box).not.toBeNull();
        expect(box!.x).toBeGreaterThanOrEqual(0);
        expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width);
      }
      await page.getByRole('button', { name: /Clinical & Legal Disclaimer/i }).click();
      await expect(page.getByRole('dialog', { name: /CLINICAL & MEDICO-LEGAL DISCLAIMER/i })).toBeVisible();
    });
  }

  test('keeps mobile CMS recovery and parameter controls reachable', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    let attempts = 0;
    await page.route('**/api/presets', (route) => {
      attempts += 1;
      return route.fulfill({
        status: attempts === 1 ? 503 : 200,
        contentType: 'application/json',
        body: JSON.stringify(attempts === 1
          ? { error: 'unavailable' }
          : { success: true, data: [FALLBACK_PRESETS[0]] }),
      });
    });
    await page.goto('/engine?mobile-cms-recovery-test=1');
    await expect(page.getByRole('status')).toBeVisible();
    const sleep = page.getByRole('slider', { name: 'Sleep Duration', exact: true });
    await sleep.scrollIntoViewIfNeeded();
    await sleep.fill('7.5');
    const footer = await page.locator('footer').boundingBox();
    const slider = await sleep.boundingBox();
    expect(slider!.y + slider!.height).toBeLessThan(footer!.y);

    const retry = page.getByRole('button', { name: 'Retry presets', exact: true });
    const retryBox = await retry.boundingBox();
    expect(retryBox!.x).toBeGreaterThanOrEqual(0);
    expect(retryBox!.x + retryBox!.width).toBeLessThanOrEqual(320);
    expect(retryBox!.y + retryBox!.height).toBeLessThanOrEqual(568);
    await retry.click();
    await expect(page.getByRole('status')).toHaveCount(0);
    await expect(sleep).toHaveValue('7.5');
    expect(attempts).toBe(2);
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

  test('exposes named sliders with guidance and supports keyboard parameter changes', async ({ page }) => {
    for (const name of ['Weekly aerobic activity', 'Sleep Duration', 'Whole Food Ratio', 'Perceived Stress Level']) {
      await expect(page.getByRole('slider', { name, exact: true })).toBeVisible();
    }

    const sleep = page.getByRole('slider', { name: 'Sleep Duration', exact: true });
    await expect(sleep).toHaveAccessibleDescription('Adults often need 7–9 hours; quality and routine also matter.');
    await sleep.fill('7.5');
    await sleep.focus();
    await page.keyboard.press('ArrowRight');
    await expect(sleep).toHaveValue('8');
    await expect(sleep).toHaveAttribute('aria-valuetext', '8 hours per night');

    const render2d = page.getByRole('button', { name: /2d canvas/i });
    await render2d.focus();
    await page.keyboard.press('Space');
    await expect(render2d).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByText('8h / night', { exact: true })).toBeVisible();
  });

  test('exposes control selections and dock state during keyboard navigation', async ({ page }) => {
    const sleep = page.getByRole('button', { name: 'Sleep', exact: true });
    await sleep.focus();
    await page.keyboard.press('Enter');
    await expect(sleep).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByRole('button', { name: 'Systems', exact: true }))
      .toHaveAttribute('aria-pressed', 'false');

    const macro = page.getByRole('button', { name: /Shot 3: Core Deformation/i });
    await macro.focus();
    await page.keyboard.press('Enter');
    await expect(macro).toHaveAttribute('aria-pressed', 'true');

    const failure = page.getByRole('button', { name: /Short sleep and higher stress example/i });
    await failure.focus();
    await page.keyboard.press('Enter');
    await expect(failure).toHaveAttribute('aria-pressed', 'true');
    const sleepSlider = page.getByRole('slider', { name: 'Sleep Duration', exact: true });
    await expect(sleepSlider).toHaveAttribute('aria-valuetext', '4.5 hours per night');
    await sleepSlider.focus();
    await page.keyboard.press('ArrowRight');
    await expect(failure).toHaveAttribute('aria-pressed', 'false');

    const dock = page.getByRole('button', { name: /Explore habits & scenarios/ });
    await expect(dock).toHaveAttribute('aria-expanded', 'true');
    await dock.focus();
    await page.keyboard.press('Enter');
    await expect(dock).toHaveAttribute('aria-expanded', 'false');
    await expect(sleepSlider).toHaveCount(0);
    await page.keyboard.press('Space');
    await expect(dock).toHaveAttribute('aria-expanded', 'true');
    await expect(sleepSlider).toHaveValue('5');
  });

  test('switches between WebGL and 2D fallback', async ({ page }) => {
    await page.getByRole('button', { name: /2d canvas/i }).click();

    await expect(
      page.getByText('Habit Explorer · 2D view')
    ).toBeVisible();

    await page.getByRole('button', { name: /high 3d/i }).click();

    await expect(page.locator('canvas')).toBeVisible();
  });

  test('automatically uses 2D when WebGL is unavailable and preserves controls on retry', async ({ page }) => {
    await page.addInitScript(() => {
      const getContext = HTMLCanvasElement.prototype.getContext;
      Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
        value: function (this: HTMLCanvasElement, type: string, ...args: unknown[]) {
          if (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl') return null;
          return Reflect.apply(getContext, this, [type, ...args]);
        },
      });
    });
    await page.goto('/engine?webgl-unavailable-test=1');

    const mode2d = page.getByRole('button', { name: /2d canvas/i });
    await expect(page.getByText('Habit Explorer · 2D view')).toBeVisible();
    await expect(mode2d).toHaveClass(/border-emerald-500\/30/);
    await expect(page.locator('canvas')).toHaveCount(0);

    const sleepSlider = page.locator('input[type="range"]').nth(1);
    await sleepSlider.fill('7.5');
    await page.getByRole('button', { name: /high 3d/i }).click();
    await expect(mode2d).toHaveClass(/border-emerald-500\/30/);
    await expect(sleepSlider).toHaveValue('7.5');
    await expect(page.getByText('7.5h / night', { exact: true })).toBeVisible();
  });

  test('uses the interactive 2D engine when its 3D module cannot load', async ({ page }) => {
    let blocked3dModule = false;
    await page.route('**/_next/static/chunks/*.js', async (route) => {
      const response = await route.fetch();
      if ((await response.text()).includes('data-camera-request-revision')) {
        blocked3dModule = true;
        await route.abort('failed');
      } else {
        await route.fulfill({ response });
      }
    });
    await page.goto('/engine?webgl-module-failure-test=1');

    await expect.poll(() => blocked3dModule).toBe(true);
    await expect(page.getByText('Habit Explorer · 2D view')).toBeVisible();
    await expect(page.getByRole('button', { name: /2d canvas/i }))
      .toHaveClass(/border-emerald-500\/30/);
    await expect(page.getByText('LOADING HABIT EXPLORER...')).toHaveCount(0);

    await page.getByRole('button', { name: /Short sleep and higher stress example/i }).click();
    await expect(page.getByText('4.5h / night', { exact: true })).toBeVisible();
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
      page.getByText('Habit Explorer · 2D view')
    ).toBeVisible();

    await high3d.click();
    await expect(high3d).toHaveClass(/border-emerald-500\/30/);
    await expect(page.locator('canvas')).toBeVisible();
  });

  test('active pillar control stays synchronized with canonical state', async ({ page }) => {
    const sleepPreset = page.getByRole('button', {
      name: /Sleep example: everyday foundations/i,
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
      name: /Sleep example: everyday foundations/i,
    });

    await sleepPreset.click();

    await expect(sleepPreset).toHaveClass(/border-emerald-500\/50/);
    await expect(
      page.getByText('Explore sleep duration and routine')
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
      name: /Connected habits example/i,
    });

    await integratedPreset.click();

    await expect(
      page.getByText('Explore habits together')
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
      name: /Short sleep and higher stress example/i,
    }).click();

    await expect(hud).toHaveAttribute('data-alcohol-units', '18');

    await page.getByRole('button', {
      name: /Sleep example: everyday foundations/i,
    }).click();

    await expect(hud).toHaveAttribute('data-alcohol-units', '0');
  });

  test('parameter controls stay synchronized with canonical preset state', async ({ page }) => {
    const sliders = page.getByRole('slider');

    await page.getByRole('button', {
      name: /Sleep example: everyday foundations/i,
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
      name: /Connected habits example/i,
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
      name: /Short sleep and higher stress example/i,
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
      fallback.getByText('Manual settings. Select a preset to view its evidence summary.', { exact: true })
    ).toBeVisible();

    await expect(
      fallback.getByText('EXAMPLE', { exact: true })
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
      name: /Sleep example: everyday foundations/i,
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
      .getByRole('button', { name: /Connected habits example/i })
      .click();

    await expect(page.locator('canvas')).toBeVisible();

    await page
      .getByRole('button', { name: /Sleep example: everyday foundations/i })
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
      name: /Connected habits example/i,
    });

    await expect(preset).toBeVisible();
    await preset.click();

    await expect(
      page.getByText('Explore habits together')
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
    await page.goto('/engine?cms-test=1', { waitUntil: 'networkidle' });

    expect(intercepted).toBeTruthy();

    const preset = page.getByRole('button', {
      name: /Unreviewed Sleep example/i
    });

    await expect(preset).toBeVisible();
    await preset.click();

    await expect(
      page.getByText('Example settings awaiting content review')
    ).toBeVisible();

    await expect(page.locator('canvas')).toBeVisible();
  });


  for (const scenario of [
    { name: 'failed CMS request', status: 503, body: '{"error":"unavailable"}' },
    { name: 'malformed CMS JSON', status: 200, body: '{invalid' },
    { name: 'invalid CMS response', status: 200, body: '{"success":false}' },
    { name: 'empty CMS preset list', status: 200, body: '{"success":true,"data":[]}' },
  ]) {
    test(`keeps fallback presets interactive after ${scenario.name}`, async ({ page }) => {
      await page.route('**/api/presets', (route) => route.fulfill({
        status: scenario.status,
        contentType: 'application/json',
        body: scenario.body,
      }));

      await page.goto('/engine?cms-failure-test=1');
      await expect(page.getByRole('status')).toHaveText(
        'CMS presets unavailable — using local evidence presets.'
      );

      await page.getByRole('button', { name: /Short sleep and higher stress example/i }).click();
      await expect(page.locator('input[type="range"]').nth(1)).toHaveValue('4.5');
      await expect(page.getByText('Compare a different set of example settings')).toBeVisible();

      await page.getByRole('button', { name: /2d canvas/i }).click();
      await expect(page.getByText('Habit Explorer · 2D view')).toBeVisible();
      await expect(page.getByText('4.5h / night', { exact: true })).toBeVisible();
    });
  }

  test('times out a stalled CMS request while fallback controls remain usable', async ({ page }) => {
    let stalledRequest: Request | undefined;
    let aborted = false;
    page.on('requestfailed', (request) => {
      if (request === stalledRequest) aborted = true;
    });
    await page.route('**/api/presets', (route) => {
      // Leave the request pending so the application's own timeout must cancel it.
      stalledRequest = route.request();
    });

    await page.goto('/engine?cms-timeout-test=1');
    await expect.poll(() => stalledRequest !== undefined).toBe(true);
    await page.getByRole('button', { name: /Short sleep and higher stress example/i }).click();
    await expect(page.locator('input[type="range"]').nth(1)).toHaveValue('4.5');
    await expect(page.getByRole('status')).toHaveText(
      'CMS presets unavailable — using local evidence presets.',
      { timeout: 15_000 }
    );
    await expect.poll(() => aborted).toBe(true);
    await expect(page.getByText('Compare a different set of example settings')).toBeVisible();
  });

  test('retries CMS loading without losing manual parameters or render mode', async ({ page }) => {
    let attempts = 0;
    let pendingRetry: Route | undefined;
    const recoveredPreset = {
      ...FALLBACK_PRESETS[0],
      id: 'recovered-cms-preset',
      slug: 'recovered-cms-preset',
      title: 'Recovered CMS Preset',
    };
    await page.route('**/api/presets', (route) => {
      attempts += 1;
      if (attempts === 1) {
        return route.fulfill({ status: 503, body: 'unavailable' });
      }
      pendingRetry = route;
    });

    await page.goto('/engine?cms-recovery-test=1');
    await expect(page.getByRole('status')).toBeVisible();
    const sleepSlider = page.locator('input[type="range"]').nth(1);
    await sleepSlider.fill('7.5');
    await page.getByRole('button', { name: /2d canvas/i }).click();

    await page.getByRole('button', { name: 'Retry presets', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Retrying…', exact: true })).toBeDisabled();
    await expect.poll(() => pendingRetry !== undefined).toBe(true);
    expect(attempts).toBe(2);
    await pendingRetry!.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, data: [recoveredPreset] }),
    });

    await expect(page.getByRole('status')).toHaveCount(0);
    await expect(page.getByRole('button', { name: /Unreviewed Systems example/i })).toBeVisible();
    await expect(sleepSlider).toHaveValue('7.5');
    await expect(page.getByText('Habit Explorer · 2D view')).toBeVisible();
    await expect(page.getByRole('button', { name: /Retry presets|Retrying…/ })).toHaveCount(0);
  });

  test('allows another retry when the CMS is still unavailable', async ({ page }) => {
    let attempts = 0;
    await page.route('**/api/presets', (route) => {
      attempts += 1;
      return route.fulfill({ status: 503, body: 'unavailable' });
    });

    await page.goto('/engine?cms-retry-failure-test=1');
    const retry = page.getByRole('button', { name: 'Retry presets', exact: true });
    await expect(retry).toBeEnabled();
    for (const expectedAttempts of [2, 3]) {
      await retry.click();
      await expect.poll(() => attempts).toBe(expectedAttempts);
      await expect(retry).toBeEnabled();
      await expect(page.getByRole('status')).toBeVisible();
    }
    await page.getByRole('button', { name: /Short sleep and higher stress example/i }).click();
    await expect(page.locator('input[type="range"]').nth(1)).toHaveValue('4.5');
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

    await page.goto('/engine?warning-state-test=1', {
      waitUntil: 'networkidle'
    });

    const preset = page.getByRole('button', {
      name: /Unreviewed Systems example/i
    });

    await expect(preset).toBeVisible();
    await preset.click();

    await expect(
      page.getByText('Example settings awaiting content review')
    ).toBeVisible();

    await page.getByRole('button', { name: /2d canvas/i }).click();

    await expect(
      page.getByText('Habit Explorer · 2D view')
    ).toBeVisible();

    const fallback = page.getByText(
      'Habit Explorer · 2D view'
    ).locator('..').locator('..');

    await expect(
      fallback.getByText('EXAMPLE', { exact: true })
    ).toBeVisible();

    await expect(
      page.getByText('4.5h / night', { exact: true })
    ).toBeVisible();

    await expect(
      page.getByText('Lvl 8/10', { exact: true })
    ).toBeVisible();
  });

});



test.describe('Inline setting explanations', () => {
  test('explaining each setting preserves the scenario and updates with manual values', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.route('**/api/presets', route => route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ success: true, data: FALLBACK_PRESETS }),
    }));
    await page.goto('/engine');
    const preset = page.getByRole('button', { name: /Connected habits example/i });
    await preset.click();
    const canvas = await page.locator('canvas').elementHandle();
    const initialValues = await page.getByRole('slider').evaluateAll(elements =>
      elements.map(element => (element as HTMLInputElement).value));
    for (const [label, meaning, source, slug] of [
      ['Weekly aerobic activity', 'MVPA means moderate-to-vigorous physical activity.', 'https://www.nhs.uk/live-well/exercise/physical-activity-guidelines-for-adults-aged-19-to-64/', 'fitness'],
      ['Sleep Duration', 'Hours of sleep per night in the scenario.', 'https://www.nhs.uk/conditions/insomnia/', 'sleep'],
      ['Whole Food Ratio', 'It is not a measured diet-quality score', 'https://www.nhs.uk/live-well/eat-well/food-guidelines-and-food-labels/the-eatwell-guide/', 'nutrition'],
      ['Perceived Stress Level', 'It is not a clinical test', 'https://www.nhs.uk/mental-health/feelings-symptoms-behaviours/feelings-and-symptoms/stress/', 'stress'],
    ]) {
      const summary = page.getByLabel('Explain this setting: ' + label, { exact: true });
      const explanation = page.getByRole('region', { name: label + ' explained', exact: true });
      await summary.click();
      await expect(explanation).toContainText(meaning);
      await expect(explanation.getByRole('link', { name: /^NHS:/ })).toHaveAttribute('href', source);
      await expect(explanation.getByRole('link', { name: 'Plan a manageable next step', exact: true }))
        .toHaveAttribute('href', '/next-step?pillar=' + slug);
      await expect(preset).toHaveAttribute('aria-pressed', 'true');
      await summary.click();
    }
    expect(await page.getByRole('slider').evaluateAll(elements =>
      elements.map(element => (element as HTMLInputElement).value))).toEqual(initialValues);
    expect(await canvas!.evaluate(element => element === document.querySelector('canvas'))).toBe(true);
    await page.getByLabel('Explain this setting: Sleep Duration', { exact: true }).click();
    await page.getByRole('slider', { name: 'Sleep Duration', exact: true }).fill('7.5');
    await expect(page.getByRole('region', { name: 'Sleep Duration explained', exact: true }))
      .toContainText('Chosen scenario value: 7.5 hours per night');
    await expect(preset).toHaveAttribute('aria-pressed', 'false');
  });

  test('view explanations distinguish unused 3D inputs, active scenes and 2D', async ({ page }) => {
    await page.goto('/engine');
    const explanation = page.getByRole('region', { name: 'Whole Food Ratio explained', exact: true });
    await page.getByLabel('Explain this setting: Whole Food Ratio', { exact: true }).click();
    await expect(explanation).toContainText('This setting does not change the Systems 3D scene.');
    await expect(explanation).toContainText('It does not set a whole-food percentage target');
    await page.getByRole('navigation', { name: 'Health pillars' }).getByRole('button', { name: 'Nutrition', exact: true }).click();
    await expect(explanation).toContainText('The nutrition scene responds to food-pattern inputs');
    await expect(explanation).not.toContainText('This setting does not change');
    await expect(explanation).toContainText('a small change can leave the same colour');
    await page.getByRole('button', { name: /lite 3d/i }).click();
    await expect(explanation).toContainText('The nutrition scene responds to food-pattern inputs');
    await page.getByRole('button', { name: /2d canvas/i }).click();
    await expect(explanation).toContainText('The 2D overview labels this setting');
    await expect(explanation).not.toContainText('The nutrition scene responds');
    await page.getByRole('slider', { name: 'Whole Food Ratio', exact: true }).fill('65');
    await expect(explanation).toContainText('Chosen scenario value: 65 percent');
  });

  for (const viewport of [
    { width: 320, height: 568 }, { width: 390, height: 844 },
    { width: 768, height: 1024 }, { width: 1440, height: 900 },
  ]) {
    test('inline guidance is keyboard accessible and scrollable at ' + viewport.width + 'px', async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/engine?pillar=sleep');
      const dock = page.getByRole('region', { name: 'Habit settings and scenarios', exact: true });
      const summary = page.getByLabel('Explain this setting: Sleep Duration', { exact: true });
      await summary.scrollIntoViewIfNeeded();
      await summary.focus();
      await page.keyboard.press('Enter');
      const content = page.getByRole('region', { name: 'Sleep Duration explained', exact: true });
      await expect(content).toContainText('Adults generally need 7–9 hours of sleep');
      const plan = content.getByRole('link', { name: 'Plan a manageable next step', exact: true });
      await plan.scrollIntoViewIfNeeded();
      await expect(plan).toBeVisible();
      expect(await dock.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
      expect(await content.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
      const box = await plan.boundingBox();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width);
      expect(box!.y).toBeGreaterThanOrEqual(0);
      expect(box!.y + box!.height).toBeLessThanOrEqual(viewport.height);
      await summary.scrollIntoViewIfNeeded();
      await summary.focus();
      await page.keyboard.press('Space');
      await expect(content).toBeHidden();
      await expect(summary).toBeFocused();
    });
  }

  test('a setting explanation opens its own habit plan even from another pillar', async ({ page }) => {
    await page.goto('/engine?pillar=fitness');
    await page.getByLabel('Explain this setting: Sleep Duration', { exact: true }).click();
    await page.getByRole('region', { name: 'Sleep Duration explained', exact: true })
      .getByRole('link', { name: 'Plan a manageable next step', exact: true }).click();
    await expect(page).toHaveURL(/\/next-step\?pillar=sleep$/);
    await expect(page.getByRole('group', { name: 'Choose a habit pillar' })
      .getByRole('button', { name: 'Sleep', exact: true })).toHaveAttribute('aria-pressed', 'true');
  });
});


test.describe('Reviewed scenario evidence', () => {
  test('stale CMS copy is replaced while sources, scope and parameters remain available', async ({ page }) => {
    await page.route('**/api/presets', route => route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ success: true, data: [{ ...FALLBACK_PRESETS[2],
        title: 'Guaranteed disease prevention', headline: 'Oxytocin Shield Active',
        outcomes: ['-35% CVD Mortality Risk'], education: undefined,
      }] }),
    }));
    await page.goto('/engine');
    await page.getByRole('button', { name: /Movement example: weekly activity/i }).click();
    await expect(page.getByRole('slider', { name: 'Weekly aerobic activity', exact: true })).toHaveValue('180');
    await page.getByRole('button', { name: 'Guide: understand this view', exact: true }).click();
    const dialog = page.getByRole('dialog', { name: 'Understand this view' });
    const sources = dialog.getByRole('region', { name: 'Scenario sources and limits', exact: true });
    await expect(sources).toContainText('Adults aged 19–64');
    await expect(sources).toContainText('cannot predict individual disease risk');
    await expect(sources.getByRole('link', { name: /^NHS: activity guidance/ })).toHaveAttribute('href', /physical-activity-guidelines/);
    await expect(dialog).not.toContainText(/Oxytocin Shield|Guaranteed disease prevention|35%/);
  });

  test('research is a separate group with primary studies and explicit limitations', async ({ page }) => {
    await page.route('**/api/presets', route => route.fulfill({
      status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: FALLBACK_PRESETS }),
    }));
    await page.goto('/engine');
    const research = page.getByRole('group', { name: 'Research examples — not routine advice', exact: true });
    const example = research.getByRole('button', { name: /Research example: timed sound during sleep/ });
    await example.click();
    await expect(page.getByRole('group', { name: 'Everyday examples', exact: true })
      .getByRole('button', { name: /Research example/ })).toHaveCount(0);
    await page.getByRole('button', { name: 'Guide: understand this view', exact: true }).click();
    const dialog = page.getByRole('dialog', { name: 'Understand this view' });
    await expect(dialog).toContainText('Early laboratory research is not routine advice');
    await expect(dialog).toContainText('13 cognitively healthy adults aged 60–84');
    await expect(dialog).toContainText('without better performance');
    await expect(dialog.getByRole('link', { name: /Papalambros/ })).toHaveAttribute('href', 'https://pubmed.ncbi.nlm.nih.gov/28337134/');
    await expect(dialog.getByRole('link', { name: /Henin/ })).toHaveAttribute('href', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6831893/');
  });

  test('unknown CMS claims are withheld and clearly labelled awaiting review', async ({ page }) => {
    await page.route('**/api/presets', route => route.fulfill({
      status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: [{
        ...FALLBACK_PRESETS[0], id: 'unknown', slug: 'unknown', title: 'Miracle cure',
        headline: 'Guaranteed recovery', outcomes: ['Stop prescribed treatment'],
      }] }),
    }));
    await page.goto('/engine');
    await page.getByRole('group', { name: 'Awaiting content review', exact: true })
      .getByRole('button', { name: /Unreviewed Systems example/ }).click();
    await page.getByRole('button', { name: 'Guide: understand this view', exact: true }).click();
    const dialog = page.getByRole('dialog', { name: 'Understand this view' });
    await expect(dialog.getByRole('group', { name: 'Selected scenario', exact: true })).toContainText('Unreviewed');
    await expect(dialog).not.toContainText(/Miracle cure|Guaranteed recovery|Stop prescribed treatment/);
  });
});
