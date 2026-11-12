# Healthcrest engineering instructions

## Project and architecture
- Educational Four Pillars website; Next.js App Router, React/TypeScript, Tailwind,
  React Three Fiber/Three and Sanity. No clinical-service or compliance claim.
- Public pages live in `app/`; the public presets API is `app/api/presets/route.ts`.
- CMS scenarios pass repository-reviewed normalization; preserve local fallbacks.
- Planner drafts stay in browser memory until an explicit save/import action.
- Begin with [current state](docs/agent/PROJECT_STATE.md), then relevant source.

## Invariants
- Preserve manual save/restore/removal/import, unsaved-edit guards, bounded JSON
  validation, scoped storage keys and stale-read cancellation.
- Never transmit planner notes, backups or health-setting events as measurement.
- Measurement requires the production operator flag AND independent visitor
  choices; respect expiry, privacy signals and URL/referrer restrictions.
- Preserve approved assets, canonical https://www.healthcrest.uk, educational
  limitations, reviewed content and source/review-date distinctions.
- Do not invent credentials, addresses, approvals, provenance or compliance.
- Use synthetic data; keep secrets and personal records out of logs and commits.
- Preserve release identity assertions, performance thresholds and failure evidence.

## Verified commands
These passed at the baseline on Node 24.19.0; CI uses Node 22.
- `npm run test:unit` — 305 tests at baseline.
- `npm run lint`.
- `./node_modules/.bin/tsc --noEmit --incremental false`.
- `node --test scripts/sanity-backup.test.mjs scripts/release-identity.test.mjs scripts/structured-data-contract.test.mjs scripts/performance-budget.test.mjs` — 109 tests.
- Build/browser/release commands exist in package.json and CI; baseline did not
  execute them. Inspect side effects/settings before running them. CMS import
  scripts write external data; they are not health checks.

## Execution and risk
1. Confirm root, branch, status, applicable instructions and exact scope.
2. Classify risk and define acceptance criteria; inspect narrowly before editing.
3. Make the smallest coherent diff; preserve unrelated changes and decisions.
4. Verify affected behavior, then relevant lint/types; broaden only for justified
   risk, changed dependencies or repository requirements. Review the actual diff.
5. Update state only at meaningful boundaries; record durable decisions once.
6. Report results and stop when done; use the linked checklists as needed.
- LOW: reversible copy/style/docs; targeted validation, no automatic full audit.
- MEDIUM: functional workflows; targeted tests and relevant lint/type/build checks.
- HIGH: privacy/storage/security boundaries; state invariant, positive/negative,
  failure and relevant isolation/concurrency tests, focused security review and
  residual risks.
- CRITICAL: irreversible/production changes; explicit target approval, acceptance
  evidence, recovery strategy and independent review where policy requires it.

## Approval boundaries
- Work autonomously within authorised local scope; do not repeat unchanged approvals.
- Explicit approval is required for push, merge, release, deployment, production
  settings/data, CMS writes/restores, paid services, privilege changes, destructive
  operations, material scope expansion or weakening protected gates.
- A content decision does not authorise a release. A source commit does not prove
  the remote branch or deployed revision. Pending launch gates stay pending.
- No proactive delegation unless the user or applicable instructions requests it.

## Evidence and supporting records
- [Baseline audit](docs/agent/AUDIT.md); [decisions](docs/agent/DECISIONS.md);
  [lessons](docs/agent/LESSONS.md).
- Existing launch records remain authoritative for their domains:
  [launch checklist](docs/launch/LAUNCH-CHECKLIST.md),
  [owner decisions](docs/launch/DECISION-REGISTER.md),
  [editorial packet](docs/launch/CONTENT-APPROVAL-PACKET.md),
  [operations](docs/launch/OPERATIONS-RUNBOOK.md),
  [release evidence](docs/launch/RELEASE-EVIDENCE.md).
- Do not duplicate those registers or silently rewrite historical evidence.
- [Change protocol](docs/agent/checklists/change-protocol.md),
  [security review](docs/agent/checklists/security-review.md),
  [done](docs/agent/checklists/definition-of-done.md),
  [debugging](docs/agent/checklists/debugging-loop-breaker.md),
  [reporting](docs/agent/checklists/response-style.md).

## Reporting
Use **Changed**, **Verified**, **Not verified / risks**, **Decisions needed**.
Name actual commands/outcomes; omit empty changed lists. Use NOT VERIFIED,
BLOCKED or FAIL honestly; never label an unexecuted check PASS.
