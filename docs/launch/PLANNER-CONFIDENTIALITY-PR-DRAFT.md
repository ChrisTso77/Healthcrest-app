# Draft PR: keep Planner edits in page memory and preserve legacy recovery

Owner approved architecture; isolated branchcodex/healthcrest-planner-confidentiality.
FrozenPR139/9d5dbca and production076a853 unchanged. Draft prepared locally only:
remote publication could trigger Vercel Preview deployment; no deployment authorised.

## Behaviour

All previous Planner/week saves request explicit JSON export; no new localStorage
writer remains in HabitPlanner. Edits/import/restoration remain page memory.
Legacy versions1–3 are parsed through explicit read-only recovery; original saved
bytes unchanged until explicit existing removal confirmation. Export is never
permission to delete. Old records remain sensitive; ASVS14.3.3 staysFAIL pending
legacy treatment and independent browser/security verification.

Exports remain unencrypted,user-managed files. Requests do not prove durable save;
page changes remain marked unsaved after export. Failed exports retain memory edits.
Beforeunload handler requests browser warning,link capture permits cancellation
before leaving current page. Browser-supported warnings are best effort; crashes,
OS termination,SPA history/programmatic navigation and session restoration require
further browser-specific review. No guarantee of loss prevention. No new backend,
sensitive URL payload,sessionStorage or IndexedDB persistence introduced.

Storage/privacy/backup/week wording updated together. Restore/remove confirmation
focus behaviour retained; status regions announce export failures and operations.
No browser storage encryption or automatic legacy migration/deletion implemented.

## Actual verification13November2026

- Education unit suite:130tests/10files PASS,including legacy helper/parser coverage.
- Targeted ESLint:PASS with no remaining warnings; TypeScript noEmit PASS.
- Local systemChromium/Next development build:6scenario groups PASS,versions1–3
  at320px/1280px. Actual JSON downloaded/parsed,reimported,week exported; failure
  retains text; legacy bytes unchanged and Storage write spies empty before explicit
  confirmed removal; remove cancellation and successful explicit removal checked.
  Link cancellation,synthetic beforeunload cancellation flag,one Tab focus check,
  restore Keep edits and no horizontal overflow verified.
- Initial127.0.0.1development hydration blocked by Next's dev-origin restriction;
  switched test URL tolocalhost without altering security configuration. Failure
  retained. Final6groups pass; not an assertion production/browser suites passed.

Evidence under evidence/phase14-1. Test runner scripts/planner-confidentiality-check.mjs
uses synthetic data only and a local dev server atlocalhost3019. Existing production
bundles untouched. Full optimized build,physicalSafari/Android,native refresh dialog,
complete keyboard traversal,screen-reader announcements and axe contrast scans
NOT VERIFIED. Existing browser specs tied to persistent saving need their expectations
updated before the hosted affected-suite check; those suites were not falsely rerun
or declared green. This is a reviewable implementation draft,not release-ready.

## Review / remaining gates

Review loss-warning coverage for SPA history/programmatic navigation and legacy
record exposure; revalidate provider-independent ASVS scope. All manual/privacy/
provider/recovery/SEO/advisory gates remain; matrix11PASS/1FAIL/2BLOCKED/20NOT VERIFIED
unchanged. No gate waiver or professional independent sign-off. Resolve affected
browser-suite expectations and remaining accessibility checks before publication.
