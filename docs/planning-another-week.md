# Planning another week

Prepare another week offers an explicit handoff from the current week. The action begins with the weekly next-action note when present, otherwise the current draft action (or the current week's action if the draft is blank). Cue and support begin with the editable draft. The visitor can change every field. A blank start date uses the device calendar when Review new week is pressed; explicit dates use the existing bounded date/week validation.

The preparation is temporary UI state. It does not edit the current week/draft, save browser storage or appear in backups/printing. Save or backup while preparing still operates on the existing current plans. Review creates a proposed seven-day snapshot and focuses a confirmation heading showing its dates and action.

Download backup of current plans uses the same validated all-pillar JSON download as the existing backup controls. It includes current page drafts and all four current weeks, including the old week's check-ins and review; preparation fields are excluded. The visitor should check the download has finished saving if they want to retain the old record. Starting another week does not create an in-app archive: there remains one current week per pillar. A backed-up record can be re-imported through the existing manual flow.

Only Replace with this new week updates the selected pillar's page draft action/cue/support and current week. New daily check-ins, weekly review and next-action fields start blank. General reflection and the other three pillars stay unchanged. The page is marked unsaved; only explicit Save changes browser storage. The confirmation states these consequences, and cancellation from either stage preserves the current plans and restores focus.

Returning to editing focuses the new-action field. Confirming focuses the current-week heading. Clearing, switching pillars, successful Restore and file Import discard stale preparation/clear-confirmation UI, so an old proposal cannot silently survive a data replacement. No automatic download, save or restore is added.

The shared backup helper preserves existing download validation, filename, cleanup and error behavior. Version-3 payloads, the existing key and 120 KB file limit are unchanged. No dependency, upload, telemetry event, clinical target or health score is introduced. Future health-content changes continue to follow docs/editorial-sources.md and appropriate UK/global sources.

Browser checks cover backup/recovery of an old week after replacement, seven blank new check-ins, preservation of other pillars/reflection, manual save/restore, cancellation/editing/focus, invalid actions, leap-day and device-calendar year boundaries, blocked downloads/storage with no outbound data, stale proposals after restore/import/pillar switching, and 320/1440px keyboard layouts. The full backup, print, release and privacy suites remain required.
