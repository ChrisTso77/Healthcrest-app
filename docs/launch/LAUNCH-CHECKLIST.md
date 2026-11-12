# Controlled-launch checklist

**Recovered historical copy:** this checkout predates local checkpoints469cd1a/dbecd67.
Reported current totals are17PASS/1FAIL/2BLOCKED/14NOT VERIFIED=34; recover the
current documentation checkpoint before reconciling rows. No status changed here.
See [Gemini source validation](GEMINI-ASSESSMENT-VALIDATION.md): the HIGH telemetry
claim is false; provider/professional review remains open.


Unchecked means pending, including checks unavailable in the current environment. This register is not a statement of legal, clinical, security or WCAG compliance. Record evidence/approver/date, not just a tick. Baseline evidence is in AUDIT.md and [RELEASE-EVIDENCE.md](RELEASE-EVIDENCE.md); implementation results go in PROGRESS.md. The owner has approved parallel launch-readiness work and combined release review. Optional visual refinements do not take priority over these gates.

## Canonical launch-readiness matrix — 12 November 2026

This is the single current status matrix. Gate sections below retain acceptance
criteria and historical evidence; owner decisions stay in DECISION-REGISTER.md,
and actual executions stay in RELEASE-EVIDENCE.md. Scope: local candidate from
43365db; production remains076a853. PASS applies only to the stated scope, not full
launch acceptance. Severity expresses release impact/priority, not a discovered
vulnerability rating. FAIL means a known unmet requirement; BLOCKED identifies an
absent capability; NOT VERIFIED means required evidence is incomplete. Unknown
security coverage must not be interpreted as absence of vulnerabilities.
Execution classes: AUTO (local action/evidence), HOSTED (authorised preview/CI),
OWNER (operator facts/decisions), EXTERNAL (assessment/capability), BLOCKED (no safe
current path). Completed rows retain the class used. Phase6 corrected35 physical
rows to34 by combining duplicate production identity/deployment evidence; no
independent requirement was removed or waived.

| Requirement | Severity | Current status | Execution class | Evidence reference | Responsible |
| --- | --- | --- | --- | --- | --- |
| Build/lint/types and unit/boundary foundation (A) | High | PASS | AUTO | [Release evidence](RELEASE-EVIDENCE.md), local0cd449e: new final build/lint/types,314 unit,109 sequential boundary PASS; initial boundary subprocess failure retained | Engineering |
| Automated Explorer/learning/planner positive, error and persistence journeys (A) | High | PASS | AUTO | Programme14 distinct cases:12 initial successes +2 targeted passes after stale helper fix; prior23 cases/navigation reused; see release evidence for failures/limits | QA lead |
| Actual-device Safari/iOS/Android touch/native files/print (A) | High | NOT VERIFIED | OWNER | Scoped owner reports and manual matrix below; remaining exact device/OS/browser evidence absent | Device QA / owner |
| Explorer visible-label/name regression (B) | High | PASS | AUTO | Local0cd449e final navigation and affected axe scans; correction is local, not deployed | Accessibility lead |
| Automated WCAG tags/reflow baseline (B) | High | PASS | AUTO | 16 scoped axe runs at320/1280 with affected Explorer retests; no remaining reported violations, no overflow; incomplete checks excluded | Accessibility lead |
| Home caption normal-text contrast (B) | Medium | PASS | AUTO | Actual background under caption glyphs:4.424 before /5.580:1 after at320/1280, zero final samples below4.5; existing palette token only | Accessibility lead |
| Manual contrast and forced-colour verification (B) | High | NOT VERIFIED | OWNER | Computed/raster checks narrowed incompletes;49 Explorer composites >=6.895:1 do not prove forced-colour/scroll/paint/AT acceptance; manual matrix below remains open | Accessibility lead / manual reviewer |
| Bounded keyboard/focus short-viewport coverage (B) | High | PASS | AUTO | First35 Tab actions on Home/Learn/Planner/Explorer at320x200:140 visible unobscured client-rect centres; not full route/dialog/paint/AT coverage | Accessibility lead |
| Real screen-reader/status/error and verified400% zoom (B) | High | NOT VERIFIED | OWNER | Partial owner NVDA/Explorer zoom results below, not full route/state/support coverage | Manual AT reviewer / owner |
| Supported Standard application security assessment (L01/B) | High | BLOCKED | EXTERNAL | Required scan reference/preflight tools unavailable; bounded review is not substitute | Platform operator / security lead |
| Public API/input/failure controls (B) | High | PASS | AUTO | Programme bounded static review: fixed query, strict scene parser, normalized fallback, generic logs; not full SAST/dynamic assessment | Security lead |
| Planner import/storage isolation controls (B) | High | PASS | AUTO | Programme static review plus baseline boundary/browser tests: bounded versioned parsing, explicit saves, guards and stale-read cancellation | Security lead / QA |
| Comprehensive secrets/history and provider IAM review (B/D) | High | NOT VERIFIED | EXTERNAL | Limited tracked-file screen only; no complete history/entropy/binary scan or provider-access attestation | Security lead / operator |
| Production dependencies, advisory-database result (B) | High | PASS | AUTO | Reused current production-only audit at0cd449e: zero reported vulnerabilities, not absence-of-vulnerability claim | Security lead |
| Development dependency advisory remediation (B) | Moderate | FAIL | BLOCKED | [Dependency investigation](../dependency-upgrades.md): GHSA-g3hv-75wg-m249, seven affected entries; no compatible supported fix, current caller constraints verified; no acceptance/waiver | Engineering / upstream maintainer |
| Production containment headers and release identity (B/D) | High | PASS | AUTO | Production076a853/CSP/SAMEORIGIN; #138 deployment7742651420, canonical43255707119, six-job main43255604123; combined duplicate identity/deployment evidence | Release engineer |
| CI explicit least privilege configuration (B/D) | Medium | PASS | AUTO | Candidate workflow contents:read; parsed YAML equals baseline after removing only permissions; six jobs/triggers/steps/overrides unchanged; hosted execution remains separately NOT VERIFIED | Release engineer |
| App measurement stays inactive; separate consent boundary (B) | High | PASS | AUTO | 076a853 inactive served markup and source review; production flag/provider switches unchanged | Engineering / operator |
| Concrete privacy, retention, deletion, rights and processor facts (D03/B) | High | NOT VERIFIED | OWNER | Business Basics and dashboardON owner-reported; “industry standard” is not retention criteria; [decision register](DECISION-REGISTER.md) | Owner / privacy reviewer |
| Hosting eligibility/public company disclosure/credential evidence (D01/D02/D04) | High | NOT VERIFIED | OWNER | Owner confirms eligibility/credential checks; supporting facts and approved disclosure wording incomplete; no private address collected | Owner |
| Editorial cadence at reviewed source (B/C) | High | PASS | AUTO | [Content packet](CONTENT-APPROVAL-PACKET.md): G1–G4/S1–S3 next19Nov; S4–S8/C1 next13Nov; no automatic renewal or new wording approval | Editorial owner |
| Metadata/canonicals/robots/sitemap/internal links/schema consistency (C) | Medium | PASS | AUTO | Reused23 local smoke/35 structured-data boundary tests; programme source review found no defect | SEO lead |
| Current Google guidance/external rich-result validation (C) | Medium | NOT VERIFIED | EXTERNAL | Official Article/Breadcrumb/CWV guidance now reviewed using available web connector; actual external rich-result test report still absent | Environment operator / SEO owner |
| Search Console ownership/submission/index coverage (D06/C) | Medium | NOT VERIFIED | OWNER | No owner account evidence/submission result; no external discovery action performed | SEO owner |
| Eight navigation lab performance budgets (C) | Medium | PASS | HOSTED | Reused #138 profiles,performance99–100, all other categories100; exact prior-source scope, not candidate run | Performance lead |
| Field CWV/INP,3D/GPU and device performance (C) | Medium | NOT VERIFIED | EXTERNAL | No field percentiles/device evidence;2D navigation TBT is not interaction INP | Performance lead / owner |
| Final candidate exact-head hosted CI/reports/preview identity (D08/D) | High | NOT VERIFIED | HOSTED | New local candidate not hosted; six required jobs/artifact review remain required before release | Release engineer |
| Production environment separation/settings equivalence/access (D03/D08) | High | NOT VERIFIED | OWNER | Earlier owner absent-flag/no-queued-settings statement is scoped to prior release; provider/IAM review incomplete | Production operator |
| Source-reconstruction preview rehearsal only (D07/L09) | Medium | PASS | AUTO | [Runbook](OPERATIONS-RUNBOOK.md): source/tree equality and scoped owner preview journeys; not measured recovery or production promotion | Engineering / owner |
| Current private backup freshness/off-device copy/retention (D07/L09) | High | NOT VERIFIED | OWNER | Earlier2Nov export/task evidence does not establish current freshness/off-device protection | Backup operator |
| Private CMS restore rehearsal (D07/L09) | High | BLOCKED | BLOCKED | No available private test destination; no production overwrite/public dataset/paid workaround authorised | Owner / provider |
| Actual rollback/settings recovery and measured RTO/RPO (D07/L09) | High | NOT VERIFIED | OWNER | 021341d recovery reference/access reported; actual promotion/settings equivalence/objectives not exercised | Production operator |
| Monitoring cadence, named responder and provider-log retention (D03/D07) | High | NOT VERIFIED | OWNER | Runbook preparation only; actual settings/alert delivery/ownership evidence incomplete | Production operator |
| Acceptance of GatesA–C and concrete deployment approval (D08/D) | Critical | NOT VERIFIED | OWNER | Preparation authorised; current candidate has no production deployment approval; no launch acceptance inferred | Owner / release manager |
## Gate A — Functional foundation
- [x] Immutable source inventory and exact-main CI baseline recorded (34ca713b; run 40840624311).
- [x] Existing automation covers homepage/navigation, practical learning journeys, Explorer scenarios/2D fallback/keyboard settings, planner save/restore/backup/calendar/failure and no-JavaScript/404 recovery.
- [x] Legacy draft parsing, explicit save/import boundaries and storage-blocked cases remain covered.
- [x] Historical approved release #134 has five passing PR jobs, matching reviewed/merged trees, successful production deployment and 24 passing commit-bound canonical live checks; see RELEASE-EVIDENCE.md. This is release evidence, not launch acceptance.
- [x] PR #137 head aa7495a passes all six defined CI jobs; provider reports Vercel Preview success and scoped owner journeys pass. Four authenticated reports reviewed (RELEASE-EVIDENCE.md, 12 November). Preview served identity and manual save remain separately unverified; this does not accept Gate A.
- [ ] Representative real-device/touch/back-forward/error journeys recorded; confirm no critical functional defects across the agreed support matrix.
- [ ] Final Gate A reviewer/date/evidence recorded.

## Gate B — Security and trust
- [ ] Supported Standard security audit/threat model completed; application/API/CMS/import/storage/logging/supply-chain/deployment boundaries reviewed.
- [ ] No unresolved Critical/High findings; confirmed fixes retested or explicitly identified as launch blockers.
- [ ] Current dependency audit, observed security headers and resource-based CSP review; no generic unsafe policy installed to obtain a score.
- [ ] Provider dashboards, scope, environment separation and optional measurement payload/withdrawal checks reviewed per ../measurement-rollout.md. Default-off behavior retained; do not enable by assumption.
- [ ] Company disclosures, current credentials and privacy/provider/retention/rights process verified and public changes approved (D02–D04).
- [x] G1–G4, S1–S8 and C1 received explicit owner editorial approval at the revisions/dates in CONTENT-APPROVAL-PACKET.md (2/6 November 2026). Source-check dates are not review dates; credential verification and other gates remain separate.
- [x] All 13 per-content decisions are recorded in [CONTENT-APPROVAL-PACKET.md](CONTENT-APPROVAL-PACKET.md), bound to reviewed source with item-specific next-review dates. This does not grant launch acceptance.
- [ ] Manual accessibility matrix below completed and blocking defects fixed/retested.
- [ ] Final Gate B reviewer/date/evidence recorded.

## Manual accessibility and device matrix

For each row record date, commit, browser/OS/device or AT/version, task, result, issue and retest link. Automated Lighthouse/Playwright support these checks but do not replace them. Agreed target: WCAG 2.2 AA; no conformance claim yet.

| Task | Representative routes | Required evidence | Status |
| --- | --- | --- | --- |
| Keyboard order/skip/focus | Home, Learn, guide, planner, Explorer, privacy | All actions reachable; visible focus; no trap; dialogs close and return focus | Partial owner desktop pass; remaining routes/device matrix pending |
| Screen-reader structure | Same routes | Landmarks/headings/names, check-in/status errors and 2D description understandable; dialog announcements | Partial owner NVDA 2026.3 Windows walkthrough passed for Home, Explorer dialogs/2D explanation and planner labels/unsaved-edit cancellation; see scoped record below. Remaining routes, error/status and device/AT combinations pending. |
| 400% zoom and text resize | Same routes at desktop zoom plus 320 CSS px | Reflow without lost content/actions; usable forms/dock/dialog scrolling | Owner-reported manual Explorer 400% pass; other routes/text resize pending |
| Forced colours/contrast | Light pages, planner selects, dark Explorer | Text/focus/states/chevrons identifiable; colour is not the only explanation | Pending manual; L23 covers public selection; L24/L25 add Explorer selection, manual attribution and modal-close paint checks |
| Touch and orientation | Mobile/tablet learning/planning/Explorer | Target sizes, no hover-only help, usable landscape/portrait | Pending actual devices |
| Reduced motion/static/errors | Home and 2D/3D Explorer | No essential content lost; pause and failed-video/WebGL alternatives usable | Automated cases exist; manual pending |
| Native controls and downloads | Planner import/export/calendar/print | Actual Safari/iOS/Android picker, file and printing behavior; no private text in generic calendar | Pending actual devices; Linux engine tests are partial evidence |

## Gate C — Marketing readiness
- [ ] Owner-reviewed brand/value proposition/CTA and responsive visual baseline, with the existing hummingbird assets preserved.
- [ ] Complete useful Home/Learn/Explorer/About/Contact/privacy journeys; no misleading clinical/service promises.
- [x] Candidate aa7495a / CI checkout 1c4ceb9 passes canonical/sitemap/robots/404/sharing/unique metadata/internal-fragment checks and required heading audit; bound to run 43233728546, not a production-deployment assertion.
- [ ] Structured data checked against visible content/current Google documentation; external validation recorded without inventing eligibility or ranking guarantees.
- [x] Eight candidate mobile/desktop navigation lab profiles reviewed and raw budgets re-evaluated; real-user/INP, real devices and 3D/GPU performance remain explicitly pending. Explorer lab profiles intentionally use 2D per the existing policy; no feature removed to change a score. See RELEASE-EVIDENCE.md.
- [ ] Editorial briefs/content clusters and correction process approved; new advice reviewed before publication.
- [ ] Search Console/domain ownership, sitemap submission, indexing monitoring and social/partnership plan approved before external actions (D06).
- [ ] Final Gate C reviewer/date/evidence recorded.

## Gate D — Production launch
- [ ] Gates A–C accepted with no outstanding launch-blocking findings.
- [ ] Current hosting plan and intended use confirmed eligible (D01); any paid changes separately approved.
- [ ] DNS/HTTPS/canonical domain, production/preview settings and least-privilege access verified by operator without exposing values.
- [ ] Incident owner, privacy-preserving logs/monitoring, CMS recovery, rollback access and recovery exercise recorded (D07).
- [x] Owner explicitly approved #134 merge/resulting deployment; merged SHA be24c69c9ef78d0646dae4133df899d0eded4589. This approval does not apply to future releases or launch acceptance.
- [x] #137 reviewed candidate aa7495a passed all six jobs/preview; merged tree matches reviewed tree. Production 021341d identity observed, canonical run 43244366643 PASS and all six post-merge jobs in 43244145077 PASS. This release evidence does not accept the other launch gates.
- [x] #134 manual canonical production run [41061693500](https://github.com/ChrisTso77/Healthcrest-app/actions/runs/41061693500) on intended main passed all 24 checks. Artifacts expire after 14 days; durable private preservation remains an operator task.
- [x] Canonical live expected/observed marker and workflow source match approved merged SHA be24c69c9ef78d0646dae4133df899d0eded4589 in run 41061693500. Preserve mismatch/failure assertions for future releases.
- [ ] External legal/provider/credential/accessibility/security checks complete or explicit owner risk decision recorded; unresolved required gates are never silently waived.
- [ ] Final launch approver/date/evidence and post-launch observation/rollback trigger recorded.

## Post-launch monitoring plan — preparation only

Confirm ownership and a practical review cadence for uptime/deployment errors, broken routes, CMS fallback rates, Search Console indexing, accessibility/content corrections and existing provider quota alerts. Do not log planner text, query preferences or backups. Do not add a processor, enable optional telemetry, schedule external campaigns or incur costs without approval. Field performance coverage must respect consent/exclusions and be labelled unavailable when insufficient.

## Owner desktop check — 30 October 2026

Owner-reported desktop Chrome results: skip link moved actual focus to MAIN#main-content; Important information opened by keyboard and Escape restored trigger focus; cancelling inline saved-draft restoration preserved the synthetic reflection exactly, then the reflection was cleared. OS/Chrome version were not supplied. No save, overwrite, submission or deployment was performed; existing saved-copy loading was not verified.

The requested 1280×800 viewport produced 320×200 CSS pixels with DPR 4. Explorer Guide and About controls overlapped (Guide y111–147, About y117–161). Browser zoom percentage and return to 100% could not be independently verified, so the 400% zoom matrix row remains pending. Home/planner had no page-level horizontal overflow in that check. The viewport override was reset. The short-viewport fix must be retested on a real browser at verified 400% zoom; automated effective-viewport regression is supporting evidence only.

### Owner retest — 30 October 2026

Reported browser: Chrome 156.0.8078.80 (64-bit); exact Windows version remains unverified. This follow-up records the supplied report, not a new independent inspection of the browser/version or deployed commit.

At 420×236 CSS pixels, the owner reported no overlap and passing skip-link actual focus, Guide close-button focus/Escape return, settings-dock collapse/reopen plus scrolling/keyboard reachability, and both information dialogs' close focus/Escape return. Cancelling planner restoration preserved the exact synthetic edit; original field content was restored afterwards. No saved plan was overwritten and no code was deployed during the check.

Chrome's menu zoom percentage remained inaccessible to the automation used. Verified 400% zoom and restoration to verified 100% therefore remain blocked. The earlier 320×200 case has not been manually revalidated by this report. #130's automated effective-viewport checks at 320/640/1350×200 passed, but do not certify real browser zoom or close this manual matrix item. Retest the exact 320×200 condition and independently confirmed browser zoom separately; retain the 420×236 passes at their actual scope.

### Owner-confirmed manual zoom result — 30 October 2026

The owner subsequently confirmed: “I have checked the zoom manually and everything is working fine.” In the context of the requested 400% Chrome zoom retest, record the manual 400% Explorer zoom check as an owner-reported pass. This supersedes the earlier inability to confirm the zoom setting for that specific check; it is separate from automated CSS viewport evidence. No further overlap or unusable-control issue was reported.

The previously reported browser was Chrome156.0.8078.80 (64-bit). Exact Windows version, the effective CSS viewport during this manual check and restoration to100% were not newly confirmed. Do not infer those details or completion of the entire device/assistive-technology matrix. This confirmation is accessibility test evidence, not merge or launch approval.

## Owner NVDA walkthrough — recorded 2 November 2026

Owner reported NVDA 2026.3 running on their Windows computer during the guided Chrome walkthrough. Current Chrome/Windows versions were not reconfirmed; do not reuse October's browser version as a newly verified fact. These are owner-reported observations, not an independent screen-reader inspection, transcript or WCAG conformance assessment.

| Focused check | Owner-reported result |
| --- | --- |
| Home heading navigation | H recognised page headings. Initial broad reading report alone did not establish skip-link focus. |
| Home skip link | After activating Skip to content and pressing Insert+Tab, owner reported “main land focus”, interpreted as main-landmark focus. No independent DOM-focus inspection was performed in this walkthrough. |
| Explorer Guide | Dialog and close button announced; Escape followed by Insert+Tab announced “Guide button”. |
| Explorer Important information | Dialog/close announced; after Escape, the trigger's name and button function were announced. |
| Explorer About this Explorer | Owner separately confirmed dialog/close announcements and trigger name after Escape. |
| Planner labels | Owner reported field labels and button purposes clearly announced during tab navigation. No claim that every validation/error state was exercised. |
| Planner unsaved-edit cancellation | Using synthetic text only, owner confirmed the warning was announced and Keep my edits preserved the text. No overwrite/restore confirmation was requested. Removal/restoration of the temporary in-memory text was instructed but not separately confirmed; no saved-copy inspection is established. |
| Explorer 2D explanation | At `/engine?view=2d`, owner reported the topic/example/limits and controls were understandable through speech. This is a qualitative focused result, not exhaustive coverage of every scenario/control. |

Production identity inspected while recording these results: canonical Home returned HTTP 200 and marker `14bce2cf31dc45e35ddb9e3ba28e818fb7aa12a4` (#135). That observation binds the currently served release, not a captured build marker from every earlier owner action or an attestation about an already-open tab.

Keep remaining coverage pending: Learn/individual guide/privacy routes; validation/status/error announcements; broader saved-plan/import/removal flows; all scenario/control states; actual mobile/touch, forced colours, reduced-motion/error alternatives and other AT/browser combinations. No accessibility gate, editorial approval, merge or launch acceptance is granted by this record.

## Owner batch follow-up — 12 November 2026

Owner confirms hosting eligibility and reports independent credential checks done;
see DECISION-REGISTER.md for source/verification limits. Analytics/Speed Insights
are reported ON; this does not confirm the Production application switch. Current
backup freshness/off-device/private-restore evidence and iPhone/Safari remain
pending. Owner says remaining device checks are done without browser/OS versions
or individual additional outcomes; retain this broad report without inventing
matrix-row passes. The earlier explicit candidate manual-save UNTESTED result
remains. This follow-up provides no merge/deployment approval or launch acceptance.

## Approved preparation release #137 — 12 November 2026

Owner approved exact head aa7495a merge/resulting deployment/canonical checks after
confirming absent Production app switch, no pending settings changes and rollback
access. Merge/deployed source 021341d matches the reviewed tree. Canonical smoke
and all six post-merge CI jobs PASS; live header rechecked. Measurement remains
inactive in served privacy markup. No CMS writes, actual rollback or launch-gate
waiver. This approval applies only to #137; full Gate D acceptance remains pending.

## Approved containment preparation release #138 — 12 November 2026

Owner approved the combined conditional pipeline for exact c283efc. Required PR
checks and direct report review passed; merged/deployed source 076a853 matches the
reviewed tree. Canonical identity/headers and authenticated 24-check live smoke
passed; optional app measurement remains inactive. All six automatic main CI jobs in 43255604123 PASS for exact 076a853.
Recovery reference remains previous release 021341d. This grants no further release,
full launch acceptance, provider setting, CMS restore or measurement activation.
Remaining owner facts/recovery/device/security gates retain their prior status.
See RELEASE-EVIDENCE.md for final verification and provenance.
