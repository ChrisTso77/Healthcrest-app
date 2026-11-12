# Evidence-backed lessons

## 12 November 2026 — Reconcile current state rather than appending contradictions
- Mistake: progress continued to call #136 unmerged and backup/content decisions
  unresolved alongside later completed implementation/owner-result records.
- Evidence: [audit HC-04](AUDIT.md); pre-installation PROGRESS.md lines 21–22 and
  39 versus checkout HEAD 6dd8d57 and the same file's later dated owner updates.
- Root cause: current summary was not reconciled when later updates were appended;
  authorship and deeper process cause are not established.
- Prevention: at a meaningful boundary, update the current summary once; retain
  historical evidence with its original date/revision. Never infer deployment or
  approval solely from a commit or content-review outcome.

Append only when an evidenced mistake warrants a reusable prevention rule.

## 12 November 2026 — Test hooks must not accidentally return mocks
- Mistake: `beforeEach(() => fetchMock.mockReset())` returns the mock; Vitest 5
  treats a returned function as teardown. A rejected fetch implementation then
  failed teardown even when the API's catch branch behaved correctly.
- Evidence: new CMS failure regression in lib/presets/apiContent.test.ts failed
  with the synthetic rejection, then passed after changing the hook to a block
  body with no return (12 targeted tests passed).
- Root cause: implicit arrow-function return conflicted with hook cleanup semantics.
- Prevention: use explicit block bodies for setup hooks that mutate mocks; cover
  rejected promises so teardown errors cannot hide behind resolved mocks.

## 12 November 2026 — Prevent edits before hydration can retain change events
- Mistake: enabled server-rendered planner controls accepted a selected date before
  React retained its change event. Calendar export then used the default local date.
- Evidence: system-Chromium calendar case at 320px/Auckland exported 20261113
  instead of requested 20270326. The initial trace showed that mismatch; seven focused calendar/hydration cases
  pass after the guard. The initial temporary trace was not durably archived.
- Root cause: interactive server markup was actionable before client readiness;
  browser timing/load exposed the gap. No user-data loss incident is claimed.
- Prevention: gate planner form controls until client readiness and keep guidance/
  links readable. Retain delayed-script coverage without adding sleeps to tests.

## 12 November 2026 — Avoid address-space confounding in frame-policy tests
- Mistake: the route-fulfilled foreign parent hit Local Network Access before CSP;
  waiting for a frame response or CSP message could not test the intended policy.
- Evidence: initial browser-policy traces show a chrome-error child and the
  public-page-to-local-network denial. Five checks passed while that fixture failed.
- Root cause: the synthetic fulfilled parent was treated as public address space.
- Prevention: use a real second loopback HTTP server on an ephemeral port, with
  browser protections enabled. Require reachable target, policy-specific block and
  no rendered planner; retain same-origin editing as the positive control. All six
  cases pass after this fixture correction; no production policy was loosened.
