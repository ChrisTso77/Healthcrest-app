# Resumable launch progress

Updated 29 October 2026. The owner authorised parallel launch-readiness work and a coherent combined release review after PR #122. Prioritise remaining launch requirements over cosmetic feature cycles. Require explicit approval of the new merge and resulting production deployment; no public launch is authorised by development work.

Read ROADMAP.md, RELEASE-EVIDENCE.md and LAUNCH-CHECKLIST.md together. Preserve Healthcrest's educational mission, canonical https://www.healthcrest.uk, manual saved-plan handling, default-off independent measurement and approved assets. Do not publish unreviewed health advice, invented legal/provider claims, private office details or new data collection.

## Verified baseline

- Main: 4309697dbdc0ffb4eeacc214102f051491c4bbf8. PR #122 merged with owner approval; reviewed head f10213e2ec39943398651f47dc7bf2a99d3674c3 and merged main share tree 1cca0d39b2841bab1f840aaf9b563e414105e7b7. Vercel production succeeded. Full evidence and limits: RELEASE-EVIDENCE.md.
- Run 300 / 40952956329 passed all five jobs: builds, CMS, lint/types, production dependency audit, 302 unit tests, 35 performance-budget checks, 35 structured-data/SEO checks, 315 Chromium and 34 Firefox/WebKit cases, preview measurement-off and 23 release checks.
- All eight lab profiles and eight restore confirmation/error screenshots were inspected. This is not a canonical live report, actual-device/AT evidence, field performance or a completed application-security assessment.
- The original /workspace/Healthcrest-app checkout remains untouched. A fresh source snapshot at /workspace/healthcrest-launch-batch-4309697 was copied only after all 230 tracked blobs matched the immutable main tree. Dependencies are reused; the tooling probe has its own isolated workspace.

## Active cycle: parallel launch-readiness batch

Branch: codex/launch-readiness-batch. Find its [PR and final-head checks](https://github.com/ChrisTso77/Healthcrest-app/pulls?q=is%3Apr+head%3Acodex%2Flaunch-readiness-batch). This authoring checkpoint does not establish later hosted outcomes; the PR's immutable final head, run and artifacts govern review. Prior merge approvals stop at #122.

Independent workstreams:

1. **Release verification (L29):** bind canonical smoke to an expected full deployed commit, expose a validated build-bound response marker and retain harness/run/expected/observed provenance. Missing or wrong identity must fail instead of attributing checks to an unintended build. Preserve existing page/privacy/browser/performance checks and manual dispatch. Actual canonical execution requires the approved deployment.
2. **Operations (L09/L13):** an ordered access/release/recovery rehearsal, stop conditions, evidence records and consolidated OWNER-LAUNCH-ACTIONS.md. Preparation is not an exercised rollback, CMS recovery or provider verification.
3. **Editorial preparation (L04):** a concise CONTENT-APPROVAL-PACKET.md tied to immutable source, guides/scenarios/shared-copy scope and blank actual review decisions. Chris's promised weekly cadence is not completed content sign-off.
4. **Security/tooling reassessment (L01/L14):** supported scan references/preflight remain unavailable, so scanning did not start. Latest lint plugins still exclude ESLint 10; strict non-mutating resolution fails ERESOLVE. Package manifest/lock/config remain unchanged. Record these gaps and stop speculative work rather than weakening checks.

The roadmap now uses coherent batches, independent file ownership, combined diff review and one final integrated hosted suite. Further small visual refinements are deferred while launch blockers remain open. AUDIT.md records twenty-nine findings/opportunities/evidence gaps; L28 is verified merged and L29 is the active release-identity gap.

## Verification to complete before review

- Local 302 unit, 35 performance-budget, 35 structured-data/SEO and 29 new release-identity checks passed; combined lint/types passed. Independent release correctness review found no blockers. Final hosted build/all five jobs and artifact review remain required.
- Independently review build-time header capture, runtime immutability, full SHA validation, GitHub PR synthetic-merge vs Vercel main identity, workflow input handling and reports on failure. Keep all existing five hosted jobs and final-head builds.
- Review the final combined head's hosted 24-check release report, 315 Chromium/34 compatibility cases, preview-off results, eight raw lab reports and Vercel preview. Do not substitute #122 artifacts for this batch.
- Check documentation links and distinguish completed baseline evidence, prepared work and actual owner/device/live evidence. Only then mark the PR ready; leave it unmerged pending approval.

## Dependencies and unavailable evidence

- Local Turbopack/PostCSS builds previously failed a child-process port bind under the sandbox, including supported network permission. Do not alter application configuration to bypass this. Hosted builds are authoritative.
- Local Chromium can support isolated checks, but no actual iPhone/Safari, screen-reader/device access or full manual accessibility matrix has been established.
- Standard security skill is readable, but referenced scan-prologue and preflight/start/scan tools are unavailable. No preflight-ready source assessment or security report exists. Dependency audit success is not application-security assurance.
- No authenticated workflow-dispatch connector is exposed. The owner must run the canonical production smoke workflow after an approved merged SHA is deployed and retain its report.
- Hosting eligibility, company/office disclosure arrangements, actual provider/retention/rights facts, content sign-offs/credentials and recovery ownership remain open (D01–D04/D07/D09). Use OWNER-LAUNCH-ACTIONS.md to resolve them together. Do not request or record the private home address in public GitHub.
- External SEO accounts/submissions/campaigns require D06; there is no automatic marketing or launch after this batch.

## Next actions

1. Integrate the independent workstreams, review the complete diff and run the combined head through all required checks.
2. Present one concrete PR with verified results and a concise owner-action list. Do not pause for separate approval of each independent minor change.
3. After explicit merge/deployment approval, recheck head/base/jobs, merge with expected head SHA, verify reviewed/merged tree equality and production status, then obtain the operator's expected-commit-bound canonical smoke report.
4. Close real owner/security/device/recovery requirements with recorded evidence. Revisit blocked lint compatibility only when a supported candidate exists. Do not resume optional polish as a substitute for launch acceptance.

## Gates

A partial: strong automation, manual/device evidence pending. B blocked: supported security assessment, trust/provider/content sign-off and manual accessibility. C partial: useful journeys, source-linked content and representative lab/SEO evidence; editorial/device/external evidence remains. D blocked: earlier gates, eligibility/operations/canonical live smoke and explicit launch acceptance. Healthcrest is not declared launch-ready.
