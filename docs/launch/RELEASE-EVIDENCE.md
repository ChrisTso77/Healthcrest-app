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
