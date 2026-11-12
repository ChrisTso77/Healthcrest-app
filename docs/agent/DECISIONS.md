# Engineering decisions

## 12 November 2026 — Reference existing launch registers
- Decision: keep owner/editorial/recovery/release evidence in the existing launch
  registers; use AGENTS.md and PROJECT_STATE.md as compact navigation/current state.
- Context: the approved baseline found contradictory current handoff statements
  (HC-04) amid substantial existing evidence.
- Alternatives: duplicate the full launch system; replace historical registers.
- Rationale: referencing preserves provenance and avoids conflicting approval state.
- Consequences: update facts once at their authoritative source, link from state,
  preserve historical failures and distinguish source/remote/deployed revisions.
- Approval: user “Approved” after the baseline/framework approval request.
- References: [audit](AUDIT.md), [owner decisions](../launch/DECISION-REGISTER.md).

Existing architecture, content and operational decisions remain in the owner
register and linked launch records. This installation grants no new release,
provider, CMS, dependency or application-change approval.

## Proposed automated gates — none installed
Existing CI already provides unit, type, lint, dependency, synthetic backup,
release, SEO, performance and browser gates. This documentation change needs no
new CI/dependency gate. If proposing one later, record its exact command, expected
benefit, runtime cost, and CI/dependency impact before installing it.

## 12 November 2026 — Retain compatible lint dependencies pending an upstream fix
- Decision: do not force minimatch 11 into typescript-eslint's minimatch 10 range.
- Context: full npm audit reports eight moderate entries from GHSA-g3hv-75wg-m249
  through development tooling; production-only audit reports zero vulnerabilities.
  Registry metadata for typescript-estree 8.72.2 still requires minimatch ^10.2.2;
  published 10.x versions end at 10.2.6 and the advisory fixes at 11.0.1.
- Alternatives: unsupported cross-major override, remove lint tooling, await a
  compatible upstream release. Removing/weaking lint gates is unacceptable.
- Rationale: no demonstrated app-runtime exposure; forcing a major into an
  unsupported range risks validation integrity. This is a residual risk, not a fix.
- Consequences: keep existing lint gates and explicit advisory disclosure; revisit
  when upstream supports a fixed version or relevant attacker-controlled tooling
  input is demonstrated. No dependency/lockfile change made.

## 12 November 2026 — Use the owner's specified brand tagline
- Decision: restore OPTIMISING HEALTH across shared chrome, page eyebrows and
  sharing metadata, preserving hummingbird assets and substantive health copy.
- Context/approval: the new autonomous-development directive explicitly specifies
  this tagline; it supersedes earlier preference for Health through everyday habits.
- Alternatives: leave contradictory taglines or replace visual assets.
- Rationale: consistent owner-specified branding without new medical/service claims.
- Consequences: homepage title regression updated; landing and sharing checks must
  run against a fresh build. Historical C1 approval stays bound to its old revision;
  this copy change does not create a new clinical/editorial approval record.
