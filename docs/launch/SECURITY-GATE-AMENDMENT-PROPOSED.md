# Conditional security gate amendment — 13 November 2026

Status: direction APPROVED IN PRINCIPLE; exact amendment NOT ADOPTED.
Candidate9d5dbca; current recordde91811 preserved byte-for-byte. No gate/status,
source,access,procurement,merge or deployment change. Matrix11/1/2/20 remains.

## Exact proposed gate wording

“Before launch, an accountable risk-based security assurance record must identify
all applicable external obligations and demonstrate compliance with any stricter
assessment requirement. It must bind verification to the exact source/environment,
map applicable OWASP ASVS5.0.0 requirements and operational controls to reproducible
evidence, and include a targeted qualified human review independent of the
implementation. Review covers sensitive browser-data handling,public rendering/API,
measurement and provider/publishing privileges. Any necessary dynamic validation
must occur only on a separately authorised target permitted by the host and all
affected providers. No unresolved confirmed critical/high defect is permitted;
material residual risks need explicit accountable disposition and retest evidence.
An unavailable particular scanner or absence of a paid full penetration test is
not alone a failure if equivalent required coverage is demonstrated. Neither owner
acceptance nor AI/scanner output substitutes for external obligations or qualified
independent human review. Missing evidence remains NOT VERIFIED/BLOCKED. Final gate
acceptance and exact-target deployment approval are separate.”

## Obligation verification — limits and conflicts

| Category | What is established | Still required |
| --- | --- | --- |
| Legal/regulatory | Public UK GDPR Article32 uses risk-appropriate measures and regular assessment/testing; no universal paid-pentest requirement established by this text. Educational branding/local storage do not establish exemption or compliance. | Owner's actual processing,controller/service classification,applicable sector duties and any uncertain interpretation require competent review. No legal opinion or universal clearance supplied. |
| Contracts/customer terms | No stricter signed obligation supplied to repository/session. This is not proof none exists. | Owner reviews actual client/partner/NHS/data-processing/order terms and records obligation,assessment scope/frequency and dated evidence,or an accountable no-applicable-contract result. No private contract upload required. |
| Insurance | Policy/schedule/endorsements not available. | Owner/broker checks security warranties,assessment obligations and exclusions; record reference/date/outcome. Do not infer absence of insurance or waive insurer conditions. |
| Vercel | Published pentest guide permits Pro/Enterprise application testing and expressly excludes Hobby. General terms restrict Hobby to personal/non-commercial use. Existing owner eligibility confirmation retained. | No active pentest against current Hobby Preview,even with owner consent alone. Use offline/local synthetic application review with third-party calls mocked,or separately obtain a provider-permitted target/exception. No upgrade,purchase or exception request authorised. Actual account/order terms and continued intended-use eligibility need evidence. |
| Sanity | Published terms restrict access to non-public systems and bypassing controls; incorporated orders/DPA/plan terms matter. | Confirm actual plan/order/applicable terms and read-only roles. No active testing of provider infrastructure,unauthorised drafts or live CMS calls during local attack simulation. Obtain required permission for any service-affecting test. |
| GitHub/email/other providers | Current account-specific terms,orders,insurance and security permissions are not fully available. | Operator identifies applicable AUP/security-testing/data-processing terms for GitHub,GoDaddy and any additional processor; retain dated relevant restrictions. No blanket provider clearance claimed. |

Sources consulted13November:
- https://www.legislation.gov.uk/eur/2016/679/chapter/IV (Article32).
- https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/security/a-guide-to-data-security/security-outcomes (risk-based outcomes; guidance under review).
- https://vercel.com/kb/guide/penetration-testing-on-vercel (Hobby prohibition; downstream permission and own-app restrictions).
- https://vercel.com/legal/terms (Hobby use restriction; actual governing agreement must be checked).
- https://www.sanity.io/legal/tos (public general terms; correct plan/order terms must be identified).

Provider restrictions LIMIT testing permission; they do not themselves require
Healthcrest to buy a test. Prior generic “authorised Preview testing” handoffs are
superseded for active pentesting by this explicit Hobby constraint. Historical
ordinary public smoke checks are not automatically classified as penetration tests.
No retrospective provider-compliance certification is made.

## Measurable verification requirements

Pin ASVS5.0.0; enumerate all applicable Level1 requirements and selected Level2
controls after data classification. A reviewer must complete a per-ID applicability/
method/result/SHA/date/evidence/gap ledger before acceptance. The following minimum
checks are proposed,not new PASS results or a complete ASVS checklist.

| ASVS/control | Required observable evidence and acceptance |
| --- | --- |
| v5.0.0-14.2.1 | Synthetic planner text,health preferences and secrets absent from outbound URLs/query strings; inventory actual framework,API and measurement requests. Zero sensitive canary values in captured destinations. |
| v5.0.0-14.2.2 | Demonstrate sensitive data is not placed in server/CDN responses/caches; document any actual processing and cache protections. A homepage header alone is insufficient. |
| v5.0.0-14.2.3 | Synthetic notes/import/check-ins never reach trackers or other untrusted recipients across consent,withdrawal,expiry,privacy-signal and failed-storage paths. Preserve zero-canary request evidence with safe local mocks. |
| v5.0.0-14.2.4 | Data inventory classifies planner notes,backups,email/logs and sets explicit protection,retention/deletion/access/logging rules; implementation/settings evidence matches each rule. No invented deletion schedule. |
| v5.0.0-14.3.3 | This Level2 requirement prohibits sensitive data in browser storage except session tokens. Current plaintext Planner localStorage conflicts IF notes are classified sensitive. Record unsatisfied control/explicit scoped risk disposition or propose a separate design change. Do not mark N/A merely because no login exists or claim Level2 completion after accepting the risk. |
| Rendering/input controls — applicable Level1 IDs to be enumerated by reviewer | Trace every actual injection sink,JSON-LD,URL/CMS input and import/print/export boundary; demonstrate malformed/oversized/prototype/type/CRLF inputs cannot reach dangerous interpretation. Show legitimate round-trip and edit-preservation controls. Existing parser/calendar evidence reused,not rerun without gap. |
| Measurement/config/API controls — applicable IDs to be enumerated | Demonstrate default-off outside enabled production,independent expiring choices,strict public-route filtering,constant GROQ/normalized outputs and generic failures. Review CSP resource limitations and framework exposure; no false full-XSS-policy claim. |
| Operational controls outside ASVS | Named provider roles/MFA/token/dataset/environment separation,read-only access evidence,CI trust/immutable refs,dependency disposition,private recovery and minimal-data incident monitoring. Record limits separately; do not manufacture ASVS IDs for these. |

ASVS source: https://github.com/OWASP/ASVS/blob/v5.0.0/5.0/en/0x23-V14-Data-Protection.md .
Visitor account/session controls may be N/A only with recorded source rationale;
provider operator authentication is still in scope. This tailored subset is not
ASVS Level2 certification or proof that every applicable requirement is satisfied.

## Minimum independent human review and reused evidence

Named reviewer with demonstrable Next.js/TypeScript/browser/API and provider-IAM
experience,independent of implementing/approving these controls; verify relevant
qualifications,references,conflicts and attributable reporting. Competence and
independence matter,not payment status or a badge alone.

Minimum work: source-assisted threat-model/entrypoint review; injection/import/
local-data/consent/API paths; limited CSP and framework risks; GitHub/Vercel/Sanity/
email read-only configuration walkthrough; data classification and ASVS storage
conflict; dev advisory and pin proposal disposition. Source-only conclusions needing
dynamic proof remain open. Any validation uses written scope,permitted local/synthetic
or otherwise provider-approved target,limits,contacts and stop rules. No access grant,
invitation,live attack or paid commitment is authorised here.

Reuse Phase12 zero production lockfile-audit result,observed076a853 headers/identity,
digest-bound325Chromium/34compatibility/eight lab profiles,protected Preview evidence,
and source-validated Gemini findings. Dates/scope remain attached. None proves
provider IAM,privacy law compliance,complete ASVS or professional independence.
Dev advisory staysFAIL; pin proposal remains unverified on hosted runners. Historical
469cd1a/dbecd67 remain MISSING; no renewed recovery attempt or test rerun.

## Adoption and remaining decisions

Before formal adoption: owner supplies accountable contractual/insurance/sector/
provider obligation outcomes,addresses the Hobby testing constraint and sensitive
browser-storage classification,then approves this exact wording or requested changes.
If stricter obligations exist,they take precedence; inability to satisfy them blocks
adoption/launch rather than creating an automatic exception. Record approver/date/
version and retained evidence; approval-in-principle alone is not formal adoption.

After adoption,the existing gate stays open until its measurable coverage,human
review,retests and residual-risk dispositions are satisfied. Explicit risk decisions
state risk/controls/owner/date/review trigger; no critical/high waiver or pretended
ASVS PASS. Existing manual accessibility,privacy/disclosure,recovery,monitoring,
SEO/field-evidence and final deployment approval remain separate. Do not automatically
purge user plans or implement encryption as part of this policy-only task.
