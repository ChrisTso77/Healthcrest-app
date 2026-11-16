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
test("hosted and unflagged routes are inaccessible; local route is noindex", async ({
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
