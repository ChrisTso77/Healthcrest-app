# Planner confidentiality verification — 13 November 2026

This is new evidence, not a recovered historical record. Source is the isolated
`codex/healthcrest-planner-confidentiality` working tree based on
`f06f95e3e318c85ef925d10268eda042415ba099`; SHA-256 source manifest below binds the
executed application files to the committed review checkpoint. Candidate `9d5dbca`,
PR #139 and production `076a853` were not changed. No hosted access/deployment used.

## Results

| Check | Actual result and scope |
| --- | --- |
| Education unit tests | 130 PASS / 10 files (`vitest run lib/education`) |
| TypeScript | PASS, `tsc --noEmit --incremental false` |
| Changed TypeScript/React ESLint | PASS, no warnings |
| Optimised production build | PASS, `next build --webpack`; local fixture Sanity configuration |
| Confidentiality contracts | 6 Chromium scenario groups PASS in each local measurement-off/on profile; v1–v3 at 320px/1280px |
| Axe WCAG 2 A/AA, 2.1 AA, 2.2 AA | 6 scans per profile PASS, zero violations/incomplete results: editing, restore confirmation, export error at 320px/1280px |
| Main browser-suite coverage | 324 distinct cases PASS across checkpoint run and focused retests; 1 API-success case timed out and remains NOT VERIFIED |
| Actual screen reader, physical Safari/iOS/Android, Firefox/WebKit | NOT VERIFIED in this execution; alternate engine binaries unavailable |

`evidence/phase14-2/browser-attempts.json` retains raw outcome/error summaries;
`browser-coverage.json` keys distinct cases by full suite/title, preserving both
pixel-density variants. PASS coverage is assembled from executed evidence, not a
claim of one clean 325-case run or hosted CI success. The checkpoint run stopped at
its configured failure cap: 198 PASS, 20 FAIL, 1 interrupted, 106 not run. Its temporary
12-second diagnostic timeout was restored to the repository's 30 seconds. Only
failed/unexecuted cases were selected next (128 selected because one title also
matched another case): 116 PASS, 12 FAIL. Subsequent focused retests cover corrected
expectations, proper measurement runtime configuration and harness failures.

Two runners initially collided in the default trace-output directory, causing
ENOENT teardown failures; isolated output directories resolved these. One test was
renamed while workers were active, producing a test-not-found error; its final
explicit legacy-fixture test passed. A long Explorer journey passed when rerun
alone with a 60-second harness timeout and unchanged assertions. Telemetry's 15
cases all passed on the measurement-enabled local server; opt-in failures on the
measurement-off server are preserved, not treated as product defects.

The sole unresolved raw failure is `health-engine.e2e.spec.ts` → `presets API
responds successfully` (30-second timeout). This run uses synthetic project/dataset
`fixture`, not an authorised live CMS. It cannot establish provider availability.
The separate stalled-CMS/fallback scenario passed. No API defect was confirmed or
unrelated source changed to manufacture a green run.

## Storage and navigation assertions

Storage mutation spies are installed after explicit synthetic legacy setup. Editing,
legacy recovery, JSON export/readback, import, week export and export failure cause
**zero new Storage writes** and preserve original v1–v3 bytes. Explicit removal
cancellation preserves those bytes; separately confirmed removal deletes only the
Planner key and retains current page edits. Test fixture writes in compatibility
specs are intentionally not counted as application persistence or migration.
Source review finds no new durable Planner writer; localStorage access is limited
to explicit read-only recovery and confirmed removal. IndexedDB/sessionStorage are
not introduced. Export failure retains canary content. Unencrypted user-managed
export messaging is visible and checked in the accessibility runner.

Next.js `Link.onNavigate` provides cancellation on Planner links, shared chrome and
the measurement notice. Native beforeunload cancellation preserves edits for tested
reload and full-document `location.assign`. Back/Forward completion is tested,
not universal cancellation or restoration of page memory. A persistent export-first
warning covers SPA programmatic navigation, history, closures/crashes and unsupported
browser behaviour. No global click interception or synthetic history is used.
Pillar switching retains drafts; explicit import/restore/week-replacement review,
Keep my edits and focus restoration are covered by affected browser scenarios.

Automated keyboard/focus, public focus-appearance, confirmation focus, status-region
and reflow checks passed at their recorded widths. These do not prove actual assistive
technology announcements or every platform's native warning behaviour. Accessibility
is **PARTIAL overall**, with automated checks PASS.

## Security disposition and release

ASVS 5.0.0 V14.3.3 stays **FAIL overall**. The redesigned new-write paths are separately
verified as memory-only; legacy plaintext copies remain sensitive browser storage.
Recovery is read-only, with no automatic migration, overwrite or deletion. The user
must inspect/export as needed and explicitly confirm removal. Exports remain
unencrypted. Active-page XSS/device compromise can expose memory and files; stopping
writes does not establish XSS immunity or independent control conformity.

Qualified independent human review, legacy disposition, browser-specific/manual
accessibility evidence and all other mandatory launch gates remain. Matrix totals
are unchanged: **11 PASS / 1 FAIL / 2 BLOCKED / 20 NOT VERIFIED = 34**. This evidence
covers an isolated development branch, not frozen-candidate launch acceptance.

## Reproduction

Use the repository dependencies and system Chromium. Build with synthetic CMS
configuration; start local Next with the measurement flag/environment both set for
the enabled profile. The local-only config defaults to localhost:3023 and accepts
`PLANNER_TEST_BASE_URL`, `PLANNER_REPORT`, and an optional `PLANNER_PENDING_FILE`
(JSON titles, for focused selection). Use distinct `--output` directories for
concurrent Playwright runners. No secret, provider change or production flag is
required. `scripts/planner-confidentiality-check.mjs` accepts the same base URL and
`PLANNER_EXPECT_MEASUREMENT=1` to require notice coverage; the axe runner accepts
the base URL. Evidence hashes are in `evidence/phase14-2/SHA256SUMS` and
`SOURCE-SHA256SUMS` (paths relative to repository root).
