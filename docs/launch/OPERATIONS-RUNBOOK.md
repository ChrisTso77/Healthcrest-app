# Operations and recovery preparation

Prepared 29 October 2026; not an exercised production runbook. Owner/operator acceptance, access and any production action remain pending D07/D08. Use existing GitHub/Vercel/Sanity capabilities first; do not add a processor, paid monitoring or telemetry settings by assumption.

## Release evidence

Before requesting release approval, identify the PR head/base, current main and all five CI job conclusions. Inspect release/mobile/compatibility/privacy artifacts and Vercel preview. Request approval for the concrete merge **and production deployment**, because main normally triggers Vercel. Never infer launch approval from a green preview.

After an approved merge, record the merge SHA and Vercel deployment linked to that SHA. The operator runs GitHub Actions → Production release smoke check → Run workflow on intended main; retain the canonical-origin report and timestamps. Check intended routes/HTTPS, not only dashboard build success. No workflow dispatch is claimed when the tool cannot perform it.

## Incident triage

1. Operator records time, affected public routes, intended/deployed revision, symptoms and scope. Avoid private query strings, emails, planner notes and backup contents in logs/screenshots/issues.
2. Check existing deployment/function errors and CI/live smoke. Reproduce with empty synthetic visitor data; do not request a person's saved health notes as a diagnostic prerequisite.
3. Determine whether the problem is delivery, CMS availability, a functional regression, content/safety or optional measurement. CMS failures should preserve usable local examples/retry, not be interpreted as a clinical signal. Use the documented default-off measurement boundary.
4. Prepare the smallest reviewed corrective PR or an owner-approved rollback. A suspected security incident needs a supported security assessment and appropriate operator escalation; no live penetration/load test is authorized here.
5. Record mitigation, verification, communication ownership and follow-up. Contacting visitors/providers or changing production is separately authorized; do not send automated messages from this checklist.

## Rollback / recovery checklist — operator verification pending

- Confirm a known-good production deployment exists, who can promote it, permissions/cost implications and expected domain behavior. Do not assume the author of a GitHub PR has this access.
- Obtain explicit approval for production promotion/rollback. If approved, promote the identified known-good Vercel deployment using the existing provider workflow; verify its commit and canonical live smoke. A source revert should be a separate reviewed PR.
- Record production-only environment changes separately; rolling back source does not necessarily restore provider settings. Do not copy secret values into records.
- Confirm actual Sanity dataset backup/export/restore options, retention, access and who can restore. No dataset write/export/restore is performed by this document. Guides and reviewed scenario wording in Git have different recovery needs from live CMS data.
- Visitor plans remain local/user-managed. Deployment rollback must preserve healthcrest.habit-draft.v1 and avoid silent writes/migrations. Do not claim server backups can restore browser-local notes.
- Schedule/perform a recovery exercise only after operator approval; record date, revision/deployment, steps, outcome and unresolved gaps.

## Monitoring and cost ownership — pending confirmation

Owner must confirm alert recipient/cadence and access for failed deployment/function requests, public route smoke, CMS outage/fallback, current quotas, indexing and correction enquiries. Minimise logged fields to necessary operational facts; never instrument planner text, JSON backups or preference query values. Do not activate Web Analytics/Speed Insights as a substitute for an operational plan. Distinguish dashboard visibility windows from deletion/retention commitments.

Required exercise record: owner, date, intended and recovered commit/deployment, alert/diagnostic source, authorization, recovery duration, canonical live-check run, CMS recovery evidence and follow-up issues. All entries are pending until observed.
