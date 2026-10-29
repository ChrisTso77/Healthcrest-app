# Resumable launch progress

Updated 29 October 2026. Read ROADMAP.md before each cycle. Continue safe work in reviewable branches; require explicit approval covering each merge and production deployment. Preserve manual saved-plan handling, default-off measurement, approved assets and the educational mission. Do not add unreviewed health advice, public legal claims, paid settings or data collection.

## Verified baseline
- Main: 7b596049c4ff5f731318b4d7516c6228f5220ad9; tree a75dbf619f3413ae9cf5b3fbe516dd106bfa7162. PR #116 merged with owner approval and Vercel production success; reviewed head 7ac29018e583bd39854a4d2c8bbf34f7b33e6235 had the same tree. The owner explicitly requested the next development phase after this merge; a subsequent merge/deployment still requires approval.
- [Run 40901184598](https://github.com/ChrisTso77/Healthcrest-app/actions/runs/40901184598) passed all five jobs: CMS, production build, lint/types/dependency audit, 302 unit, 35 performance-budget, 35 SEO, 294 Chromium and 16 Firefox/WebKit cases, preview-off and 23 release checks. Coverage included 13 public pages, 18 guide citations and four public-preference guide variants.
- Eight Lighthouse JSONs were inspected: performance 99–100 and accessibility/best practices/SEO 100 throughout, passing console/contrast/heading gates. Comparison-summary screenshots at 320/390/1350px were inspected; restore/close controls remain visible while the dialog scrolls. These are build/lab/artifact results, not canonical live smoke, real-device or manual AT evidence.
- Original /workspace/Healthcrest-app is preserved at 81758f7a50d8995747cddce585e97beea6fd6d95 on work. All tracked blobs in /workspace/healthcrest-launch-34ca713 matched the immutable main tree before this cycle. Existing dependencies are reused; no dependency/lockfile changes are proposed.

## Completed work
- Required launch documents and review/operations runbooks exist; AUDIT.md now records twenty-two findings/opportunities, including remaining unverified risks.
- #109 introduced raw budgets and metadata/headings/fragment checks. #110 added eight profiles and required contrast/heading gates. #111 aligned rendered/structured guide identities and source/date/byline/trail checks.
- #112 clarified cameras/2D space. #113 fixed the favicon and strengthened console-error gates. #114 shared plain habit-topic names. #115 added explicit restoration of all starting inputs while preserving view/camera/reference and saved plans. #116 placed a compact semantic comparison table before the optional detailed instructions. Shared-token migration starts in this cycle.
- Owner supplied company number 15318363/England registration, hobby-first intent and Chris Tsoto content approval with at least weekly review/correction. Actual company/credential verification, suitable office arrangement and per-content sign-offs remain pending. No office address was retrieved/published.
- L14 remains blocked by lint-plugin peer compatibility. No forced peers or dependency migration was introduced. The existing image-renderer img exception is specific to PNG generation.

## Active cycle: shared public palette and clearer keyboard focus (L08/L22)
Branch: codex/public-focus-tokens. Locate its [PR and exact-head checks](https://github.com/ChrisTso77/Healthcrest-app/pulls?q=is%3Apr+head%3Acodex%2Fpublic-focus-tokens). This authoring checkpoint does not establish later CI outcomes; actual immutable head/run/artifacts govern review. Prior merge approvals stop at #116.

A scoped design-token file centralises the existing public palette and outline dimensions across the homepage, Learn, guides, planner and Start styles. Existing colours/layouts and the independent Explorer theme are preserved. Dark homepage preview and planner guidance inherit a brighter existing pale-green focus colour. The former ring already exceeds 3:1 against the dark surface; this is an improvement opportunity, not a verified contrast failure. See DESIGN-TOKENS.md for the exact scope and deferred work.

Two Chromium cases and a shared Firefox/WebKit case exercise keyboard focus/activation across all five public surfaces, checking actual rendered outline width/offset and contrast against surrounding opaque surfaces (at least 3:1 on light, 7:1 on dark). Start checks the focused radio label. Tests type a search, open a guide idea and edit a planner action without saving, checking storage remains empty. Chromium retains phone/desktop screenshots of dark preview, light guide and dark planner focus. Existing saved-plan, motion and measurement suites remain required.

Local lint/types, 302 unit, 35 performance-budget and 35 SEO checks passed. Hosted build/all five jobs remain required. Expected counts: 302 unit, 35 performance-budget, 35 SEO, 296 Chromium, 18 Firefox/WebKit, 23 release checks and eight profiles. Inspect final focus screenshots and all performance reports before declaring the PR ready. These automated checks do not complete manual AT, real-device, forced-colour or zoom review; broader launch gates remain open.

## Dependencies and unavailable evidence
- Local Turbopack/PostCSS build was denied a child-process port bind by the execution sandbox, including with supported network permission. Do not alter app configuration to bypass this; use hosted build evidence.
- The resumed environment now has /usr/bin/chromium. An isolated local HTTP/Chromium reproduction worked with supported network permission; this is not the Next production build or a real-device/AT check. No exposed browser-extension/cloud-CUA tool or installed Safari is established. Hosted artifact screenshots remain available for review.
- Standard security preflight/supporting resources/tools remain unavailable. No preflight-ready source scan/report exists; dependency audit success is not application-security assurance.
- Canonical fetch was previously inaccessible and no authenticated workflow-dispatch tool is exposed. Operator-controlled live production smoke remains necessary; localhost CI is not live evidence.
- D01–D04/D07/D09 remain open for actual Hobby eligibility, company/registered-office/provider/retention facts, actual content sign-off/credentials, recovery ownership and manual device/AT checks. D06 gates external Search Console/indexing submissions and marketing. No rich-result/indexing or clinical-review certification is claimed.

## Next safe actions
1. Recheck main/open PRs/working changes. Review this branch's exact final head, all five jobs and preview; inspect public-focus screenshots and all eight performance reports. Fix real failures without weakening existing gates.
2. Leave the verified PR unmerged until approval covers merge and production deployment. Prior approvals do not authorize the next release.
3. Continue incremental shared-token/visual-state work from recorded evidence. Actual-device/3D/interaction and manual accessibility checks need suitable tooling; do not turn lab scores into field INP or WCAG claims.
4. Restore security tooling and complete actual human editorial/operator decisions. External SEO validation/submissions require D06.
5. After an approved release, confirm main/deployed SHA and operator-controlled canonical live smoke. No launch or marketing follows automatically.

## Gates
A partial: strong automation, manual/device evidence pending. B blocked: security, trust/provider/content sign-off and manual accessibility. C partial: content/brand, representative lab evidence and expanding SEO integrity; device/field/design/review work pending. D blocked: earlier gates, eligibility/operations/live smoke and explicit release authorization. **Healthcrest is not declared launch-ready.**
