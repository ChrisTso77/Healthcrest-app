# Reviewing a backup before replacing page drafts

After a backup passes the existing validation, its preview reports how many of the four pillar drafts differ from the current page. The optional Compare the backup with this page disclosure lists changed parts per pillar and shows the page and backup next-step actions, dated weeks and week actions side by side.

Differences include exact action/cue/support/reflection text, week addition/removal, dates, week action/cue/support, daily choices/notes, review and possible next action. Equal record counts or date ranges do not imply equal notes. Comparison uses named fields rather than serialised object ordering, and includes spacing differences. Daily/reflection/review text is not repeated in the comparison.

The comparison derives from the current page and validated/migrated candidate on every render. Editing or explicitly restoring the page while a candidate is open refreshes it without refocusing the preview. It does not read the separately saved browser copy, establish which copy is newer, merge records, change validation or add timestamps.

The existing file reader, sequence/cancellation guard, preview focus, explicit Replace page drafts with backup, manual Save and current-page backup download remain unchanged. A new file clears the old preview and resets the comparison disclosure using its read revision; invalid/cancelled/superseded reads keep their existing behavior. Merely reviewing differences never changes page drafts, storage or the import payload.

No new medical claims, metrics, sources, storage keys, schema, dependencies or request endpoints are added. Existing NHS/WHO/Harvard/CDC guidance remains available independently of backup contents. Browser and unit coverage verify field completeness, notes with equal counts, immutable comparisons, live preview updates, legacy imports, keyboard/width behavior, literal rendering, cancellation and explicit save boundaries.
