# Controlled-launch checklist

Unchecked means pending, including checks unavailable in the current environment. This register is not a statement of legal, clinical, security or WCAG compliance. Record evidence/approver/date, not just a tick. Baseline evidence is in AUDIT.md; implementation results go in PROGRESS.md.

## Gate A — Functional foundation
- [x] Immutable source inventory and exact-main CI baseline recorded (34ca713b; run 40840624311).
- [x] Existing automation covers homepage/navigation, practical learning journeys, Explorer scenarios/2D fallback/keyboard settings, planner save/restore/backup/calendar/failure and no-JavaScript/404 recovery.
- [x] Legacy draft parsing, explicit save/import boundaries and storage-blocked cases remain covered.
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
- [ ] Manual accessibility matrix below completed and blocking defects fixed/retested.
- [ ] Final Gate B reviewer/date/evidence recorded.

## Manual accessibility and device matrix

For each row record date, commit, browser/OS/device or AT/version, task, result, issue and retest link. Automated Lighthouse/Playwright support these checks but do not replace them. Agreed target: WCAG 2.2 AA; no conformance claim yet.

| Task | Representative routes | Required evidence | Status |
| --- | --- | --- | --- |
| Keyboard order/skip/focus | Home, Learn, guide, planner, Explorer, privacy | All actions reachable; visible focus; no trap; dialogs close and return focus | Pending manual; partial automation exists |
| Screen-reader structure | Same routes | Landmarks/headings/names, check-in/status errors and 2D description understandable; dialog announcements | Pending; choose available NVDA/Firefox and VoiceOver/Safari combinations |
| 400% zoom and text resize | Same routes at desktop zoom plus 320 CSS px | Reflow without lost content/actions; usable forms/dock/dialog scrolling | Pending manual; 320px automated coverage exists |
| Forced colours/contrast | Light pages, planner selects, dark Explorer | Text/focus/states/chevrons identifiable; colour is not the only explanation | Pending manual; L23 adds partial Chromium forced-colour emulation and cross-browser selection checks |
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
- [ ] Explicit owner approval identifies the release commit/PR and production deployment. No automatic protected-branch merge.
- [ ] All five CI jobs and preview pass at that exact head; merge result and deployed SHA checked.
- [ ] Run manual Production release smoke check on intended main; verify https://www.healthcrest.uk and retain the commit-bound live report. CI localhost checks do not satisfy this item.
- [ ] External legal/provider/credential/accessibility/security checks complete or explicit owner risk decision recorded; unresolved required gates are never silently waived.
- [ ] Final launch approver/date/evidence and post-launch observation/rollback trigger recorded.

## Post-launch monitoring plan — preparation only

Confirm ownership and a practical review cadence for uptime/deployment errors, broken routes, CMS fallback rates, Search Console indexing, accessibility/content corrections and existing provider quota alerts. Do not log planner text, query preferences or backups. Do not add a processor, enable optional telemetry, schedule external campaigns or incur costs without approval. Field performance coverage must respect consent/exclusions and be labelled unavailable when insufficient.
