// Server callers only. Never accept a URL, cookie or client value as approval.
// A local production-mode build can be reviewed; hosted environments fail closed.
export function editorialPreviewEnabled(env: Readonly<Record<string, string | undefined>> = process.env): boolean {
  return env.HEALTHCREST_EDITORIAL_PREVIEW === '1' &&
    !env.VERCEL_ENV && !env.VERCEL && !env.CI;
}
