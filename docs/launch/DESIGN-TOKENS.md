# Public design-token inventory

The first migration preserves the approved palette, type, spacing and layout. It changes keyboard focus on two dark sections to an existing brighter palette colour. No brand redesign or new assets are introduced.

`app/design-tokens.css`, imported once from globals.css, scopes tokens to `.hc-landing`. This includes the homepage, Start, Learn, practical guides, habit planner and shared public chrome. The Explorer's slate theme and measurement dialog remain independent.

| Role / token suffix (`--hc-`) | Existing value |
| --- | --- |
| ink / muted / paper | #183b2d / #506455 / #f8f7f0 |
| surface / surface-muted / border | #fffef9 / #eaf0de / #d4dcc7 |
| primary / primary-hover / on-primary | #234e37 / #315e43 / #fff |
| accent-soft / accent-soft-hover / on-accent-soft | #d2e7b5 / #e1efcd / #173b2d |
| dark-surface / on-dark | #11372b / #edf2e7 |
| focus-ring / focus-ring-on-dark | #648c44 / #c3d99f |
| focus-width / focus-offset / focus-offset-wide | 3px / 3px / 5px |

Landing, next-step, Learn, guide and Start CSS consume the repeated values. White input surfaces, explicit black/white print rules, SVG artwork, status colours, local borders, radii, spacing and typography retain their previous definitions. This is a bounded first migration, not a complete design system.

`.hc-preview` and `.hc-plan-guidance` override the inherited `--hc-focus-ring` with `--hc-focus-ring-on-dark`. Current interactive descendants sit on the dark section background. Future nested light cards need an explicit light focus context and rendered checks. The pale colour was already used for planner evidence focus. The former dark-section ring measured about 3.35:1; the brighter treatment is an enhancement rather than a claimed contrast failure.

Browser checks measure computed outlines against their surrounding opaque surfaces, require solid rings at least 3px wide with at least 3px offset, and test a 3:1 light/7:1 dark threshold. They also exercise selection, guide navigation, editable planner input without saving and Start radio activation. Chromium retains phone/desktop focus screenshots; Firefox/WebKit run the same journey. Existing release, motion, storage and performance checks remain required. This does not establish manual assistive-technology, zoom, forced-colour or real-device conformance.

## Selection state beyond colour

`HabitSelectionMark` shares a 16px current-colour checkmark across public preview, planner selection and draft overview buttons. Only the selected mark is visible; unselected marks reserve the same space. The icon is aria-hidden because each existing button already exposes aria-pressed. It adds no visible wording or accessible-name suffix and does not override system colours. Original topic icons remain intact. Responsive controls may wrap earlier to accommodate the reserved marker; verify 320px and desktop layouts. The Explorer now reuses the marker for selected example scenarios; its existing palette, camera icon and topic/render state styles stay independent. Native Start radios retain their own state representation.

Chromium covers normal narrow and emulated forced light/dark phone/desktop selection. Firefox/WebKit cover the same switching/edit/focus journey in normal colours. These are partial automated checks, not a substitute for actual high-contrast OS themes or manual accessibility review.

## Explorer example markers

The shared marker now carries its own Tailwind size, spacing and visible/invisible utilities rather than relying on landing.css. The retained hc-selection-mark class/data attribute identify it for browser inspection. This moves no palette values into the Explorer. Example card titles wrap beside the reserved marker; accessible names still contain the exact title/category because the SVG is aria-hidden. The Example scenarios group contains the existing category groups.

The marker follows activePreset identity. Editing an input or restoring a reference keeps manual attribution even when the numbers match an example. Only explicit selection reapplies that example. Automated checks cover ordinary/research examples, forced light/dark compact/desktop 2D, normal 3D canvas/camera continuity and Firefox/WebKit compact 2D, while retaining public-marker regressions. Actual OS-theme and manual AT/device checks remain pending.

## Forced-colour decorative effects

HUD header/summary/camera/dock surfaces and native modal backdrops now disable backdrop blur under forced-colors: active, using existing Tailwind variants. Normal modes retain the original effects and palette. Initial hosted screenshots and an isolated Chromium reproduction showed unchanged text disappearing after dialog close when either blur layer remained. Compiled-style checks cover actual visible surfaces and dialog pseudo-elements; retained post-close screenshots must be inspected because DOM visibility alone did not detect the missing paint. This adds no system-colour override and establishes no real-device or OS-theme certification.

## Explorer information controls

About this Explorer and Important information open in-place dialogs; the separate Healthcrest home link navigates home. Information openers use 12px text, explicit dialog hints and at least 44px targets. Header and final close actions also use 44px targets; flexible headers wrap beside a fixed close target. Both final actions say Close and keep exploring and record no acknowledgement. Substantive content/source blocks remain unchanged; this is no legal or clinical re-review.

The ordinary footer reserve is 5.5rem (previously 5rem) to accommodate larger controls without dock overlap. Existing recovery reserve/scrolling is retained. Existing keyboard/modal/recovery/forced-colour coverage remains required alongside compact 2D/desktop 3D screenshots and session/storage checks.

## Saved-copy removal state

The planner's inline removal confirmation uses the existing muted surface, ink, border, focus and 44px button styles. Its heading describes removal of the saved browser copy; body text covers all four habits, notes/check-ins and the separate current-page/downloaded/printed copies. Keep saved plan receives focus first; Remove saved copy is a distinct final action. Failure text remains beside the actions, with the existing status announcement. Cancellation/success restore focus to Remove saved plan. No auto-read/save/restore is introduced; explicit save/restore/import and context changes invalidate a pending removal.

## Restore confirmation and feedback

Both restore controls use the same origin-aware inline confirmation when page drafts are unsaved. Keep my edits receives focus; Replace edits and restore describes the complete replacement scope. Error text stays beside the initiating control and is its accessible description; the existing live status announces the result. Successful top restoration still opens its week/action; lower restoration keeps opener focus. Existing public surfaces, borders, focus tokens and 44px controls are reused. No automatic saved-plan read or rewrite is introduced, and clean pages retain the explicit one-step flow.
