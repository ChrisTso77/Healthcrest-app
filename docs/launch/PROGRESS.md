# Resumable launch progress

Current handoff reconciled 12 November 2026 against local HEAD `6dd8d57` (#136). Remote main and the current deployment were not queried. Historical release results below retain their original revisions/dates. The owner authorised parallel launch-readiness work and separately approved releases through #134. Each future merge/resulting deployment requires its own approval; no public launch is authorised by development work.

Read ROADMAP.md, RELEASE-EVIDENCE.md and LAUNCH-CHECKLIST.md together. Preserve the educational mission, canonical https://www.healthcrest.uk, manual saved-plan handling, default-off independent measurement and approved assets. Do not publish unreviewed advice or invented legal/provider facts.

## Historical verified releases and runtime baseline

- Previously recorded main was `14bce2cf31dc45e35ddb9e3ba28e818fb7aa12a4` after approved documentation/recovery-policy PR #135. Reviewed head `39978a09913a6f6aa88f121a25198186a9ad5546` and merged source share tree `b7b907fba635659f8a82de1482a2586de3d46392`. All five jobs passed in run 41074075226 after one failed-job rerun: mobile 2D Explorer TBT was initially 202 ms against 200 ms, then 190 ms; the original failure is retained in the PR and budgets stayed unchanged. Canonical run [41077804804](https://github.com/ChrisTso77/Healthcrest-app/actions/runs/41077804804) passed all 24 checks with matching identity.
- Runtime/toolchain baseline remains approved [PR #134](https://github.com/ChrisTso77/Healthcrest-app/pull/134), `be24c69c9ef78d0646dae4133df899d0eded4589`. Reviewed head `a8d465339c49eeeeebf7f1acf73201df2eb81fcf` and merged source share tree `221b19f068eef7ec977ade49eaca8088723b79bd`.
- All five hosted PR jobs passed in [41056351489](https://github.com/ChrisTso77/Healthcrest-app/actions/runs/41056351489); Vercel production succeeded. [Canonical live run 41061693500](https://github.com/ChrisTso77/Healthcrest-app/actions/runs/41061693500) passed all 24 checks with expected/observed identity equal to merged main, 22 typed assets and no failed assets/invalid types/telemetry requests.
- Live favicon is HTTP 200, `image/png`, `nosniff` and the complete expected 2,787-byte PNG. RELEASE-EVIDENCE.md retains the original failed #123 run and corrected #124 evidence separately.
- #126 added nosniff/MIME verification; #130 fixed short-viewport Explorer overlap. Later approved dependency changes and checks are recorded in ../dependency-upgrades.md. This documentation branch reconciles current evidence; it changes no application, dependency or workflow.

## Remaining engineering and owner evidence

- Supported application-security assessment remains unavailable: no security preflight/start/scan tools are exposed. The earlier required scan-prologue resource failure remains unresolved; no supported report is claimed. L01 stays blocked. A full dependency audit on 30 October reports zero vulnerabilities, which does not establish application security.
- Parallel remaining-upgrade review found no needed supported migration. ESLint 10 remains excluded by current React/import/accessibility plugin peers; TypeScript 7 remains outside typescript-eslint support. Keep normal strict resolution and all lint rules. Root PostCSS is already 8.5.32; preserve Next/Tailwind/Vitest exact nested pins. Defer unexercised gainmap additions and speculative native-installer/resolver changes. L14's ESLint support gap stays open.
- Owner reported desktop Chrome keyboard/dialog/unsaved-edit passes and subsequently confirmed manual zoom worked. The checklist retains exact limitations and the earlier overlap/retest history. This does not complete screen-reader, touch/native-device, forced-colour or all-route coverage.
- Content packet comparison from #122 to #134 found unchanged guide/scenario/health-guide catalogue blobs. Two linked Explorer files have layout-only changes; app/globals.css also contains the short-viewport rule. G1–G4 and S1–S3 were explicitly approved by Chris on 2 November 2026 against current served source; S4–S8 subsequently approved on 6 November 2026. C1 shared-copy approval recorded on 6 November 2026; all packet decisions now complete at their recorded revisions. See the packet for revision and scope.
- Owner confirmed non-commercial education; professional registered address remains outstanding. Owner now confirms Vercel Hobby and will operate recovery. Hosting eligibility, privacy/provider facts, credential verification and successful recovery remain unresolved. All 13 historical content decisions and initial Windows backup/automatic-run results are recorded below; ongoing review, monitoring and recovery evidence remain pending. Owner accepted 4-hour website/1-working-day CMS recovery, maximum 24-hour CMS data loss, daily/pre-bulk-change private exports and 30-day retention; see the runbook. Use OWNER-LAUNCH-ACTIONS.md; never request a private home address or credentials.
- GitHub CLI live-smoke dispatch works. Owner reports seeing the candidate Vercel deployment/rollback controls and manual Sanity export availability; an exercised recovery remains unverified. The owner-reported initial automatic backup run is recorded below; continuing schedule reliability is not established. Preserve reports privately before the 14-day Actions artifact expiry; this repository is not a durable private archive.

## Next actions

1. Use ../agent/PROJECT_STATE.md for the current local task and verification. Preserve release assertions/workflows; historical approvals do not grant future merge/deployment or launch acceptance.
2. Restore supported security resources/preflight tooling for L01; no improvised report substitutes for that assessment.
3. Verify hosting eligibility and actual recovery access/capabilities; complete pending device/AT checks. G1–G4/S1–S3 follow-up was completed 12 November: all seven remain approved without corrections, next due 19 November (see packet). S4–S8/C1 remain due 13 November. Record substantive review outcomes in the existing packet, without advancing dates automatically.
4. Complete the runbook's access/recovery-point/settings worksheet before any recovery action. A live rollback, dataset write/restore or paid/provider change needs approval of its concrete target and impact.

Gate A remains partial, B blocked, C partial and D blocked. Historical live smoke verifies its identified release; current deployed identity and launch readiness are not established by this local handoff.

## Windows backup preparation

The owner selected a private backup location on their Windows computer. The separate operator-local runner and [Windows setup](WINDOWS-CMS-BACKUP.md) implement export staging, private CLI logs/temporary files, warning rejection, archive/checksum checks, 24-hour freshness failure and reporting of copies older than 30 days. No automatic pruning, restore, dataset write or public artifact upload is added. CLI tooling is installed separately from website dependencies. Synthetic Linux/Windows CI tests need no Sanity credentials or dataset access; every existing release gate remains.

Owner setup follow-up recorded 2 November 2026: private folder and trusted account access reported; CLI 8.27.0 installed/authenticated; pinned corrected runner downloaded and checksum-verified. First manual export, freshness/checksum and manually launched scheduled task passed. Owner subsequently confirmed a successful automatic 18:00 run. Local archive/JSON checks reported 13 documents and 4 entries; no contents were shared. See OPERATIONS-RUNBOOK.md for exact scope, path-splitting failure/correction and evidence limits.

Private test datasets are unavailable on the owner's current Sanity plan. Restore rehearsal remains pending; no public dataset or paid upgrade was used. Ongoing monitoring, retention review, off-device recovery and actual restore/rollback capability remain unverified; D07/L09 stay partial. The backup implementation is present in local HEAD `6dd8d57` (#136); this establishes source inclusion, not its merge authorisation, remote state or deployment. CI does not establish the owner's device outcomes.

NVDA follow-up recorded 2 November 2026: owner installed NVDA 2026.3 and reported passes for Home headings/skip link, all three Explorer dialog announcements and trigger-focus returns, planner labels/unsaved-edit cancellation and the 2D explanation. LAUNCH-CHECKLIST.md preserves individual observations, identity/version limits and pending coverage. These focused results do not complete the manual matrix or establish WCAG conformance. Temporary planner-text cleanup was instructed but not separately confirmed.

G1 (Movement and strength), G2 (Balanced meals), G3 (Sleep routines) and G4 (Stress and support) approved by Chris on 2 November 2026 against served source `14bce2cf31dc45e35ddb9e3ba28e818fb7aa12a4`; guide catalogue blob still matches the immutable packet baseline. Next review due 9 November 2026 under the agreed weekly cadence, earlier for material changes/safety concerns. These are item-specific content decisions, not credential verification, PR approval or launch acceptance. All four learning guides now have item-specific approval. S1 (Connected habits example / integrated-harmony) explicitly approved by Chris on 2 November 2026 at the same served source; reviewedContent.ts blob `468209416c7cdb97b3c5b5e8d9cce42355e9c288` matches baseline. S1 next review due 9 November 2026 or earlier for material changes/safety concerns. S2 (Short sleep and higher stress example / single-pillar-failure) explicitly approved by Chris on 2 November 2026 at the same source/blob, review due 9 November 2026 or earlier for material changes/safety concerns. S3 (Movement example: weekly activity / uk-cmo-optimal) explicitly approved by Chris on 2 November 2026 at the same source/blob, review due 9 November 2026 or earlier for material changes/safety concerns. S4 (Sleep example: everyday foundations / sleep-rung1-foundations) explicitly approved by Chris on 6 November 2026 at the same source/blob, review due 13 November 2026 or earlier for material changes/safety concerns. Earlier G1–G4/S1–S3 review dates remain unchanged. S5 (Sleep example: routines and support / sleep-rung2-behavioral) explicitly approved by Chris on 6 November 2026 at the same source/blob, review due 13 November 2026 or earlier for material changes/safety concerns. S6 (Sleep example: bedroom environment / sleep-rung3-circadian) explicitly approved by Chris on 6 November 2026 at the same source/blob, review due 13 November 2026 or earlier for material changes/safety concerns. S7 (Research example: timed sound during sleep / sleep-rung4-experimental) explicitly approved by Chris on 6 November 2026 at the same source/blob, review due 13 November 2026 or earlier for material changes/safety concerns. S8 (Stress example: coping and support / active-vagal-reset) explicitly approved by Chris on 6 November 2026 at the same source/blob, review due 13 November 2026 or earlier for material changes/safety concerns. All eight scenarios now have item-specific approval. C1 shared copy/practical tools explicitly approved by Chris on 6 November 2026 at served source `14bce2cf31dc45e35ddb9e3ba28e818fb7aa12a4`, review due 13 November 2026 or earlier for material changes/safety concerns. All 13 packet decisions are recorded. Credential/provider/security/recovery and remaining device/AT gates remain separate; content decisions do not authorise any merge or deployment.

## Engineering framework — 12 November 2026

The owner approved the baseline audit and minimal operating-framework installation. See [current state](../agent/PROJECT_STATE.md) and [baseline audit](../agent/AUDIT.md). This approval covers local documentation and handoff reconciliation only; other findings and production operations retain their separate scope/approval boundaries. Baseline local checks passed: 305 unit tests, 109 synthetic boundary tests, lint and TypeScript on Node 24.19.0; current CI uses Node 22. No new build, browser or live result is claimed.

## Owner follow-up — 12 November 2026

G1–G4/S1–S3 weekly review completed; owner explicitly confirms all remain approved
without corrections. Current content hashes and next review (19 November) are in
[the packet follow-up](CONTENT-APPROVAL-PACKET.md#weekly-follow-up--12-november-2026).
Earlier 9 November dates above are historical. Owner reconfirms intended Vercel
Hobby hosting; eligibility is not established by the chosen plan. Private recovery
rehearsal is explicitly not yet done. Other unanswered gates remain pending.

## Local development candidate — 12 November 2026

The new autonomous-development directive authorises local fixes and dedicated-branch
commits. Branch: `codex/healthcrest-release-readiness`; no push, merge or deployment.
Implemented: planner controls wait for hydration before accepting edits (fixes the
observed lost-calendar-date race); delayed-script regression joins existing browser
CI; malformed scene numbers return 400 before CMS access; provider exception details
are withheld from API logs; unused analytics adapter removed; specified OPTIMISING
HEALTH tagline restored without replacing assets or substantive health guidance.

Local build, lint and TypeScript pass; 314 unit tests pass on Node 24 and Node
22.23.5, and 109 synthetic boundary tests pass. Default-off local system-Chromium
smoke passes 23 checks. Broad system-Chromium regression: 308 passed, 11 failed
(three Explorer timeouts, eight enabled-telemetry tests against an off-profile
build). Correct-profile telemetry subsequently passed 15 cases; all three Explorer
cases passed in isolation with original timeouts. Initial failures remain preserved;
this is not a full-suite PASS, pinned-browser result or current-head hosted CI.
Required browser downloads are blocked by cdn.playwright.dev policy 403. Existing
six-job hosted CI passed at 6dd8d57 before these edits; it does not validate them.
See [current state](../agent/PROJECT_STATE.md) for final profile verification,
remaining gates and local evidence paths. Production release remains blocked.
