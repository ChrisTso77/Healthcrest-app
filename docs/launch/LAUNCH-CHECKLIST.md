# Controlled-launch checklist

Unchecked means pending, including checks unavailable in the current environment. This register is not a statement of legal, clinical, security or WCAG compliance. Record evidence/approver/date, not just a tick. Baseline evidence is in AUDIT.md and [RELEASE-EVIDENCE.md](RELEASE-EVIDENCE.md); implementation results go in PROGRESS.md. The owner has approved parallel launch-readiness work and combined release review. Optional visual refinements do not take priority over these gates.

## Gate A — Functional foundation
- [x] Immutable source inventory and exact-main CI baseline recorded (34ca713b; run 40840624311).
- [x] Existing automation covers homepage/navigation, practical learning journeys, Explorer scenarios/2D fallback/keyboard settings, planner save/restore/backup/calendar/failure and no-JavaScript/404 recovery.
- [x] Legacy draft parsing, explicit save/import boundaries and storage-blocked cases remain covered.
- [x] Latest approved release #124 has five passing PR jobs, matching reviewed/merged trees, successful production deployment and 24 passing commit-bound canonical live checks; see RELEASE-EVIDENCE.md. This is release evidence, not launch acceptance.
- [ ] Current launch PR exact head passes all five CI jobs and Vercel preview; reports reviewed, not just presence of checks.
- [ ] Representative real-device/touch/back-forward/error journeys recorded; confirm no critical functional defects across the agreed support matrix.
- [ ] Final Gate A reviewer/date/evidence recorded.

## Gate B — Security and trust
- [ ] Supported Standard security audit/threat model completed; application/API/CMS/import/storage/logging/supply-chain/deployment boundaries reviewed.
- [ ] No unresolved Critical/High findings; confirmed fixes retested or explicitly identified as launch blockers.
- [ ] Current dependency audit, observed security headers and resource-based CSP review; no generic unsafe policy installed to obtain a score.
- [ ] Provider dashboards, scope, environment separation and optional measurement payload/withdrawal checks reviewed per ../measurement-rollout.md. Default-off behavior retained; do not enable by assumption.
- [ ] Company disclosures, current credentials and privacy/provider/retention/rights process verified and public changes approved (D02–D04).
- [ ] Four guides and scenarios receive accountable human editorial sign-off; source-check dates are not clinical-review dates.
- [ ] Complete the per-content records in [CONTENT-APPROVAL-PACKET.md](CONTENT-APPROVAL-PACKET.md); keep pending decisions blank and bind actual approvals to the reviewed source.
- [ ] Manual accessibility matrix below completed and blocking defects fixed/retested.
- [ ] Final Gate B reviewer/date/evidence recorded.

## Manual accessibility and device matrix

For each row record date, commit, browser/OS/device or AT/version, task, result, issue and retest link. Automated Lighthouse/Playwright support these checks but do not replace them. Agreed target: WCAG 2.2 AA; no conformance claim yet.

| Task | Representative routes | Required evidence | Status |
| --- | --- | --- | --- |
| Keyboard order/skip/focus | Home, Learn, guide, planner, Explorer, privacy | All actions reachable; visible focus; no trap; dialogs close and return focus | Pending manual; partial automation exists |
| Screen-reader structure | Same routes | Landmarks/headings/names, check-in/status errors and 2D description understandable; dialog announcements | Pending; choose available NVDA/Firefox and VoiceOver/Safari combinations |
| 400% zoom and text resize | Same routes at desktop zoom plus 320 CSS px | Reflow without lost content/actions; usable forms/dock/dialog scrolling | Pending manual; 320px automated coverage exists |
| Forced colours/contrast | Light pages, planner selects, dark Explorer | Text/focus/states/chevrons identifiable; colour is not the only explanation | Pending manual; L23 covers public selection; L24/L25 add Explorer selection, manual attribution and modal-close paint checks |
| Touch and orientation | Mobile/tablet learning/planning/Explorer | Target sizes, no hover-only help, usable landscape/portrait | Pending actual devices |
| Reduced motion/static/errors | Home and 2D/3D Explorer | No essential content lost; pause and failed-video/WebGL alternatives usable | Automated cases exist; manual pending |
| Native controls and downloads | Planner import/export/calendar/print | Actual Safari/iOS/Android picker, file and printing behavior; no private text in generic calendar | Pending actual devices; Linux engine tests are partial evidence |

## Gate C — Marketing readiness
- [ ] Owner-reviewed brand/value proposition/CTA and responsive visual baseline, with the existing hummingbird assets preserved.
- [ ] Complete useful Home/Learn/Explorer/About/Contact/privacy journeys; no misleading clinical/service promises.
- [ ] Canonical/sitemap/robots/404/sharing/unique metadata/headings/internal fragments pass on current build.
- [ ] Structured data checked against visible content/current Google documentation; external validation recorded without inventing eligibility or ranking guarantees.
- [ ] Representative mobile/desktop lab results reviewed, plus real-user/INP evidence or explicitly pending field coverage. No disabled feature used to game scores.
- [ ] Editorial briefs/content clusters and correction process approved; new advice reviewed before publication.
- [ ] Search Console/domain ownership, sitemap submission, indexing monitoring and social/partnership plan approved before external actions (D06).
- [ ] Final Gate C reviewer/date/evidence recorded.

## Gate D — Production launch
- [ ] Gates A–C accepted with no outstanding launch-blocking findings.
- [ ] Current hosting plan and intended use confirmed eligible (D01); any paid changes separately approved.
- [ ] DNS/HTTPS/canonical domain, production/preview settings and least-privilege access verified by operator without exposing values.
- [ ] Incident owner, privacy-preserving logs/monitoring, CMS recovery, rollback access and recovery exercise recorded (D07).
- [x] Owner explicitly approved #124 merge/resulting deployment; merged SHA 603d8e04e7a4bb8fb0b8939a3b714be9046fa20f. This approval does not apply to future releases or launch acceptance.
- [ ] All five CI jobs and preview pass at that exact head; merge result and deployed SHA checked.
- [x] #124 manual canonical production run [40967684877](https://github.com/ChrisTso77/Healthcrest-app/actions/runs/40967684877) on intended main passed all 24 checks. Artifacts expire after 14 days; durable private preservation remains an operator task.
- [x] Canonical live expected/observed marker and workflow source match approved merged SHA 603d8e04e7a4bb8fb0b8939a3b714be9046fa20f in run 40967684877. Preserve mismatch/failure assertions for future releases.
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
