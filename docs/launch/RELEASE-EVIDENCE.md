# Release evidence and remaining launch work

Updated 30 October 2026. This ledger distinguishes completed software releases, build checks and actual launch requirements. A successful deployment does not close legal, editorial, security, accessibility or operational gates. Use [LAUNCH-CHECKLIST.md](LAUNCH-CHECKLIST.md) for acceptance, [OWNER-LAUNCH-ACTIONS.md](OWNER-LAUNCH-ACTIONS.md) for consolidated operator tasks and [PROGRESS.md](PROGRESS.md) to resume engineering work.

## Latest verified production release: PR #134

| Evidence | Recorded result |
| --- | --- |
| Approved release | Owner explicitly approved [PR #134](https://github.com/ChrisTso77/Healthcrest-app/pull/134); merged 30 October 2026 at 13:13:53 UTC (13:13:53 Europe/London). Approval covers this release, not launch acceptance or future merges. |
| Reviewed head | `a8d465339c49eeeeebf7f1acf73201df2eb81fcf` |
| Merged main | `be24c69c9ef78d0646dae4133df899d0eded4589` |
| Identical reviewed/merged tree | `221b19f068eef7ec977ade49eaca8088723b79bd`, verified with local Git objects after fetching main |
| Hosted PR checks | [41056351489](https://github.com/ChrisTso77/Healthcrest-app/actions/runs/41056351489), all five jobs passed: lint/type/unit/boundaries, CMS validation, Chromium E2E/WebGL/performance, preview measurement-off, Firefox/WebKit compatibility |
| Local supporting checks | Clean strict install with scripts enabled, lint/types, 305 unit tests, 35 structured-data, 35 performance-budget, 29 release-identity cases, production build, six focused browser checks and all 24 local release checks passed. Effective client/server lint rule maps unchanged. System Chromium and CMS fallback were used locally; no live-CMS or non-Linux native-binding coverage is inferred. |
| Production deployment | [Vercel production](https://vercel.com/tsotsoft/healthcrest-app/DeuVcqpBpLRYGCxBcqANiRU5akvp) reported success; canonical favicon response carried the merged SHA |
| Canonical live smoke | [41061693500](https://github.com/ChrisTso77/Healthcrest-app/actions/runs/41061693500), main at the merged SHA; all 24 checks passed. Expected/observed commit both `be24c69c9ef78d0646dae4133df899d0eded4589`, mode `canonical-live`. 22 typed assets, zero invalid types, failed assets or telemetry requests. |
| Live favicon | HTTP 200, `image/png`, `nosniff`, complete 64×64 PNG, 2,787 bytes; SHA-256 `ec50cba97dc423f7fe1f5cf1799730ea8a936b18a136679fcb204703aab108f0` |
| Coverage limits | No provider-dashboard access, rollback/CMS recovery exercise, clinical content approval, full manual device/AT coverage or launch acceptance established. |

Subsequent approved maintenance after #124 includes response MIME/`nosniff` checks (#126), runtime/compiler/tooling updates (#127–#129, #131–#134) and the short-viewport Explorer fix (#130). Detailed dependency scope and limitations are in [dependency-upgrades.md](../dependency-upgrades.md). Those releases do not change the outstanding launch gates. The #124 results below remain historical evidence for their own revision.

## Historical verified production release: PR #124

| Evidence | Recorded result |
| --- | --- |
| Approved release | Owner explicitly approved merging [PR #124](https://github.com/ChrisTso77/Healthcrest-app/pull/124); merged 29 October 2026 at 22:40 UTC. Approval covers this release, not public launch or future merges. |
| Reviewed head | `1f84a9598000823369789da09a8b12541bdf43f5` |
| Merged main | `603d8e04e7a4bb8fb0b8939a3b714be9046fa20f` |
| Identical reviewed/merged tree | `2fc562ef34bbd4b9c1f965854ddf0aeffbaf8913`, rechecked through GitHub commit records |
| Hosted PR checks | [40964311761](https://github.com/ChrisTso77/Healthcrest-app/actions/runs/40964311761), all five jobs passed, including production-build release smoke, Chromium E2E/WebGL, Firefox/WebKit compatibility, preview measurement-off and mobile/desktop performance audit |
| Local supporting checks | Build, lint/types, 302 unit tests, 29 release-identity, 35 performance-budget and 35 structured-data cases passed; production dependency audit reported zero vulnerabilities |
| Local release smoke | All 24 checks passed at the reviewed head, including compiled/served identity under deliberately different runtime variables. Used system Chromium; Sanity DNS failures used existing fallback data, so this does not establish live CMS availability. |
| Production deployment | Vercel reported success for the merged SHA; canonical HTTP responses then carried that same SHA |
| Canonical live smoke | [40967684877](https://github.com/ChrisTso77/Healthcrest-app/actions/runs/40967684877), manual workflow on main at the merged SHA; all 24 checks passed. Expected/observed commit both `603d8e04e7a4bb8fb0b8939a3b714be9046fa20f`; mode `canonical-live`. |
| Live favicon | HTTP 200, `image/png`, complete 64×64 PNG, 2,787 bytes; SHA-256 `ec50cba97dc423f7fe1f5cf1799730ea8a936b18a136679fcb204703aab108f0` |
| Coverage limits | Preview deployed successfully, but direct preview HTTP inspection was blocked by network policy. Later canonical live smoke verifies the deployed fix. No new device/AT, legal/editorial, provider-dashboard or recovery-exercise evidence is claimed. |

### Retained failed production check

PR #123 merged as `f262542754e9336038a46392460232dae2b07a69`. Production run [40960592800](https://github.com/ChrisTso77/Healthcrest-app/actions/runs/40960592800) verified that identity and passed 21 checks, then failed the browser-tab icon fallback. Direct live inspection confirmed HTTP 200 and complete PNG bytes identical to `/icon`, but `/favicon.ico` was labelled `image/vnd.microsoft.icon`. PR #124 added the explicit PNG header and diagnostic detail without weakening assertions or changing either workflow. Keep the failed run as evidence of detection; do not describe #123's production smoke as passing.

## Historical baseline: PR #122

| Evidence | Recorded result |
| --- | --- |
| Approved release | [PR #122](https://github.com/ChrisTso77/Healthcrest-app/pull/122), both restore controls protect unsaved edits |
| Reviewed head | f10213e2ec39943398651f47dc7bf2a99d3674c3 |
| Merged main | 4309697dbdc0ffb4eeacc214102f051491c4bbf8 |
| Identical reviewed/merged tree | 1cca0d39b2841bab1f840aaf9b563e414105e7b7 |
| Hosted run | [300 / 40952956329](https://github.com/ChrisTso77/Healthcrest-app/actions/runs/40952956329), all five jobs passed |
| Unit / supporting checks | 302 unit; 35 performance-budget; 35 structured-data/SEO checks; production dependency audit reported zero vulnerabilities |
| Browser coverage | 315 Chromium and 34 Firefox/WebKit cases; preview measurement-off checks passed |
| Build release smoke | All 23 checks passed: 13 public pages, 18 citations, metadata/destinations/media and fresh-visitor assets/measurement |
| Lab evidence | Eight Lighthouse 13.6.0 profiles inspected: performance 99–100; accessibility/best practices/SEO 100; passing contrast/heading audits and empty console-error lists |
| Visual evidence | Eight restore confirmation/error images reviewed at 320px/1350px; final run images identical to reviewed images |
| Production deployment | Vercel success for merged SHA: [deployment](https://vercel.com/tsotsoft/healthcrest-app/9yf3jyeHfdAntCxRu9uh5U41d8Hq) |
| Canonical live smoke | Not established by the evidence above. Retain a separate expected-commit-bound report after an approved deployment. |

Reports are retained by Actions for 14 days. Preserve required evidence privately before expiry; links and this summary are not a permanent archive of every artifact. The run tests the PR build; it does not establish live-domain behavior or actual provider settings.

## Remaining launch requirements after #134

PR #123 delivered the preparation/release-identity batch; #124 fixed its confirmed live MIME mismatch. Later releases through #134 are also merged and its current evidence is recorded above. Approval does not extend to another PR or public launch. The canonical live identity requirement now has evidence; recovery and the other launch requirements below remain open.

| Launch requirement | State after baseline | Work that can progress now | Evidence still required |
| --- | --- | --- | --- |
| L01 supported application-security assessment | Blocked by unavailable referenced resources/preflight tooling | Record exact capability limitation and restore a supported scan environment | Completed supported assessment and resolution of launch-blocking findings; dependency audit is insufficient |
| L14 supported lint toolchain | Upstream peer compatibility blocked | Retain normal resolution/no forced peers; latest strict probe evidence in AUDIT.md | Compatible supported toolchain, or separately documented owner disposition of the maintenance gap |
| L09/L29 live release identity and recovery | L29 verified through #134 canonical live smoke; L09 recovery incomplete | Preserve expected-commit assertions and actual run provenance | Operator access, recovery point and exercised recovery evidence; a passing smoke is not a rollback rehearsal |
| L02/L03 hosting/company/privacy/provider facts | Pending owner/operator verification | Consolidated worksheet and reviewable drafts | Verified facts, suitable hosting eligibility and approved public wording; no private home address in this repository |
| L04 health-content accountability | Approver and weekly cadence confirmed; actual sign-offs pending | Immutable content approval packet | Chris's real per-content decisions and verified credential claims |
| L06/L11/D09 real devices and accessibility | Substantial automation; manual evidence incomplete | Preserve gates and prepare specific tasks | Dated browser/device/AT results and fixes/retests; lab scores are not WCAG or field-INP evidence |
| D06 external discovery/marketing | Preparation only | Existing metadata and submission instructions | Explicit authorisation before external accounts/submissions/campaigns |

Gate A remains partial, B blocked, C partial and D blocked. Optional polish does not substitute for closing these requirements. No launch date or readiness claim is implied.

## Draft candidate #137 — 12 November 2026

- PR: https://github.com/ChrisTso77/Healthcrest-app/pull/137 (draft; no merge or production approval).
- Candidate head: `aa7495a35481d1155c23943461afb53d99f9976a`.
- CI merge checkout: `1c4ceb90c18f356e1a0500ff3dcf9973384d86a4`; both share tree `bab0852ac1d21c50820ae7016942ab2b97d87c27`. Main/base remains `6dd8d57e83d39225ef57f4f26be5a253e88fa890`.
- Run https://github.com/ChrisTso77/Healthcrest-app/actions/runs/43233728546 completed successfully. All six jobs passed: lint/type/unit/boundaries, CMS seed validation, Windows synthetic backup, Chromium/WebGL/release/performance, preview measurement-off, Firefox/WebKit compatibility. Existing thresholds unchanged; no rerun requested.
- Vercel GitHub deployment `7739467846`, environment Preview, reports success for candidate head. URL: https://healthcrest-5nqj24z5q-tsotsoft.vercel.app . Build success is provider metadata, not independently observed served identity.
- Owner reports Home → Learn → Movement and Strength guide PASS; Explorer sleep 8→7.5, 2D and Guide open/close PASS, then settings restored; Planner restore confirmation/Keep my edits preserves exact synthetic text, then original field value restored. Manual save explicitly UNTESTED; existing saved copy left intact. These details supersede the initial broad all-pass reply. Browser/OS/version not captured.
- Report/log review BLOCKED: download of release-readiness and run logs receives Forbidden from the environment's artifact-storage host policy (`productionresultssa13.blob.core.windows.net`). Signed URLs are not recorded here. No underlying report metrics, exact hosted test counts, screenshots or compiled-marker values are claimed inspected. Next evidence needed: release-readiness, mobile-performance, playwright-report and browser-compatibility-report artifacts from this run.
- At the initial hosted-status checkpoint, detailed evidence review was pending; the uploaded-artifact review below now resolves that four-report gap. Supported security assessment, private CMS restore/production rollback, remaining device/AT and provider/legal gates remain open. No launch acceptance; do not equate six green jobs with full security, legal compliance or operational readiness.

Later local handoff documentation does not change the frozen PR head. Evidence is
bound to the head and run above; a future source change needs its own verification.

### Uploaded artifact review completed — 12 November 2026

All four uploaded ZIPs match GitHub's SHA-256 artifact digests, sizes, workflow run
43233728546 and candidate aa7495a. Direct download/log restrictions remain, but
these authenticated copies complete the requested four-report review. The earlier
BLOCKED report-review entry is historical and superseded for these four artifacts.

| Artifact | GitHub-matching SHA-256 |
| --- | --- |
| release-readiness | `426d4fcacb81d80159bf6b15de8381da6e5abca2a64f6ff1bfd074aea1f4c431` |
| playwright-report | `188f6d560360371ef46465e29e47234458b4251a5ce2eb872b80b3025418373c` |
| browser-compatibility-report | `52aab3f160c98bf9954d7db918555c4f84516d1188eb76d65f2c22aa4d91e7ec` |
| mobile-performance | `ec4a5b661b4ef77e30d67e548ae130cfb8755fda051558ba6c342f486a9588a9` |

- Release: all 24 checks passed. Expected, compiled and observed commits equal CI
  checkout `1c4ceb90c18f356e1a0500ff3dcf9973384d86a4`; runtime identity probe passed.
  This is localhost CI build identity, not the served Vercel preview or production.
  All 13 pages passed; 22 typed assets, zero failed/invalid assets and zero optional
  measurement requests in the fresh-visitor check.
- Chromium: 319 actual passed results, zero unexpected/flaky/skipped/global errors;
  every case has exactly one result at retry 0. New delayed-script planner regression
  passed. No hidden expected-failure annotations found.
- Compatibility: 34 actual passed results (17 Firefox, 17 WebKit), zero retries,
  failures, flakiness, skips or global errors. Linux engines are not real devices.
- Visual review: inspected 12 representative Playwright captures/portions covering
  landing, restore confirmations, forced colours, 2D/3D, comparison and guide views,
  plus all eight Lighthouse final screenshots. No new visible regression identified
  in those reviewed areas; no full-device/AT or all-page visual-conformance claim.
- Performance: re-evaluated every raw Lighthouse JSON with the unchanged repository
  assessor, correct fixed route/query and mobile/desktop profile; compared raw
  metrics with summary.json. All eight pass, including required contrast/heading,
  console, network/privacy and browser checks. Original raw values determine PASS;
  displayed table values below are rounded only for readability.

| Profile | Performance / accessibility / best practices / SEO | LCP ms | CLS | TBT ms |
| --- | --- | --- | --- | --- |
| Home mobile | 100 / 100 / 100 / 100 | 918.4 | 0.000715 | 87 |
| Start mobile | 100 / 100 / 100 / 100 | 913.9 | 0 | 87.5 |
| Guide mobile | 100 / 100 / 100 / 100 | 912.3 | 0 | 87.5 |
| Planner mobile | 100 / 100 / 100 / 100 | 919.2 | 0 | 83 |
| Explorer 2D mobile | 97 / 100 / 100 / 100 | 767.6 | 0 | 194 |
| Guide desktop | 100 / 100 / 100 / 100 | 267.9 | 0 | 11 |
| Planner desktop | 100 / 100 / 100 / 100 | 257.5 | 0 | 2.5 |
| Explorer 2D desktop | 100 / 100 / 100 / 100 | 217.0 | 0 | 4 |

Mobile 2D Explorer has only 6 ms headroom under the 200 ms TBT budget. Preserve the
threshold and original measurements; a passing run is no reason to rerun for a
better number or introduce speculative optimisation. This is single-run navigation
lab evidence, not field INP/percentiles, 3D/GPU performance or WCAG conformance.
Manual saving is still untested by the owner; the automated save/restore cases pass.
The requested technical report review passes, but separate security, operational,
provider/legal and remaining device/AT gates still block launch acceptance. No
merge, production release or gate waiver was authorised by uploading the files.

Review data/scripts and selected captures are retained under
`/workspace/work/healthcrest-artifact-review/`; raw reports/embedded Git metadata
were not copied into the public repository. The run's measurement-off job passed,
but its separate fifth artifact was not part of this upload/review request.

### Consolidated remaining-work pass — 12 November 2026

- Read-only canonical HEAD remains HTTP 200 with source marker 6dd8d57; HSTS
  max-age 63072000, nosniff and no-referrer observed. No CSP or frame header was
  present in this response. Header/resource-policy review remains partial, not a
  security clearance or a validated clickjacking finding.
- Served privacy markup has both measurement checkboxes disabled/unchecked and the
  inactive notice. This is a markup observation, not dashboard or runtime collector
  verification. No visitor choice or production setting was changed.
- Additional fresh-browser live inspection failed at managed-proxy certificate
  trust (ERR_CERT_AUTHORITY_INVALID); no TLS verification bypass was used. Zero
  recorded optional requests from that failed navigation is not a privacy PASS.
- CI raw network inventory for the eight lab profiles contains same-origin
  document/fetch/image/media/script/style resources on localhost. This is not a
  complete deployed CSP design; inline execution and provider resources need review.
- Current candidate/head/base/checks remain unchanged. The requested technical
  report gap is closed; unavailable supported scan tooling and owner/provider/
  recovery/device evidence remain distinct. No redundant application suites rerun.
- The existing runbook explicitly permits a separately approved preparation
  release while launch decisions remain open, provided the change does not depend
  on those decisions. A proposed #137 preparation release would ship the tested
  hydration/API/unused-adapter/tagline changes only. Before any approved deployment,
  the operator must confirm the Production measurement flag is false/unset and
  there are no unreviewed Production settings/dashboard changes waiting to apply.
  Current inactive markup alone does not prove those build-time settings. It would not declare launch
  acceptance or waive any outstanding gate. Production action still needs exact
  merge/deployment approval; no such approval or action is recorded by this pass.

## Approved preparation release #137 — 12 November 2026

- Owner explicitly confirmed Production `HEALTHCREST_TELEMETRY_ENABLED` absent,
  no pending Production settings changes, rollback access available to previous
  source 6dd8d57, and approval of #137 merge/resulting deployment/canonical checks.
  This is preparation-release approval, not full launch acceptance or permission
  to activate measurement, change providers, restore CMS data or incur new costs.
- Before action: PR head aa7495a, base 6dd8d57, all six CI jobs and Vercel successful;
  no source drift. Marked ready and squash-merged without admin bypass or branch
  deletion. Merge: `021341d6be51bcd6d49b7f44ab676cede64bceb2`, 15:06:06 UTC.
- Merged tree equals reviewed candidate tree `bab0852ac1d21c50820ae7016942ab2b97d87c27`;
  parent is previous main `6dd8d57e83d39225ef57f4f26be5a253e88fa890`.
- GitHub Production deployment `7741002799` reports success at 15:06:44 UTC;
  Vercel deployment `3uV3rkH7zAbtdZgP6kdmDXwqRTHr`.
- Canonical HTTP observation: www.healthcrest.uk serves X-Healthcrest-Commit
  `021341d6be51bcd6d49b7f44ab676cede64bceb2`. Served privacy markup has both
  measurement choices disabled/unchecked and the inactive notice. No configuration
  or consent choice was changed by this verification.
- Canonical workflow https://github.com/ChrisTso77/Healthcrest-app/actions/runs/43244366643
  completed successfully for that exact main SHA, with expected_commit supplied as
  the same full SHA. Its live verification step passed. No rollback was performed.
- Production report artifact metadata: production-release-readiness, 1,280 bytes,
  SHA-256 `5e9c9ecf089ac47e3e0df33e900cfeba6463476ad42d44afc664fb66ff661fe2`.
  Contents were not independently downloaded/reviewed because of the established
  storage-host policy restriction. Workflow success and direct live identity/markup
  observations are verified; individual live report counters are not quoted here.
  Preserve the artifact privately before the existing 14-day retention expires.
- Automatic post-merge CI: https://github.com/ChrisTso77/Healthcrest-app/actions/runs/43244145077 completed SUCCESS for exact merged SHA 021341d; all six jobs passed, including Chromium/WebGL and performance. No rerun or threshold change requested. Main and the canonical marker were rechecked afterwards and remain 021341d. Detailed main-run reports were not re-downloaded; reviewed PR reports cover the identical source tree.
  Separate supported security, provider/legal, actual-device and CMS/production-
  recovery requirements remain open. This release does not establish compliance,
  full public-launch acceptance or a measured recovery-time guarantee.

## Approved containment preparation release #138 — 12 November 2026
Owner approved one conditional pipeline for exact head `c283efc62f8274fbeb1ccfcf33ceb919da10f317`: publish/PR, passing hosted checks and report review, then merge/deploy and canonical verification. Recovery reference is `021341d6be51bcd6d49b7f44ab676cede64bceb2`. No provider/configuration/CMS/measurement activation scope.
- PR https://github.com/ChrisTso77/Healthcrest-app/pull/138; all six jobs in https://github.com/ChrisTso77/Healthcrest-app/actions/runs/43253496816 PASS. Vercel preview 7742340734 successful. No reruns or gate changes.
- PR synthetic merge checkout `42660e7bf6c9ae1dbeb34cffd5a623a3401bb50b` has tree `28548ab5033bda67e9aed42a6b7badc93b72081a`, identical to candidate c283efc. Expected/compiled/observed release identity matched that checkout.
- Five artifacts downloaded directly with the GitHub connector; archive bytes/size/digests match API metadata for exact head/run. Parsed reports as data. 325 Chromium, 34 Firefox/WebKit and one preview measurement-off case each passed once, retry zero; no failures/flaky/skips/global errors. All 24 release checks pass.
- Eight raw Lighthouse profiles independently reassessed using unchanged repository budgets and exact route/query/emulation; summary agrees. Max LCP 918.1276ms, CLS 0.0007147309648763568, TBT 134.5ms. Performance 99 for mobile 2D Explorer and 100 elsewhere; other categories all 100. This is navigation lab evidence, not actual-device/3D/field INP evidence. Viewed eight final screenshots and twelve Playwright image portions; no visible regression in viewed areas.
- Immutable artifact SHA-256 values:
  - mobile-performance: `27cb328ff3798fd8651d8b7f4b9774db5ba0b3d85326c06b5984172800b27eda` (3189623 bytes).
  - browser-compatibility-report: `44fd3d9e7c305183496a257aaa906f886ef6c5c824d208328b401bee00305d51` (354904 bytes).
  - measurement-off-report: `44799537d6299c531d0a6f3de12f015065fe7631002adbb4381487104f9c4db0` (217251 bytes).
  - playwright-report: `4a28a225670826104ea9512f014e830287629d6ba2c9822060157cc4596ee683` (11402014 bytes).
  - release-readiness: `e137351d446ebf75b5a5b1b440f989f0e5a1441da7c817217d7451bb53a2be09` (1302 bytes).
- Marked ready and squash-merged without bypass or branch deletion: `076a85369c1826f98b6b92ac5bad515cc9d6546e`; parent 021341d, identical reviewed tree.
- Production deployment 7742651420 reports success at 16:10:02 UTC. Canonical home/privacy/planner/presets API/favicon return expected source marker, exact CSP, SAMEORIGIN, no-referrer and nosniff; icon remains PNG. Privacy HTML contains two disabled unchecked choices and inactive notice.
- Canonical workflow https://github.com/ChrisTso77/Healthcrest-app/actions/runs/43255707119 PASS. Directly downloaded production report (1,282 bytes), SHA-256 `8238f1c2d6a5fdd1215bc44727e653592c0a8fbcb5881ce168053b9ada9ce433` matches metadata. All 24 canonical-live checks pass; expected/observed 076a853, 22 valid typed assets, zero failed/invalid assets and zero optional measurement requests. Automatic main CI https://github.com/ChrisTso77/Healthcrest-app/actions/runs/43255604123 PASS for exact 076a853; all six jobs successful, including browser and performance. Main and canonical identity/containment headers rechecked after completion, unchanged. Detailed main artifacts were not independently re-downloaded; reviewed PR reports cover the identical source tree. No rollback performed. Full launch/security/privacy/provider/device/private-recovery gates remain open.
- Follow-up evidence: the previously unavailable #137 production artifact was downloaded directly through the connector and SHA-256 verified (`5e9c9ecf089ac47e3e0df33e900cfeba6463476ad42d44afc664fb66ff661fe2`). Its summary has 24 passing canonical-live checks, expected/observed 021341d. This supersedes the prior download limitation for that artifact only.

## Local advisory/accessibility checkpoint — 12 November 2026

Continues local73f55f0; production076a853 remains separate. No production action.
Dependency investigation is documented in ../dependency-upgrades.md: no supported
compatible fix, installed advisory remains open. Full audit seven moderate entries
for one dev-only advisory; production-only audit zero; no high/critical.

Verification before the accessibility edit: lint/build/types PASS,314 unit tests
(31 files) PASS,109 backup/identity/structured-data/performance-boundary tests PASS,
23 system-Chromium policy/hydration/planner cases PASS,23 local release checks PASS.
Smoke found13 public pages,22 valid typed assets,zero failed/invalid assets or
optional measurement requests. No supplied build identity: no compiled/source-bound
release assertion claimed. No new full performance/hosted compatibility claim.

Next blocker investigated automatically: axe-core4.14 WCAG2/2.1/2.2 A/AA tag checks
on Home,Learn,Movement guide,Planner,About,Contact,Privacy and2D Explorer, at320 and
1280 CSS pixels. Initial16 runs had one serious label-content-name-mismatch on the
Explorer home link at both widths; all16 had no document horizontal overflow.
Source fix in HealthEngineHUD.tsx derives the accessible name from visible title
and subtitle plus sr-only home destination. Existing landing regression updated.
No user-visible wording, route, data/storage, health guidance, settings or asset
changed. Initial aria-label revision still failed axe; evidence preserved.

Final candidate: build,lint,TypeScript noEmit/incremental false PASS. Focused
Explorer-to-home browser case PASS (1 case); rerun affected axe scans both report
zero violations/no horizontal overflow. Fourteen unaffected initial scans had no
reported violations. System Chromium only; Firefox/WebKit launch attempts report
missing executables. This is not actual Safari/iPhone/Android evidence.

Unresolved axe checks: contrast on Home9 nodes per width; Explorer30 at320 and49
at1280. Incomplete is not PASS or a confirmed contrast violation. Manual contrast,
AT,device/touch/native downloads/printing remain pending, as does supported security
assessment and concrete privacy/provider/disclosure/recovery evidence. Existing
launch gates remain open; no compliance or full launch acceptance claim.
Logs/raw reports: /workspace/work/healthcrest-advisory/. Hosted checks and production
release are not performed for this local candidate.
