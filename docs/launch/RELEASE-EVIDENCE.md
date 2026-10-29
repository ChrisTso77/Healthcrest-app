# Release evidence and remaining launch work

29 October 2026. This ledger distinguishes completed software releases, build checks and actual launch requirements. A successful deployment does not close legal, editorial, security, accessibility or operational gates. Use [LAUNCH-CHECKLIST.md](LAUNCH-CHECKLIST.md) for acceptance, [OWNER-LAUNCH-ACTIONS.md](OWNER-LAUNCH-ACTIONS.md) for consolidated operator tasks and [PROGRESS.md](PROGRESS.md) to resume engineering work.

## Latest verified production baseline: PR #122

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

## Current batch: preparation and release assurance

The owner authorised parallel implementation after #122. This does not approve the batch merge, production deployment or public launch. Review the combined PR's immutable head, run, reports and preview before approval. Do not use baseline results above as results for the new batch.

| Launch requirement | State after baseline | Work that can progress now | Evidence still required |
| --- | --- | --- | --- |
| L01 supported application-security assessment | Blocked by unavailable referenced resources/preflight tooling | Record exact capability limitation and restore a supported scan environment | Completed supported assessment and resolution of launch-blocking findings; dependency audit is insufficient |
| L14 supported lint toolchain | Upstream peer compatibility blocked | Retain normal resolution/no forced peers; latest strict probe evidence in AUDIT.md | Compatible supported toolchain, or separately documented owner disposition of the maintenance gap |
| L09/L29 live release identity and recovery | Build smoke exists; deployed identity/rehearsal incomplete | Add build-bound commit evidence, fail live smoke on mismatch and prepare recovery steps | Actual canonical report for the approved merged SHA plus exercised recovery evidence |
| L02/L03 hosting/company/privacy/provider facts | Pending owner/operator verification | Consolidated worksheet and reviewable drafts | Verified facts, suitable hosting eligibility and approved public wording; no private home address in this repository |
| L04 health-content accountability | Approver and weekly cadence confirmed; actual sign-offs pending | Immutable content approval packet | Chris's real per-content decisions and verified credential claims |
| L06/L11/D09 real devices and accessibility | Substantial automation; manual evidence incomplete | Preserve gates and prepare specific tasks | Dated browser/device/AT results and fixes/retests; lab scores are not WCAG or field-INP evidence |
| D06 external discovery/marketing | Preparation only | Existing metadata and submission instructions | Explicit authorisation before external accounts/submissions/campaigns |

Gate A remains partial, B blocked, C partial and D blocked. Optional polish does not substitute for closing these requirements. No launch date or readiness claim is implied.
