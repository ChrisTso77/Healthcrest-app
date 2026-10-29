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

`HabitSelectionMark` shares a 16px current-colour checkmark across public preview, planner selection and draft overview buttons. Only the selected mark is visible; unselected marks reserve the same space. The icon is aria-hidden because each existing button already exposes aria-pressed. It adds no visible wording or accessible-name suffix and does not override system colours. Original topic icons remain intact. Responsive controls may wrap earlier to accommodate the reserved marker; verify 320px and desktop layouts. The Explorer and native Start radios retain their existing state representations.

Chromium covers normal narrow and emulated forced light/dark phone/desktop selection. Firefox/WebKit cover the same switching/edit/focus journey in normal colours. These are partial automated checks, not a substitute for actual high-contrast OS themes or manual accessibility review.
