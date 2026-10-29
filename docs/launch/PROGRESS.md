# Resumable launch progress

Updated 29 October 2026. Read ROADMAP.md and this file before starting another cycle. The owner's master directive requires autonomous safe improvements, small reviewable PRs and explicit release gates. No approval for this new branch's merge or production deployment exists.

## Checked state
- Main baseline: `34ca713b922ee53b2f0dad1c5447d406e9a1216d`, PR #108 merged; tree `c7ce7560f82777ffda89b684a963e1ed973e9d21`.
- Exact-main [run 40840624311](https://github.com/ChrisTso77/Healthcrest-app/actions/runs/40840624311) passed all five jobs, 300 unit, 283 Chromium and 14 Firefox/WebKit cases, release/build/privacy/dependency/mobile checks. Vercel production status succeeded. No new live-domain smoke is claimed.
- Original local checkout is clean but older at 81758f7; never overwrite it to resume. Isolated snapshot `/workspace/healthcrest-launch-34ca713` matches all 203 baseline Git blobs. Existing installed dependencies were reused; clean local installation failed offline. Hosted npm ci is the reproducibility evidence.

## Completed this cycle
- Read the master directive; audited current source inventory, recent/open PR state, architecture, routes, content/assets, storage/privacy behavior and existing verification/operations documents.
- Created AUDIT.md with ranked evidence/limits, ROADMAP.md with engineering/editorial/commercial tasks, LAUNCH-CHECKLIST.md and DECISION-REGISTER.md. Full security/manual/operational checks remain pending, not passed.
- Local baseline: type checks, lint and 300 unit tests passed initially using reused dependencies; a subsequent clean npm ci succeeded. Local browser binaries are missing. Build outcome and hosted implementation evidence will be appended below.
- Implemented L05: raw-value mobile budgets, explicit failure on low/invalid/runtime-failed reports or unpermitted measurement; preserves output before failure. Added 21 Node boundary/error cases and CI invocation. No dependency/service or app runtime change.
- Implemented L07's first slice: unique public titles/descriptions, single primary heading/language and default-public-page fragment destinations in the existing read-only release check. Query-dependent states still need separate tests; no external source uptime or schema eligibility claim.
- Owner supplied company number 15318363, registration in England, a hobby-first intention, and Chris Tsoto approval with at least weekly content review/correction. These are recorded as supplied facts; no company lookup exposing an address or public legal change was made. Registered-office privacy/eligibility and actual content sign-off remain open. See D01/D02/D04.

## Active task
Verify and review the launch foundation PR at its immutable head. L14 was investigated in an isolated local experiment and is blocked on current React/a11y/import plugin peer compatibility; no dev-tool PR was published and no lockfile was changed on the launch branch. Then choose the highest-priority unblocked roadmap task. Keep reports and state bound to the actual checked commit, not this document's later administrative edits. All five CI jobs, including compatibility and preview-off, are required; do not infer Actions success from the Vercel status alone.

## Failed/unavailable checks and dependencies
- Local git network: proxy:8080 connection failed. Do not bypass the policy or expose credentials; use the GitHub connector and hosted CI.
- Initial `npm ci --offline`: ENOTCACHED for zustand. A later npm ci with supported network permission succeeded; a local production dependency audit then reported zero vulnerabilities; no proxy/TLS bypass. The install exposed an unsupported ESLint 9 warning (L14), now investigated separately.
- Initial local build with symlinked node_modules: Turbopack could not resolve a package outside its filesystem root. Retry with dependency files inside snapshot failed at Turbopack/PostCSS child-process port binding: Operation not permitted (os error 1). This is an execution-sandbox limitation; hosted build verification is required. Do not change production config to accommodate the workspace.
- No local Chromium/Firefox/WebKit executables; browser CDN is outside allowed destinations. Browser/release/Lighthouse checks require hosted CI here.
- Formal security workflow blocked: codex-security:security-scan/SKILL.md was readable; required scan-prologue resource failed to load and no capability/preflight/scan tool was exposed. Skill requires preflight ready before source-audit workflow. No completed security scan/report or blanket security conclusion exists.
- Live canonical homepage fetch was inaccessible from the web tool; production deployment success is not a live smoke pass.
- First foundation CI attempt (run 40843896951) stopped on a new heading assertion that counted the planner’s hidden print-only h1. Corrected the check to use exposed accessibility headings, preserving the print heading and app behavior. Subsequent hosted verification is required.
- Owner/provider/AT/device decisions in D01–D09 remain open. No company/credential/retention/commercial eligibility facts were invented.

## Next safe actions
1. Read AUDIT.md and ROADMAP.md; recheck main, working branch, changed files and open PRs before edits.
2. Review latest launch PR's exact-head results; address any real failures and retain regression evidence. Update this progress record with actual commits/runs and avoid rerunning unchanged tests merely for administrative docs.
3. Continue representative-route performance, schema/content consistency and a visual/token inventory when tools permit; do not claim manual or unavailable checks complete. Use separate small PRs for larger independent changes.
4. Restore supported security scan tooling to resolve L01. Record actual manual accessibility/device results for L06. Prepare operational runbook without executing unapproved production changes.
5. When a release is concrete and verified, obtain explicit approval covering protected-branch merge and production deployment (D08). Do not auto-merge or deploy based on the master directive. After approval, verify the resulting commit/deployment and run the operator-controlled live workflow.

## Gate state
Gate A: partial (strong automation; current implementation review/manual device coverage pending). Gate B: blocked (L01–L04, manual accessibility). Gate C: partial (existing content/brand/SEO; review/design/representative evidence pending). Gate D: blocked (earlier gates, hosting/operations and explicit release authorization). **Healthcrest is not declared launch-ready.**

## Cycle evidence
Branch: codex/launch-foundation-audit. [PR #109](https://github.com/ChrisTso77/Healthcrest-app/pull/109), unmerged; live PR metadata/checks identify its immutable current head and latest results. Initial implementation: 3fe3f0b193e212cdfd850e264016b55a3f7a36ca. Heading correction/evidence update: df8ce4b422c41a942239fc3774262380d5b53c68, [run 40844354529](https://github.com/ChrisTso77/Healthcrest-app/actions/runs/40844354529). At this checkpoint its release/build steps, Firefox/WebKit, lint/unit/budget and preview-off jobs had passed; Chromium/mobile completion was still pending. The subsequent final commit also rejects zero LCP without rejecting valid zero CLS/TBT, and updates this record. Its current all-five-job results must be read from the linked PR before merging; earlier run success is not a substitute.

Local final focused evidence: 21 Node performance-budget cases and lint/syntax checks. Broader unit/browser coverage belongs to the exact hosted commit/run. No fresh live-domain, manual AT/device or formal security scan is claimed. Required next permission is D08 for a concrete protected-branch merge and production deployment; no launch gate has been declared passed.
