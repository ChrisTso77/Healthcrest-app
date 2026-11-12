# Healthcrest baseline engineering audit

Date: 12 November 2026 (Europe/London). Read-only baseline; only this report added.

## 1. Executive summary

Healthcrest is an educational Four Pillars website with learning guides, an illustrative 2D/3D Explorer and a manually saved browser habit planner. The inspected source is a mature pre-launch implementation with substantial automated safeguards and explicitly incomplete launch gates. No Critical or High exploitable defect was established in this bounded review. That is not a security clearance or a production-readiness conclusion.

The highest priorities are overdue editorial reviews, recovery evidence, and completion of the existing security/accessibility/provider gates. A concrete handoff defect is that current progress describes #136 as unmerged even though its squash commit is this checkout's HEAD. Reconcile existing records before introducing another operating framework. Preserve historical approvals and failed checks.

## 2. Confirmed baseline

- Root: `/workspace/Healthcrest-app`; origin: `https://github.com/ChrisTso77/Healthcrest-app.git`.
- Branch: `work`; HEAD: `6dd8d57e83d39225ef57f4f26be5a253e88fa890` (`Prepare private Windows Sanity backups and verification (#136)`). Initial `git status --short` was empty. Remote/live state was not queried.
- 241 tracked files. No tracked AGENTS.md or SECURITY.md found; no AGENTS.md found in this repository during discovery. The uploaded engineering directive governs this audit. Existing launch decisions and approval boundaries remain applicable.
- Manifest: Next.js ^16.4.3, React ^19.3.1, TypeScript ~6.0.3, Tailwind ^4.3.3, Three ^0.187.0, React Three Fiber ^9.8.2 and Sanity client ~8.14.1; npm lockfile present. These are declared ranges, not a claim that every installed package matches the lockfile. Local Vitest reported 5.0.5.
- App Router public pages and one tracked API route, `app/api/presets/route.ts`. Sanity is the CMS; no application SQL database, authentication service, tenant model or payment flow was identified in the inspected source. Do not import financial/clinical invariants from other TSOTSOFT projects.
- Architecture: repository-reviewed educational copy plus normalized CMS scenarios; local preset fallback; reducer-driven Explorer; browser-local manual plan storage and JSON backup import/export. Vercel hosting is documented, not independently verified in this audit.
- Sensitive boundaries: visitor-authored notes in localStorage/downloaded files; untrusted imported JSON; CMS input; browser measurement consent; public API errors; operator backup filesystem and CLI; CI and provider access. Planner files can contain sensitive personal information even though this is an educational product.
- UK GDPR/data-protection and PECR obligations require assessment against actual processing; company disclosures, hosting eligibility and health-claim/credential review remain recorded owner tasks. Educational positioning and test results do not prove legal or clinical compliance. No prescribing workflow was found.
- Existing commands inspected: package scripts, Vitest configuration, Playwright configuration, CI workflow and synthetic tests. CMS seed-import scripts write remote data and were not executed.

### Executed verification

| Command | Outcome |
| --- | --- |
| `npm run test:unit` | PASS: 31 files, 305 tests |
| `npm run lint` | PASS: exit 0 |
| `./node_modules/.bin/tsc --noEmit --incremental false` | PASS: exit 0, no diagnostics; incremental output disabled |
| `node --test scripts/sanity-backup.test.mjs scripts/release-identity.test.mjs scripts/structured-data-contract.test.mjs scripts/performance-budget.test.mjs` | PASS: 109 tests, zero failures/skips |

Environment Node is v24.19.0; CI specifies Node 22. Results establish local behavior on Node 24, not reproduction of Node 22 CI. No dependency installation or update occurred.

## 3. Evidence-backed findings

### HC-01 — Editorial review dates have passed

- Severity: Medium. Kind: missing current review evidence. Confidence: verified for recorded dates; later review outside the repository NOT VERIFIED. Effort: S for records, M for substantive review.
- Evidence: `docs/launch/CONTENT-APPROVAL-PACKET.md`, Actual decision record (G1–G4 and S1–S3); `docs/launch/PROGRESS.md:43` explicitly records 9 November 2026 next-review dates. Audit date is 12 November. Later S4–S8/C1 dates are 13 November and are not yet overdue.
- Consequence: historical approval can be mistaken for completion of the agreed current editorial cadence. No incorrect health statement is established by the missed date alone.
- Minimal fix: ask the designated reviewer to perform or supply the due review for those seven items, bind outcomes to content revisions, and record actual dates/corrections. Do not advance dates automatically or infer approval from silence.

### HC-02 — Successful export does not establish recoverability

- Severity: Medium. Kind: missing operational evidence; existing launch blocker, not a newly proven backup defect. Confidence: verified documentation gap; provider capability NOT VERIFIED. Effort: M; external dependency.
- Evidence: `docs/launch/OPERATIONS-RUNBOOK.md:60–69` records archive/freshness success but `restoreTested:false`, no private test dataset, no demonstrated off-device recovery or successful Vercel rollback. `docs/launch/PROGRESS.md:39` retains D07/L09 as partial.
- Consequence: accepted four-hour website/one-working-day CMS recovery and maximum 24-hour CMS loss remain unproven; device loss can affect local backup availability.
- Minimal fix: prepare a specific private recovery target and operator evidence checklist using the existing runbook. Resolve permitted rehearsal capability with the owner; obtain explicit approval for any restore, provider change or production rollback. Record actual source/data/settings recovery separately. Do not use production as an unapproved test target.

### HC-03 — Supported security assessment and deployment-boundary evidence remain incomplete

- Severity: Medium. Kind: missing evidence, not a validated vulnerability. Confidence: verified workflow/tooling limitation; security posture NOT VERIFIED. Effort: M, dependent on tooling and operator access.
- Evidence: `docs/launch/LAUNCH-CHECKLIST.md:14–18` leaves the supported Standard assessment, current dependency audit, observed headers/CSP review and provider boundaries open. `next.config.ts:8–13` defines no-referrer and nosniff but does not itself establish hosting CSP/frame/HTTPS controls. Current attempt to load the Security Scan required `references/scan-prologue.md` failed; discovery returned no preflight/Standard-start tool.
- Consequence: local tests cannot close application-security or deployed identity/IAM/configuration gates. Existing historical zero-vulnerability dependency results are not current evidence.
- Minimal fix: restore the supported scan resources/capabilities and run the existing required assessment; separately verify current dependency metadata and actual provider/header settings within approved scope. Keep L01 open. No generic CSP should be installed without resource compatibility review.

### HC-04 — Progress records contradict the checkout and their own later updates

- Severity: Low. Kind: existing documentation defect. Confidence: verified. Effort: S.
- Evidence: HEAD `6dd8d57` is #136 while `docs/launch/PROGRESS.md:39` says #136 remains unmerged. Lines 21–22 call content decisions and backup implementation/schedule unresolved, while lines 35–43 record implemented backup tooling, an automatic run and all 13 editorial decisions. Line 9's “Current main” refers to #135; no remote query was performed to establish present remote main or production.
- Consequence: repeated investigations, incorrect approval requests and accidental attribution of historical checks to the current source.
- Minimal fix: after approval, reconcile a compact current summary against the checkout, preserve historical records with dates, and distinguish checkout, remote main and deployed revision. Do not infer deployment from commit presence.

### HC-05 — Manual accessibility and native-device coverage remains partial

- Severity: Medium. Kind: missing verification evidence; not a newly demonstrated WCAG failure. Confidence: verified recorded gap. Effort: M.
- Evidence: `docs/launch/LAUNCH-CHECKLIST.md:25–37` retains pending forced-colour, actual-touch/orientation, native file/download/printing and remaining route/AT checks. Lines 65–102 preserve narrower owner Chrome/zoom/NVDA outcomes and limitations.
- Consequence: broad automated browser success cannot establish supported-device usability or WCAG 2.2 AA conformance for core planner journeys.
- Minimal fix: complete only the pending rows using synthetic notes on available devices, with exact commit/device/browser/task/result; retain existing scoped passes. Fix reproduced defects before repeating unrelated suites.

### HC-06 — Dormant analytics adapter can bypass the current consent boundary if reused

- Severity: Low. Kind: latent maintenance risk/dead code; no active transmission established. Confidence: verified implementation and absence of current source call sites. Effort: S.
- Evidence: `lib/health-engine-analytics.ts:33–52` dispatches arbitrary event properties directly to gtag/Plausible/PostHog without `canMeasure`. Repository search for its module/helpers found no application imports/calls; `docs/homepage-feedback.md:20` already identifies unused adapters. Active consent filters are in `lib/privacy/measurement.ts`.
- Consequence: future reuse could send scenario/parameter events outside the approved pageview/performance contract. This is not a claim that the current app leaks those events.
- Minimal fix: after approval, remove the unused adapter if no supported consumer exists, or clearly constrain any retained interface through the approved measurement boundary and negative tests. Do not enable or add providers.

## 4. Ranked minimal follow-up

1. HC-01: obtain overdue editorial review evidence; independent of code changes.
2. HC-02: resolve private recovery rehearsal capability and prepare a concrete approved exercise.
3. HC-03: restore the supported security assessment; retain launch hold meanwhile.
4. HC-05: close pending actual-device/AT evidence using the existing matrix.
5. HC-04: reconcile the current handoff once; this makes later work faster and safer.
6. HC-06: remove or constrain the dormant adapter in a small approved change.

Ranking reflects educational trust and launch dependencies, not a claim of imminent exploitation. Existing provider eligibility, professional address/disclosure and credential decisions remain owner blockers in OWNER-LAUNCH-ACTIONS.md; they are not independently verified findings here. Dependency upgrades beyond demonstrated need remain deliberately deferred.

## 5. Recurring failure patterns

- Append-only progress has accumulated contradictory current statements (HC-04). Use one dated current summary and retain evidence in its existing register.
- Historical “all five jobs” wording no longer describes the six job definitions now in `.github/workflows/ci.yml` after adding Windows backup verification. Historical counts may remain valid for their original commits; current acceptance must use current workflow jobs.
- `PROGRESS.md:9` preserves a mobile TBT failure at 202 ms against a 200 ms gate followed by a 190 ms rerun. This demonstrates sensitivity near the threshold, not proof of a systemic flake. Preserve initial failures and avoid claiming a rerun explains the cause.
- The runbook records a corrected Windows path-splitting failure. Synthetic Windows CI now addresses that platform boundary; local Linux success must not replace it.
- Evidence does not establish who authored each defect or that all historical commits were agent-generated. No recurring agent attribution is made.

## 6. Controls worth preserving

- Manual plan save/restore/removal/import boundaries; bounded JSON schema parsing in `lib/education/habitDraft.ts`; size checks, stale-read cancellation and review-before-apply in `components/HabitPlanBackup.tsx:26–77`.
- Explicit unencrypted-backup disclosure (`components/HabitPlanBackup.tsx:83–88`), browser-only import and scoped storage keys. Encryption is not silently promised.
- Measurement default-off outside production; separate positive choices; DNT/GPC handling; expiry and URL/referrer filtering; fail-closed storage-write behavior in `lib/privacy/measurement*.ts`.
- Parameter-free static GROQ queries, repository-reviewed normalization and safe generic API responses. API raw exception logging warrants assessment but no credential/PII exposure was established.
- Real SDK middleware with only the HTTP boundary stubbed in `lib/presets/sanityTransport.test.ts`; cancellation and failure tests preserve useful integration contracts.
- Escaped JSON-LD in layout/guide rendering; nosniff/referrer headers; commit-bound release identity and mismatch tests.
- Synthetic backup corruption, warning, freshness and concurrency checks; private backup paths and no automatic destructive pruning.
- Existing negative tests, preview measurement-off gate, Firefox/WebKit checks and performance/SEO failure boundaries. Preserve gate thresholds and historical failure evidence.

## 7. Known blockers and verification limitations

This is a bounded baseline assessment, not the supported Codex Security Standard report. The security-scan skill was consulted for the requested security component, but its required reference could not load and no preflight tool was exposed. Source observations above do not substitute for L01.

No build, browser suite, live smoke, network dependency audit, remote Git fetch or production/provider access was performed. A build can fetch externally configured CMS data and changes generated output; this audit used existing offline checks instead. Actual rendering, installed dependency integrity/current advisories, deployed headers, provider IAM, backup ACL/encryption, restoration and regulatory compliance are NOT VERIFIED. Secret review was limited to tracked filename/configuration and inspected source; no comprehensive history/content secret scan was completed and no “secret-free” claim is made.

Authentication, tenant isolation, financial calculations and prescribing lifecycle were not assessed as implemented features because this source did not establish those workflows. No production patient/financial data was accessed. The broad initial instruction-file discovery encountered a permission denial outside this repository; no unrelated data was investigated.

## 8. Reduce development time and token consumption

Use the existing launch audit, decisions, checklist and runbook as authoritative evidence sources rather than duplicating their contents in a new framework. If approved, keep AGENTS.md compact and reference these files; reconcile the current handoff before writing PROJECT_STATE. Group one owner request around exact unresolved evidence, preserving prior answers. Reuse current passing test evidence until code/environment changes justify reruns. Keep node-based synthetic checks separate from expensive browser profiles; use current workflow job names rather than hard-coded historical totals. Do not disable test isolation solely on a runner speed suggestion without evaluating shared-global tests.

## Approval gate

Baseline assessment complete within the limits above. Only `docs/agent/AUDIT.md` was added. No application, dependencies, lockfile, workflow, production service or operating framework was changed. The uploaded directive section 3 explicitly requires approval after the initial audit before establishing operating files or changing code. Requested decision: accept this baseline and authorise a minimal operating-framework merge that references existing records and reconciles HC-04; implementation of other findings and all production operations remain separately scoped.
