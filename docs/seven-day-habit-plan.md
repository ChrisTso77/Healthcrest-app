# Seven-day habit plan

This extends /next-step with one current week per pillar. Seven days is a planning window, not a claim about when a habit forms or when health changes occur. Existing NHS-backed pillar guidance continues to supply the educational context; check-in choices are personal descriptions.

## User flow

Choose an action, cue and support in the existing draft. Explicitly start a week, optionally choosing a date; a blank date uses the device's local calendar date at the moment Start is pressed. Seven calendar labels are derived in UTC from that date to avoid daylight-saving drift.

Starting copies the action/cue/support into the week. Later draft edits do not rewrite that week's history. Native expandable day rows offer optional choices and short notes, including adapted actions, rest/support and not trying it. A plain count describes recorded days; there is no adherence target or inferred health score.

A weekly review records what helped or got in the way and a possible next action. Use this action in my draft explicitly copies the next action to the draft while keeping this week's snapshot.

Clearing requires an inline confirmation, changes only the selected pillar's current page week, and preserves its draft/general reflection. Download before clearing to keep a separate copy. There is one current week per pillar and no automatic archive.

## Preparing another week

Prepare another week adds a reviewable handoff: edit the proposed action/cue/support and start date, keep the current record in an all-pillar backup if wanted, and explicitly confirm replacement. Preparation leaves current records unchanged. Only the selected pillar receives a new week with blank check-ins/review; general reflection and other pillars remain. Save is still manual. There is one current week per pillar, with downloaded backups providing separate records rather than an automatic in-app archive. See docs/planning-another-week.md.

## Storage, compatibility and boundaries

No automatic save or restore is introduced. Save on this device writes all four drafts and their current weeks to the existing healthcrest.habit-draft.v1 key with payload version 3. Versions 1 and 2 restore into version 3 in memory, preserving existing text and adding week: null; only an explicit Save upgrades stored data.

Validation bounds every field, seven-day array length, choice enumeration, start date and total raw payload. Invalid storage does not replace current edits. The 120,000-character raw limit accommodates maximum-length escaped text across all four drafts/weeks. Unknown extra properties are not copied.

Remove saved draft removes only this saved key, keeps current edits and never changes measurement choices. A blocked storage operation leaves editing and download available. Download includes the selected pillar only, both the current draft and the explicitly labelled weekly snapshot/check-ins/review.

The planner remains excluded from both optional measurement services; no check-in event or upload endpoint is added. Public storage/privacy copy covers the new saved fields. The administrative provider-processing review remains separate.

No new dependency, background reminder, account or server data store is added. The date input and disclosures are native controls; the introductory guidance remains readable without JavaScript, with the unavailable start form hidden.

## Verification

Unit checks cover migration, malformed and oversized data, snapshot copies, calendar rollover/leap dates and weekly exports. Browser checks exercise start/check-in/review, per-pillar isolation, explicit save/restore/remove, legacy migration, confirmation/copy/download, invalid storage, blocked storage, keyboard/small-screen use and no-JavaScript content.

The existing full regression suite, default-off preview test and mobile lab audits remain required before marking the PR ready.
