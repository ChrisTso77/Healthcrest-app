import { test, expect } from "@playwright/test";
const route = "/prototype/explorer-v2";
test("onboarding start, skip, return and reopen without durable storage", async ({
  page,
}) => {
  await page.goto(route);
  await expect(page.getByRole("dialog")).toBeVisible();
  await page
    .getByRole("button", { name: "Skip introduction", exact: true })
    .click();
  await expect(page).toHaveURL(/#explore$/);
  await page.reload();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByRole("button", { name: "Introduction", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Introduction", exact: true }),
  ).toBeFocused();
  expect(
    await page.evaluate(() =>
      Object.keys(localStorage).filter((k) => /explorer|habit/i.test(k)),
    ),
  ).toEqual([]);
});
test("all habits and five steps, bounded sliders and preserved choices", async ({
  page,
}) => {
  await page.goto(route + "#explore");
  for (const [name, label, key] of [
    ["Movement", "Weekly aerobic activity", "aerobicVolume"],
    ["Food", "Whole-food setting", "wholeFoodRatio"],
    ["Sleep", "Sleep duration", "sleepDuration"],
    ["Stress and social support", "Perceived stress", "perceivedStress"],
  ]) {
    await page
      .getByRole("navigation", { name: "Choose a habit" })
      .getByRole("button", { name: new RegExp(name) })
      .click();
    for (const step of [
      "Understand",
      "Explore",
      "Experiment",
      "Apply",
      "Learn more",
    ]) {
      await page
        .getByRole("navigation", { name: "Lesson steps" })
        .getByRole("button", { name: new RegExp(step) })
        .click();
      await expect(
        page.getByRole("heading", { name: step, exact: true }),
      ).toBeVisible();
    }
    await page.getByRole("button", { name: "3 Experiment" }).click();
    const slider = page.locator("#lesson-" + key);
    await slider.focus();
    await page.keyboard.press("End");
    await expect(slider).toHaveAttribute(
      "aria-valuetext",
      new RegExp((await slider.getAttribute("max"))!),
    );
    await page.getByRole("button", { name: "Example A", exact: false }).click();
    await page.getByRole("button", { name: "Settings & scenarios" }).click();
    await expect(
      page.getByRole("dialog").getByLabel(new RegExp(label)),
    ).toHaveValue(await slider.inputValue());
    await page.keyboard.press("Escape");
    await expect(
      page.getByRole("button", { name: "Settings & scenarios" }),
    ).toBeFocused();
  }
  await page.getByRole("button", { name: "4 Apply" }).click();
  await page.getByRole("combobox").selectOption("Talk with someone you trust");
});
test("drawer focus trap, scenarios, resets and closing keeps changes", async ({
  page,
}) => {
  await page.goto(route + "#explore");
  await page.getByRole("button", { name: "Settings & scenarios" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name: "Example B" }).click();
  await dialog
    .getByText("Advanced · other inputs and full scenarios", { exact: true })
    .click();
  await dialog
    .getByRole("button", { name: "Reset all example values" })
    .focus();
  await page.keyboard.press("Tab");
  await expect(
    dialog.getByRole("button", { name: "Close settings" }),
  ).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(
    dialog.getByRole("button", { name: "Reset all example values" }),
  ).toBeFocused();
  await dialog.getByRole("button", { name: /Guideline-level/ }).click();
  await expect(dialog.getByRole("status")).toContainText(
    "All example inputs replaced",
  );
  await dialog
    .getByRole("button", { name: "Reset all example values" })
    .click();
  await expect(dialog.getByRole("status")).toContainText("reset");
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "3 Experiment" }).click();
  await expect(page.locator("#lesson-aerobicVolume")).toHaveValue("180");
});
for (const width of [320, 390, 768, 1440])
  test(`reflow and axe at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(route + "#explore");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.addScriptTag({ path: require.resolve("axe-core/axe.min.js") });
    const violations = await page.evaluate(async () => {
      const axe = (
        window as unknown as {
          axe: {
            run: (
              node: Element,
              options: unknown,
            ) => Promise<{ violations: { id: string }[] }>;
          };
        }
      ).axe;
      return (
        await axe.run(document.querySelector(".ev2")!, {
          runOnly: {
            type: "tag",
            values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"],
          },
        })
      ).violations.map((x) => x.id);
    });
    expect(violations).toEqual([]);
    await page.getByRole("button", { name: "Settings & scenarios" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const dialogViolations = await page.evaluate(async () =>
      (
        await (
          window as unknown as {
            axe: {
              run: (node: Element) => Promise<{ violations: { id: string }[] }>;
            };
          }
        ).axe.run(document.querySelector("dialog")!)
      ).violations.map((x) => x.id),
    );
    expect(dialogViolations).toEqual([]);
    await page.keyboard.press("Escape");
    // 1280 CSS pixels at 400% is equivalent to a 320px layout viewport.
    if (width === 1440) {
      await page.setViewportSize({ width: 320, height: 256 });
      await page
        .getByRole("button", { name: "Introduction", exact: true })
        .click();
      await expect(
        page
          .getByRole("dialog")
          .getByRole("button", { name: "Start exploring" }),
      ).toBeVisible();
      await page
        .getByRole("dialog")
        .getByRole("button", { name: "Start exploring" })
        .click();
    }
  });
test("WebGL unavailable retains accessible comparison and reduced-motion operation", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      type: string,
      ...args: unknown[]
    ) {
      if (/webgl/.test(type)) return null;
      return Reflect.apply(original, this, [type, ...args]);
    } as typeof original;
  });
  await page.goto(route + "#explore");
  expect(await page.locator("canvas").count()).toBe(0);
  await page.getByRole("button", { name: "Explore optional 3D" }).click();
  await expect(
    page.getByText("3D is unavailable.", { exact: false }),
  ).toBeVisible({ timeout: 30000 });
  await expect(
    page.getByRole("img", { name: /Weekly aerobic activity/ }),
  ).toBeVisible();
  await page.getByRole("button", { name: "3 Experiment" }).click();
  await page.locator("#lesson-aerobicVolume").focus();
  await page.keyboard.press("End");
  await expect(page.locator("#lesson-aerobicVolume")).toHaveValue("400");
});
test("production and unflagged routes are inaccessible; local route is noindex", async ({
  page,
  request,
}) => {
  for (const port of [3211, 3212])
    expect(
      (await request.get(`http://127.0.0.1:${port}${route}`)).status(),
    ).toBe(404);
  await page.goto(route + "#explore");
  await expect(page.locator("meta[name=robots]")).toHaveAttribute(
    "content",
    /noindex/,
  );
  const sitemap = await request.get("/sitemap.xml");
  expect(await sitemap.text()).not.toContain(route);
});
test("supported optional 3D pauses, honours reduced motion and can be removed", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(route + "#explore");
  await page.getByRole("button", { name: "Explore optional 3D" }).click();
  const canvas = page.locator("canvas");
  await expect(canvas).toBeVisible({ timeout: 30000 });
  await expect(page.locator("[data-motion-paused=true]")).toHaveAttribute(
    "data-reduced-motion",
    "true",
  );
  await page.getByRole("button", { name: "Play illustration motion" }).click();
  await expect(page.locator("[data-motion-paused=false]")).toHaveAttribute(
    "data-reduced-motion",
    "true",
  );
  await page.getByRole("button", { name: "Hide optional 3D" }).click();
  await expect(canvas).toHaveCount(0);
  await page.setViewportSize({ width: 844, height: 390 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("contextual lesson actions advance the journey and update the new input illustration", async ({
  page,
}) => {
  await page.goto(route + "#explore");
  await page
    .getByRole("button", { name: "Explore the illustration", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Explore", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Try an example", exact: true })
    .click();
  await page.getByRole("button", { name: "Example B", exact: false }).click();
  await expect(
    page.getByRole("img", {
      name: /Weekly aerobic activity: opening 180, current 300/,
    }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Find a practical idea", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Apply", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Go a little deeper", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Learn more", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("navigation", { name: "Lesson steps" })
    .getByRole("button", { name: "1 Understand" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Understand", exact: true }),
  ).toBeVisible();
});

test("approved hosted preview opens the redesigned UI while draft clinical content stays blocked", async ({
  page,
  request,
}) => {
  const preview = "http://127.0.0.1:3213";
  const response = await page.goto(preview + route);
  expect(response?.status()).toBe(200);
  await page
    .getByRole("button", { name: "Start exploring", exact: true })
    .click();
  await expect(
    page.getByRole("heading", {
      name: "Small habits. A bigger picture.",
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.locator("meta[name=robots]")).toHaveAttribute(
    "content",
    /noindex/,
  );
  await page.getByRole("button", { name: "3 Experiment" }).click();
  await page.getByRole("button", { name: "Example B", exact: false }).click();
  await expect(page.getByRole("img", { name: /current 300/ })).toBeVisible();
  await page.getByRole("button", { name: "Settings & scenarios" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  expect((await request.get(preview + "/learn/library")).status()).toBe(404);
  expect((await request.get(preview + "/engine")).status()).toBe(200);
});

test("original scanner controls and assets work while V2 settings and focus survive both return paths", async ({
  page,
}) => {
  await page.goto(route + "#explore");
  await page.getByRole("button", { name: "3 Experiment" }).click();
  await page.getByRole("button", { name: "Example B", exact: false }).click();
  await page
    .getByRole("button", { name: "Open Body Scanner", exact: true })
    .click();
  const scan = page.getByRole("region", { name: "Habit body scan" });
  await expect(scan).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Back to Habit Explorer", exact: false }),
  ).toBeFocused();
  for (const [habit, setting, value] of [
    ["Fitness", "Moderate activity per week", "600"],
    ["Nutrition", "Fruit and vegetable portions per day", "8"],
    ["Sleep", "Typical sleep per night", "11"],
    ["Stress", "Time for calming practice each day", "30"],
  ]) {
    await scan.getByLabel("Habit", { exact: true }).selectOption(habit);
    const slider = scan.getByRole("slider", { name: new RegExp(setting) });
    await slider.fill(value);
    await expect(slider).toHaveValue(value);
    await scan
      .getByRole("slider", { name: /Move scanner manually/ })
      .fill("49");
    await expect(
      scan.getByRole("slider", { name: /Move scanner manually/ }),
    ).toHaveAttribute("aria-valuetext", "Abdomen");
  }
  for (const model of ["female", "male"]) {
    await scan.getByLabel("Body illustration").selectOption(model);
    const image = scan.getByAltText(
      new RegExp("Illustrative " + model + " anatomy"),
    );
    await expect(image).toBeVisible();
    await expect
      .poll(() =>
        image.evaluate(
          (node: HTMLImageElement) => node.complete && node.naturalWidth > 0,
        ),
      )
      .toBe(true);
    expect(await image.getAttribute("src")).toContain(
      "body-scan-" + model + ".webp",
    );
  }
  await scan.getByRole("button", { name: "Start scan", exact: true }).click();
  await scan.getByRole("button", { name: "Pause scan", exact: true }).click();
  await scan
    .getByRole("button", { name: "Original view", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Open Body Scanner", exact: true }),
  ).toBeFocused();
  await expect(
    page.getByRole("heading", { name: "Experiment", exact: true }),
  ).toBeVisible();
  await expect(page.locator("#lesson-aerobicVolume")).toHaveValue("300");
  await page
    .getByRole("button", { name: "Open Body Scanner", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Back to Habit Explorer", exact: false })
    .click();
  await expect(page.locator("#lesson-aerobicVolume")).toHaveValue("300");
});

test("restored scanner matches the original scanner content", async ({
  page,
}, testInfo) => {
  const { default: sharp } = await import("sharp");
  const comparisons: {
    width: number;
    model: string;
    maxChannelDifference: number;
    differentPixels: number;
  }[] = [];
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const [width, height] of [
    [1440, 2000],
    [390, 2200],
  ]) {
    await page.setViewportSize({ width, height });
    for (const model of ["female", "male"]) {
      await page.goto("/engine?view=scan");
      const original = page.getByRole("region", { name: "Habit body scan" });
      await original.getByLabel("Body illustration").selectOption(model);
      await expect
        .poll(() =>
          original
            .locator("img")
            .evaluate(
              (node: HTMLImageElement) =>
                node.complete && node.naturalWidth > 0,
            ),
        )
        .toBe(true);
      await page.mouse.move(0, 0);
      const before = await original.locator(":scope > div").screenshot({
        animations: "disabled",
        path: testInfo.outputPath(`original-${width}-${model}.png`),
      });
      await page.goto(route + "#explore");
      await page
        .getByRole("button", { name: "Open Body Scanner", exact: true })
        .click();
      const restored = page.getByRole("region", { name: "Habit body scan" });
      await restored.getByLabel("Body illustration").selectOption(model);
      await expect
        .poll(() =>
          restored
            .locator("img")
            .evaluate(
              (node: HTMLImageElement) =>
                node.complete && node.naturalWidth > 0,
            ),
        )
        .toBe(true);
      await page.mouse.move(0, 0);
      const after = await restored.locator(":scope > div").screenshot({
        animations: "disabled",
        path: testInfo.outputPath(`restored-${width}-${model}.png`),
      });
      const a = await sharp(before)
        .removeAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      const b = await sharp(after)
        .removeAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      expect(b.info).toEqual(a.info);
      let maxChannelDifference = 0,
        differentPixels = 0;
      for (let i = 0; i < a.data.length; i += 3) {
        const difference = Math.max(
          ...[0, 1, 2].map((channel) =>
            Math.abs(a.data[i + channel] - b.data[i + channel]),
          ),
        );
        maxChannelDifference = Math.max(maxChannelDifference, difference);
        if (difference > 0) differentPixels++;
      }
      // Chromium occasionally composites a handful of native select corners
      // one colour level differently. Permit only that imperceptible noise;
      // any geometry, text, image, colour or layout change still fails.
      expect(maxChannelDifference).toBeLessThanOrEqual(2);
      expect(differentPixels).toBeLessThanOrEqual(64);
      comparisons.push({ width, model, maxChannelDifference, differentPixels });
    }
  }
  const { writeFile } = await import("node:fs/promises");
  await writeFile(
    testInfo.outputPath("visual-comparison.json"),
    JSON.stringify(comparisons, null, 2),
  );
});

test("scanner remains usable at narrow width and cleans up narration when returning", async ({
  page,
}) => {
  await page.addInitScript(() => {
    class Utterance {
      lang = "";
      rate = 1;
      constructor(public text: string) {}
    }
    Object.defineProperty(window, "SpeechSynthesisUtterance", {
      value: Utterance,
    });
    Object.defineProperty(window, "speechSynthesis", {
      value: {
        cancel() {
          document.documentElement.dataset.scanCancelled = String(
            Number(document.documentElement.dataset.scanCancelled ?? 0) + 1,
          );
        },
        speak() {},
      },
    });
  });
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto(route + "#explore");
  await page
    .getByRole("button", { name: "Open Body Scanner", exact: true })
    .click();
  const scan = page.getByRole("region", { name: "Habit body scan" });
  await expect(scan).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await scan.getByRole("button", { name: "Voice off", exact: true }).click();
  await scan.getByRole("button", { name: "Start scan", exact: true }).click();
  const cancelled = await page
    .locator("html")
    .getAttribute("data-scan-cancelled");
  await page
    .getByRole("button", { name: "Back to Habit Explorer", exact: false })
    .click();
  await expect(scan).toHaveCount(0);
  await expect
    .poll(async () =>
      Number(await page.locator("html").getAttribute("data-scan-cancelled")),
    )
    .toBeGreaterThan(Number(cancelled));
  await expect(
    page.getByRole("button", { name: "Open Body Scanner", exact: true }),
  ).toBeFocused();
});
