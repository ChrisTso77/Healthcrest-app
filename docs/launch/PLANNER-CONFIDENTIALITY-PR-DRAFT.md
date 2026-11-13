# Draft PR: Planner page-memory editing, explicit exports and legacy recovery

## Problem and resulting behaviour

Potentially sensitive Planner notes were written to plaintext browser storage.
The approved redesign keeps new edits, imports and restored working copies in page
memory. Save controls request explicit JSON exports. Existing versions 1–3 remain
available through read-only recovery; only separately confirmed removal deletes
the historical saved key. Export does not grant removal permission or prove that a
file was retained. Exports are unencrypted, sensitive, user-managed files.

Branch: `codex/healthcrest-planner-confidentiality`, based on `49e780a`; previous
implementation checkpoint `f06f95e`. Frozen PR #139/candidate `9d5dbca` and production
`076a853` are unchanged. This draft is prepared locally: pushing this branch or
opening a PR may trigger Vercel, so neither is performed without separate Preview
publication authorisation.

## Navigation and recovery

Supported Next.js `Link.onNavigate` guards replace document-wide click interception.
Planner links, shared chrome and the measurement notice use the same guard. Dirty
edits survive cancelled internal links, native reload and full-document programmatic
navigation in local Chromium. Beforeunload warnings depend on browser support and
user activation. Back/Forward and SPA programmatic routing cannot universally be
cancelled: a persistent export-first warning explains this. No synthetic history,
router monkey patch, Navigation API dependency or global DOM interception is added.
Pillar switching preserves drafts; imports, restoration and week replacement retain
explicit review/cancellation controls.

Browser tests deliberately importing an exported JSON file into legacy localStorage
are labelled compatibility fixtures; those test setup writes are not application
persistence. Separate spies verify zero application Storage writes across editing,
recovery, import, successful export and failed export before explicit removal.

## Verification and limitations

See [Phase 14.2 verification](PLANNER-CONFIDENTIALITY-VERIFICATION.md) and the checked-in
synthetic evidence directory. All execution is local; no hosted, production or
physical-device results are implied. Automated axe and keyboard/focus assertions
support accessibility but do not replace actual screen-reader or device evidence.

ASVS 5.0.0 V14.3.3 remains **FAIL** overall. The redesign removes new durable Planner
writes; existing plaintext records remain readable to same-origin code until their
owner explicitly removes them. Active-page XSS can access memory and exports;
no encryption, XSS immunity or automatic migration/deletion is claimed. Qualified
independent human review, legacy disposition and browser-specific validation remain.
The frozen-candidate matrix stays 11 PASS / 1 FAIL / 2 BLOCKED / 20 NOT VERIFIED.

## Owner publication action

After reviewing the local checkpoint and evidence, explicitly authorise publishing
this isolated branch/draft PR and its separate protected Vercel Preview. Do not
modify or merge PR #139. Production deployment requires a separate release decision.
