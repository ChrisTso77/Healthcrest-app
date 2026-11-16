# Original Body Scanner restored in Explorer V2

16 November 2026. Work remains on `codex/healthcrest-explorer-v2-prototype` / draft PR #144. Existing owner approval for this branch's preview deployment applies; no production integration, merge or production deployment is performed.

## Root cause and original implementation

V2 was built as a separate route and connected only its radial comparison and optional abstract Three scene. It never imported `BodyScanExplorer` or exposed the original scanner entry button. Nothing was deleted: `/engine?view=scan` still mounts the original scanner through `HealthEngineApp`.

The preserved implementation is `components/BodyScanExplorer.tsx` (latest scanner-source change `5a8939b`; unchanged at merged baseline `db93754a333ceb6255ef632e9218180ad1a7f89e`). It uses the original female/male WebP illustrations, CSS scanning ring, region controls, narrated/captioned scan, source links and scientific limitations. There is no separate 3D anatomy/camera implementation in this scanner; the existing Three scene/camera is a different feature and stays unchanged. No substitute anatomy, camera or rendering system was introduced.

## Integration

**Open Body Scanner** is visible beside Settings & scenarios. It lazily mounts the original component in a full-height wrapper matching its original host, outside V2's scoped CSS. A separate return bar and the scanner's unchanged **Original view** button both return to V2. Focus and the previous page scroll position are restored.

The V2 component stays mounted, preserving its habit, lesson, settings, scenario state, support choice and optional 3D selection. Scanner values are seeded from the current examples but remain separate: its original activity range goes to 600, sleep to 11, and its food/stress controls use different inputs. No clamping, remapping or overwrite of unsaved V2 values is added. Reopening seeds a fresh scanner visit from the retained Explorer values; no persistence is added. Original scanner unmount cleanup stops timers/speech.

## Verification

- PASS: `npm run build`, `npm run lint`, `npx tsc --noEmit --incremental false`.
- PASS: all 15 V2 cases via `HEALTHCREST_CHROMIUM_PATH=/usr/bin/chromium npx playwright test --config=playwright.explorer-v2.config.ts`. Includes all previous onboarding, lesson, drawer, scenario, reset, 2D/3D, reduced-motion, focus, four-width axe/reflow and preview/production isolation cases, plus original scanner controls/assets, both returns, retained V2 value/lesson, 320px usability and narration cleanup.
- PASS: all four unchanged `body-scan.e2e.spec.ts` cases. Reproduced using the existing V2 Chromium launch override and an isolated Next start server on port 3214; no assertion/source changes to the original tests. These cover four habits/manual regions, model selection, start/pause/return, mobile keyboard behavior, speech failure and premature speech completion.
- PASS: source and asset bytes equal the merged baseline. [Exact SHA-256 records](scanner/source-integrity.json) include the scanner source, both original WebP assets and the untouched production `HealthEngineApp`.
- PASS: actual scanner-content screenshots compared at 1440px and 390px for both illustrations. Three pairs are pixel-identical. Desktop female differs at nine native-select corner pixels by only 1/255 per channel; geometry, imagery and text match. The test permits at most 64 differing pixels, with a maximum 2/255 channel difference, to avoid platform native-control compositing noise. An initial strict PNG-byte assertion exposed this noise; the assertion was corrected without modifying scanner source or styling. [Observed comparison values](scanner/visual-comparison.json).
- Unit-model baseline remains 330 PASS from the prior preview work; not rerun for this integration. No model, dependencies or security controls changed. No fresh scanner performance/GPU or real-device claim is made.

| Review | Desktop | Mobile |
|---|---|---|
| Visible entry button | [Explorer](scanner/entry-desktop.png) | [Explorer](scanner/entry-mobile.png) |
| Integrated scanner and return navigation | [Viewport](scanner/view-desktop.png) | [Viewport](scanner/view-mobile.png) |
| Original scanner content compared above | [Content](scanner/content-desktop.png) | [Content](scanner/content-mobile.png) |

## Exact files changed for this restoration

- `components/explorer-v2/ExplorerPrototype.tsx`: lazy reuse, visible entry, separate scanner state and return/focus/scroll handling.
- `app/prototype/explorer-v2/prototype.css`: layout for the two Explorer action buttons only; no scanner rules.
- `e2e/explorer-v2.spec.ts`: three restoration tests; original scanner regression file unchanged.
- `docs/agent/PROJECT_STATE.md`: current restoration status.
- `docs/explorer-v2/REVIEW.md`: link to this follow-up record.
- `docs/explorer-v2/SCANNER-RESTORATION.md`: this record.
- `docs/explorer-v2/scanner/entry-desktop.png`
- `docs/explorer-v2/scanner/entry-mobile.png`
- `docs/explorer-v2/scanner/view-desktop.png`
- `docs/explorer-v2/scanner/view-mobile.png`
- `docs/explorer-v2/scanner/content-desktop.png`
- `docs/explorer-v2/scanner/content-mobile.png`
- `docs/explorer-v2/scanner/source-integrity.json`
- `docs/explorer-v2/scanner/visual-comparison.json`

## Preview and limitations

The corrected immutable preview URL, deployed source SHA and provider Ready status will be recorded in [PR #144](https://github.com/ChrisTso77/Healthcrest-app/pull/144). The [approved branch preview](https://healthcrest-app-git-codex-healthcrest-explorer-d05b27-tsotsoft.vercel.app/prototype/explorer-v2) follows its latest Ready deployment. Open **Open Body Scanner** on that page. The previous immutable URL stays on its previous version.

Live browser verification from this workspace remains blocked by the outbound proxy, as documented in [the deployment record](DEPLOYMENT.md). Manual assistive technology, actual speech-engine quality, Safari/Firefox and physical-device performance are NOT VERIFIED. The screenshot comparison establishes the recorded Chromium/static states, not every device or animation frame. Local original-route tests used existing reviewed fallbacks when Sanity DNS was unavailable; no CMS writes or clinical changes occurred. No production release is authorised.
