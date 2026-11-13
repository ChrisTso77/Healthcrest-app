# Gemini assessment validation — 12 November 2026

Target: ChrisTso77/Healthcrest-app, frozen
`9d5dbca88426152c3dad56c41d2db05a68acf7b9`. Source access confirmed locally.
Gemini explicitly lacked source access. Its production observations do not prove
candidate vulnerabilities. This is AI validation, not qualified independent sign-off.

| Gemini ID | Verdict | Actual evidence at frozen source / disposition |
| --- | --- | --- |
| HC-SEC-001 HIGH | FALSE POSITIVE | `app/layout.tsx:22`, `lib/privacy/measurement.ts:11`, `components/MeasurementProvider.tsx:25`: server VERCEL_ENV AND explicit flag plus per-mount/per-send consent checks. CI `.github/workflows/ci.yml:192` measurement test passed in historical run43287617779; later step202 failed on HTTP302 identity/authentication. Job name alone does not establish telemetry leakage. Separate protected verifier43316098536 passed historically. Original anonymous job remains failed; no required-check waiver. |
| HC-SEC-002 MEDIUM | CONFIRMED behaviour; exploit severity not established | `components/HabitPlanner.tsx:75,109,188`, `lib/education/downloadHabitBackup.ts:8`, `app/storage/page.tsx:25,38`: explicit plaintext local save/export, manual removal, disclosed shared-profile risk. No promised encrypted/session isolation is bypassed. No automatic TTL/deletion, encryption redesign or session migration proposed: these change retention/data integrity and need a product decision. |
| HC-SEC-003 MEDIUM | FALSE POSITIVE | `lib/education/habitDraft.ts:16`, `lib/education/habitWeek.ts:50`, `components/HabitPlanBackup.tsx:32`: bounded JSON, fixed pillar keys, type/length/date/day-enum validation, fresh object reconstruction. Unknown keys discarded rather than recursively merged. `components/HabitPlanPrint.tsx:16` renders React text; JSON export uses application/json. No prototype-pollution or HTML execution path established; Zod is unnecessary for these existing controls. |
| HC-SEC-004 MEDIUM | FALSE POSITIVE | `lib/education/habitCalendar.ts:4,18,24`, `lib/education/habitWeek.ts:19`, `lib/siteMetadata.ts:3`: strict date/time validation, fixed canonical return URL, generated timestamps and ASCII fixed content. No window.location or notes enter ICS. Existing VALARM is intentional; no attacker-controlled property injection demonstrated. Native calendar compatibility is separate. |
| HC-SEC-005 MEDIUM | CONFIRMED LOW tag subclaim; runner/permissions claims FALSE POSITIVE | `.github/workflows/ci.yml:9,58,60` uses windows-latest and contents:read; Windows job does not install npm dependencies. No self-hosted runner established. Both workflows use mutable official action tags:21 references. Proposed separate branch pins exactly those existing implementations; no runner, trigger or privilege changes. |
| HC-SEC-006 LOW | NOT VERIFIED for provider exposure; source injection claims FALSE POSITIVE | `app/api/presets/route.ts:15,22,60,176` uses token-free client and constant GROQ; slug selects normalized results rather than interpolating query text. `app/learn/[slug]/page.tsx:10,126` uses repository-owned guides from `lib/education/learningGuides.ts:14`, not a CMS Portable Text serializer; links have noopener noreferrer. `import-sanity-presets.ts:6` uses server/CLI SANITY_API_TOKEN. Seed CI is syntax-only, not a URL schema validator, but seed data does not create the claimed guide injection path. Actual dataset/editor/token permissions and deployed environment contents remain unverified. |
| HC-SEC-007 LOW | FALSE POSITIVE bypass claim | `lib/privacy/measurement.ts:15,28,47`: exact allowlist rejects uppercase/trailing-slash unknown paths; malformed/version/finite/expiry checks fail closed. Five-minute future clock tolerance exists explicitly at line22; one-day future timestamps fail. Same-origin storage mutation is not proof of a remote consent bypass. Normalizing excluded paths is unnecessary and could broaden allowed inputs. |
| HC-SEC-008 INFORMATIONAL | NOT VERIFIED for mail encryption/configuration | `app/contact/page.tsx:23` warns against sensitive disclosures; `app/privacy/page.tsx:49,51` names email processing and leaves precise retention unresolved. A mailto link proves neither absent SMTP TLS nor missing DNS controls. Provider mail/DNS, retention/deletion and rights practices need operator evidence. Do not invent immediate deletion policy or blindly set DMARC reject/MTA-STS. |

Confidence: high for cited source behaviour and counterevidence; provider/mail
configuration remains unknown. No critical/high application exploit confirmed.
The two CONFIRMED rows concern disclosed persistence and LOW tag hardening; they
must not be read as confirmation of Gemini's original vulnerability severities.

## Verification and proposal

Before the environment restart,17 focused synthetic pure-function checks passed:
backup reconstruction/prototype keys, wrong types, oversized/nested input; calendar
CRLF/encoded CRLF rejection and seven canonical events; measurement excluded path
variants, future/NaN/expiry/tolerance cases and ordinary production/preview controls.
Historical focused Semgrep run:12rules/two patched workflows,0findings/0errors.
An internal read-only patch review found no concrete regression. These executions
are recorded in this conversation; their temporary scripts/raw artifacts were lost
when the workspace reverted. They are not freshly rerun evidence or a full scan.

On resume, fetched exact frozen commit into a separate worktree and reconstructed
only21 action pin substitutions. Fresh checks: all three upstream v7 tag targets
match proposed full hashes; both YAML documents parse and compare semantically equal
after intended reference substitution; whitespace check passes. Frozen candidate
is unchanged. No application build/unit/browser repetition. Hosted action execution,
Windows/cache/artifact upload compatibility at the proposal SHA remain NOT VERIFIED.
No claim that the proposal is a hosted verified replacement candidate.

Branch: `codex/healthcrest-gemini-remediation`. Scope: two workflow files only for
code changes; documentation records the review. No push, merge or deployment.
Pinned commits address future tag movement, not malicious pinned code or downloads.
No unsupported runtime fix is proposed for disproven hypotheses.

## Remaining launch blockers and recovered-record limitation

Reported launch baseline remains17PASS/1FAIL/2BLOCKED/14NOT VERIFIED=34. The restored
checkout predates local checkpoints469cd1a/dbecd67 and lacks their current canonical
matrix/reviewer records. The candidate's older matrix is historical; its older counts
must not overwrite the reported baseline. Recover those saved documentation commits
before treating the per-row matrix as fully reconciled. No status upgraded here.

Qualified independent security/provider IAM acceptance, manual AT/physical devices,
privacy/company/retention/processor facts, monitoring/settings, safe private backup/
restore/recovery, external SEO/indexing/field performance, dev advisory disposition
and final gate acceptance remain outstanding. AI/Gemini/Copilot reviews do not close
professional independence. Original required-check reconciliation remains necessary.
