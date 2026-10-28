# Printing a habit plan

Print my plan opens the browser print dialog for the currently selected pillar. The visitor can print on paper or choose Save as PDF where their browser provides it. Ctrl/Cmd+P uses the same print stylesheet. Browser print-dialog behavior remains browser-specific.

The dedicated text layout includes current page edits, the next-step draft, its extra reflection, the current week's original action, all seven daily outcomes and notes, the weekly review and the next action. Closed disclosure panels do not omit notes. Other pillar drafts are excluded. A draft without a dated week gets seven blank paper check-ins with a handwritten start-date space; printing does not create a stored week.

The print layout is hidden on screen. Print media hides navigation, the editable planner and screen controls. Long text wraps, form fields are rendered as ordinary text, and content may span multiple pages. Avoid splitting an individual daily note where the browser allows it. The layout uses black text on white with no dependence on background colours. Browser-added headers/footers and printer margins may vary.

Printing reads the existing in-memory React state. It does not read or write storage, save a draft, update check-ins or send planner contents to a server. The existing /next-step measurement exclusion remains in force. Printing failures keep edits and offer the existing text download. JavaScript-free visitors can use their browser's print command for the server-rendered starter worksheet; interactive print controls are hidden.

No clinical claims or recommendations are added. The paper copy retains the educational scope and links to /learn, whose sources include NHS, WHO, Harvard's Nutrition Source and CDC, as relevant to each guide. Follow docs/editorial-sources.md for future medical-content changes.

Browser checks cover current edits and all-pillar isolation, explicit keyboard activation at 320px, unchanged saved drafts and no outbound measurements, print-media visibility, closed check-ins, original week versus edited draft, long-text PDF pagination, literal text rendering, unavailable printing/storage, empty actions, and a JavaScript-free starter.
