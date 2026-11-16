# Explorer V2 integration and release preparation

## Baseline and scope

Approved source: `codex/healthcrest-explorer-v2-prototype` at `59a8d4f584f6356ff9df23447b0b6bb2240edc0d`, including original Body Scanner restoration. Target main fetched at `db93754a333ceb6255ef632e9218180ad1a7f89e`. Dedicated integration branch: `codex/healthcrest-explorer-v2-integration`, created from the exact approved source. Four prototype commits and all changed paths are preserved in Git; no alternative prototype selected.

Authorised: integrate the approved UI, preserve scanner/assets, verify application regression, prepare PR/release evidence. No production merge or deployment. Existing independent security, clinical, privacy, accessibility and recovery gates remain open where previously open; this work cannot waive them.

Planned integration: `/engine` renders the shared approved V2 by default; preserve pillar/idea entry context and guide/Planner links. Explicit original/scan/connected-habits links retain the old component for compatibility and recovery. No duplicate scanner, dependencies, CMS writes, authentication or storage/measurement changes. Prototype review routes remain gated and noindex.

## Progress

- Source, target, clean branch and Body Scanner identity confirmed before editing.
- Public route integration complete, with no further redesign; core model/data boundaries and scanner unchanged.
- Local verification complete; final candidate CI and immutable preview identity are recorded in PR #145 after push.
- Production remains BLOCKED by carried-forward launch restrictions and the explicit production approval gate.

## Integration contract

The public route reuses the approved component without a layout redesign. Integration-only changes seed an allowlisted pillar on entry, retain the existing `idea` context in guide/Planner links, label the public experience rather than a prototype, and update the original-view link. `/engine?view=original` keeps the original high-3D view; `/engine?experience=original&view=2d` keeps its labelled 2D view. Existing `/engine?view=scan` and connected-habits (`pillar=systems`) entries remain unchanged. Unknown/repeated values fall back safely and are not rendered as copy.

All existing public Home/Learn/Start/Planner links keep their URL contracts. The main entry and `view=2d` use V2; explicit compatibility tests continue asserting the old renderer's full behavior rather than deleting old assertions. A dedicated production-profile suite verifies the new default and replaces the two prototype-only gate assertions with public-route contracts. The prototype route and unreviewed clinical library remain gated. No saved-data migration exists or is required.

Runtime changes beyond the approved prototype are limited to `app/engine/page.tsx`, shared component integration props/links in `components/explorer-v2/ExplorerPrototype.tsx`, and a small SSR-preserving lazy boundary in `components/explorer-v2/OriginalExplorer.tsx` to prevent the original renderer from loading with the default V2. Approved CSS, SVG illustration, optional Three renderer, original Body Scanner, Planner, clinical copy and storage/measurement helpers remain unchanged. New config/tests exercise public V2 and legacy compatibility; CI runs both. [Full baseline/path inventory](baseline.json) and [unchanged-source hashes](source-integrity.json).

## Before / after

| View | Previous production layout | Integrated approved layout |
|---|---|---|
| Desktop | [Original](../before-desktop.png) | [V2 at /engine](after-desktop.png) |
| Mobile | [Original](../before-mobile.png) | [V2 at /engine](after-mobile.png) |

[Integrated scanner desktop](scanner-desktop.png) · [Mobile](scanner-mobile.png). Scanner-content visual parity is verified separately by actual paired screenshots in the public-route test, with the original native-control antialiasing tolerance documented in the restoration record. These images are not a user-study result.

## Focused impact/security review

New inputs are existing allowlisted scene/constraint values. Repeated/unknown query values do not select privileged paths or render raw copy. `experience=original` only selects the existing public renderer; it grants no authority. Canonical metadata and response headers stay unchanged. The shared UI still uses React text escaping and reviewed, fixed reference links. No secrets, HTML injection, new external resources/services, dependencies or lockfile changes are introduced. The lazy scanner and optional 3D unmount when closed. Default 2D starts without a canvas; paused/reduced-motion 3D uses the existing demand loop. A fresh navigation records no page exception. This is a focused implementation review, not the outstanding independent supported security assessment or a React profiler study.

Production `npm audit --omit=dev --audit-level=high`: zero vulnerabilities. Full tree: eight existing moderate development findings, zero high/critical; dependencies are unchanged. Planner, source/assets, legacy scene/engine, measurement and clinical gate hashes match both main and the approved source. Original scanner speech/animation/camera behavior is not rewritten (the scanner uses the original illustrated images/ring; the independent Three camera remains available in the original experience and optional 3D).

## Release restrictions and recommendation

Integration correctness and overall Healthcrest launch acceptance are separate decisions. Do not merge or deploy based on the approved prototype alone. The controlled-launch checklist still has open Gate A actual-device/final acceptance, Gate B supported security audit/threat-model and provider/privacy/credential/manual accessibility evidence, Gate C remaining marketing/editorial/external validation, and Gate D launch/access/recovery approval. D02–D04/D07/D09 remain unresolved or partial as recorded in the owner decision register. Source-check dates and automated scores do not accept clinical, security or WCAG compliance. Earlier manual results do not certify the new V2 on all devices.

No changes to the authoritative launch registers are made. References: [controlled-launch checklist](../../launch/LAUNCH-CHECKLIST.md), [owner decisions](../../launch/DECISION-REGISTER.md), [editorial approvals](../../launch/CONTENT-APPROVAL-PACKET.md), [operations/recovery](../../launch/OPERATIONS-RUNBOOK.md). Independent/manual evidence or a specific recorded risk decision is still required where those gates require it.

## Rollback strategy (prepared, not executed)

1. Before any approved production action, record the actual integration merge SHA/tree, successful candidate CI, immutable deployment ID, previous production deployment and saved-data regression evidence. Current known production source is db93754; a provider success alone is not live identity verification.
2. If acceptance fails before merge, leave production untouched. The explicit original experience is available in the candidate for diagnosis/temporary navigation, not an operational rollback by itself.
3. After a separately approved merge, prepare a reviewed revert PR of that integration merge: normal revert for a squash commit, or `git revert -m 1 <actual-merge-sha>` for a merge commit. The preserved old engine remains in source. No database/CMS migration or saved-plan format changed, so source rollback requires no data rewrite. Preserve user storage.
4. Run the same build, source identity, release, Planner, route and security checks on the revert; obtain explicit approval before merging/deploying it. Provider promotion of the previously recorded immutable deployment is an alternative only if the owner has verified access/configuration and authorised that exact action.
5. Verify canonical served SHA, Explorer/Planner/guide journeys, privacy headers/measurement and new errors after the authorised rollback. No rollback, restore or provider promotion has been exercised here; D07 recovery limitations remain open.

## Performance verification

The existing eight-profile Lighthouse 13.6.0 navigation policy and raw budgets are unchanged (score >=90, LCP <=2500ms, CLS <=0.1, TBT <=200ms; no console errors, required contrast/heading audits and no unconsented measurement). No initial introduction was skipped to obtain the score.

The first run passed seven profiles but failed Explorer mobile at 2736ms LCP. Inspection found the retained legacy client renderer in the default route's loading graph. An SSR-preserving client lazy boundary separates it without changing its implementation or the approved UI. Next's installed lazy-loading guide specifically notes that server-to-client dynamic imports do not provide automatic splitting, hence the small client wrapper.

After that correction, all eight profiles passed in an isolated run with no competing local build/tests. Explorer mobile: performance 97, LCP 2408ms, TBT 70ms, CLS 0. Desktop: performance 100, LCP 548ms, TBT 0ms, CLS .0071. Both report accessibility/best-practices/SEO 100. Fresh navigation transfer: 216749 bytes, including 185821 bytes of script. Before the split the integrated route transferred 249585 bytes. Historical original-Explorer 2D evidence (same Lighthouse/system Chromium, earlier run) was 261903 total / 209485 script bytes; it did not have V2 onboarding, so its lower LCP is not a controlled comparison of identical content. The new first-visit intro remains slower than the old static 2D entry but meets the current budget with a modest margin. No field/INP, repeatability, 3D GPU/battery or physical-device claim is made.

[Machine performance results](performance.json). Full original reports are retained in work artifacts/CI artifacts; the initial failure is retained rather than averaged away. Do not alter thresholds, exclude the introduction or relabel these lab results as field measurements.

## Verification matrix and release decision

| Check | Result / scope |
|---|---|
| Build, TypeScript, lint | PASS; production operator flag enabled in synthetic build; fresh visitor consent still absent |
| Unit tests | 330 PASS / 34 files; source model unchanged |
| Safeguards | 109 PASS: backup/release identity/structured data/performance failure boundaries |
| Application regression | 329 cases exercised: initial run 326 PASS, three old-overlay reflow tests still pointed at the new default; corrected only their compatibility URL, then all three passed. No application assertion removed. Final-head CI performs the whole suite afresh. |
| Public V2 contracts | 24 PASS in final production-profile run; two prototype-only gate tests skipped by design and replaced with public production/indexing/isolation contracts |
| After renderer split | 10 targeted legacy/scanner/graphics/scenario cases PASS, plus all 24 public V2 cases above |
| Release smoke | 24 PASS, build/served/expected source `010c3bd712694a66ed2ca0e299e4748960568249`; deliberately changed runtime marker did not relabel the build. Canonical/SEO/links, assets, failure recovery and unconsented measurement checked locally. [Result](release-checks.json) |
| Performance | All eight profiles PASS after documented split; exact unchanged budgets and limitations above |
| Scanner | UNCHANGED; source/assets hash-identical to approved source and main; four actual content comparisons PASS at two widths/both illustrations [observations](scanner-visual-comparison.json) |
| Accessibility | Keyboard/modal focus and return, labelled controls, reduced motion, four-width axe, short-height/reflow and automated contrast/headings PASS. Native 400% browser UI zoom, new manual screen-reader/real-device matrix NOT VERIFIED. No conformance claim. |
| Browser engines | System Chromium 154.0.8037.57 locally. First candidate Firefox/Linux WebKit CI passed, including public V2/scanner cases; final exact-head pinned-engine results and counts are linked from PR #145 after completion. Not physical Safari/iPhone evidence. |
| Security/dependencies | No new finding in focused review; production audit 0, full audit 8 existing moderate development findings / 0 high or critical. Supported independent assessment remains open. |
| Production/data | No production merge/deploy, CMS/database write, dependency, authentication, storage or telemetry change |

Code verification SHA `010c3bd...` is followed only by evidence/state documentation in the release packet. [PR #145](https://github.com/ChrisTso77/Healthcrest-app/pull/145) records the exact final candidate SHA, final-head CI run/check results and immutable provider Preview URL after push, avoiding an endless extra deployment just to write a commit's own SHA into its source.

**Local integration status: PASS. Production deployment readiness: BLOCKED** until applicable existing launch restrictions/independent evidence or permitted explicit risk decisions are resolved and the owner approves the exact production target. Recommend reviewing this focused integration candidate and retaining all existing launch restrictions. Do not treat preview success, source preservation or UI approval as production authorisation.

## Reproduction

- `npm run test:unit`; `npm run lint`; `npx tsc --noEmit --incremental false`.
- `node --test scripts/sanity-backup.test.mjs scripts/release-identity.test.mjs scripts/structured-data-contract.test.mjs scripts/performance-budget.test.mjs`.
- Build from the intended clean candidate with `HEALTHCREST_TELEMETRY_ENABLED=true VERCEL_ENV=production HEALTHCREST_BUILD_COMMIT="$(git rev-parse HEAD)" npm run build` (synthetic/local profile only, no provider settings changed).
- `npx playwright test` exercises application/explicit legacy compatibility. `npx playwright test --config=playwright.explorer-integration.config.ts` exercises public V2 in its own production-profile server. `npm run test:compatibility` uses installed pinned Firefox/WebKit. Existing education and preview-measurement isolation jobs stay intact.
- `HEALTHCREST_EXPECTED_COMMIT="$(git rev-parse HEAD)" npm run test:release`; `node scripts/mobile-performance.mjs` run existing identity/performance assertions. The release command must match the compiled build, not a later docs-only commit. CI builds/verifies its own checkout SHA.
- Local execution substituted `/usr/bin/chromium` through a work-only launch override (no application assertions or shared CI browser versions changed); browser video was disabled only in that local override because the pinned video tool was unavailable. Raw local test/Lighthouse reports stay in work artifacts; CI uploads its canonical artifacts. CI release identity refers to its PR merge checkout, not silently to the branch head.

Live preview verification from this workspace remains proxy-blocked; the provider's Preview success/commit is recorded separately. No deployment identity is inferred from a localhost test. React profiler, field INP, low-end GPU/battery and actual speech/device quality remain NOT VERIFIED. Existing CMS read requests used reviewed fallbacks when DNS was unavailable; no writes were attempted.
