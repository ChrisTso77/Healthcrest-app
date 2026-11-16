import { editorialPreviewEnabled } from "./library/visibility";

// Owner approved this branch's preview deployment on 16 November 2026.
// This selects the UI review deployment; Vercel access protection remains separate.
// Never enable draft clinical-library routes or derive approval from request data.
export const EXPLORER_REVIEW_BRANCH = "codex/healthcrest-explorer-v2-prototype";
export function explorerPreviewEnabled(
  env: Readonly<Record<string, string | undefined>> = process.env,
): boolean {
  return (
    editorialPreviewEnabled(env) ||
    (env.VERCEL === "1" &&
      env.VERCEL_ENV === "preview" &&
      env.VERCEL_GIT_COMMIT_REF === EXPLORER_REVIEW_BRANCH)
  );
}
