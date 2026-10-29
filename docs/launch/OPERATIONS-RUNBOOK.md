# Operations and recovery preparation

Prepared 29 October 2026. This is an operator worksheet, not evidence of an exercised recovery. Use existing GitHub, Vercel and Sanity capabilities. Owner decisions D01–D04/D07/D09 and approval of each production action remain required. Do not add paid monitoring, processors, telemetry settings or data collection through this runbook.

## Release evidence and stop conditions

Create one record for the combined release. Keep accepted reports in an existing operator-controlled location: current GitHub artifacts expire after 14 days. Never put secrets, private query strings, contact messages, planner notes or backup contents in public records.

Stop if the reviewed head/base changes, a required check fails, deployed identity differs from the approved source, canonical smoke fails, a required owner decision is unresolved, or no authorised operator can recover production. An unavailable check stays pending; a green preview/build does not resolve these conditions.

| Record field | Required evidence |
| --- | --- |
| Owner, date and approval | Named responsible person; actual approval link and its production scope |
| Source | PR, immutable head, base/main and reviewed tree |
| Integrated checks | Exact-head run, all five jobs, inspected release/browser/compatibility/measurement/performance reports and coverage limits |
| Deployments | Preview URL; after approval, merge SHA, production deployment ID/URL and deployed source/tree comparison |
| Canonical check | Live smoke run/report, origin, time, expected/observed deployed revision and actual conclusion |
| Recovery point | Specific retained deployment/source, confirmed promotion access and settings differences, without secret values |
| Follow-up | Observation cadence/owner, rollback triggers, outstanding issues and next review |

Latest reference: PR #122 merged with owner approval as `4309697dbdc0ffb4eeacc214102f051491c4bbf8`, tree `1cca0d39b2841bab1f840aaf9b563e414105e7b7`, matching reviewed head `f10213e2ec39943398651f47dc7bf2a99d3674c3`. [Run 300](https://github.com/ChrisTso77/Healthcrest-app/actions/runs/40952956329) passed all five jobs, 315 Chromium/34 Firefox-WebKit cases, 23 build smoke checks and eight lab profiles. Vercel reported [production success](https://vercel.com/tsotsoft/healthcrest-app/9yf3jyeHfdAntCxRu9uh5U41d8Hq). This is build/deployment evidence, not canonical live smoke, recovery exercise or launch acceptance. The next batch needs its own approval.

## Rehearsal before requesting launch approval

1. **Assign ownership/access.** Record who can inspect GitHub reports, inspect/promote Vercel deployments, inspect Sanity backup/restore options and handle enquiries. Verify access without copying tokens. The owner sets acceptable recovery time and tolerable CMS data-loss targets; neither is established here.
2. **Identify a recovery point.** Select a specific retained Vercel deployment and immutable source. Confirm actual promotion availability and domain behaviour under the current plan. Compare relevant provider settings; source rollback need not restore changed settings. Stop if no usable recovery point/access is available.
3. **Exercise preview journeys.** With synthetic data, follow Home → Learn → guide → Explorer → planner; save, edit, cancel restore/removal, export and re-import a synthetic backup. Verify edits/unrelated storage survive. Complete the agreed actual-device/AT matrix and record defects. Linux browser engines do not establish actual iOS/Safari or manual screen-reader coverage.
4. **Review failure evidence.** Inspect automated CMS-failure/fallback, storage-blocked and no-JavaScript cases. Do not disable production to simulate an outage. Repository fallback examples support availability; they are not a live-dataset backup.
5. **Prepare recovery without executing it.** Identify provider controls, target, verification and responsible operator. Follow the CMS preparation below. Paper/preview rehearsal proves preparation only; a real production promotion, dataset restore or setting change needs explicit approval of that action/target.
6. **Submit one release decision.** Present the integrated PR, final checks/artifacts, owner decisions, limitations and recovery point together. Approval must identify the concrete merge and resulting production deployment. This is not launch/marketing approval.

## After an approved merge

1. Record actual merge SHA; verify its tree matches the reviewed source. Inspect the Vercel production deployment tied to that SHA. Stop if it fails or points elsewhere.
2. Run **GitHub Actions → Production release smoke check → Run workflow** on intended main. Supply the required `expected_commit` as the complete 40-character merged main SHA, matching the selected workflow revision; wait for that exact Vercel deployment to succeed first. Retain the report with expected/observed release identity, origin, run URL and time. A missing/mismatched identity or failed canonical check leaves live acceptance pending; a localhost/preview report is not a substitute.
3. On https://www.healthcrest.uk, check the affected learning/Explorer/planner/error journeys with fresh synthetic data. Leave optional measurement off unless its separate checks and activation approval are complete. If activation is proposed, inspect actual settings/payloads under [measurement-rollout.md](../measurement-rollout.md).
4. Record the operator-agreed observation window/cadence and route/deployment/CMS failures or correction enquiries. Accept launch only against the outstanding gates; never enter an approval/completion date before it occurs.

## Incident triage and rollback

1. Record time, affected routes, expected/deployed revision and symptoms without visitor notes/private query values. Reproduce with synthetic data; do not require a visitor's health notes for diagnosis.
2. Classify delivery, CMS outage, functional regression, content/safety, security/privacy or optional measurement. Inspect existing logs/reports. Suspected security incidents need appropriate operator escalation and supported assessment; this runbook authorises no live penetration/load testing.
3. Pause release/wider promotion for failed canonical identity/checks, broken core journeys, suspected unexpected planner transmission or potentially harmful content. Chris handles content corrections under [EDITORIAL-REVIEW.md](EDITORIAL-REVIEW.md); urgent concerns must not wait for the weekly review.
4. Propose a specific corrective PR or known-good deployment, including settings/data differences. Obtain explicit approval for production rollback/promotion; record operator, target, time and actual result. A source revert is a separately reviewed PR.
5. After an approved rollback, verify recovered deployment/source, rerun canonical smoke against that revision and retest the affected synthetic journey. If recovery fails, stop repeated changes and escalate to the named operator. Contacting visitors/providers is not authorised by this worksheet.
6. Record duration, established cause, residual differences/risks, verification links and follow-up. Older open browser tabs may still run older code. Removing a telemetry flag requires redeployment; it does not retroactively remove loaded scripts/reports. Follow the documented measurement stop procedure.

## CMS recovery — provider evidence pending

1. In existing Sanity controls, confirm actual project/dataset, export/backup availability, retention, access and supported restore method. Record non-sensitive capability/outcome only; do not assume a backup feature or paid retention tier exists.
2. Identify a dated recovery point and newer content that would be lost. Confirm content/assets required for restoration. A Git commit or `pillars-seed-data-v3.json` is not proof of a dataset backup.
3. If an authorised non-production dataset is available, rehearse there first and record content/asset/app checks. Do not create paid resources or overwrite production. `import-sanity-seed.ts` and `import-sanity-presets.ts` write data; do not run them as health checks or recovery without a reviewed scope and explicit approval.
4. Before an approved production restore, record target, recovery point, newer-data impact, operator and verification. Any supported current-data safety copy remains within that approval; never publish exports.
5. Verify reviewed scenario identities/content and affected Explorer journeys, then canonical smoke. Source rollback may not reverse CMS changes; record source/dataset recovery separately. L09/D07 remain unresolved until actual access and agreed exercise evidence exist.

Visitor plans remain browser-local and user-managed. Deployment/CMS recovery must preserve `healthcrest.habit-draft.v1` without silent reads/writes/migrations. Server backups cannot recover local notes; downloaded/printed records are separate user-managed copies.

## Monitoring ownership — decisions pending

Use existing deployment/function errors, manual canonical smoke, CMS/fallback reports and contact channels first. Confirm responsible person and actual cadence, including provider quota checks. Never log planner text, backups or preference query values; distinguish dashboard visibility from retention/deletion. Search Console actions need D06 approval. Optional Analytics/Speed Insights are not an uptime/recovery plan.

Use [OWNER-LAUNCH-ACTIONS.md](OWNER-LAUNCH-ACTIONS.md) for the consolidated handoff. This runbook closes preparation gaps only until real access, exercise and live evidence exist.
