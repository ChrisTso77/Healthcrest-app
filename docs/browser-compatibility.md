# Focused browser-engine verification

The full Chromium regression suite remains the primary broad functional check. A separate Firefox and WebKit CI job now exercises a small set of critical public and private-planner flows against the same production build profile.

Run locally after npm ci and npm run build:

1. npx playwright install --with-deps firefox webkit
2. npm run test:compatibility

The separate configuration selects only browser-compatibility.e2e.spec.ts, starts the built server and runs Firefox and Playwright WebKit sequentially. Existing Chromium and preview measurement-off selection are unchanged. CI keeps a distinct HTML/trace/screenshot/video report for 14 days and fails the job on a test failure. The job has read-only repository permissions and uses the same public CMS build configuration as existing checks.

Coverage includes reduced-motion homepage fallback and default-off measurement, multiword learning/source/idea navigation, explicit weekly save/restore with notes, backup comparison/import/download, generic calendar downloads with blocked storage, the labelled 2D Explorer and dialog focus, and server-rendered guidance without JavaScript. Narrow layouts are checked on both engines. No PDF API is called outside Chromium.

Playwright WebKit on Linux is engine coverage; it is not the installed Safari application, an iPhone, or a real-device test. Firefox/WebKit checks here do not establish all 3D/GPU driver behavior, external calendar imports, device notifications or screen-reader compatibility. The Explorer case intentionally exercises the labelled 2D path with deterministic local preset data.

The first WebKit run found a 600px document scroll area at a 320px viewport after a week was restored and a day opened. Layout probes isolated native selects: hiding selects restored the width while hiding other controls did not. Further probes showed that max-width, overflow clipping and inline-size containment alone left the width at 600px, while removing the native collapsed-control appearance returned it to 320px. The weekly selectors now use a scoped collapsed style with a CSS chevron, retaining the actual select elements, option text, native pickers and keyboard behavior. Forced-colour modes retain their native rendering. The test keeps the original width assertion and also opens/edits day seven through the picker.

No medical content, dependency, storage schema, measurement setting or paid hosting option changes. The existing NHS/WHO/Harvard/CDC source policy remains in force for content updates. Deployment review should inspect all five CI jobs, the exact PR head and the Vercel preview; adding this job does not change GitHub branch-protection settings.
