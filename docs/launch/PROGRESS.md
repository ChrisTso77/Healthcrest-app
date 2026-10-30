# Resumable launch progress

Updated 30 October 2026. The owner authorised parallel launch-readiness work and separately approved releases through #134. Each future merge/resulting deployment requires its own approval; no public launch is authorised by development work.

Read ROADMAP.md, RELEASE-EVIDENCE.md and LAUNCH-CHECKLIST.md together. Preserve the educational mission, canonical https://www.healthcrest.uk, manual saved-plan handling, default-off independent measurement and approved assets. Do not publish unreviewed advice or invented legal/provider facts.

## Current verified release

- Main is `be24c69c9ef78d0646dae4133df899d0eded4589` after owner-approved [PR #134](https://github.com/ChrisTso77/Healthcrest-app/pull/134). Reviewed head `a8d465339c49eeeeebf7f1acf73201df2eb81fcf` and merged source share tree `221b19f068eef7ec977ade49eaca8088723b79bd`.
- All five hosted PR jobs passed in [41056351489](https://github.com/ChrisTso77/Healthcrest-app/actions/runs/41056351489); Vercel production succeeded. [Canonical live run 41061693500](https://github.com/ChrisTso77/Healthcrest-app/actions/runs/41061693500) passed all 24 checks with expected/observed identity equal to merged main, 22 typed assets and no failed assets/invalid types/telemetry requests.
- Live favicon is HTTP 200, `image/png`, `nosniff` and the complete expected 2,787-byte PNG. RELEASE-EVIDENCE.md retains the original failed #123 run and corrected #124 evidence separately.
- #126 added nosniff/MIME verification; #130 fixed short-viewport Explorer overlap. Later approved dependency changes and checks are recorded in ../dependency-upgrades.md. This documentation branch reconciles current evidence; it changes no application, dependency or workflow.

## Remaining engineering and owner evidence

- Supported application-security assessment remains unavailable: no security preflight/start/scan tools are exposed. The earlier required scan-prologue resource failure remains unresolved; no supported report is claimed. L01 stays blocked. A full dependency audit on 30 October reports zero vulnerabilities, which does not establish application security.
- Parallel remaining-upgrade review found no needed supported migration. ESLint 10 remains excluded by current React/import/accessibility plugin peers; TypeScript 7 remains outside typescript-eslint support. Keep normal strict resolution and all lint rules. Root PostCSS is already 8.5.32; preserve Next/Tailwind/Vitest exact nested pins. Defer unexercised gainmap additions and speculative native-installer/resolver changes. L14's ESLint support gap stays open.
- Owner reported desktop Chrome keyboard/dialog/unsaved-edit passes and subsequently confirmed manual zoom worked. The checklist retains exact limitations and the earlier overlap/retest history. This does not complete screen-reader, touch/native-device, forced-colour or all-route coverage.
- Content packet comparison from #122 to #134 found unchanged guide/scenario/health-guide catalogue blobs. Two linked Explorer files have layout-only changes; app/globals.css also contains the short-viewport rule. Review the current rendered layout. All content approval rows remain pending actual human decisions.
- Owner confirmed non-commercial education; professional registered address remains outstanding. Owner now confirms Vercel Hobby and will operate recovery. Hosting eligibility, privacy/provider facts, credential verification, content decisions, successful recovery and backup implementation remain unresolved. Owner accepted 4-hour website/1-working-day CMS recovery, maximum 24-hour CMS data loss, daily/pre-bulk-change private exports and 30-day retention; see the runbook. Use OWNER-LAUNCH-ACTIONS.md; never request a private home address or credentials.
- GitHub CLI live-smoke dispatch works. Owner reports seeing the candidate Vercel deployment/rollback controls and manual Sanity export availability; an exercised recovery and actual backup schedule remain unverified. Preserve reports privately before the 14-day Actions artifact expiry; this repository is not a durable private archive.

## Next actions

1. Review this evidence handoff and preserve existing release assertions/workflows. The #134 approval does not authorise this branch's merge or launch acceptance.
2. Restore supported security resources/preflight tooling for L01; no improvised report substitutes for that assessment.
3. Verify hosting eligibility and actual recovery access/capabilities, choose available screen-reader/device checks, and record actual per-content decisions in the existing packet. Do not mark prepared tasks complete.
4. Complete the runbook's access/recovery-point/settings worksheet before any recovery action. A live rollback, dataset write/restore or paid/provider change needs approval of its concrete target and impact.

Gate A remains partial, B blocked, C partial and D blocked. Current live smoke verifies the release; it does not establish launch readiness.
