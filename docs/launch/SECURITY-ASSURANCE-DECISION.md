# Proposed security assurance decision — 13 November 2026

Status: PROPOSED, owner approval required. Target9d5dbca; production076a853.
Current checkpoint67414db. No matrix/gate/required-check change or release approval.

## Decision and origin

Recommend a risk-based assurance gate with a targeted qualified independent human
review, rather than an unconditional full paid penetration test. Payment is not
itself assurance. No basis established for declaring AI/scanners alone equivalent
to human independent assessment. This recommendation changes nothing until approved.

Earliest located Git evidence:5cdb224, docs/launch/LAUNCH-CHECKLIST.md Gate B requires
“Supported Standard security audit/threat model completed”; the same gate survives
6dd8d57/43365db. docs/agent/AUDIT.md HC-03 identifies unavailable Codex Standard
resources/preflight, not a statutory pentest requirement. This is an internal
technical assurance criterion, not proof of a professional service obligation.
Later owner Phase8/9 directives explicitly required qualified independent review;
Phase10/13 commissioned engagement preparation while withholding purchase approval.
Thus independent human review is now owner-directed internal policy; a mandatory
full paid pentest was not established by those instructions. Missing historical
commits remain MISSING; this trace uses available Git records and conversation,
not a reconstructed original or proof of the complete earlier policy history.

No supplied contract, insurer requirement, sector-regulator instruction or provider
term mandates a paid test. Absence from available records does not prove absence of
external obligations. Owner must check actual contracts/insurance/provider terms
and intended service classification; obtain professional advice for uncertainty.
No conclusion of legal compliance or exemption is made.

## Risk and data-flow assessment

| Boundary | Observed design and residual exposure |
| --- | --- |
| Public Next.js pages/API | Educational site; no visitor login/private planner API. GET presets uses fixed GROQ and normalized data. Public rendering/API/framework attack surface remains. Health-content integrity and availability matter. |
| Planner | Explicit browser-local save; unencrypted localStorage and downloaded files can contain sensitive health-related text. Shared profiles and same-origin XSS can disclose it. No server database does not mean no privacy risk or no possible controller responsibility. Maintain warnings, bounded imports, manual deletion and data-integrity controls. |
| Telemetry/requests | Production environment/flag and separate expiring consent gate measurement; query filtering and sensitive-route exclusions. Hosting receives technical requests regardless of optional telemetry. Provider retention, transfers and settings remain unverified; do not equate cookie-free with no personal data. |
| Email | GoDaddy Business Basics owner-reported; visitors may send sensitive information despite warnings. Retention, access, transport/domain safeguards and rights processes require operator evidence. A mailto link does not establish encryption status or special-category processing compliance. |
| CMS/deployment | Sanity published reads; editor/token/IAM permissions and dataset visibility need review. GitHub/Vercel compromise could alter every page and read browser data through malicious scripts. Cloud vendors do not remove application/operator accountability. |

Engineering risk judgement: limited public server transaction surface, but meaningful
confidentiality/integrity risk from browser notes, unsolicited email, third-party
processing and privileged publishing. Not a clinical records platform on observed
scope, and not automatically low risk because educational or non-commercial.
Assess actual processing and DPIA screening where appropriate; no high-risk/DPIA
threshold determination is certified here.

## Authoritative guidance and ASVS scope

- [ICO security outcomes](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/security/a-guide-to-data-security/security-outcomes): measures/testing depend on processing and risk; regular evaluation remains necessary. It does not prescribe one paid test for every site. ICO notes this guidance is under review following legislative changes; recheck at a concrete legal decision.
- [UK GDPR Article32](https://www.legislation.gov.uk/eur/2016/679/chapter/IV): appropriate security and regular testing/evaluation are risk-based duties, not a generic supplier-purchase requirement. This is not a legal applicability opinion.
- [NCSC penetration testing](https://www.ncsc.gov.uk/guidance/penetration-testing): use competent experienced testers, scoped engagement and follow-up; a point-in-time test does not replace ongoing security. Government CHECK recommendations are not automatically Healthcrest obligations.
- [OWASP ASVS5.0.0](https://github.com/OWASP/ASVS/blob/v5.0.0/5.0/en/0x03-What-is-the-ASVS.md): verification requirements and risk-prioritised levels guide the assessment, not a mandated commercial product or guarantee.

Proposed ASVS scope: pin5.0.0, cover every applicable Level1 requirement and select
Level2 requirements for sensitive browser data, input/output, API, configuration,
transport and privacy. In particular assess sensitive-data classification/handling,
untrusted-party transmission and retention/logging controls (V14.2), alongside
browser script/encoding safety, file parsing, consent and failure modes. Record each
requirement ID, applicability rationale, method, evidence, result and gap. Account/
session/MFA requirements may be N/A for absent visitor accounts, not for provider
operator accounts; assess provider IAM separately. DNS,email operations,backups and
CI/CD need complementary operational assurance, not fabricated ASVS coverage.
Do not claim full ASVS Level2 certification/completion for a selected subset.
If server-side sensitive records,accounts,clinical workflows or integrations are
added, reassess all applicable Level2 requirements and deeper testing before release.

## Options

| Route | Value / limits | Appropriate decision |
| --- | --- | --- |
| Full professional penetration test | Stronger adversarial dynamic investigation with competent assessor; contractual scope/coverage, fee and retest required. Still point-in-time, cannot certify privacy/legal compliance or all provider controls. No quotation/availability known. | Required if an actual external obligation demands it, or risk/assessor findings justify broad exploitation testing. Not established as a universal prerequisite now. |
| Targeted independent human review — recommended | Manual source-assisted review of browser/import/rendering/telemetry/API plus owner-led provider-IAM/config review; bounded synthetic validation and retest where necessary. May be paid or genuinely qualified pro-bono; no price assumption. | Proportionate to current architecture if scoped gaps are resolved and residual risks accepted explicitly. Not an unqualified peer or scanner report. |
| AI reviews + independently sourced automated tools + owner acceptance | Useful reproducible technical evidence at low monetary cost; tools' independent authorship is not organisational independence. Misses business/context/provider facts and novel exploit chains. | Possible internal assurance model only after explicit policy approval and demonstrated coverage/competence; not recommended alone for currently unresolved sensitive-data/provider boundaries. Cannot override external duties. |

## Evidence, gaps and incremental free checks

Existing: Phase12 fresh production-only lockfile audit zero vulnerabilities; observed
production identity/containment headers; digest-bound325Chromium/34compatibility and
eight passing navigation lab profiles; exact protected Preview report; bounded
Gemini validation. Historical reports remain labelled historical; AI is not sign-off.
The CSP lacks full script/resource restrictions. Dev advisory remainsFAIL; action
pin proposal1b7153a is local,not hosted-verified. Shared-profile storage is disclosed.
No Copilot report supplied. No critical/high exploit validated is not absence proof.

Missing: scoped manual/AT/device evidence; provider/editor IAM; actual email/log
retention and deletion; private restoration; external SEO/field data; independent
coverage judgement and original required-check reconciliation. Matrix11/1/2/20 stands.

Useful next free work, only if it closes a specific gap: owner-led read-only MFA/
role/token/dataset/environment walkthrough; current-history secret scan of commits
added since the last retained scan; workflow policy lint of the pin proposal and
approved hosted checkout/cache/upload verification; narrow synthetic source tests
for identified ASVS gaps; operator DNS/mail configuration inspection with known
selectors; incident and recovery tabletop without writes. Do not repeat the fresh
audit,existing browser/performance runs or missing-history search. GitHub hosted
CodeQL may be available for a public repo,but this integration's403 does not establish
configuration; activation/access changes need approval. Scanners or a paid upgrade
are not prerequisites for every alternative check. These checks are proposed,not run.

## Proposed replacement gate — approval text

Replace the internally chosen requirement for a particular Standard scan/full
professional test with: “An accountable, source-bound risk assessment and applicable
ASVS verification record covers the actual application and operational boundaries;
a qualified human independent of implementation reviews sensitive client-data,
public API/rendering/measurement and provider privilege controls. Necessary bounded
validation and fixes are retested. Any external obligation remains binding.”

Before PASS: owner confirms external-obligation review; source/environment identities,
coverage and exclusions documented; no unresolved confirmed critical/high defects;
material findings and dev advisory have permitted explicit dispositions; human
reviewer attributable and competent; privacy/retention/processor facts verified;
security/recovery controls supported by evidence. Unknowns stay NOT VERIFIED or
BLOCKED. Existing non-security gates remain separate. No blanket acceptance of
missing evidence,independence,required checks or critical/high defects.

Acceptance records identify risk,likelihood/impact,controls,remaining exposure,
owner/approver,scope/date,review deadline and trigger. Monitoring must have a named
responder/cadence,provider alerts and minimal-data incident logs,dependency/security
advisory review and change-triggered reassessment. Do not log plans/notes/backups or
activate telemetry as an uptime substitute. Test recovery safely when authorised.
Reassess on new accounts/server storage,health-data collection,new processors,
a significant release,incident or credible vulnerability. No automatic expiry of
user data or new policy invented by this decision record.

Owner decision requested: approve narrowing to the proposed risk-based gate with
targeted qualified human review,conditional on confirming no stricter external
obligation. Until explicit approval,the existing professional assessment gate stays
BLOCKED. Approval of this proposal would change policy only; it would not mark the
gate PASS,appoint an assessor,authorise spending/access,merge PR139 or deploy.
