import { test, expect } from "@playwright/test";
const integrated = process.env.HEALTHCREST_EXPLORER_PUBLIC === "1";
test.skip(!integrated, "Run with playwright.explorer-integration.config.ts");

test("public route uses the approved V2 and canonical metadata, while draft routes stay closed", async ({
  page,
  request,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const response = await page.goto("/engine");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("dialog")).toBeVisible();
  await page
    .getByRole("button", { name: "Start exploring", exact: true })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Small habits. A bigger picture.",
  );
  await expect(page.locator("link[rel=canonical]")).toHaveAttribute(
    "href",
    "https://www.healthcrest.uk/engine",
  );
  expect(
    await page.evaluate(
      () =>
        document.querySelector("meta[name=robots]")?.getAttribute("content") ??
        "",
    ),
  ).not.toContain("noindex");
  await expect(
    page.getByRole("button", { name: "Open Body Scanner", exact: true }),
  ).toBeVisible();
  expect((await request.get("/prototype/explorer-v2")).status()).toBe(404);
  expect((await request.get("/learn/library")).status()).toBe(404);
  expect(errors).toEqual([]);
});

for (const [slug, label] of [
  ["fitness", "Movement"],
  ["nutrition", "Food"],
  ["sleep", "Sleep"],
  ["stress", "Stress and social support"],
])
  test(`existing ${slug} guide/Planner links open its V2 lesson`, async ({
    page,
  }) => {
    await page.goto("/engine?pillar=" + slug + "&view=2d&idea=routine#explore");
    await expect(
      page.getByRole("heading", { level: 2, name: label, exact: true }),
    ).toBeVisible();
    await expect(
      page
        .getByRole("navigation", { name: "Choose a habit" })
        .getByRole("button", { name: new RegExp("^" + label) }),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("canvas")).toHaveCount(0);
    await page.getByRole("button", { name: "4 Apply", exact: true }).click();
    await expect(
      page.getByRole("link", {
        name: "Make a manageable next step",
        exact: true,
      }),
    ).toHaveAttribute("href", "/next-step?pillar=" + slug + "&idea=routine");
    await page
      .getByRole("button", { name: "5 Learn more", exact: true })
      .click();
    await expect(
      page.getByRole("link", { name: /Read the .* guide/ }),
    ).toHaveAttribute("href", /\?idea=routine$/);
  });

test("legacy original, connected-habit and direct scanner URLs remain functional", async ({
  page,
}) => {
  for (const path of [
    "/engine?experience=original&view=2d",
    "/engine?pillar=systems&view=2d",
  ]) {
    await page.goto(path);
    await expect(
      page.getByRole("heading", { name: "HABIT EXPLORER", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("region", { name: "2D health overview", exact: true }),
    ).toBeVisible();
  }
  await page.goto("/engine?view=scan");
  await expect(
    page.getByRole("region", { name: "Habit body scan", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Original view", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "HABIT EXPLORER", exact: true }),
  ).toBeVisible();
});

test("Explorer, scanner and public return links preserve a saved synthetic Planner copy", async ({
  page,
}) => {
  await page.goto("/next-step?pillar=sleep");
  await page
    .getByRole("textbox", { name: "One manageable action", exact: true })
    .fill("Synthetic integration sleep plan");
  await page
    .getByRole("button", { name: "Save on this device", exact: true })
    .click();
  const saved = await page.evaluate(() =>
    localStorage.getItem("healthcrest.habit-draft.v1"),
  );
  await page.goto("/engine?pillar=sleep&idea=routine#explore");
  await page.getByRole("button", { name: "3 Experiment", exact: true }).click();
  await page.locator("#lesson-sleepDuration").fill("7.5");
  await page
    .getByRole("button", { name: "Open Body Scanner", exact: true })
    .click();
  await page.getByRole("button", { name: /Back to Habit Explorer/ }).click();
  await expect(page.locator("#lesson-sleepDuration")).toHaveValue("7.5");
  expect(
    await page.evaluate(() =>
      localStorage.getItem("healthcrest.habit-draft.v1"),
    ),
  ).toBe(saved);
  await page.getByRole("button", { name: "4 Apply", exact: true }).click();
  await page
    .getByRole("link", { name: "Make a manageable next step", exact: true })
    .click();
  expect(
    await page.evaluate(() =>
      localStorage.getItem("healthcrest.habit-draft.v1"),
    ),
  ).toBe(saved);
  await page
    .getByRole("button", { name: "Restore saved draft", exact: true })
    .click();
  await expect(
    page.getByRole("textbox", { name: "One manageable action", exact: true }),
  ).toHaveValue("Synthetic integration sleep plan");
});

test("unknown and repeated entry parameters fall back without reflecting untrusted values", async ({
  page,
}) => {
  await page.goto(
    "/engine?pillar=sleep&pillar=stress&idea=%3Cscript%3E&experience=original&experience=other#explore",
  );
  await expect(
    page
      .getByRole("navigation", { name: "Choose a habit" })
      .getByRole("button", { name: /^Movement/ }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("canvas")).toHaveCount(0);
  await page.getByRole("button", { name: "4 Apply", exact: true }).click();
  await expect(
    page.getByRole("link", {
      name: "Make a manageable next step",
      exact: true,
    }),
  ).toHaveAttribute("href", "/next-step?pillar=fitness");
});

for (const width of [320, 640, 1350])
  test(
    "public V2 remains reachable in a short " + width + "px viewport",
    async ({ page }) => {
      await page.setViewportSize({ width, height: 200 });
      await page.goto("/engine#explore");
      const settings = page.getByRole("button", {
        name: "Settings & scenarios",
        exact: true,
      });
      await settings.click();
      await expect(page.getByRole("dialog")).toBeVisible();
      await page
        .getByRole("dialog")
        .getByRole("button", { name: "Close settings", exact: true })
        .click();
      await expect(settings).toBeFocused();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page
        .getByRole("button", { name: "Introduction", exact: true })
        .click();
      await page
        .getByRole("dialog")
        .getByRole("button", { name: "Start exploring", exact: true })
        .click();
      await expect(page.getByRole("dialog")).toHaveCount(0);
    },
  );

test("onboarding content is server-rendered and a no-JavaScript visit retains readable navigation", async ({
  browser,
  baseURL,
  request,
}) => {
  const response = await request.get("/engine");
  const html = await response.text();
  expect(html).toMatch(/<dialog[^>]*open=""/);
  expect(html).toContain("Four habits. Room to explore.");
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL,
  });
  try {
    const page = await context.newPage();
    await page.goto("/engine?pillar=sleep");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Small habits. A bigger picture.",
    );
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await page
      .getByRole("link", { name: "Healthcrest home", exact: true })
      .click();
    await expect(page).toHaveURL(/\/$/);
  } finally {
    await context.close();
  }
});

test("first paint exposes the introduction and returning hash skips it before client scripts load", async ({
  page,
}) => {
  await page.route("**/_next/static/**/*.js", (route) => route.abort());
  await page.goto("/engine");
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Start exploring", exact: true }),
  ).toBeDisabled();
  await page.goto("/engine#explore");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Small habits. A bigger picture.",
  );
});
