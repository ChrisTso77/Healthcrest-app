# Optional measurement rollout

This combines the Web Analytics and Speed Insights installations originally proposed separately in #89 and #88. Neither enabling a dashboard feature nor merging this code alone starts optional collection.

## Deployment and visitor boundaries

- Both SDKs are disabled unless HEALTHCREST_TELEMETRY_ENABLED is exactly true and VERCEL_ENV is exactly production. Leave the flag unset until the checks below are complete.
- Preview/development builds remain disabled even with an opted-in browser and an enabled flag.
- Set the flag for the Production environment only, then redeploy. Static output captures the server setting at build time; changing a dashboard variable alone does not update an existing build.
- The visitor must separately allow usage statistics and/or performance measurement on /privacy. Defaults are off; there is no consent wall and no preselected permission.
- Choice storage lasts until cleared/changed, but permission expires after 180 days. GPC and DNT requests, expired/malformed records and unavailable storage prevent collection.
- Every beforeSend re-reads the current permission and location. This blocks late callbacks after withdrawal, expiry, storage failure or entering a private route. Successful choice changes reload the document to remove previously loaded scripts/handlers.
- Failed saves deny measurement for the current document and attempt to remove only the measurement record. Habit drafts are never read or changed.
- Only /, /learn, /start, /engine, /about, /contact and /storage can be measured. New routes require an explicit source/privacy review.
- /next-step, /privacy, APIs and unknown routes are excluded. URLs are rebuilt from the same-origin allowlisted pathname, dropping query strings/fragments and extra event fields. Custom analytics events are rejected.
- Potentially sensitive incoming referrers block collection. A no-referrer HTTP header and metadata policy also prevent this site's outgoing requests exposing its page address.
- There is no measurement of selected pillars/preferences, draft contents, reflections, clinical scores or custom interactions.

## Operator checks before activation

1. Confirm the Analytics and Speed Insights dashboard states; these have not been independently inspected. Enable only the basic features intended for this rollout, without custom events or additional paid settings.
2. Review actual Vercel processing terms, recipients, transfers and operational-log retention, plus Sanity and the exact GoDaddy email product. Complete the remaining administrative record in docs/privacy-notice-draft.md and update public information where needed.
3. The owner confirms Hobby. Vercel restricts Hobby to personal, non-commercial use: https://vercel.com/docs/plans/hobby. Check whether this Healthcrest Ltd site qualifies; do not assume eligibility or silently upgrade the plan.
4. Current reporting access: Hobby Analytics one month; basic Speed Insights 24 hours/seven days. These are dashboard windows, not event/log deletion deadlines. Vercel says it may retain analytics longer for upgrades. Do not promise 24-hour deletion based on session hashes.
5. Review basic quotas in the linked provider pricing docs before activation. No paid Plus settings or custom sampling/extended metrics are introduced here.
6. Set the production switch only after those checks. Use a fresh browser with synthetic, non-health text for a live network check. Verify no /_vercel collector script/request before permission; verify each separate permission and withdrawal; confirm queries/fragments/private routes and sensitive referrers never appear in actual requests. Do not enter real health notes.
7. Inspect actual deployed proprietary collector payloads and initiators, not just page counters. Check that other Vercel dashboard injection/settings have not introduced an additional integration that bypasses this application's gates.
8. Confirm the public notice matches the activated services. A provider's cookie-free description does not establish that all privacy obligations are satisfied.

## Verification scope

Unit tests cover strict choices, expiry, deployment gates, URL/referrer allowlists, field removal, custom-event rejection and independent permissions.

Production-build browser tests use the actual installed Next SDK components and their beforeSend registration, with a deterministic intercepted transport fixture. They cover absence of SDK loads before permission, independent opt-in, filtered synthetic POST bodies, withdrawal, private-route navigation, failure states, keyboard/small-screen controls and JavaScript-disabled content.

The fixture does not reproduce or verify Vercel's proprietary hosted collector serialization, backend retention, dashboard configuration or legal eligibility. The live synthetic check above remains necessary before activation.

A separate CI build sets the operator flag true with VERCEL_ENV=preview and an already opted-in browser, proving previews remain disabled. Normal CI also runs the full existing regression suite, lint, types, unit tests, dependency audit and mobile lab audits.

## Disable and rollback

Visitors can withdraw either permission on /privacy; this does not erase already received aggregate reports. For an operator stop, remove/set false the production flag and redeploy; also disable the relevant dashboard services if appropriate. Existing open documents need reload to receive a new deployment setting. Do not claim that changing an environment variable retroactively stops every already-open browser tab.

A code rollback can restore the previous release. Choice records are independent of planner storage and never auto-enable an integration lacking the deployment and visitor gates.

References checked 28 October 2026:
- https://vercel.com/docs/analytics/redacting-sensitive-data
- https://vercel.com/docs/speed-insights/package
- https://vercel.com/docs/analytics/limits-and-pricing
- https://vercel.com/docs/speed-insights/limits-and-pricing
