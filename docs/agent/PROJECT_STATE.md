# Current engineering state

Updated 12 November 2026. This file summarises current local work; launch evidence
and owner decisions remain in the existing linked registers.

## Repository and stage
- Root: `/workspace/Healthcrest-app`; branch: `codex/healthcrest-release-readiness`.
- Source baseline before this work: `6dd8d57e83d39225ef57f4f26be5a253e88fa890` (#136).
- Local implementation commit: `6ded2ef`; subsequent handoff-only commits do not
  change application code. Use `git log -1` for the latest documentation HEAD.
- Educational website in controlled launch preparation. No launch acceptance.
- Next.js/React public pages, reviewed Sanity scenarios, 2D/3D Explorer and manual
  browser-local planner. See ../../AGENTS.md for invariants and commands.
- GitHub CI run 42299146937: all six jobs passed at source HEAD 6dd8d57. This
  predates local edits; current deployed identity not independently verified.

## Objective and acceptance
- Owner's new autonomous-development directive authorises routine local changes,
  dedicated-branch commits and release-candidate preparation. Stricter production,
  protected-gate and human-accountability boundaries remain in force.
- Branch: `codex/healthcrest-release-readiness` (created without discarding changes).
- Release acceptance: build and affected tests pass; current-head CI/browser,
  privacy/SEO/performance and existing launch gates have evidence; content/legal/
  recovery/security decisions completed before production release approval.
- Current work: reject malformed scene requests, avoid provider-detail logging,
  remove unused analytics adapter, restore specified tagline, prevent pre-hydration
  planner edits from losing entered dates, and verify core journeys.

## Completed and verification
- [Baseline audit](AUDIT.md) retained unchanged as assessment-time evidence.
- Framework installed; contradictory current claims in launch/PROGRESS reconciled.
- Baseline: 305 unit tests, 109 synthetic boundary tests, lint and TypeScript PASS
  on Node 24.19.0. CI targets Node 22; build/browser/live checks NOT VERIFIED.
- Framework follow-up: local Markdown links/line budgets and
  `git diff --check` PASS. New development checks: build, lint, 314 unit tests
  and seven focused system-Chromium calendar/hydration cases PASS. Node 22.23.5
  also passes 314 unit tests, lint and TypeScript. Default-off local smoke: 23 PASS.
- Broad system-Chromium run: 308 passed, 11 failed (18.6m). Three Explorer tests
  timed out; eight telemetry failures used the wrong default-off build profile.
  Correct-profile telemetry: 15 PASS; isolated Explorer cases: 3 PASS under the
  original timeouts. Original failures preserved; no full-suite PASS claimed.
  Exact preview profile (operator flag true, VERCEL_ENV preview): 1 PASS.
- No push, merge, deployment or external write performed. Local candidate commit
  authorised by the new directive; its identifier is available from `git log -1`.

## Blockers and next actionable work
- HC-01: owner completed G1–G4/S1–S3 review on 12 November, explicitly retaining
  approval without corrections; unchanged content hashes verified. Next due
  19 November, per packet follow-up. S4–S8/C1 remain due 13 November.
- HC-02: private restore rehearsal/off-device recovery remain unverified; prepare
  a concrete scoped target before requesting any operational approval.
- Dependency audit: zero production vulnerabilities; full audit has eight moderate
  dev-tool entries from minimatch (see DECISIONS.md). No compatible fix identified.
- Browser download blocked: cdn.playwright.dev returns policy 403. System Chromium
  is local evidence only (video disabled in scratch config); pinned Chromium/
  Firefox/WebKit and current-head hosted CI gates remain pending.
- HC-03/L01: supported security reference failed to load; no preflight tool was
  exposed during audit. Restore capability before claiming supported assessment.
- HC-05: remaining actual-device/AT matrix pending; retain narrower owner passes.
- HC-06: unused analytics adapter removed under the new development directive;
  active pageview/performance consent implementation is preserved.
- Provider eligibility, disclosure, credential and processing facts remain owner
  evidence gaps; see ../launch/OWNER-LAUNCH-ACTIONS.md.
- Current local changes address observed actionable defects. Release remains
  BLOCKED by supported security tooling, pinned-browser/current-head CI and
  outstanding recovery/provider/legal/device evidence; no production approval
  requested while these gates remain open.

## Evidence
- [Launch progress](../launch/PROGRESS.md),
  [gates](../launch/LAUNCH-CHECKLIST.md),
  [editorial decisions](../launch/CONTENT-APPROVAL-PACKET.md),
  [recovery](../launch/OPERATIONS-RUNBOOK.md),
  [release provenance](../launch/RELEASE-EVIDENCE.md).

## Local evidence locations
- Scratch logs/reports/screenshots: `/workspace/work/healthcrest/` (not committed).
- Original broad failures: `broad-default-off-results/`, `browser-regression.log`.
- Profile recheck: `enabled-telemetry.log`; timing recheck: `explorer-isolated.log`.
- Node 22 checks: `node22-unit.log`; default-off smoke report:
  `release-readiness-default-off/summary.json`. These are local, not live results.

Final commit-bound local smoke, if executed, writes `artifacts/release-readiness/`
then is preserved under the scratch evidence directory; it does not attest live state.
