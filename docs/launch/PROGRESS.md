# Resumable launch progress

Updated 29 October 2026. The owner authorised parallel launch-readiness work and a coherent combined release review after PR #122. Prioritise remaining launch requirements over cosmetic feature cycles. Require explicit approval of the new merge and resulting production deployment; no public launch is authorised by development work.

Read ROADMAP.md, RELEASE-EVIDENCE.md and LAUNCH-CHECKLIST.md together. Preserve Healthcrest's educational mission, canonical https://www.healthcrest.uk, manual saved-plan handling, default-off independent measurement and approved assets. Do not publish unreviewed health advice, invented legal/provider claims, private office details or new data collection.

## Verified production release and current cycle

- Main is `603d8e04e7a4bb8fb0b8939a3b714be9046fa20f` after owner-approved PR #124. Reviewed head `1f84a9598000823369789da09a8b12541bdf43f5` has the identical tree `2fc562ef34bbd4b9c1f965854ddf0aeffbaf8913`.
- PR [#123](https://github.com/ChrisTso77/Healthcrest-app/pull/123) delivered launch preparation and build-bound release identity. Its canonical smoke failed the favicon MIME assertion; #124 fixed the confirmed header mismatch and preserved every release assertion and both workflows.
- [PR CI 40964311761](https://github.com/ChrisTso77/Healthcrest-app/actions/runs/40964311761) passed all five jobs. [Canonical live run 40967684877](https://github.com/ChrisTso77/Healthcrest-app/actions/runs/40967684877) passed all 24 checks with expected/observed commit equal to merged main. Detailed evidence and the retained failed #123 run are in RELEASE-EVIDENCE.md.
- Direct production inspection confirmed HTTP 200, `image/png` and complete 2,787-byte 64×64 favicon bytes. This closes L29's deployed-identity evidence gap for this release, not recovery rehearsal or launch acceptance.
- The `docs/verified-production-release` branch reconciled the resumption/operations/gate records with those actual outcomes in documentation only.
- That reconciliation merged with explicit owner approval in #125 as `534325ea71f901a4a90b677691a087a48e56b270`; reviewed/merged trees matched. All five PR jobs passed in run 40968534850, and canonical live run [40969499299](https://github.com/ChrisTso77/Healthcrest-app/actions/runs/40969499299) passed all 24 checks with matching identity. The #124 ledger above remains evidence for that specific release.
- Current development branch `harden/response-content-types` adds the observed missing `nosniff` response header and checks declared MIME types on loaded scripts/styles alongside the existing release assertions. This is scoped header hardening; L01's supported assessment and a broader resource-specific CSP review remain pending. #125 merge approval does not apply to this new change.

## Security/tooling reassessment

The Standard security skill was re-read after #124. Its required `references/scan-prologue.md` resource still fails to read, and no security preflight/start/scan tools are exposed. The skill requires a ready preflight before source review or workers; no supported scan started, no report was generated and L01 remains blocked. No speculative lint dependency probe was repeated: L14 remains unchanged until a supported candidate exists.

## Dependencies and unavailable evidence

- Earlier sandbox build failures are historical: #124 local production build and all 24 smoke checks passed with supported network permission and system Chromium. Hosted CI also passed; neither result establishes real-device/AT coverage.
- Local Chromium can support isolated checks, but no actual iPhone/Safari, screen-reader/device access or full manual accessibility matrix has been established.
- Standard security skill is readable, but referenced scan-prologue and preflight/start/scan tools are unavailable. No preflight-ready source assessment or security report exists. Dependency audit success is not application-security assurance.
- Authenticated GitHub CLI dispatch is available and was used for successful canonical run 40967684877. Retain the report before the 14-day artifact expiry; no durable private archive is established here.
- Hosting eligibility, company/office disclosure arrangements, actual provider/retention/rights facts, content sign-offs/credentials and recovery ownership remain open (D01–D04/D07/D09). Use OWNER-LAUNCH-ACTIONS.md to resolve them together. Do not request or record the private home address in public GitHub.
- Owner confirmed no professional office arrangement yet and access to iPhone/Safari, Android/Chrome, Windows and Mac. Actual checks and screen-reader access remain pending. Legacy markerless recovery points cannot pass the new identity smoke; retain the limitation and separate provider/source/manual verification rather than weakening the check.
- External SEO accounts/submissions/campaigns require D06; there is no automatic marketing or launch after this batch.

## Next actions

1. Review this evidence reconciliation; preserve the historical #122 baseline and failed #123 run without attributing their results to #124.
2. Restore supported security preflight/resources for L01. Do not substitute dependency audit or an improvised report for the required assessment.
3. Close actual owner/security/device/recovery requirements using OWNER-LAUNCH-ACTIONS.md. Canonical smoke is complete for #124; access, recovery exercise, provider facts and human content/device checks remain pending.
4. Prepare a concrete change only when evidence supports it. Keep optional polish deferred. Future merge/deployment approval must identify that release; #124 approval does not carry forward.

## Gates

A partial: strong automation, manual/device evidence pending. B blocked: supported security assessment, trust/provider/content sign-off and manual accessibility. C partial: useful journeys, source-linked content and representative lab/SEO evidence; editorial/device/external evidence remains. D blocked: earlier gates, eligibility, recovery/operator evidence and explicit launch acceptance; canonical live smoke passed for #124. Healthcrest is not declared launch-ready.
