# Habit Explorer V2 — isolated prototype review

## Baseline and decision (16 November 2026)
Branch: `codex/healthcrest-explorer-v2-prototype`. Base: `db93754a333ceb6255ef632e9218180ad1a7f89e` (#143 merge).
Next App Router / React / TypeScript; existing R3F/Three renderer retained. Production `/engine`, Body Scan, Planner, CMS and privacy controls remain unchanged. The screenshot supplied in follow-up confirms the existing `/engine` overlay layout. Before images use the actual same implementation at the recorded viewports.

`HealthEngineApp` uses a fixed-height, overflow-hidden shell. `HealthEngineHUD` has independently scrolling clinical, camera, dock and scenario areas; the footer is another scrollable overlay. Layout, rather than Three itself, causes competing reading/navigation contexts. Abstract core/lattice shapes lack an obvious interpretation without the existing visual key. Orbit controls require spatial interaction; thresholds/colours are illustrative, not physiological measures. Existing Lite mode and demand rendering already reduce graphics cost.

Reuse: canonical reducer/state, `COMPARED_SETTINGS` ranges and comparison helpers, reviewed `PILLAR_GUIDES`, existing learning guides, `ModalDialog`, lazy `WebGLCanvasWrapper` and its reduced-motion/demand rendering. No new engine, assets or dependencies.

## Three lightweight concepts
See [concept sketches](concepts.svg). These are expert design assessments, not user-study findings.

| Criterion | A: improved existing 3D | B: new lightweight 3D | C: labelled 2D + optional existing 3D |
|---|---|---|---|
| Comprehension / credibility | Needs explicit metaphor key | New visual language still needs validation | Raw values and limits visible; no inferred health score |
| Accessibility | Text fallback remains necessary | New fallback and camera work | Default semantic values; optional canvas |
| Appeal | Familiar animated scene | Potentially cleaner scene, unproven | Restrained comparison with optional spatial view |
| Performance / mobile | Graphics loaded initially | Asset/runtime cost unknown | No canvas until requested; one page flow |
| Complexity / maintenance | Moderate layout change | Highest: new renderer/model tests | Reuses renderer and canonical state |

**Select C.** A does not remove the initial graphics/comprehension cost. B has no demonstrated educational advantage or licensed anatomy asset to justify replacement. Build only C. Default scale compares inputs, not predicted outcomes. Existing 3D remains an explicitly labelled metaphor and is paused initially.

## Revised UI review

The follow-up screenshot shows the existing `/engine`, which deliberately remains unchanged under the prototype-first scope. The earlier local-only prototype was not available at that production route. The owner subsequently approved a preview deployment. Review **`/prototype/explorer-v2`** on this branch’s Vercel Preview deployment (or use the local command below); `/engine` still shows the old interface. No redirect or automatic fallback sends prototype visitors into the old Explorer.

The UI has also been rebuilt: compact colour-coded habit cards, a larger dark-green visual workspace, a responsive radial input diagram with explicit raw value and limits, a single contextual lesson card, clear next-step actions, lighter typography and spacing, and secondary evidence disclosures below. The desktop lesson sits beside the visual; mobile stacks them in one page flow. Other settings remain in the modal drawer. The original-Explorer link is now an explicit comparison disclosure to avoid accidentally leaving the redesigned experience.

The radial diagram uses the existing `markerPosition` normalisation and only changes its geometry. Diamond/current and outlined-circle/opening markers are shape-coded; habit colours identify the chapter, not health status. The numeric value, units, opening/current comparison and disclaimer remain textual. No physiological calculation is introduced. The ring is an input scale, not progress towards a goal or a health score.

## Local access and boundaries
Run `HEALTHCREST_EDITORIAL_PREVIEW=1 npm run dev -- --port 3200`, open `http://localhost:3200/prototype/explorer-v2`. The local route requires the flag. Owner approval on 16 November 2026 additionally permits the exact `codex/healthcrest-explorer-v2-prototype` branch when provider variables identify Vercel Preview (`VERCEL=1`, `VERCEL_ENV=preview`, exact `VERCEL_GIT_COMMIT_REF`). Production, other branches and unflagged local environments return 404. This UI-specific selector is separate from the unchanged clinical-library gate, which stays closed on every hosted deployment. Existing provider access protection is unchanged; this selector is not an authentication mechanism. No production navigation link or sitemap entry; noindex/nofollow metadata. No production deployment or merge is authorised. Deployed identity and URL are recorded separately in [DEPLOYMENT.md](DEPLOYMENT.md).

Start/Skip sets only the URL fragment `#explore`; returning to that URL bypasses onboarding. No cookies, storage, account, analytics events or health values are added to URLs. A fresh unmarked URL shows the introduction again. Prototype values exist only in component memory and disappear on reload. Reopen introduction remains available.

Original Explorer controls are used (not Body Scan's distinct ranges): aerobic 0–400 minutes/week step 10; whole-food setting 0–100% step 5; sleep 4–10 hours/night step .5; stress 1–10 step 1. Whole-food percentage is not a validated target; stress is subjective. Neutral A/B comparisons use values already present in repository scenarios; only the active input changes. Full reviewed built-in presets are advanced and explicitly replace all example values. Social-support examples are practical choices, not numerical health interventions.

## Progress ledger
- Baseline inspected; three sketches evaluated; C selected before implementation.
- Guided hybrid implemented; canonical ranges and production isolation preserved.
- Supplied screenshot reviewed; UI rebuilt with a prominent radial comparison, compact navigation and contextual lesson workspace; all six after images refreshed.
- Build/lint, 328 units and 11 targeted Chromium cases PASS; screenshots and local lab performance recorded.
- Owner approved preview deployment; branch-specific Vercel Preview access added and tested. No production integration or merge performed.

## Migration recommendation — proposal only
After prototype approval, commission real task-based usability testing and manual screen-reader/device checks; independently review clinical wording, presets and the hash-based onboarding tradeoff. Decide whether existing original/Body Scan entry points and all existing camera/scenario workflows need parity. Introduce any replacement behind the established release controls with reversible routing and retain the old experience through acceptance. Do not migrate Planner state or change storage/measurement boundaries. No migration is implemented here.

## Before / after review

| Desktop 1440×1000 / mobile 390×844 | Existing Explorer | Prototype opening lesson |
|---|---|---|
| Visible button elements (rendered, including below fold) | 30 / 26 | 15 / 15 |
| Mounted sliders | 4 / 4 | 0 / 0; one in Experiment |
| Overflowing nested scroll regions | 3 / 2 | 0 / 0; one drawer scroll only when open |
| Choose a habit | 1 activation | 1 activation, scroll/focus to lesson |
| Change active input from opening view | Slider gesture (dock scrolling may be needed) | Experiment activation + slider gesture |
| View guidance from active habit | Guide / Why this matters: 1 activation | Learn more or evidence disclosure: 1 activation |
| Open a named scenario | 1 activation plus dock/list scrolling | Settings + Advanced + scenario: 3 activations |

Counts are DOM observations of the captured initial states, not a claim that all buttons fit in the viewport. Counts exclude links and summaries; task counts exclude scrolling and first-time onboarding (one Start/Skip activation). Scenarios intentionally take more actions to reduce initial clutter. The mobile page remains a tradeoff: habit selection moves to the lesson and all content uses the page scroll. Source supports the navigation comparison; these are not observed user completion times or comprehension results.

| State | Desktop | Mobile |
|---|---|---|
| Existing | [Before](before-desktop.png) | [Before](before-mobile.png) |
| Prototype | [Opening lesson](after-desktop.png) | [Opening lesson](after-mobile.png) |
| Changed input | [Experiment](experiment-desktop.png) | [Experiment](experiment-mobile.png) |
| Optional panel | [Drawer](drawer-desktop.png) | [Drawer](drawer-mobile.png) |

## Verification and reproducibility

PASS on local Node 24 / system Chromium 154.0.8037.57, 16 November 2026 (UI revision checks below):

- `npm run test:unit`: 330 tests / 34 files PASS after adding preview boundary tests; canonical model/reducer unchanged. Original application baseline had 326 tests.
- `npm run lint`; `npm run build` (includes TypeScript); standalone `npx tsc --noEmit --incremental false` also passed during implementation.
- `HEALTHCREST_CHROMIUM_PATH=/usr/bin/chromium npx playwright test --config=playwright.explorer-v2.config.ts`: 12 tests. Omit the environment override with installed pinned Playwright browsers. Build first; config starts local local-positive/production-negative/unflagged-negative and approved-preview-positive servers on 3210–3213.
- All four habits/five steps, End-key slider updates, comparison scenarios, full preset replacement, reset, focus wrapping/restore, Escape, onboarding/reopen/return, no new preference storage, optional 3D creation/removal, reduced-motion demand flag and forced WebGL failure.
- Axe: zero reported violations in prototype main and drawer at 320, 390, 768 and 1440 CSS px. Keyboard checks automate native Chromium interaction; they do not substitute for manual screen-reader testing.
- 320px layout and 320×256 dialog reflow represent a 1280px window at 400% zoom; landscape 844×390 also checked. Real browser UI zoom and manual text-scaling/device checks: NOT VERIFIED.
- Local default-2D Lighthouse 13.6.0 mobile navigation: performance 99, accessibility 100, best practices 100; LCP/FCP 0.92s, TBT 103ms, CLS 0, transferred 209KiB. SEO 66 is expected for intentional noindex and prototype metadata, not a release target. Single synthetic run, not field performance, an old/new performance comparison, or optional-3D frame-rate evidence. No other test/build work ran during measurement.

Lighthouse command: `CHROME_PATH=/usr/bin/chromium node <lighthouse-install>/cli/index.js 'http://localhost:3200/prototype/explorer-v2#explore' --chrome-flags='--headless --no-sandbox --disable-dev-shm-usage' --form-factor=mobile --no-enable-error-reporting --output=json --output-path=work/lighthouse.json --quiet`. Keep server running with the local review flag. Compact results: [verification.json](verification.json).

## Technical impact and limits

Prototype changes are limited to the route/components, UI-specific preview selector, targeted tests/config and review documents (plus engineering state update). Shared production runtime, dependencies and lockfile unchanged. CSS is scoped to `.ev2` / `.ev2-modal`. Three is dynamically requested only when the optional view is mounted, uses the existing Lite scene, and unmounts on Hide. 2D and text remain available on WebGL failure; pause is initially enabled. Reduced-motion preference overrides Play. `HabitIllustration` is a new SVG presentation of the existing bounded input scale. No physiological formulas or anatomical assets were added.

Full preset buttons reuse repository-reviewed fallback records and show source scope/limits. Seven other canonical inputs have no verified original HUD bounds: no invented sliders were added. Full presets may carry these inputs as before; the prototype does not present all as individually editable. Body Scan's distinct control ranges and connected-habits/camera-shot workflows are outside this four-habit prototype; they remain available in the existing Explorer. They require an explicit parity decision before replacement.

NOT VERIFIED: real user testing, manual assistive technology, Safari/Firefox, actual 400% browser UI zoom, low-end physical-device GPU/battery behavior, independent clinical review and live browser access from this workspace (proxy blocks the preview hostname). Provider deployment status is recorded separately. This is not a claim of WCAG conformance or production readiness. Existing launch gates remain open. Review the design and practical tradeoffs before authorising any integration.
