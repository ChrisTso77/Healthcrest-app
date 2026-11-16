# Current engineering state

Updated 16 November 2026. Current local work is separate from deployed production.

## Current initiative — Explorer loading follow-up (16 November)

- #145 merged with explicit owner approval as 6771f48; canonical serves that SHA,
  and live commit-bound smoke 43891385536 passed. Scanner source/assets unchanged.
- Post-merge CI 43891071015 passed functional/browser checks but failed only the
  mobile Explorer lab LCP (2581.936ms against unchanged 2500ms budget).
- New `codex/healthcrest-explorer-loading` starts at that exact main. User asks
  to proceed with next upgrades; prioritise this observed regression before new
  features. Server-resolved guide links reduce client data; onboarding hydration
  now paints the unchanged introduction before hydration, promoting its native
  modal/focus when ready. Default dialogs retain prior behavior. No scanner,
  clinical, persistence or measurement changes.
- [Loading review record](../explorer-v2/loading/REVIEW.md). Verification underway;
  no new production merge/deployment authorised. Earlier records are historical.

## Previous initiative — approved Explorer V2 integration (16 November)

- Approved source: `59a8d4f584f6356ff9df23447b0b6bb2240edc0d`, including
  restored unchanged scanner. Main fetched at db93754. New branch:
  `codex/healthcrest-explorer-v2-integration`. User authorises integration/PR and
  release preparation; production merge/deployment remain unapproved.
- `/engine` uses approved V2 by default; original/scan/systems links remain for
  compatibility and recovery. Existing pillar/idea and Planner/guide context is
  preserved. No scanner, storage, measurement or clinical-library gate changes.
- [Integration baseline, evidence and release decision](../explorer-v2/integration/RELEASE.md).
  Local integration PASS: build/lint/types, 330 units, 109 safeguards, 329 app
  cases (three compatibility URL corrections retested), 24 public V2 cases,
  ten post-split legacy/scanner/graphics cases and 24 commit-bound release checks.
  All eight unchanged performance budgets pass after splitting legacy loading.
  Final exact-head CI/preview are recorded in PR #145; production remains BLOCKED
  by carried-forward launch restrictions and explicit-target approval. Earlier
  prototype records below remain historical.

## Previous initiative — Habit Explorer V2 prototype (16 November)

- Latest: restored **Open Body Scanner** by lazily reusing the unchanged original
  component/assets. V2 settings/lesson stay in memory; original scanner controls
  use their own state and return restores focus/scroll. No production edits.
- Build/lint/types, 15 V2 cases and four original scanner cases PASS. Hashes match
  merged baseline; four actual static screenshot comparisons pass with only
  negligible native-control edge differences. No scanner source/style edits.
- [Restoration evidence and exact file list](../explorer-v2/SCANNER-RESTORATION.md).
  Existing preview approval applies; no production merge/deployment authorised.

- #143 evidence library merged with owner approval at db93754; no deployment implied.
- Dedicated `codex/healthcrest-explorer-v2-prototype` starts at that merge. User
  authorises isolated prototype/review preparation; production integration,
  merge and production deployment require new explicit approval. Owner has now
  approved a separate preview deployment (16 November).
- Three concepts evaluated; selected labelled 2D with optional existing Lite 3D.
  `/prototype/explorer-v2` permits local review and the exact approved branch in
  Vercel Preview; production stays blocked. Original Explorer, Body Scan, Planner,
  reviewed clinical content and data boundaries unchanged.
- Supplied screenshot reviewed; prototype UI rebuilt with compact habit cards,
  radial input visual and contextual lesson workspace. Review path remains
  `/prototype/explorer-v2`; screenshot route `/engine` remains the original.
- Build/lint, 330 units and 12 targeted Chromium cases PASS, including approved
  preview positive, production negative and draft-library isolation. Axe at four
  widths; forced WebGL failure, keyboard dialog and reduced motion checked.
  Manual assistive technology / real users / other browsers NOT VERIFIED.
- [Review package, screenshots, tradeoffs and migration proposal](../explorer-v2/REVIEW.md).
  [Preview deployment record](../explorer-v2/DEPLOYMENT.md). No production integration
  or merge performed. Keep #139/#140 work separate.

## Previous initiative — evidence library (16 November, historical pre-merge record)

- User authorises research, development branch and reviewable draft PR; no production
  deployment, unreviewed clinical publication, CMS write or gate bypass.
- Upstream main verified/fetched at a08e1ca (#142); branch
  codex/healthcrest-evidence-library. Preserve newer reviewed Body scan and leave
  open #139/#140 work separate. The 12 November baseline below is historical.
- Four draft lessons, four learning levels, claim register, regional/audience
  pathways, SVG diagrams, quizzes and generated video source/caption packages.
- New routes require explicit local-only editorial flag; hosted contexts fail
  closed. Existing reviewed guidance, Planner data controls, visual rules, privacy
  and response policy remain intact. New independent clinical review is pending.
- Research, concise progress ledger and actual verification are maintained once in
  [the education review record](../education/RESEARCH-AND-RELEASE.md).
- 326 unit tests, types/lint/build, 109 safeguard tests and dependency audit passed.
  201 browser cases/five axe page scans and 23 local release checks passed with
  system Chromium; eight public lab performance profiles passed. Pinned browser
  download blocked. Candidate is for independent review, not publication.

## Historical context — 12 November 2026

## Repository and released baseline
- Root: `/workspace/Healthcrest-app`; branch: `codex/healthcrest-browser-policy`.
- Branch starts at deployed main `021341d6be51bcd6d49b7f44ab676cede64bceb2` (#137).
- Previous local handoff branch `codex/healthcrest-release-readiness` is preserved;
  its six documentation-only updates were brought forward into this candidate.
- Educational Next.js/React/Sanity site, 2D/3D Explorer and manual browser planner.
- #137 had explicit owner merge/deployment approval. Its merged/reviewed source
  tree matches; canonical workflow 43244366643 and all six main CI jobs in
  43244145077 PASS. Optional app measurement remains inactive in served markup.
- Full launch acceptance remains open; #137 approval does not authorise this patch.

## Current objective and risk
- Implement a narrow containment policy after observed absence of live CSP/framing
  headers. HIGH response-policy boundary; no production change performed.
- Invariant: foreign framing and foreign form/base targets blocked, embedded objects
  blocked; self framing, planner editing and ordinary scripts/styles/forms work.
- Changes: next.config.ts adds CSP base-uri self, object-src none, frame-ancestors
  self, form-action self and legacy X-Frame-Options SAMEORIGIN.
- Six new browser-policy cases join the existing Chromium CI suite. No dependencies,
  lockfile, data schema, processor, CMS content or production settings changed.
- Intentional behavior change: third-party sites cannot embed Healthcrest pages.
  Same-origin framing stays supported. Broad script/style/nonce CSP remains separate.

## Local verification
- Build PASS, lint PASS, TypeScript --noEmit --incremental false PASS.
- Six enforcement/header/positive-frame cases PASS using system Chromium.
- 54 affected cases PASS: guided start, print plan/guide, calendar, next-week,
  consent/withdrawal/privacy and planner hydration. Production-enabled local test
  profile used; actual production flag/settings were not changed.
- Initial fixture failures retained: a route-fulfilled attacker page hit Local
  Network Access first. A real second loopback server isolates CSP without
  disabling browser security; same-origin test also targets the visible heading.
- Local release smoke PASS: 23 checks, 13 pages, 22 valid typed assets and no
  failed/invalid assets or optional measurement requests. No local commit identity
  was supplied; no compiled-identity assertion claimed for this smoke.
- Pinned-browser/full CI not run for this new candidate yet; no remote preview
  or production claim for this branch.

## Approval and completion boundary
- Current user authorised autonomous local engineering and asked for the next
  actionable step. Push/PR and production require their explicit scope approval.
- Candidate must pass required hosted checks and report review before merge.
- No push, merge or deployment for this new branch. Keep deployed 021341d stable.
- Reuse existing passing evidence for unaffected logic; do not repeat full local
  suites without a relevant change/failure. Do not raise performance/test gates.

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
- Reviewed prior candidate: 319 Chromium + 34 compatibility, zero retries/failures/
  skips; 24 release checks and eight raw performance profiles PASS. Mobile 2D TBT
  was 194/200 ms. These are prior-source results, not this patch's hosted results.

## Evidence and next work
- Current scratch: `/workspace/work/healthcrest-final-batch/browser-policy-*`.
- [Decisions](DECISIONS.md), [lessons](LESSONS.md),
  [release provenance](../launch/RELEASE-EVIDENCE.md),
  [launch gates](../launch/LAUNCH-CHECKLIST.md),
  [owner facts](../launch/OWNER-LAUNCH-ACTIONS.md),
  [operations](../launch/OPERATIONS-RUNBOOK.md).
- Local implementation, targeted verification and diff review complete. Freeze the
  commit, then seek one combined remote verification/preparation-release approval;
  act on production only after required hosted checks/report review pass.
