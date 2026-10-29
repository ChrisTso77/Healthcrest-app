# Representative navigation performance checks

29 October 2026. This extends L11's previous homepage/Start mobile baseline without changing app behavior or relaxing the budgets from #109.

| Report name | Path | Configuration |
| --- | --- | --- |
| home | / | Mobile |
| start | /start | Mobile |
| guide-mobile / guide-desktop | /learn/balanced-meals | Mobile / desktop |
| planner-mobile / planner-desktop | /next-step?pillar=sleep | Mobile / desktop |
| explorer-2d-mobile / explorer-2d-desktop | /engine?pillar=sleep&view=2d | Mobile / desktop |

Run npm ci, npm run build, install Chromium with npx playwright install chromium, then node scripts/mobile-performance.mjs. The historical script and artifacts/mobile-performance location are preserved; both form factors are now included. The existing Chromium CI job runs it with a five-minute step bound, inside its unchanged fifteen-minute job limit. No new service or paid setting is needed.

The runner uses pinned Lighthouse 13.6.0, its normal mobile configuration and full --preset=desktop for desktop. Merely changing --form-factor does not configure the full desktop environment. No audit is skipped, storage reset is not disabled, and no content/control is hidden to increase scores. Each invocation starts with Lighthouse's normal storage reset; planner profiles do not read a saved visitor plan, enter notes, save data or grant measurement permission. Routes/queries are fixed public examples, not visitor data. Source: https://github.com/GoogleChrome/lighthouse#using-the-node-cli (read 29 October 2026).

Every report must match its requested form factor, enabled screen emulation, origin, route and query. Missing/malformed URL evidence and unexpected redirects fail. The existing raw score/metric budgets remain: performance/accessibility/best practices/SEO ≥90, LCP ≤2500ms, CLS ≤0.1 and TBT ≤200ms. Missing/invalid/runtime-failed evidence or unpermitted optional measurement fails. Zero LCP is invalid; zero CLS and TBT are allowed.

The summary identifies actual screen emulation/throttling, each route/form factor, all raw metrics and failures. Five mobile and three desktop reports are expected. A partial run cannot pass, and the summary is retained even after an execution failure; server cleanup runs even if summary writing fails. Individual HTML/JSON reports and the summary remain in the historical mobile-performance CI artifact for fourteen days.

Run npm run test:performance-budget for 28 cases, including original budget boundaries, desktop/mobile identity, URL/redirect evidence and public-route configuration safeguards. Broad functional/compatibility/privacy tests remain required.

These are single-navigation lab results on the CI runner. They do not establish p75 field LCP/INP/CLS, actual phones/Safari, screen-reader compatibility, planner interaction latency, or 3D/GPU/background-tab performance. The Explorer profile intentionally names its 2D path; it does not replace or remove 3D. Manual device/AT checks, interaction profiles and actual 3D profiling remain queued. Performance/accessibility scores do not certify clinical validity or WCAG conformance. See https://developer.chrome.com/docs/lighthouse/performance/performance-scoring for score variability.
