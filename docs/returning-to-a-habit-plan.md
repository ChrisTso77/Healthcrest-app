# Returning to a habit plan

The homepage links to /next-step#return-to-plan. The planner shows an explicit Restore my plan action near its top. No draft read or restoration is performed on page load.

Both Restore my plan and Restore saved draft ask before replacing unsaved drafts, notes and seven-day check-ins for all four habits. Keep my edits is focused first and cancels without another saved-plan read; Replace edits and restore explicitly reads the saved copy through the existing validator. A clean page keeps the one-step explicit restore flow. A saved selected week receives focus and scrolls into view. Earlier saved drafts without a week focus their action field instead. Missing, malformed or blocked storage leaves current edits intact.

A reminder tracks edits since save/restore. It never claims that an unchanged starter has been saved. Editing notes, actions or a week marks changes pending; successful Save/Restore clears that marker. Removing the saved copy leaves page edits and marks them unsaved.

Save week and all drafts uses the existing save operation and explicitly states its all-pillar scope. It writes only the existing draft key, with the same version-3 schema. No automatic saving, background request, account, clinical metric or new storage key is introduced. The original save/restore/remove controls and downloads remain available.

One shared confirmation path covers both restore controls. Cancel returns focus to the opener. Missing, malformed or blocked data is described beside that opener and in the existing status region; it leaves page edits and stored bytes unchanged. Explicit save/import, removal and relevant context changes dismiss a pending restore. Without JavaScript the new action controls are hidden, and existing guidance explains that restoration/check-ins need scripting.

No medical claims are added in this workflow change. Future medical-content updates continue to follow docs/editorial-sources.md, including relevant reputable international references.

Browser checks cover homepage discovery, both entry points, safe default focus/cancellation, exact storage-read/write boundaries, clean and confirmed restore, weekly-note preservation, missing/damaged/blocked data, explicit save dismissing pending restore, and keyboard layouts at 320–1440px. The full existing tests and preview measurement boundary remain release checks.
