# Planner confidentiality design — 13 November 2026

Preparation on isolated codex/healthcrest-planner-confidentiality,base7bf46db.
Frozen9d5dbca/PR139 and production076a853 untouched. No deployed behaviour change.

## Options and recommendation

| Option | Security / ASVS | Preservation and experience | Complexity / maintenance / cost |
| --- | --- | --- | --- |
| A: minimise inputs | Generic fixed choices reduce collection; action/cue/support/reflection/day/review text can all contain sensitive information. Removing only reflection is insufficient. Warnings cannot enforce non-sensitive content. | Existing notes must remain explicitly recoverable/exportable; loss of free-form planning value. | Low-to-medium code cost; content/accessibility and compatibility work; no service cost. |
| B: encrypted local vault | AES-GCM authenticated encryption with reviewed passphrase derivation,random salt/nonce,versioned envelope and non-persisted user secret could improve locked-at-rest confidentiality. IndexedDB versus localStorage is not protection by itself. Do not infer ASVS14.3.3 compliance from ciphertext storage. | Wrong passphrase/corruption must never replace originals. No reset/recovery without a separately user-held recovery copy. Never persist keys with ciphertext; unlocked memory/XSS/device compromise still exposed. | Highest complexity,crypto/browser/key lifecycle/recovery/accessibility testing and ongoing review. No server required but substantial engineering/maintenance. Not preferred initially. |
| C: page memory + explicit export — preferred | No new sensitive drafts in localStorage,sessionStorage,IndexedDB,cookies,URL or telemetry. SessionStorage is not selected: still browser storage and browser restoration can persist it. Memory remains visible to XSS/device access. | Refresh/tab close can lose edits; explicit JSON/text/print export remains user-controlled and unencrypted. Legacy saved copy must be recoverable without mutation. Requires replacing save UX and warning/confirmation paths. | Smallest architecture,existing import/export/parser reuse; no database/login/service/key infrastructure or recurring operating charge. Targeted QA still required. |

Choose C subject to explicit approval of the changed durable-save contract. This
is not a new ASVS PASS: live/frozen persistence remains unchanged,and legacy
sensitive localStorage stays exposed until its owner explicitly removes it.
Exports may sync through browser/OS/cloud providers outside app control. No claim
that tab close reliably clears browser/OS memory or history. Native browser/session
restore,crash recovery,extensions and assistive-technology behaviour require review.

## Existing paths and compatibility

HabitPlanner saveDraft serializes all four pillars into healthcrest.habit-draft.v1
only on explicit save. Restore parses that key after an unsaved-edit confirmation;
Keep my edits cancels before reading. Remove requires confirmation. Backup import
is size/schema bounded,previews content and applies only explicitly; it does not
save automatically. JSON/text/calendar/print exports have distinct privacy scopes.
Version1/2/3 records normalize in memory; original bytes are not migrated in storage.

## Safe implementation boundary

Added recoverLegacyHabit: injectable getItem-only dependency,explicit-call-only
helper returning available/missing/invalid/unavailable. No storage writes,deletion,
network or automatic invocation. Not wired into UI yet. Tests exercise real parser,
all supported versions,Unicode/whitespace/literal markup,oversize/malformed data,
denied reads and zero write/remove/clear calls. Existing UI/storage remains intact.

After owner approval: replace every save entry point,including HabitWeekPlan save,
with explicit backup/export action; retain page-memory editing and stale-read guards.
Keep legacy restore/export controls explicit and labelled as old saved copy; loading
must preserve original bytes and unsaved edits. No overwrite of legacy key with new
page data. Offer existing explicit remove only after user choice,never on load,
import,export success or deployment. Verify export readability before suggesting
removal; cancellation/errors always preserve old and current copies. No automatic
TTL,destructive transformation or forced migration. Existing users need no conversion
to recover version1/2/3. App cannot recover lost user-managed export files.

Before shipping: browser tests intercept every browser persistence API; synthetic
canary edits/imports must cause zero new durable writes or outbound disclosures.
Cover legacy restore/Keep edits/export/remove cancellation,failed download/storage,
refresh/tab navigation warnings,keyboard/screen-reader announcements and actual
Safari/Android file workflows. Review session-restoration limitations. Page-close
warnings are best effort; do not promise loss prevention or equate file-click with
a verified durable download. Update privacy/storage/help/calendar return wording
and existing tests together. No broad suite before the UI architecture is approved.

## Remaining operator/reviewer evidence

Vercel: read-only roles/MFA/environment/flag/log settings; no Hobby pentest.
Sanity: published dataset exposure,editor roles/token scopes,applicable terms.
Email: operator access/MFA,known domain/mail protections,retention/deletion/rights.
Contracts/insurance: actual requirements or accountable no-applicable-term outcome.
Retention: classify all copies,owner removal/export lifecycle and provider rules.
Independent human: review classification,legacy residual risk,chosen UX,local
validation and source-bound retests before gate disposition. No facts repeated,
accounts granted,paid service or legal compliance inferred. Existing matrix remains
11PASS/1FAIL/2BLOCKED/20NOT VERIFIED; ASVS14.3.3 remainsFAIL in control register.

Decision required: approve C's change from device-save to explicit export,retaining
read-only legacy recovery and user-confirmed removal. No destructive migration is
proposed. Until approved,stop at tested preparation,not full implementation.
