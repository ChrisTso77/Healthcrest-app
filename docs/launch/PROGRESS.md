# Resumable launch progress

Updated 29 October 2026. Read ROADMAP.md before each cycle. Continue safe work in reviewable branches; require explicit approval covering each merge and production deployment. Preserve manual saved-plan handling, default-off measurement, approved assets and the educational mission. Do not add unreviewed health advice, public legal claims, paid settings or data collection.

## Verified baseline
- Main: 8f4f76eb61d5d71d504a1b7e33132858c6debb9e; tree c04a1463efd92747eb158057b3accc81c464608c. PR #112 merged with owner approval and Vercel production success; its reviewed head 592be5dd5830e158c0e329b77c4dee6e83075d0b had the same tree.
- [Run 40867577849](https://github.com/ChrisTso77/Healthcrest-app/actions/runs/40867577849) passed all five jobs: 300 unit, 32 performance/configuration, 35 structured-data, 283 Chromium and 14 Firefox/WebKit cases, preview-off, build/release/dependency checks and eight Lighthouse profiles. Twenty-three release checks are proposed next; #112 passed the existing 22 across 13 pages, 18 citations and four guide preference variants. All eight lab profiles scored performance/accessibility/SEO 100, best practices 96; required contrast/heading gates passed.
- Before #112 merged, its successful Chromium report's 390px/768px 2D, desktop 2D and desktop 3D camera screenshots were inspected after workspace access returned. Labels/focus/layout matched the intended change; this is recorded screenshot evidence, not real-device/AT testing. Canonical live smoke remains unverified.
- Original /workspace/Healthcrest-app is preserved at 81758f7a50d8995747cddce585e97beea6fd6d95 on work. All tracked blobs in /workspace/healthcrest-launch-34ca713 matched the immutable main tree before this cycle. Existing installed dependencies are reused; no dependency/lockfile changes are proposed.

## Completed work
- Required launch documents, editorial/operations runbooks and performance-profile documentation exist; AUDIT.md now records eighteen findings, including opportunities and unverified risks.
- #109 introduced raw budgets and metadata/headings/fragment checks. #110 added eight profiles and required contrast/heading audit gates. #111 aligned rendered/structured guide identities and source/date/byline/trail checks.
- #112 made camera controls specific to 3D, used plain angle names/larger explanations, reclaimed desktop 2D space and verified keyboard mode/angle transitions while preserving settings. Shared-token migration remains queued.
- Owner supplied company number 15318363/England registration, hobby-first intent and Chris Tsoto content approval with at least weekly review/correction. Actual company/credential verification, suitable office arrangement and per-content sign-offs remain pending. No office address was retrieved/published.
- L14 remains blocked: current React/a11y/import lint plugin peers do not support the isolated ESLint 10 experiment. No forced peers, disabled rules, lockfile changes or tooling PR.

## Active cycle: browser-tab icon and console-error evidence (L10/L18)
Branch: codex/browser-icon-integrity. Locate its [PR and exact-head checks](https://github.com/ChrisTso77/Healthcrest-app/pulls?q=is%3Apr+head%3Acodex%2Fbrowser-icon-integrity). This authoring checkpoint does not establish later CI outcomes; actual immutable head/run/artifacts govern review. Prior approvals stop at #112.

Retained Lighthouse JSON identifies the 404 source as /favicon.ico; the 96 best-practices score did not fail the aggregate threshold. A native Next metadata icon renders the complete approved logo proportionally on the existing paper colour as a small 64px PNG. The conventional favicon address redirects locally to that same generated icon; originals are preserved. No external request, new branding asset or dependency is introduced.

All public-page release checks now require local icon metadata; a separate icon check verifies metadata targets, the single local fallback redirect, PNG signatures/completeness, 64px dimensions, a 16 KiB ceiling and actual browser decoding. Firefox/WebKit also decode the conventional fallback and attach the PNG for review. The performance validator independently requires a passing, empty errors-in-console audit: a high aggregate score or missing/contradictory evidence cannot hide errors. Three added Node cases include the recorded favicon failure.

Local type/lint, 35 performance and existing unit/SEO checks are required before publication. Hosted build/all five jobs, 23 release checks, 283 Chromium cases, 16 Firefox/WebKit cases and eight performance profiles remain required. Inspect the generated icon and compare retained report evidence before declaring the issue fixed. Manual device/AT/3D/field and broader launch gates remain open.

## Dependencies and unavailable evidence
- Local Turbopack/PostCSS build was denied a child-process port bind by the execution sandbox, including with supported network permission. Do not alter app configuration to bypass this; use hosted build evidence.
- No local browser executables or exposed browser-extension/cloud-CUA control tool. Recorded Lighthouse screenshots can be read from hosted report artifacts; they do not establish manual visual, AT, real-device or installed Safari results.
- Standard security preflight/supporting resources/tools remain unavailable. No preflight-ready source scan/report exists; dependency audit success is not application-security assurance.
- Canonical fetch was previously inaccessible and no authenticated workflow-dispatch tool is exposed. Operator-controlled live production smoke remains necessary; localhost CI is not live evidence.
- D01–D04/D07/D09 remain open for actual Hobby eligibility, company/registered-office/provider/retention facts, actual content sign-off/credentials, recovery ownership and manual device/AT checks. D06 gates external Search Console/indexing submissions and marketing. No rich-result/indexing or clinical-review certification is claimed.

## Next safe actions
1. Recheck main/open PRs/working changes. Review this branch's exact final head, all five jobs and preview; inspect the generated icon and the eight performance reports. Fix real failures without weakening existing gates.
2. Leave the verified PR unmerged until approval covers merge and production deployment. Prior approvals do not authorize the next release.
3. Continue incremental shared-token/visual-state work from recorded evidence. Actual-device/3D/interaction and manual accessibility checks need suitable tooling; do not turn lab scores into field INP or WCAG claims.
4. Restore security tooling and complete actual human editorial/operator decisions. External SEO validation/submissions require D06.
5. After an approved release, confirm main/deployed SHA and operator-controlled canonical live smoke. No launch or marketing follows automatically.

## Gates
A partial: strong automation, manual/device evidence pending. B blocked: security, trust/provider/content sign-off and manual accessibility. C partial: content/brand, representative lab evidence and expanding SEO integrity; device/field/design/review work pending. D blocked: earlier gates, eligibility/operations/live smoke and explicit release authorization. **Healthcrest is not declared launch-ready.**
