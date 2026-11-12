# Current engineering state

Updated 12 November 2026. Production remains approved #138 / 076a853. Local accelerated-programme candidate is not deployed.

## Repository and current release
- Root `/workspace/Healthcrest-app`; local records branch
  `codex/healthcrest-launch-programme` continues verified clean checkpoint0cd449e.
- PR #138 squash merge `076a85369c1826f98b6b92ac5bad515cc9d6546e` has parent
  `021341d6be51bcd6d49b7f44ab676cede64bceb2` and reviewed tree
  `28548ab5033bda67e9aed42a6b7badc93b72081a`.
- Owner approved one combined conditional publish/PR/CI/report/merge/deploy/live
  verification pipeline for exact candidate c283efc. All pre-merge gates passed;
  no repeated permission needed within that scope. No settings/CMS/provider change.
- Vercel Production 7742651420 successful 16:10:02 UTC; canonical source and policy
  confirmed on five public endpoints. Recovery reference remains previous 021341d.

## Implemented scope and verification
- Narrow CSP base-uri self, object-src none, frame-ancestors self, form-action self;
  X-Frame-Options SAMEORIGIN. Foreign embedding intentionally blocked; self works.
- No script/style/resource CSP claim; no dependency/schema/app flow changes.
- Six policy browser cases cover headers/API/icon, cross-origin framing rejection,
  working same-origin planner editing, base/form rejection and embedded objects.
- Local build/lint/types, six policy cases, 54 affected regression cases and 23
  local smoke checks PASS using system Chromium. Initial fixture failures retained;
  real second loopback origin avoids Local Network Access confounding frame test.
- All six hosted jobs in 43253496816 PASS. Direct artifacts digest/size verified.
  325 Chromium + 34 Firefox/WebKit + one preview-off case PASS; zero retries,
  flaky/failures/skips/global errors. All 24 release checks pass, exact synthetic
  checkout 42660e7 tree matches reviewed candidate and actual merged release.
- Eight raw performance profiles reassessed against unchanged limits PASS; maximum
  LCP 918.1276ms, CLS 0.000714731, TBT 134.5ms. Reviewed eight Lighthouse finals and
  twelve Playwright image portions without visible regression in viewed areas.
- Five canonical endpoints return exact new CSP/framing/identity plus existing
  headers; favicon remains PNG. Privacy choices disabled/unchecked, inactive notice.
- Canonical workflow 43255707119 PASS; digest-verified report has 24 passing live
  checks, exact 076a853 identity, 22 valid typed assets and zero failed assets or
  optional measurement requests. All six automatic main CI jobs
  in 43255604123 PASS for exact merged 076a853. Main and live source/policy rechecked
  after completion, unchanged. Main report contents were not independently
  re-downloaded; detailed PR reports cover the identical source tree.
- Prior #137 canonical artifact now independently downloaded/digest verified: 24
  canonical-live checks pass, exact 021341d. Direct connector replaces manual ZIP
  roundtrips for available GitHub artifacts; shell storage-host block still exists.

## Prior #138 completion boundary
- Approved pipeline complete. Evidence records saved locally and in closed PR #138.
  Do not push documentation-only follow-up and trigger another release.
- Stop if final verification fails; preserve evidence and avoid weakening gates.
- No actual rollback, CMS restore, paid service, provider setting or measurement
  activation performed. Preparation release does not declare full launch acceptance.

## Current local checkpoint — accelerated programme
- Five parallel scratch-owned workstreams completed: accessibility,security,
  functional QA,SEO/performance,production readiness. Root serialized shared edits.
- Single canonical current matrix: [launch checklist](../launch/LAUNCH-CHECKLIST.md),
  with requirement,severity,PASS/FAIL/BLOCKED/NOT VERIFIED,evidence,responsible.
  Historical gates/decisions/evidence retained; unresolved gates not waived.
- Fixed demonstrated Home caption contrast: existing --hc-muted token improves
  actual glyph-background minimum4.424 to5.580:1 at320/1280. No layout/copy change.
- Fixed stale home-link locator in shared Explorer test helper; native accessible
  name introduced in0cd449e is unchanged. Initial functional run12PASS/2FAIL; after
  helper correction targeted2PASS, original failures retained. All14 distinct scoped
  cases have passing split evidence; not an uninterrupted14-case green run.
- Added explicit CI workflow contents:read; all six job/trigger/step/override values
  unchanged under parsed YAML comparison. Hosted current-head execution pending.
- Corrected runbook/evidence latest-source and six-job pointers, retaining history.
- Final build/lint/types PASS;314 unit tests PASS; initial boundary108PASS/1 null
  child-status failure under concurrent load, unchanged targeted check PASS then
  sequential full109PASS. Cause not conclusively captured; no timeout/gate change.
- Final local23-check smoke PASS; no source identity supplied, no compiled identity
  claim.140 bounded Tab focus checks at320x200 PASS; manual AT/zoom/paint/device
  coverage remains incomplete. Contrast incompletes are not blanket PASS.
- Prior0cd449e browser/axe evidence and #138 eight lab profiles reused with exact
  scope. No new full browser/performance/security assessment claimed. No demonstrated
  performance bottleneck found. TBT is not INP; no field/3D/device performance claim.
- Supported security tools/resources absent; current Google docs fetch blocked403.
  Dev advisory remains unresolved at prior verified scope, no repeated investigation.
- Local candidate only: no push/merge/deployment/provider/CMS/telemetry change.
  Current production and remote main rechecked076a853. Recovery reference021341d.
- Remaining work depends on platform/manual/operator evidence in canonical matrix,
  exact-head hosted checks/report review and concrete production approval. Do not
  ask for unchanged facts again or trigger an automatic deployment to obtain proof.
- Durable results: [release evidence](../launch/RELEASE-EVIDENCE.md), accelerated
  programme section. Scratch `/workspace/work/healthcrest-programme/`, reports a–e,
  raw tests, original failures and before/after contrast images retained.

## Remaining launch requirements
- L01 supported security assessment blocked by unavailable preflight/resources.
  This focused containment patch does not replace it or establish XSS prevention.
- Owner confirms Hobby eligibility and independent credential checks; underlying
  evidence not supplied here. Existing-office public wording remains pending;
  no private address was collected or published.
- GoDaddy Business Basics and Analytics/Speed Insights ON are owner-reported;
  Production app flag absent/no queued changes confirmed for #137. Exact retention,
  deletion/rights/provider processing evidence remains pending; no activation scope.
- Private CMS restore/off-device recovery and actual production rollback rehearsal
  remain pending. Source-recovery preview passed scoped owner journeys only.
- iPhone/Safari pending; remaining devices broadly reported done without versions
  or individual additional outcomes. Candidate manual save explicitly untested.
- G1–G4/S1–S3 renewed on 12 November, next due 19 November; S4–S8/C1 due 13 November.

## Evidence and next work
- Scratch evidence `/workspace/work/healthcrest-browser-policy-release/`.
- [Decisions](DECISIONS.md), [lessons](LESSONS.md),
  [release provenance](../launch/RELEASE-EVIDENCE.md),
  [launch gates](../launch/LAUNCH-CHECKLIST.md),
  [owner facts](../launch/OWNER-LAUNCH-ACTIONS.md),
  [operations](../launch/OPERATIONS-RUNBOOK.md).
