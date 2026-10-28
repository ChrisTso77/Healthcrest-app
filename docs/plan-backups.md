# Manual plan backups

The planner's Download all-pillar backup creates healthcrest-plan-backup.json from current page memory. It includes the selected pillar and all four drafts, reflections and current weeks (their original action/cue/support, dated daily outcomes/notes and weekly review/next action). It includes unsaved edits. Export validates and normalizes through parseSavedHabitDraft, writes no local storage and sends no request. Text download and printing remain selected-pillar copies; the JSON backup is the all-pillar transfer format.

To move a plan, manage the downloaded file yourself, open the planner on the other device and choose the file. The browser reads it locally with File.text; there is no form submission, upload API, account or automatic sync. The file is not encrypted by Healthcrest. Local browser copies and downloaded/printed copies are managed separately, as the public storage/privacy pages explain.

Files must be non-empty and at most 120000 bytes. The existing parser checks supported versions, selected pillar, all four drafts, bounded fields and complete valid seven-day records. Unknown versions, invalid weeks and malformed data fail without changing page edits or browser storage. Extra properties are discarded by normalization. Existing version-1/2 draft payloads migrate in page memory and export as version 3; the browser-storage key and schema are unchanged.

Selecting a valid file displays a summary and focuses its heading. No drafts are applied until Replace page drafts with backup is chosen. The explicit replacement covers all four pillars. Cancel keeps edits/saved data and returns focus to the file input. Import places validated data in page memory, marks it unsaved, resets the weekly transient controls and focuses its selected week or action. Only a later Save writes the existing browser key.

A request sequence prevents a cancelled, superseded or unmounted file read from reopening an older preview. Reading failures leave edits intact; the file input is reset so the same file can be chosen again. Blocked local storage does not prevent file import/export. The existing planner measurement exclusion remains in force. Backup controls are hidden without JavaScript, while the starter guidance and browser print worksheet remain available.

Browser coverage exercises round-tripping across independent browser profiles, current-versus-saved isolation, explicit save/restore, cancellation, size/schema/date/field validation, earlier versions, blocked storage/read failure, asynchronous read ordering, literal notes and no outbound planner/measurement requests, focus and 320/1440px layouts. Existing release, privacy, print and regression checks remain required.

This adds a workflow for a person's own notes, not new health guidance. Future clinical-content updates continue to follow docs/editorial-sources.md, including appropriate reputable UK and global references.
