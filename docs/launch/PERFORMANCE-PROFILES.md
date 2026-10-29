# Representative navigation performance checks

29 October 2026. This extends L11's previous homepage/Start mobile baseline while retaining the budgets from #109. The first expanded run exposed two desktop Explorer accessibility defects, corrected alongside this coverage.

| Report name | Path | Configuration |
| --- | --- | --- |
| home | / | Mobile |
| start | /start | Mobile |
| guide-mobile / guide-desktop | /learn/balanced-meals | Mobile / desktop |
| planner-mobile / planner-desktop | /next-step?pillar=sleep | Mobile / desktop |
| explorer-2d-mobile / explorer-2d-desktop | /engine?pillar=sleep&view=2d | Mobile / desktop |

Run npm ci, npm run build, install Chromium with npx playwright install chromium, then node scripts/mobile-performance.mjs. The historical script and artifacts/mobile-performance location are preserved; both form factors are now included. The existing Chromium CI job runs it with a five-minute step bound, inside its unchanged fifteen-minute job limit. No new service or paid setting is needed.

The runner uses pinned Lighthouse 13.6.0, its normal mobile configuration and full --preset=desktop for desktop. Merely changing --form-factor does not configure the full desktop environment. No audit is skipped, storage reset is not disabled, and no content/control is hidden to increase scores. Each invocation starts with Lighthouse's normal storage reset; planner profiles do not read a saved visitor plan, enter notes, save data or grant measurement permission. Routes/queries are fixed public examples, not visitor data. Source: https://github.com/GoogleChrome/lighthouse#using-the-node-cli (read 29 October 2026).

Every report must match its requested form factor, enabled screen emulation, origin, route and query. Missing/malformed URL evidence and unexpected redirects fail. The existing raw score/metric budgets remain: performance/accessibility/best practices/SEO ≥90, LCP ≤2500ms, CLS ≤0.1 and TBT ≤200ms. Missing/invalid/runtime-failed evidence or unpermitted optional measurement fails. The color-contrast and heading-order audits must separately pass (or have genuine not-applicable evidence); an aggregate accessibility score above 90 cannot mask these confirmed regressions. The errors-in-console audit must also score 1 with an explicit empty items list; missing/unscorable/contradictory evidence fails. This catches the retained favicon 404 even with best practices 96. Zero LCP is invalid; zero CLS and TBT are allowed.

The summary identifies actual screen emulation/throttling, each route/form factor, all raw metrics and failures. Five mobile and three desktop reports are expected. A partial run cannot pass, and the summary is retained even after an execution failure; server cleanup runs even if summary writing fails. Individual HTML/JSON reports and the summary remain in the historical mobile-performance CI artifact for fourteen days.

Run npm run test:performance-budget for 35 cases, including original budget boundaries, desktop/mobile identity, URL/redirect evidence and public-route configuration safeguards, required accessibility-rule results and console/network-error evidence. Broad functional/compatibility/privacy tests remain required.

These are single-navigation lab results on the CI runner. They do not establish p75 field LCP/INP/CLS, actual phones/Safari, screen-reader compatibility, planner interaction latency, or 3D/GPU/background-tab performance. The Explorer profile intentionally names its 2D path; it does not replace or remove 3D. Manual device/AT checks, interaction profiles and actual 3D profiling remain queued. Performance/accessibility scores do not certify clinical validity or WCAG conformance. See https://developer.chrome.com/docs/lighthouse/performance/performance-scoring for score variability.

## Defects found by the first expanded run

Run 40851374711 at e8a72c92d7e3f1b9c1d467e6228a3e88ecad45cf passed the aggregate budgets, but the actual desktop Explorer report scored accessibility 94. Its color-contrast audit found camera descriptions at 2.74:1 in the selected button and 4.02:1 in the other buttons, below the reported 4.5:1 text requirement. Its heading-order audit found the health-goal h3 after the page h1 without a preceding panel h2. The other seven reports had no weighted accessibility audit failures.

HealthEngineHUD now uses lighter slate-300 camera descriptions and actual h2 panel labels above their existing h3 subsections. Text wording, button/panel names, layout sizes, camera behavior and habit values are preserved. The Firefox/WebKit 2D case additionally checks desktop headings, keyboard camera selection and preservation of the slider value. Evaluating the saved pre-fix report with the stricter validator rejects exactly those two audit failures; a corrected build must pass both on all eight profiles. Final-head evidence belongs to the PR's current checks/artifacts; the old report is not a post-fix result.

## Browser icon regression

The retained #111 home report identifies the console error as /favicon.ico, not an unspecified asset. The browser-icon change uses a Next-generated 64px PNG of the complete approved logo and a direct conventional-path response. Release checks cover icon metadata on every public page, actual PNG framing/dimensions, the 16 KiB limit and browser decoding; Firefox/WebKit repeat decoding and retain the PNG. The stricter budget evaluator rejects the old report independently of the best-practices aggregate. Verify all eight new reports and inspect the retained icon before reporting the defect resolved. #112's camera controls are now 3D-only; compatibility evidence for 2D checks their absence, while Chromium covers 3D keyboard controls.
