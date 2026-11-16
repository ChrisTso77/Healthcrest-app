import { describe, expect, it } from "vitest";
import {
  EXPLORER_REVIEW_BRANCH,
  explorerPreviewEnabled,
} from "./explorerPreview";
import { editorialPreviewEnabled } from "./library/visibility";

describe("approved Explorer UI review deployment", () => {
  const approved = {
    VERCEL: "1",
    VERCEL_ENV: "preview",
    VERCEL_GIT_COMMIT_REF: EXPLORER_REVIEW_BRANCH,
  };
  it("allows only the selected Vercel preview or the existing explicit local flag", () => {
    expect(explorerPreviewEnabled(approved)).toBe(true);
    expect(explorerPreviewEnabled({ HEALTHCREST_EDITORIAL_PREVIEW: "1" })).toBe(
      true,
    );
    expect(explorerPreviewEnabled({})).toBe(false);
    expect(
      explorerPreviewEnabled({ HEALTHCREST_EDITORIAL_PREVIEW: "true" }),
    ).toBe(false);
    for (const override of [
      { VERCEL_ENV: "production" },
      { VERCEL_ENV: "development" },
      { VERCEL_ENV: "" },
      { VERCEL: "" },
      { VERCEL: "true" },
      { VERCEL_GIT_COMMIT_REF: "" },
      { VERCEL_GIT_COMMIT_REF: "main" },
      { VERCEL_GIT_COMMIT_REF: EXPLORER_REVIEW_BRANCH + "-other" },
    ])
      expect(
        explorerPreviewEnabled({
          ...approved,
          ...override,
          HEALTHCREST_EDITORIAL_PREVIEW: "1",
        }),
      ).toBe(false);
  });
  it("does not unlock draft clinical content even on the approved review deployment", () => {
    expect(
      editorialPreviewEnabled({
        ...approved,
        HEALTHCREST_EDITORIAL_PREVIEW: "1",
      }),
    ).toBe(false);
    expect(
      explorerPreviewEnabled({
        ...approved,
        VERCEL_ENV: "production",
        HEALTHCREST_EDITORIAL_PREVIEW: "1",
      }),
    ).toBe(false);
  });
});
