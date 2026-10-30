# Launch roadmap

Read AUDIT.md and PROGRESS.md before each cycle. Preserve the educational mission, canonical https://www.healthcrest.uk, manual planner storage and default-off independent measurement. A checked task is not a passed release gate. [RELEASE-EVIDENCE.md](RELEASE-EVIDENCE.md) separates verified releases from outstanding launch requirements.

## Current priority: remaining launch evidence

The latest owner-approved release is #134, merged as `be24c69c9ef78d0646dae4133df899d0eded4589`. All five PR jobs and [canonical run 41061693500](https://github.com/ChrisTso77/Healthcrest-app/actions/runs/41061693500) passed, with all 24 live checks and matching expected/observed identity. RELEASE-EVIDENCE.md preserves the #123 favicon failure and #124 fix as historical evidence. Remaining priorities are supported security assessment, owner/provider/content decisions, actual-device/AT checks and recovery evidence.

The owner approved parallel work and one coherent release review on 29 October 2026. Prioritise closure of launch blockers over further cosmetic refinements. Run independent tooling, release-testing, operations and editorial-preparation work concurrently; integrate and review their changes before the final full hosted run. Do not repeat speculative blocked migrations or present prepared documents as exercised operations.

| Workstream | Current outcome / next evidence |
| --- | --- |
| Security / tooling | Supported security preflight/resources remain unavailable (L01). Latest stable lint plugins still exclude ESLint 10; a strict resolver probe fails, so preserve supported strict resolution and unchanged rules (L14); later approved compatible updates are recorded in ../dependency-upgrades.md. These are explicit unresolved items, not successful audits/migrations. |
| Release testing | L29 verified through #134 canonical live smoke, including the fallback PNG response. Preserve expected-commit, failure/provenance, browser, privacy and performance gates for each later release. |
| Operations | Prepare one ordered access/recovery/release rehearsal and owner worksheet (L09/L13); actual dashboard checks and any approved production exercise remain pending. |
| Editorial preparation | Bind a concise per-content approval packet to immutable source revisions (L04); Chris must actually review and record decisions. |

Manual device/assistive-technology evidence, hosting eligibility and legal/provider facts remain launch requirements. The batch cannot independently supply these. Defer optional design/content expansion and commercial features until the required launch evidence is resolved.

## Ranked backlog

| Priority | Task / audit IDs | Dependency | Acceptance and next evidence |
| --- | --- | --- | --- |
| P0 | Supported threat-model-driven security assessment (L01) | Security preflight/tooling | Retained validated report, boundary/coverage limits, no unresolved Critical/High findings or explicit launch blockers. |
| P0 | Hosting eligibility, company/privacy and human editorial sign-off (L02–L04) | Owner D01–D04 | Verified records and approved changes; no invented details or automatic paid upgrade. |
| P1 | Performance budgets and stronger release smoke (L05/L07) | Existing CI | Merged in #109: raw-boundary tests, all five CI jobs, 20 release checks/66 fragments and two mobile budgets passed at the reviewed head; preserve these gates. |
| P1 | Supported ESLint tooling (L14) | Compatible peer dependencies / migration review | Strict reassessment still fails on latest plugin peer ranges; retain strict peer resolution, current lint rules and the explicit maintenance gap. Revisit only when a supported candidate exists, then require clean install without forced peers and preserved lint/type/unit/hosted gates. |
| P1 | Accessibility matrix / confirmed Explorer findings (L06/L15) | Browser/AT/device access | Merged #110: desktop camera contrast/heading fixes and mandatory audit rules; record remaining manual keyboard, screen-reader, zoom/reflow, forced-colours, touch and reduced-motion tasks before sign-off. Merged #118: public selection checkmarks survive substituted colours. Merged #119: Explorer example markers/manual attribution and restored forced-colour text after dialog close. Merged #120: plain information controls and touch/header fit. Merged #121: saved-copy removal confirmation and safe default focus. Merged #122: both restore controls protect unsaved edits; 315 Chromium/34 compatibility cases and all five jobs passed. |
| P1 | Representative mobile/desktop lab and interaction profiles (L11) | First budget baseline | Merged #110: eight navigation profiles across five routes, with corrected-head reports inspected; actual 3D/device and interaction profiling remain pending. Keep field INP separate; never remove working 3D for a score. |
| P1 | Operations, CMS recovery and launch rehearsal (L09/L13) | D07, provider access | Document incident ownership/log redaction/rollback, CMS recovery and post-deploy smoke; exercise only authorized operations. |
| P2 | Structured-data and crawl/indexability contracts (L07/L16) | Current article/visible-content review | Merged #111: shared guide trails/byline and rendered WebSite/Article/BreadcrumbList/source/date consistency, including public preference variants. External validation/indexing requires D06. No invented dates or medical-service/review claims. |
| P2 | Shared design tokens and states (L08) | Screenshot/contrast baseline; D05 for changed branding | Merged #112: plain 3D angles, 3D-only controls and expanded 2D space, with hosted keyboard/layout and four inspected screenshots. Merged #114: plain topic names across Explorer/entry surfaces, preserved keys/slugs/settings and inspected mobile/tablet/desktop/compact 3D layouts. Merged #117: first scoped public palette/focus migration, documented inventory and rendered keyboard/contrast checks (L22). Merged #118: non-colour selection markers across public habit buttons. Merged #119: independent Explorer markers and forced-colour decorative-effect safeguards. Merged #120: plain dialog labels and consistent information/close targets. Merged #121: matching removal confirmation and keyboard/error states. Merged #122: unified restore confirmation, origin focus and nearby error feedback. Explorer/status/spacing/type tokens remain deferred. |
| P2 | Reversible Explorer comparisons (L20) | Captured comparison values / manual reducer state | Merged #115: atomic restoration of all starting inputs, preserved reference/topic/view/camera and saved plans, manual provenance and keyboard focus; all five jobs and inspected compact dialog screenshots passed. |
| P2 | Mobile comparison reading order (L21) | Retained comparison screenshots | Merged #116: compact table before details, visible health caveat and native optional instructions; reviewed 320/390/1350px screenshots, reference/restore updates and all five jobs. |
| P2 | Media/network/GPU improvements (L10/L11) | Measured route/device profile | Merged #113: small icon from the complete approved logo, direct fallback, browser decoding and error-free console gates; eight inspected reports scored 100 across all four categories. Larger GPU/media work remains queued. |
| P2 | Editorial/content cluster plan (L04/L13) | D04 human review | Briefs for habit formation and evidence literacy connected to existing four guides; source scope, original usefulness, no automatic publication of clinical advice. |
| P2 | Organic launch preparation (L07) | D06; Gates B/C | Search Console ownership/sitemap/indexing checklist and approved social previews; no external submission/campaign until approved. |

## Delivery phases and gates

1. **Baseline / functional foundation (Gate A):** five documents, reproducible CI, planner/backups/storage/failure journeys, 404 recovery, core cross-browser evidence. Current automation is strong; manual/device gaps remain explicit.
2. **Security / trust (Gate B):** complete L01–L04 and accessibility blockers. Treat unavailable checks as pending; do not interpret silence as risk acceptance.
3. **UX / SEO / content / performance (Gate C):** incremental design system, useful journeys, current sources/human review, technical metadata/structured-data checks and representative lab/device evidence. Safe independent work can continue while owner decisions wait.
4. **Operations / controlled launch (Gate D):** eligibility, settings/access, rollback/monitoring, explicit release approval, exact deployed commit and live smoke. CI or preview success alone cannot pass this gate.

Use one review branch for a coherent launch batch, with independent agents owning separate files or isolated dependency workspaces. Integrate once, review the combined diff and run scoped checks followed by the required final-head hosted suite. Split a change only when its dependencies or risk justify separate review; do not create a PR for every minor refinement. Record exact head/run links in the PR and PROGRESS.md, retaining immutable release evidence after approval. Do not merge or deploy automatically; earlier approvals apply only to their identified releases. Preserve unrelated working changes. Production auto-deploy normally follows main, so a future merge approval must cover that deployment.

## Editorial and marketing preparation

Use the existing discovery→learning→Explorer→optional plan journey. Improve clarity and useful navigation without collecting visitor notes or adding clinical services. Prepare briefs, not bulk articles:
- Movement: everyday activity and adaptable first steps, linked to the existing adult/older-adult guidance.
- Food: interpreting balanced-meal frameworks without merging UK/US frameworks into an invented prescription.
- Sleep: routines and recognising limits/when to seek support, respecting source age bands.
- Stress/support: practical coping and local urgent-help routes, with international context clearly labelled.
- Cross-pillar: how to read evidence and choose/review a manageable habit without turning check-in counts into health outcomes.

Every brief needs audience, question, original contribution, claim/source/population/limitations mapping, responsible author, human sign-off and correction/review plan. Keep NHS/NICE as appropriate and relevant WHO/Harvard/CDC sources. Do not publish new advice until reviewed.

## Separate future commercial roadmap — approval required

No feature below is authorized as a live service by this plan. Explore only after the actual business model, legal/privacy/hosting and clinical boundaries are approved:
- Helpful email series/newsletter: purpose, explicit permission, unsubscribe/retention, approved processor and costs before signup implementation.
- Partnerships/social/editorial distribution: factual professional positioning, approved assets/content, no fabricated endorsement, testimonials or urgency.
- Google Business Profile: first establish eligibility; do not imply a public clinical location/service.
- Programmes, membership/payments, bookings/CRM or clinical consultations: dedicated approved service scope, provider/security/privacy design, costs and professional/regulatory review.
- Personalised assessments: separate explicit scope and sensitive-data design; never infer permission from the Habit Explorer or educational planner.

Prefer useful engagement without identifying visitors: guide navigation, understanding and optional manual planning. Any new measurement still needs operator approval and the existing privacy gates. No external accounts, submissions or campaigns are created by these documents.
