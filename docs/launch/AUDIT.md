# Healthcrest launch audit

Recorded 29 October 2026. Baseline: `34ca713b922ee53b2f0dad1c5447d406e9a1216d` (PR #108), tree `c7ce7560f82777ffda89b684a963e1ed973e9d21`. This is an evidence register, not a declaration of launch readiness or a completed penetration test. Read ROADMAP.md, LAUNCH-CHECKLIST.md, DECISION-REGISTER.md and PROGRESS.md together.

## Reproducible baseline

- GitHub main was at the baseline above; no open PRs at audit start. The original local `/workspace/Healthcrest-app` checkout was clean at `81758f7` on branch `work`; it was preserved.
- The GitHub connector supplied the immutable tree and changed files. An isolated source snapshot was reconstructed at `/workspace/healthcrest-launch-34ca713`; all 203 tracked files matched their Git blob hashes. No AGENTS.md or SECURITY.md was present in the repository inventory.
- Local git fetch failed: `Failed to connect to proxy port 8080`. `npm ci --offline` failed with ENOTCACHED for zustand; the initial install was unavailable under the default sandbox. A later `npm ci` with the supported network permission completed successfully (468 packages); no proxy or TLS settings were bypassed. Existing dependencies were reused, with the key installed package versions checked against the unchanged lockfile. Local Node is 24.19.0; CI uses Node 22.
- Initial local `npx --no-install tsc --noEmit`, `npm run lint` and `npm run test:unit` passed (300 tests, 30 files). A symlinked dependency build failed Turbopack root resolution; dependencies were then made available inside the snapshot. The subsequent build with in-root dependency files failed when Turbopack/PostCSS attempted a child-process port bind denied by the execution sandbox (Operation not permitted). Hosted CI remains the build evidence; no application config was changed to bypass this.
- Chromium, Firefox and WebKit executables are absent locally. Local browser/release/Lighthouse checks are unavailable; browser downloads require destinations outside the current allowed host policy. No network-policy bypass was attempted.
- Exact-main hosted [run 40840624311](https://github.com/ChrisTso77/Healthcrest-app/actions/runs/40840624311) passed all five jobs: CMS seed validation; lint/type checks/300 unit tests and production dependency audit; production build/18 release checks/283 Chromium tests/mobile audit; preview measurement-off; 14 compatibility checks (seven Firefox, seven WebKit). Dependency audit reported zero vulnerabilities; that is not an application-security assessment.
- Vercel reported a successful [production deployment](https://vercel.com/tsotsoft/healthcrest-app/66LRHQHEcpqpXZxTbBkacmQUhaN9) for the baseline. This does not prove current DNS, all live journeys or provider settings. A read-only web fetch of the canonical homepage was inaccessible from this tool. The latest known manual live smoke predates this baseline; run the production workflow after an explicitly approved release.

### Mobile laboratory results on the baseline

Lighthouse 13.6.0, one navigation per route on a GitHub runner; default visitor with no optional measurement requests. These are not field percentiles, INP measurements or a WCAG conformance statement.

| Route | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| / | 100 | 100 | 96 | 100 | 915 ms | 0.000715 | 24 ms |
| /start | 100 | 100 | 96 | 100 | 911 ms | 0 | 26 ms |

## Architecture and visitor journeys inspected

| Area | Current evidence and limits |
| --- | --- |
| Stack | package-lock.json resolves Next 16.4.3, React/React DOM 19.3.0, TypeScript 5.9.3, Tailwind 4.3.3, Sanity client 8.7.0, Three 0.186.1, Playwright 1.63.0 and Vitest 5.0.5. package.json, tsconfig.json, next.config.ts and .github/workflows/ci.yml define commands/builds. The later clean install warned that ESLint 9.39.5 is unsupported; see L14. Other dependency currency beyond the recorded audit is not established. |
| Routes and server/client boundaries | App Router server pages cover /, /start, /learn, four /learn/[slug] guides, /engine, /next-step, /about, /contact, /storage and /privacy. Client islands include LearningLibrary, HabitPlanner, MeasurementProvider, the preview and animation. The engine is interactive client state; its WebGL wrapper is dynamically imported with SSR disabled. |
| Brand and navigation | components/SiteChrome.tsx shares logo/header/footer. app/page.tsx provides the purpose, four pillars, interactive preview, sources, credibility and planner links. The approved raster logo uses next/image AVIF/WebP delivery, not a fabricated vector. app/landing.css supplies three scoped colour variables plus shared classes; engine and planner styles also contain literal values. |
| Explorer | state/PillarsStateMachine.tsx and lib/state implement reducer transitions; reviewed preset text is separate from illustration values. components/HealthEngineViewport.tsx supplies a labelled 2D alternative/error boundary. app/WebGLCanvasWrapper.tsx uses demand frames when paused/reduced motion and capped DPR; normal animated mode still renders continuously. GPU/background-tab behavior needs profiling. |
| Motion/media | components/HummingbirdAnimation.tsx has a pause control and reduced-motion/error still. Public runtime files: opaque WebM 1,641,474 bytes, JPEG still 36,695 bytes, PNG logo 698,105 bytes. The old transparent WebM and root asset copies remain tracked; they are not proof of runtime downloads. Preserve originals until usage and asset ownership are reviewed. |
| Planner | components/HabitPlanner.tsx, HabitPlanBackup.tsx, HabitWeekPlan.tsx and lib/education/habitDraft.ts/habitWeek.ts maintain manual save/restore/import boundaries. The existing key healthcrest.habit-draft.v1 carries version 3 data; v1/v2 parse into memory. A selected backup is bounded/validated locally, previewed and explicitly applied. Notes never become scores. Calendar downloads are generic; external calendar imports/device alerts are not tested. |
| Content/CMS | Four substantive source-linked guides are repository-authored in lib/education/learningGuides.ts; they are not Sanity article documents. pillars-cms-schema.ts describes scenarios/storyboards. /api/presets is the only App Router API route in the inventory; it has a GET handler and reads Sanity. Known scenario wording comes from lib/presets/reviewedContent.ts. UI retry/fallback cases exist. Actual Studio editorial permissions, publishing/archive and CMS recovery remain unverified. |
| Accounts/forms | No visitor authentication, payment, signup, contact submission or server-action implementation was found in the tracked route/component inventory. Contact is an email link. Do not add collection by assumption. |
| Privacy | lib/privacy/measurement.ts and components/MeasurementProvider.tsx implement the operator-production gate, independent expiring permissions, public-path allowlist, URL/referrer filters and default-off behavior. Planner routes are excluded. Runtime provider dashboards and retention/enquiry practices are not established by these tests. |
| SEO | lib/siteMetadata.ts, learningGuideMetadata.ts, robots.ts, sitemap.ts, opengraph-image.tsx and not-found.tsx provide canonical/sharing metadata, WebSite/Article/BreadcrumbList JSON-LD, sitemap discovery and 404/noindex recovery. Guide bylines say Healthcrest and distinguish source checks from clinical validation. Search Console, indexing and external rich-result validation are not verified. |
| Accessibility/tests | Shared skip links, labelled controls, native disclosures/dialogs, text/SVG alternatives and reduced-motion paths are covered by several suites. Narrow 320px WebKit overflow was corrected in #108. Existing browser tests are not a full manual keyboard, screen-reader, forced-colours, 400% zoom or real-device audit. |
| Operations | Five CI jobs, manual production-smoke.yml, release/mobile scripts, docs/release-readiness.md and measurement-rollout.md exist. No vercel.json, custom monitoring integration or incident exercise evidence appears in the inventory. Dashboard environment separation, rollback access and DNS require operator verification. |

## Ranked findings

Severity describes launch impact, not an invented exploit score. **Verified defect** means directly evidenced behavior; **opportunity** is a justified improvement; **unverified risk** requires further evidence. No claim of absence of critical/high vulnerabilities is made.

### L01 — Security assurance unavailable
- Category / severity / kind: Security; **High**; unverified risk and Gate B/D blocker.
- Evidence: The codex-security:security-scan skill was read, but its referenced scan-prologue resource was unavailable and no security preflight/scan tool was exposed. Only configuration inventory and historical dependency-audit evidence are recorded here. next.config.ts declares no-referrer; further header/CSP behavior is not certified.
- Impact: A dependency pass cannot establish trust boundaries, CSP suitability, CMS exposure or safe production operation.
- Remediation: Restore a supported Standard scan environment, perform its threat model/source review/validation and retain its report. Review headers/resources, imports/storage, API/CMS, logs, supply chain and deployment boundaries; design CSP from actual resource needs. Do not install a generic permissive policy.
- Complexity / dependencies: Medium–High; supported scan/preflight and source access, production checks where authorized.
- Acceptance / status: Completed source-backed assessment; all Critical/High findings fixed or recorded as explicit blockers with regression evidence. **Pending; not scanned.**

### L02 — Hosting eligibility unresolved
- Category / severity / kind: Operations/legal; **High**; unverified risk and Gate D blocker.
- Evidence: Owner last confirmed Vercel Hobby; docs/privacy-notice-draft.md already flags eligibility. Vercel's official Hobby documentation read 29 October restricts it to personal, non-commercial use. Planned Healthcrest Ltd business positioning requires an eligibility decision; company ownership alone does not settle the permitted use.
- Impact: Controlled business launch could use an unsuitable plan.
- Remediation: Owner confirms intended use/current plan; obtain provider clarification or explicitly approve a suitable plan if required. No automatic upgrade.
- Complexity / dependencies: Low engineering; owner/provider decision D01.
- Acceptance / status: Recorded current plan and eligibility for intended use, approved cost/configuration decisions. **Pending.**

### L03 — Company and processing facts incomplete
- Category / severity / kind: Privacy/legal/trust; **High**; unverified risk and Gate B/D blocker.
- Evidence: docs/privacy-notice-draft.md lists missing company details, exact GoDaddy product/subprocessors, retention, transfers, lawful-basis and enquiry handling records. Public /privacy and /contact exist; that does not complete these records.
- Impact: Public disclosures may not fully describe the operator's actual obligations/processing.
- Remediation: Verify business/provider facts and obtain owner approval for any public legal changes. Review notices against actual processing.
- Complexity / dependencies: Medium; D02/D03, owner/provider records and appropriate legal review.
- Acceptance / status: Verified disclosures/retention/rights process; approved public wording; tests preserve default-off telemetry. **Pending; no legal text changed.**

### L04 — Human editorial sign-off not established
- Category / severity / kind: Health-content governance; **High**; unverified risk and Gate B/C blocker.
- Evidence: app/about/page.tsx and guide bylines explicitly distinguish the 28 October source check from independent clinical review. docs/editorial-sources.md and scenario-evidence-review.md exist; no completed per-content approval history is established by the code. On 29 October the owner confirmed he will approve health content and review/correct at least weekly; this is a process commitment, not completed sign-off. Existing founder credentials are owner-supplied, not independently reverified here.
- Impact: A health-site launch needs accountable, current content review without implying clinical validation of the model.
- Remediation: Record the confirmed Chris Tsoto/weekly review process and actual per-content approvals; verify credentials before any changed claim. Retain NHS/local service routes and relevant WHO/Harvard/CDC perspectives. No unreviewed new advice.
- Complexity / dependencies: Medium; D04 and human review.
- Acceptance / status: Four guides/scenarios signed off with substantive dates, limitations and correction process; evidence retained. **Approver/cadence confirmed; content sign-off pending.**

### L05 — Mobile scores did not gate release
- Category / severity / kind: Verification/performance; **Medium**; verified defect.
- Evidence: Baseline scripts/mobile-performance.mjs wrote scores/metrics without comparing them to targets. CI would succeed on low scores when Lighthouse itself exited successfully.
- Impact: A green release could conceal an agreed performance/accessibility/SEO budget failure.
- Remediation: Evaluate raw scores ≥90 and mobile LCP ≤2500ms, CLS ≤0.1, TBT ≤200ms; reject incomplete/invalid/runtime-failed reports and unpermitted measurement. TBT is a lab budget, not INP. Preserve reports before failing.
- Complexity / dependencies: Low; existing Lighthouse/Node tooling, no new service.
- Acceptance / status: Exact-threshold and just-outside/invalid cases tested; actual mobile job passes or fails on recorded evidence. **Implemented on the launch branch; hosted verification pending.**

### L06 — Manual accessibility coverage incomplete
- Category / severity / kind: Accessibility; **Medium**; unverified risk and Gate B/C condition.
- Evidence: automated/browser coverage above; no retained route-wide screen-reader, 400% zoom, forced-colours, touch and actual Safari/device matrix. WCAG 2.2 AA cannot be inferred from Lighthouse 100.
- Impact: Visitors using assistive technology or magnification may encounter untested barriers.
- Remediation: Complete the manual matrix in LAUNCH-CHECKLIST.md; reproduce/fix each confirmed defect with regression coverage.
- Complexity / dependencies: Medium; browser/device/assistive-technology access.
- Acceptance / status: Dated route/task results with browser/AT/version, failures, fixes and retests. **Pending.**

### L07 — SEO/internal-link regression coverage gaps
- Category / severity / kind: SEO/functionality; **Medium**; opportunity.
- Evidence: scripts/check-release.mjs checked title/description presence and internal pathnames, but not unique page metadata, exposed screen heading/language or fragment targets. Structured data exists; external eligibility/indexing checks remain separate.
- Impact: A later broken source/skip/planner anchor or duplicated metadata could pass the smoke check.
- Remediation: Add default-public-DOM fragment and metadata/heading checks; plan structured-data consistency review and approved Search Console verification/submission.
- Complexity / dependencies: Low engineering; browser CI. External accounts require D06.
- Acceptance / status: Production-build release report includes the new checks; query-specific states remain covered separately. **Initial checks merged in #109; rendered structured-data coverage merged in #111.**

### L08 — Design system only partially shared
- Category / severity / kind: Design/UX; **Medium**; opportunity.
- Evidence: app/landing.css has scoped ink/muted/paper tokens and shared buttons; app/next-step/next-step.css, guide.css and HealthEngineHUD contain repeated literal colours, spacing and control styles.
- Impact: Incremental upgrades risk inconsistent states, contrast or spacing across calm/light and dark interactive routes.
- Remediation: Inventory approved tokens and components, compare current screenshots, then migrate one representative control/page at a time. Preserve hummingbird assets and existing layout behavior.
- Complexity / dependencies: Medium; baseline visual matrix, contrast verification and D05 for material brand changes.
- Acceptance / status: Documented semantic tokens and before/after review at mobile/tablet/desktop with no lost focus/reflow. **First scoped palette/focus migration merged #117 (L22); see DESIGN-TOKENS.md.** Status, spacing, typography and Explorer migration remain queued; no wholesale rewrite.

### L09 — Operational recovery/monitoring not demonstrated
- Category / severity / kind: Operations; **Medium**; unverified risk and Gate D blocker.
- Evidence: docs/release-readiness.md describes rollback/live smoke; no exercised rollback, incident contact/triage record, CMS recovery confirmation or current monitoring evidence is provided. Successful Vercel status is deployment evidence only.
- Impact: Production errors or content loss may not be detected/recovered promptly.
- Remediation: Prepare owner-operated runbook, confirm access/retention/restore options and exercise approved recovery; use existing services first without new processors.
- Complexity / dependencies: Medium; D07 and provider access.
- Acceptance / status: Commit-bound live smoke plus tested rollback/recovery and privacy-preserving operational ownership. **Pending.**

### L10 — Media originals and runtime delivery need separate review
- Category / severity / kind: Assets/performance; **Low**; opportunity.
- Evidence: duplicate root/public originals in the 203-file tree; PNG logo 698,105 bytes; runtime logo uses next/image, and opaque WebM/still intentionally preserve composition.
- Impact: Repository weight and possible unnecessary downloads; raw asset size alone does not prove live network cost.
- Remediation: Inspect actual network delivery and animation visibility/battery behavior; retain approved originals. Obtain a genuine vector source if available; do not trace/fabricate one or delete assets blindly.
- Complexity / dependencies: Low–Medium; browser profiling and approved source assets.
- Acceptance / status: Measured route transfer/GPU baseline and improvement without animation/fallback regressions. **Queued.**

### L11 — Performance scope and field evidence limited
- Category / severity / kind: Performance; **Medium**; unverified risk.
- Evidence at the audit baseline: Lighthouse covered only / and /start on mobile. #109 made those budgets enforceable. This cycle adds eight navigation profiles across five routes, including guide/planner/explicit 2D Explorer on mobile and desktop, with requested-route/emulation checks. Actual 3D/device, interaction and p75 field evidence remains unavailable.
- Impact: Good front-door scores do not establish interactive-route performance or Core Web Vitals compliance.
- Remediation: Expand representative lab coverage after budgets are established; profile 3D/background behavior on actual devices. Use approved privacy-preserving field sources only if available, without enabling measurement by assumption.
- Complexity / dependencies: Medium; browser/device access, D03 for any measurement changes.
- Acceptance / status: Inspect all eight exact-head mobile/desktop navigation reports and unchanged budgets; field/INP, actual-device, interaction and 3D/GPU checks remain distinct. **Navigation coverage implemented on the working branch; hosted results linked from its PR. Other L11 evidence remains pending.** See PERFORMANCE-PROFILES.md.

### L12 — Launch state was scattered across feature notes
- Category / severity / kind: Delivery/governance; **Low**; opportunity.
- Evidence: feature documentation existed under docs/, but no docs/launch directory at baseline.
- Impact: A resumed session could repeat work or confuse source checks, CI, production evidence and owner approvals.
- Remediation: Create the five linked launch documents, ranked tasks, gates and exact resumption instructions.
- Complexity / dependencies: Low; this audit.
- Acceptance / status: Another session can locate checked commits, blockers and next actions without chat history. **Created; maintained in this PR.**

### L13 — CMS authoring lifecycle not evidenced
- Category / severity / kind: Content operations; **Medium**; unverified risk.
- Evidence: pillars-cms-schema.ts and repository review catalogue exist; actual Studio access, preview/publish/archive workflow, reviewer roles and recovery are not part of the verified source snapshot. Educational articles currently live in Git.
- Impact: Moving health articles into CMS prematurely could bypass repository review or expose unreviewed wording.
- Remediation: Document the existing scenario workflow and test outage/retry behavior; verify operator access and draft/publish separation before proposing justified schema changes. Keep visitor notes separate.
- Complexity / dependencies: Medium; D04/D07 and scoped CMS access.
- Acceptance / status: Recorded author→review→preview→publish→correct/archive journey with failure/recovery evidence, without publishing new advice automatically. **Pending.**

### L14 — ESLint release line unsupported
- Category / severity / kind: Development tooling; **Medium**; verified maintenance issue, not a claimed exploitable vulnerability.
- Evidence: Clean npm ci warned that ESLint 9.39.5 is no longer supported; package-lock.json resolves that version. Official eslint.org/version-support/ read 29 October lists v9 EOL since 6 August 2026 and v10 current. npm registry reports stable 10.13.0; installed eslint-config-next 16.4.3 declares eslint >=9.0.0. Plugin compatibility still needs testing.
- Impact: The development lint tool no longer receives upstream maintenance; blind major upgrades could also change lint behavior.
- Remediation: Prepare an independent dev-tool PR after checking all peer constraints and the v10 migration guide; use a real lockfile update without force/legacy-peer-deps or disabling rules.
- Complexity / dependencies: Low–Medium; compatible Next/TypeScript/React lint plugins and Node (v10 requires ^20.19 / ^22.13 / >=24; CI selects current Node 22).
- Acceptance / status: Clean install without peer overrides, intended lint coverage/rules preserved, lint/type/unit/build/hosted checks pass. **Blocked on current plugin peer compatibility.** A separate isolated installation of eslint 10.13.0 completed with peer override warnings, but `npm ls eslint --all` exited ELSPROBLEMS: current eslint-plugin-react 7.37.5, eslint-plugin-jsx-a11y 6.10.2 and eslint-plugin-import 2.32.0 exclude v10. Registry checks confirmed these are their latest releases. No forced/legacy-peer install, rule removal or lockfile change is proposed in the foundation PR. Reassess compatible upstream releases or a separately reviewed configuration alternative.

### L15 — Desktop Explorer camera contrast and panel heading order
- Category / severity / kind: Accessibility; **Medium**; verified defects.
- Evidence: Run 40851374711, head e8a72c92d7e3f1b9c1d467e6228a3e88ecad45cf, mobile-performance artifact's explorer-2d-desktop.report.json. The color-contrast audit identified camera-description text in components/HealthEngineHUD.tsx at 2.74:1 (selected) and 4.02:1 (unselected) versus the reported 4.5:1 requirement. The heading-order audit identified the health-goal h3 after h1 without an intermediate panel h2. Aggregate accessibility was 94, so the ≥90 category budget alone did not reject these failures.
- Impact: Low-vision visitors can struggle to read camera explanations, and heading navigation conveys an incomplete panel hierarchy.
- Remediation: Lighten camera descriptions to slate-300; use actual h2 panel labels above existing h3 content. Preserve labels, layout and control behavior. Require those two audit rules independently of the aggregate score.
- Complexity / dependencies: Low; one HUD component, existing Lighthouse reports and Firefox/WebKit checks. No new dependency or clinical/legal text.
- Acceptance / status: Old desktop report is rejected for exactly the two required audits; all eight corrected-build reports pass them, and desktop headings/keyboard camera selection preserve habit settings in both compatibility engines. **Merged in #110 with all five jobs and eight report artifacts verified.** Other manual accessibility/device evidence remains pending.

### L16 — Structured data lacks rendered-content consistency checks
- Category / severity / kind: SEO/content integrity; **Low**; improvement opportunity.
- Evidence: lib/education/learningGuideMetadata.ts separately defined breadcrumb labels from app/learn/[slug]/page.tsx; the final structured label used the article title while the visible trail used the topic. Both can describe the same guide; this is not a claim of invalid Google markup. The release script checked canonical/sharing metadata but not JSON-LD, author/date/source agreement or query variants.
- Impact: Future source/byline/navigation edits could drift from structured representations while release checks remain green.
- Remediation: Share breadcrumb and responsible-organisation definitions; parse and compare the rendered WebSite/Article/BreadcrumbList, visible byline/date/sources/trail and public preference variants. Do not invent clinical-review/publication dates or treat software checks as human review.
- Complexity / dependencies: Low–Medium; existing Node, Vitest and hosted browser/release tooling; no new service or dependency. External Search Console actions remain D06-gated.
- Acceptance / status: 35 parser/mismatch cases, existing catalogue tests and rendered checks across 13 pages/four guide variants pass at an immutable head. **Merged in #111; run 40861689429 passed all five jobs, 35 Node contract cases and 22 release checks.** External validation/indexing and actual editorial sign-offs remain pending.

### L17 — Camera controls imply effects in the 2D diagram
- Category / severity / kind: UX/accessibility clarity; **Low**; verified usability defect.
- Evidence: At main 53fed298bcdb8d6cc5aeb712b0535ae5fb23b030, HealthEngineHUD rendered camera controls for every mode; HealthEngineViewport's 2D fallback did not consume camera state and reserved a 17rem right inset on desktop. cameraShots.ts used medical metaphors for angle/zoom presets; descriptions were 9px. Existing compatibility tests clicked a camera button in 2D without verifying a visible camera result.
- Impact: Visitors can mistake viewing angles for health outcomes or expect a 2D response that never occurs; the unused column narrows the diagram.
- Remediation: Render camera controls only in 3D, describe angles plainly, enlarge labels/descriptions, explain angle/zoom scope and expand desktop 2D space. Close compact overlays when changing render mode; preserve camera IDs/mappings, habit settings, presets and comparison starting values.
- Complexity / dependencies: Low; existing HUD/viewport, guide UI explanation, camera catalogue and hosted browser/report tooling. No dependencies, new health advice or collection.
- Acceptance / status: Keyboard camera/reset and render-mode transitions preserve selection/values; compact camera controls reopen closed after a mode change; 2D has no camera controls/canvas and uses the freed desktop width. Chromium screenshots cover mobile/tablet/desktop; Firefox/WebKit retain 2D-only checks. **Merged in #112: all five hosted jobs passed, including keyboard/layout/state regressions, and four successful browser screenshots were inspected before merge.** This does not complete manual accessibility or device/3D performance review.

### L18 — Missing conventional browser icon creates repeated console errors
- Category / severity / kind: Asset delivery/quality gates; **Low**; verified defect.
- Evidence: The retained run 40861689429 home.report.json errors-in-console audit records a network 404 at http://127.0.0.1:3001/favicon.ico. All eight profiles scored best practices 96 despite otherwise passing budgets. Main 8f4f76 has no icon/favicon route or file; shared layout provides no icon metadata. Earlier fresh-visitor checks only tracked /_next/static failures.
- Impact: Browser tabs lack a deliberate Healthcrest icon, and aggregate budgets allow this delivery error to recur unnoticed.
- Remediation: Use Next's metadata image route to render the complete approved logo proportionally as a bounded PNG; serve the conventional address directly. Check icon metadata on public routes, the response format/dimensions/size/fallback and browser decoding. Require error-free console audit evidence independently of the aggregate score.
- Complexity / dependencies: Low; existing Next ImageResponse, approved PNG and hosted browser/release/Lighthouse tooling. No new dependency, network provider or clinical/legal text.
- Acceptance / status: All 13 public routes expose a same-origin icon; fallback directly returns a complete, decodable 64px PNG at or below 16 KiB. All eight final-head reports pass the console audit with no error entries; the old 404 report is rejected. Firefox/WebKit decode the icon; inspect retained output. **Merged #113: all five jobs, 23 release checks and eight inspected error-free Lighthouse reports passed; retained PNG output was inspected.** This does not establish real-device icon appearance or broader application security.

### L19 — Explorer exposes inconsistent topic terminology
- Category / severity / kind: UX/content clarity; **Low**; verified inconsistency and improvement opportunity.
- Evidence: At main b095821, LandingEnginePreview and LearningLibrary use Movement/Food/Stress & support, but HealthEngineHUD renders internal Fitness/Nutrition/Systems names; HealthEngine2DFallback, HealthEngineGuide, ParameterExplanation and SettingComparison expose those keys as pillar names. The combined Systems view appears alongside four individual topics. Existing names are understandable to some visitors but do not match the entry journey.
- Impact: Visitors must translate terminology after following a topic link, and Systems gives little indication that the view connects the habits. Repeated independent labels can drift.
- Remediation: Share public labels (Movement, Food, Sleep, Stress & support, Connected habits) across navigation/context/entry surfaces; say topic for the five-view selector. Preserve internal identities, legacy slugs, presets/settings and source-linked health guidance.
- Complexity / dependencies: Low–Medium; shared display map, existing components and hosted browser/screenshot evidence. No new dependency, service, health advice or collection.
- Acceptance / status: Existing links select the correct public topic; keyboard changes preserve settings and matching guide/planner destinations. Visible/accessible 2D descriptions and context names agree. All five controls fit at narrow/mobile/tablet/desktop widths; inspect retained 320/768/1350px screenshots, with existing compact 3D and Firefox/WebKit 2D coverage. **Merged #114: all five jobs, 286 Chromium/16 compatibility cases and eight inspected profiles passed; four final screenshots were reviewed, including the corrected compact 3D key.** This does not complete shared-token migration or manual accessibility/device review.

### L20 — Comparison starting values cannot be restored directly
- Category / severity / kind: Explorer usability/recoverability; **Low**; improvement opportunity.
- Evidence: At main f658540, SettingComparison offers Use current settings as starting point, while captureComparisonStart retains all eleven inputs. No direct action restores those values; reloading restarts the session, and choosing an example creates a new reference and can change camera/topic. Existing reducer actions update one parameter, scene, render mode or an entire preset.
- Impact: Visitors experimenting with several sliders must manually reconstruct the starting values or leave the comparison they were exploring.
- Remediation: Provide an explicit restore action that atomically copies captured inputs as a manual scenario, retaining current topic/render mode, camera/motion and the captured reference. Keep restoration distinct from replacing the reference; prevent no-change activation from clearing preset attribution and preserve keyboard focus. Do not touch saved plans.
- Complexity / dependencies: Medium; reducer action, comparison/app/guide controls and existing unit/browser tests. No new dependency, service, health advice or collection.
- Acceptance / status: All eleven inputs restore without aliasing/mutating the reference; topic/view/camera/canvas and custom starting values persist. Restored edits have manual metadata; an unchanged example stays selected. Keyboard/status/focus and scroll work at compact/mobile/tablet/desktop sizes, and storage/privacy checks pass. Inspect retained comparison screenshots. **Merged #115: all five jobs, 302 unit, 291 Chromium/16 compatibility cases and eight profiles passed; 320/768/1350px restored-dialog screenshots were inspected.** Manual AT/device testing remains pending.

### L21 — Comparison values start below the first small-screen view
- Category / severity / kind: Explorer mobile readability; **Low**; report-backed improvement opportunity.
- Evidence: Run 40885297568 at f9b6082, retained restored-settings-320px screenshot (320×568), shows the starting label and explanatory paragraphs filling the comparison content viewport. The numeric cards appear after that prose and marker legend. Fixed restore/close controls remain usable; values require scrolling.
- Impact: Visitors opening Compare on a small screen encounter explanations before the values they came to compare.
- Remediation: Present the four main controls in a compact native table using existing comparison data/formatting. Keep a concise health caveat visible, move longer instructions/legend into an accessible disclosure, and retain detailed differences, sources/guidance and additional changed inputs below. Preserve reference/restore/view/storage behavior.
- Complexity / dependencies: Low–Medium; comparison component, existing browser/compatibility and screenshot tooling. No new dependency, state model, health advice or collection.
- Acceptance / status: Initial 320×568 content fits the complete first numeric row; 390×844 and desktop fit all four. Units/starting/current values agree with detailed cards and update after reference changes/restoration. Changed/Unchanged labels convey state without relying on colour. Native help works by keyboard without changing values; focus/scroll/restore and saved-plan checks pass. Inspect final summary screenshots. **Merged #116: all five jobs, 294 Chromium/16 compatibility cases and eight inspected profiles passed; corrected 320/390/1350px summary screenshots were reviewed.** This is not a manual screen-reader/device audit.

### L22 — Public palette and focus definitions can drift
- Category / severity / kind: Design/accessibility consistency; **Low**; improvement opportunity.
- Evidence: Main 7b59604 repeats palette and 3px focus rules across landing, planner, Learn, guide and Start styles. The homepage preview and planner guidance use #11372b; default #648c44 outline contrast is approximately 3.35:1, while planner evidence already uses #c3d99f. This is not evidence of a failed 3:1 requirement.
- Impact: Separate literals make future state changes harder to maintain; a brighter existing colour makes keyboard focus easier to distinguish on dark sections.
- Remediation: Centralise the existing semantic public palette/focus dimensions, preserve page appearance, and inherit #c3d99f focus on the preview/guidance dark surfaces. Document the partial migration and keep the Explorer independent.
- Complexity / dependencies: Low–Medium; scoped CSS and existing hosted browser/artifact tooling. No dependency, provider, clinical or storage change.
- Acceptance / status: Rendered keyboard focus/activation across home/Learn/guide/planner/Start, outline width/offset at least 3px and contrast at least 3:1 on light/7:1 on dark. Inspect phone/desktop focus screenshots, all five jobs and eight profiles. **Merged #117: all five jobs, 296 Chromium/18 compatibility cases and eight inspected profiles passed; six 390/1350px focus screenshots were reviewed.** This does not complete manual AT/device/forced-colour review.

### L23 — Selected public habits rely on palette changes
- Category / severity / kind: Accessibility/selection clarity; **Medium**; verified style defect with limited runtime reproduction.
- Evidence: Main da60a96 uses only background/border/text colours to distinguish aria-pressed buttons in LandingEnginePreview, HabitPlanner and HabitDraftOverview. An isolated local Chromium render of actual public CSS under forced-colours emulation shows selected and unselected preview/planner controls with the same black border/text on white; no visual marker remains. Full hosted-page and actual OS/AT evidence is separate.
- Impact: Visitors using a substituted palette can lose the visual indication of the active habit or open draft even though aria-pressed remains available to assistive technology.
- Remediation: Add one shared, aria-hidden checkmark to selected buttons in all three groups. Reserve its space, preserve accessible names/pressed semantics and align text/marker within existing responsive controls. Do not override the visitor's system palette.
- Complexity / dependencies: Low–Medium; existing lucide icon, scoped CSS and browser/artifact tooling. No dependency, storage, collection, clinical or provider change.
- Acceptance / status: All four choices in each group update exactly one visible marker and unchanged accessible names. Normal narrow and emulated forced light/dark phone/desktop layouts retain usable controls; keyboard/focus, edit preservation and no-save boundaries pass. Inspect screenshots, all five jobs and eight profiles. **Merged #118: all five jobs, 301 Chromium/20 compatibility cases and eight inspected profiles passed; fifteen 320/1350px normal/forced-colour screenshots were reviewed.** Actual forced-colour OS themes, screen readers and real-device checks remain pending.

### L24 — Selected Explorer examples depend on palette and shadow
- Category / severity / kind: Accessibility/scenario clarity; **Low**; source-backed improvement opportunity.
- Evidence: Main 9eba258 HealthEngineHUD example cards share the same text, font weight and border geometry in both pressed states; only palette/shadow differs. Forced colours can suppress those distinctions. The camera list already includes a selected Zap icon; topic/render controls also have structural differences. L23 covered public habit buttons, not this Explorer list.
- Impact: A visitor using substituted colours can struggle to identify the current example. The marker must follow actual preset attribution rather than coincidentally matching numbers.
- Remediation: Reuse the aria-hidden checkmark next to the selected example title with reserved space, and label the scenario collection. Make the shared marker self-contained with existing Tailwind utilities, preserving public appearance and the independent Explorer palette.
- Complexity / dependencies: Low–Medium; existing icon/utilities, HUD and hosted browser/artifact tooling. No dependency, health guidance, state model, storage or provider changes.
- Acceptance / status: Exact title/category names, one fully visible marker after explicit selection, none after manual edits or restoring the same numbers, and reselect-to-attribute behavior. Verify ordinary/research presets, compact/desktop emulated forced colours, 2D without a canvas, normal 3D canvas/camera continuity, public-marker regressions, screenshots, all five jobs and eight profiles. **Merged #119: final run 40932580357 passed all five jobs, 306 Chromium/22 compatibility cases and eight inspected profiles; thirteen final Explorer/public screenshots were reviewed.** No actual OS-theme/AT or WCAG-conformance claim.

### L25 — Forced-colour modal closing can erase static text over blur
- Category / severity / kind: Accessibility/rendering; **Medium**; verified browser-visible defect.
- Evidence: Run 40929816842 (b4b92c1) scenario-manual-after-restore 1350px forced light/dark screenshots leave the unchanged goal/2D text blank after closing Compare/Guide, despite passing DOM visibility checks. A local isolated Chromium reproduction using the same native dialog and backdrop-filter pattern persisted across animation frames. Disabling only panel or only modal-backdrop blur retained the defect; disabling both restored static text. The underlying blur styles also exist on baseline 9eba258.
- Impact: Visitors using forced colours can lose readable health-goal and diagram context after ordinary dialog use; automated visibility alone missed the paint failure.
- Remediation: Use existing forced-colors Tailwind variants to disable decorative backdrop blur on all four HUD surfaces and shared modal backdrops. Keep normal themes, colours, dialog semantics/focus and state untouched. Check rendered filters and inspect post-close screenshots.
- Complexity / dependencies: Low–Medium; existing CSS variants, modal/HUD and browser/artifact tooling. No dependencies or changed health/privacy/provider behavior.
- Acceptance / status: Emulated forced light/dark compact/desktop surfaces and open modal backdrops compute no blur; Compare/Guide close with intact readable goal/diagram text, correct marker/manual state and focus. Normal 3D/public screenshots remain consistent; all five jobs/eight profiles pass at the corrected head. **Merged #119: corrected-head run 40932580357 passed all five jobs and eight profiles; inspected forced light/dark post-close screenshots confirm restored goal/diagram text.** Actual OS-theme/AT/device evidence remains pending.

### L26 — Explorer information controls obscure their purpose
- Category / severity / kind: UX/accessibility clarity; **Low**; source/report-backed improvement opportunity.
- Evidence: Main ab28ff0 HealthEngineApp renders Home & Global Narrative as an in-place modal button; the actual home link is separate. The second modal uses CLINICAL & MEDICO-LEGAL DISCLAIMER and an I Understand & Acknowledge close button without acknowledgement storage. Retained #119 screenshots show small footer text; modal close icons have compact padding. This is a clarity/ergonomics opportunity, not a claimed WCAG target-size failure or legal-policy finding.
- Impact: Visitors can mistake an explanation for Home navigation or closing for recorded consent; technical labels and small controls increase friction in reading the tool's purpose/limits.
- Remediation: Use About this Explorer / Important information, explicit dialog hints and ordinary close actions; enlarge information/close targets and contain headers. Preserve both substantive content blocks exactly, all source links and pending editorial/legal decisions. Reserve sufficient footer space and preserve privacy/retry routes.
- Complexity / dependencies: Low–Medium; one app component, existing modal infrastructure, browser/artifact checks. No new dependency, policy, health advice or collection.
- Acceptance / status: 320px/desktop names, 44px targets and unclipped headers; keyboard/scroll/focus, actual Home navigation and in-place setting/view/camera/canvas retention. No storage/POST changes on close; both content blocks unchanged. Inspect six screenshots, all five jobs and eight profiles, preserving existing recovery/forced-colour regressions. **Merged #120: run 40937222141 passed all five jobs, 308 Chromium/24 compatibility cases and eight inspected profiles; six information-control screenshots were reviewed.** Device/AT and legal/editorial sign-off remain pending.

### L27 — Saved four-habit copy can be removed in one activation
- Category / severity / kind: Planner recoverability/UX; **Low**; source-backed improvement opportunity.
- Evidence: Main 7797ef9 HabitPlanner Remove saved draft directly calls localStorage.removeItem(HABIT_DRAFT_KEY). That key contains the four drafts, notes and current seven-day plans. Page edits remain, but no separate confirmation explains the full saved-copy scope. No actual loss incident is claimed.
- Impact: An unintended activation can discard a visitor's saved multi-habit copy, including notes/check-ins that may not be restored on the current page.
- Remediation: Add a scoped inline confirmation with Keep saved plan as the focused safe default and explicit Remove saved copy. Preserve page edits and all manual storage contracts. Cancel pending removal when saving/restoring/importing or changing relevant context; retain failure feedback beside the controls. Update factual storage instructions.
- Complexity / dependencies: Low–Medium; planner local state/refs, existing styles and browser/artifact tooling. No dependency, storage schema, automatic save/backup, processor or new health advice.
- Acceptance / status: Opening/cancelling performs no planner-key read/removal and preserves the exact stored four-habit/notes/week payload. Explicit confirmation makes one scoped removal attempt; cancellation/success restore focus, blocked removal preserves the copy and explicit save cancels the pending choice. Current edits/unrelated storage remain; 44px controls fit compact/desktop. Inspect confirmation/error screenshots, all five jobs and eight profiles. **Implemented on the saved-plan-removal branch; exact-head verification required.** Device/AT and broader recovery/operator evidence remain pending.

## Sources read for this audit

Read 29 October 2026; these do not certify Healthcrest:
- https://vercel.com/docs/plans/hobby and https://vercel.com/docs/limits/fair-use-guidelines — personal/non-commercial restriction and financial-gain examples; hobby-first intention does not itself establish eligibility.
- https://www.gov.uk/running-a-limited-company/signs-stationery-and-promotional-material and https://www.gov.uk/limited-company-formation/company-address — company website disclosures and suitable registered-office alternatives. No private address was retrieved or published.
- https://developers.google.com/search/docs/essentials — people-first content, crawlable links and technical eligibility; no ranking guarantee.
- https://web.dev/articles/vitals — LCP/INP/CLS field targets and p75 segmentation.
- https://eslint.org/version-support/ and https://eslint.org/docs/latest/use/migrate-to-10.0.0 — development-tool support and migration requirements.
- https://developer.chrome.com/docs/lighthouse/performance/performance-scoring — lab scores/variability, distinct from field evidence.

The official-source review does not independently verify professional registration, company identity, medical claims or legal compliance. No public legal/clinical statements, provider configuration or production resources were changed by the audit.
