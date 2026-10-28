# Finding a draft across pillars

See all four pillar drafts opens an optional overview above the editor. It shows each current page action, current week's dates and action when present, and days with a check-in. Each card opens the matching pillar and focuses its editable action. The existing pillar buttons retain their labels and behavior.

The overview uses the existing page drafts; it never reads saved records on its own. Initial starter ideas are labelled as page drafts, with explicit instructions to restore if the visitor wants the saved copy. Only opening the overview renders its cards. Hiding it removes those cards from the accessibility tree and DOM. The panel stays open while selecting, editing, restoring or importing, so it always derives the current values.

A next-step draft may differ from the immutable current-week action; both are labelled separately. Check-in counts reuse summarizeHabitWeek, including notes-only days and excluding whitespace-only notes. No streak, combined score, target, health outcome or cross-pillar ranking is introduced. Visitors can focus on a single pillar. No new clinical content or references are added; the existing evidence panel retains NHS, WHO, Harvard and CDC context.

There are no automatic saves, new storage keys, schema changes, accounts or outbound requests. Selection and overview visibility do not mark a draft as saved or write browser storage. Restoring/importing and starting another week continue to use existing explicit controls. Daily notes and reflections are not copied into the overview.

Without JavaScript, the overview is hidden along with the existing interactive plan controls; the selected starter and educational guidance remain readable. Browser coverage checks fresh-page versus saved-copy behavior, live actions and check-in counts, replacement flows, selected-pillar/focus behavior at 320/1440px, literal rendering and private-text isolation, blocked storage and the no-JavaScript fallback.
