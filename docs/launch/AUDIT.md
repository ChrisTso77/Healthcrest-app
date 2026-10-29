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
- Acceptance / status: Production-build release report includes the new checks; query-specific states remain covered separately. **Checks implemented; hosted verification pending.**

### L08 — Design system only partially shared
- Category / severity / kind: Design/UX; **Medium**; opportunity.
- Evidence: app/landing.css has scoped ink/muted/paper tokens and shared buttons; app/next-step/next-step.css, guide.css and HealthEngineHUD contain repeated literal colours, spacing and control styles.
- Impact: Incremental upgrades risk inconsistent states, contrast or spacing across calm/light and dark interactive routes.
- Remediation: Inventory approved tokens and components, compare current screenshots, then migrate one representative control/page at a time. Preserve hummingbird assets and existing layout behavior.
- Complexity / dependencies: Medium; baseline visual matrix, contrast verification and D05 for material brand changes.
- Acceptance / status: Documented semantic tokens and before/after review at mobile/tablet/desktop with no lost focus/reflow. **Queued; no wholesale rewrite.**

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

## Sources read for this audit

Read 29 October 2026; these do not certify Healthcrest:
- https://vercel.com/docs/plans/hobby and https://vercel.com/docs/limits/fair-use-guidelines — personal/non-commercial restriction and financial-gain examples; hobby-first intention does not itself establish eligibility.
- https://www.gov.uk/running-a-limited-company/signs-stationery-and-promotional-material and https://www.gov.uk/limited-company-formation/company-address — company website disclosures and suitable registered-office alternatives. No private address was retrieved or published.
- https://developers.google.com/search/docs/essentials — people-first content, crawlable links and technical eligibility; no ranking guarantee.
- https://web.dev/articles/vitals — LCP/INP/CLS field targets and p75 segmentation.
- https://eslint.org/version-support/ and https://eslint.org/docs/latest/use/migrate-to-10.0.0 — development-tool support and migration requirements.
- https://developer.chrome.com/docs/lighthouse/performance/performance-scoring — lab scores/variability, distinct from field evidence.

The official-source review does not independently verify professional registration, company identity, medical claims or legal compliance. No public legal/clinical statements, provider configuration or production resources were changed by the audit.
