# Explorer keyboard accessibility follow-up

16 November 2026. Branch `codex/healthcrest-explorer-accessibility`.
Base: production merge `00f74a2a44feaff039f17723392c6cde682d54dc` (#146).

## Scope and acceptance

Medium-risk, integration-specific accessibility improvements under the existing
approved-design brief. Preserve the layout, reviewed guidance, original Body Scanner,
Planner/persistence and measurement boundaries. No dependencies or services added.

Lesson navigation previously retained focus on navigation controls; on the final
step the primary button disappears and Next becomes disabled, losing usable focus.
Now a user-requested step change focuses the newly rendered lesson heading after
React commits it. Initial render and unrelated settings changes do not move focus.
The existing habit-selection focus behavior remains intact. Re-selecting the same
step does not move focus. All step entry controls share this behavior.

Slider accessible names now remain stable as their values change; `aria-valuetext`
continues to expose the value/units. Existing visible bounds and educational limits
are associated through unique `aria-describedby` IDs in lesson, drawer and advanced
controls. Visible copy and input validation are unchanged.

## Verification

- `npm run build`: PASS.
- `npm run lint`: PASS.
- `tsc --noEmit --incremental false`: PASS.
- Public Explorer integration suite: 27 PASS, two prototype-only gate cases skipped
  (public gate coverage is provided by integration cases). Includes onboarding,
  scenarios, responsive axe checks at 320/390/768/1440px, original scanner content
  comparison, optional 3D and storage boundaries.
- Extended keyboard acceptance at 390px and 1440px: two PASS. Covers Next and
  Previous at both boundaries, the disappearing final primary action, direct
  lesson selection, keyboard slider change, associated drawer/advanced guidance
  and drawer focus restoration.
- Scanner component/assets: no diff against base; no shared modal, clinical,
  Planner, storage, measurement, routing or dependency changes.
- Build/test logs: `/tmp/healthcrest-accessibility-{build,lint,types,browser,keyboard}.log`.

The browser suite exercised the existing CMS fallback when external DNS failed;
this does not verify live CMS availability. Manual screen readers, physical devices,
actual browser 400% zoom and field performance remain NOT VERIFIED. Automated axe
and focus assertions do not establish full WCAG compliance. Existing launch gates
remain open.

## Release boundary and recovery

Local candidate only. No push, preview deployment, merge or production action is
performed for this follow-up. Repository AGENTS.md requires explicit push/deployment
approval. Review this diff before publishing it. After release approval, recovery
is a reviewed revert; there is no data migration or stored-data change.
