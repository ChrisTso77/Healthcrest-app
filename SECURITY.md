# Healthcrest security assurance policy

Adopted by explicit owner decision13November2026. Replaces only the broad internal
professional/paid penetration-test prerequisite; no external obligation is waived.
Frozen release candidate9d5dbca remains unchanged. No purchase,access grant,provider
change,merge or deployment is authorised by policy adoption.

## Adopted launch security gate

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

## Mandatory interpretations

The exact approved amendment text was checked against all ten adoption conditions:
its external-obligation precedence,independent human review,permitted testing,
retesting/evidence and separate release approval are consistent. The following
explicit conditions govern any ambiguity; the owner's conditions take precedence.
- Penetration testing against Vercel Hobby deployments is prohibited. Owner consent
  alone cannot override provider restrictions. No paid upgrade or exception implied.
- Nonconforming controls remain FAIL or NOT VERIFIED as evidence supports; risk
  acceptance never converts technical nonconformance into ASVS compliance.
- Unresolved legal/contractual/insurance/provider obligations remain evidence gaps;
  adoption does not certify their absence. Stricter applicable requirements bind.
- Qualified independent human review,necessary permitted validation,retesting and
  attributable residual-risk sign-off remain mandatory. AI/scanners are supporting
  evidence only. A particular unavailable tool does not automatically block other
  valid coverage,but missing coverage is never waived.
- Scope every PASS to its stated control/source/date/environment. Policy adoption
  does not change the canonical matrix status counts or signify launch acceptance.

## Data classification and control disposition

Planner action/reflection/daily/weekly free text is classified HIGH CONFIDENTIALITY,
POTENTIALLY SENSITIVE PERSONAL DATA. Users can enter identifiable health-related
information; actual special-category legal treatment depends on content/context,
not merely an educational label. JSON/text/printed exports inherit the classification.
Consent preferences and technical logs are separate inventories,not anonymous by
assumption. Public educational CMS content is public,but integrity-critical.

ASVS5.0.0-14.3.3: FAIL for the supported case of sensitive text explicitly saved
in browser localStorage. Evidence: frozen components/HabitPlanner.tsx:75–81 stores
JSON; lib/education/habitDraft.ts:5 includes reflection/week; app/storage/page.tsx:25,38
discloses persistence/unencrypted copies. The selected Level2 requirement prohibits
sensitive browser-storage data except session tokens. Warnings/manual save/no login
and risk acceptance do not satisfy it. See CONTROL-ASSURANCE-REGISTER.md.

Recommended treatment: independent reviewer assesses minimisation/non-sensitive-only
use versus an explicitly approved storage redesign. Preserve existing user data and
manual save/restore/removal; do not silently expire,purge or migrate plans. Do not
claim passphrase encryption alone establishes ASVS compliance or blocks same-origin
XSS. Record any approved residual risk as accepted NONCONFORMANCE,not a technical
PASS; any change needs its own source identity and focused integrity/security retest.

## Adoption boundaries and records

Original decision docs/launch/SECURITY-ASSURANCE-DECISION.md atde91811 is unchanged.
Exact proposed wording at ee7ddc7 is preserved in SECURITY-GATE-AMENDMENT-PROPOSED.md
as historical proposal; this file is the current canonical policy. Obligation
verification checklist in that proposal remains open. Internal independent review
requirement continues under the narrowed gate. Existing non-security gates and
actual required-CI-check policies remain binding. No full ASVS certification claim.
