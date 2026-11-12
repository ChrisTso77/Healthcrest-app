# Focused Healthcrest security review

Apply only to affected boundaries; this checklist does not replace the required
supported launch security assessment (L01).

- CMS/API: fixed/parameterised GROQ, bounded and normalized output, repository-
  reviewed educational claims, safe failure responses and no sensitive raw logs.
- Planner/import: validate untrusted JSON and size, reject malformed versions,
  preserve edits on failure/cancel and prevent stale asynchronous file application.
- Storage: explicit save/restore/removal, scoped keys, protected unsaved edits;
  unrelated storage and downloaded backups remain unaffected by local deletion.
- Measurement: production flag plus separate valid consent, privacy signals,
  expiry/withdrawal, safe URL/referrer rules; no notes/backups/health-event payloads.
- Rendering: escaped structured data, safe links and preserved accessibility/error
  fallbacks; review actual resources before proposing CSP/header changes.
- Supply chain/operations: inspect changed dependency/CI permissions and release
  identity checks; synthetic backup tests do not demonstrate actual restoration.
- HIGH risk: document invariant, positive/negative/failure and relevant isolation
  tests, review actual diff and disclose residual risks. Keep production access,
  restores, privilege changes and gate modifications behind explicit approval.
