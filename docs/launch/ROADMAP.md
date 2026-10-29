# Launch roadmap

Read AUDIT.md and PROGRESS.md before each cycle. Preserve the educational mission, canonical https://www.healthcrest.uk, manual planner storage and default-off independent measurement. A checked task is not a passed release gate.

## Ranked backlog

| Priority | Task / audit IDs | Dependency | Acceptance and next evidence |
| --- | --- | --- | --- |
| P0 | Supported threat-model-driven security assessment (L01) | Security preflight/tooling | Retained validated report, boundary/coverage limits, no unresolved Critical/High findings or explicit launch blockers. |
| P0 | Hosting eligibility, company/privacy and human editorial sign-off (L02–L04) | Owner D01–D04 | Verified records and approved changes; no invented details or automatic paid upgrade. |
| P1 | Performance budgets and stronger release smoke (L05/L07) | Existing CI | Merged in #109: raw-boundary tests, all five CI jobs, 20 release checks/66 fragments and two mobile budgets passed at the reviewed head; preserve these gates. |
| P1 | Supported ESLint tooling (L14) | Compatible peer dependencies / migration review | Separate dev-only lockfile PR, clean install without forced peers, rules/lint/type/unit/hosted checks pass. |
| P1 | Accessibility matrix / confirmed Explorer findings (L06/L15) | Browser/AT/device access | Merged #110: desktop camera contrast/heading fixes and mandatory audit rules; record remaining manual keyboard, screen-reader, zoom/reflow, forced-colours, touch and reduced-motion tasks before sign-off. |
| P1 | Representative mobile/desktop lab and interaction profiles (L11) | First budget baseline | Merged #110: eight navigation profiles across five routes, with corrected-head reports inspected; actual 3D/device and interaction profiling remain pending. Keep field INP separate; never remove working 3D for a score. |
| P1 | Operations, CMS recovery and launch rehearsal (L09/L13) | D07, provider access | Document incident ownership/log redaction/rollback, CMS recovery and post-deploy smoke; exercise only authorized operations. |
| P2 | Structured-data and crawl/indexability contracts (L07/L16) | Current article/visible-content review | Merged #111: shared guide trails/byline and rendered WebSite/Article/BreadcrumbList/source/date consistency, including public preference variants. External validation/indexing requires D06. No invented dates or medical-service/review claims. |
| P2 | Shared design tokens and states (L08) | Screenshot/contrast baseline; D05 for changed branding | Merged #112: plain 3D angles, 3D-only controls and expanded 2D space, with hosted keyboard/layout and four inspected screenshots. Shared-token inventory/migration remains queued. |
| P2 | Media/network/GPU improvements (L10/L11) | Measured route/device profile | Active L18: fix the reported favicon 404 with a small generated icon using the complete approved logo; validate metadata, local fallback, browser decoding and error-free lab console evidence. Preserve originals. Larger GPU/media work remains queued. |
| P2 | Editorial/content cluster plan (L04/L13) | D04 human review | Briefs for habit formation and evidence literacy connected to existing four guides; source scope, original usefulness, no automatic publication of clinical advice. |
| P2 | Organic launch preparation (L07) | D06; Gates B/C | Search Console ownership/sitemap/indexing checklist and approved social previews; no external submission/campaign until approved. |

## Delivery phases and gates

1. **Baseline / functional foundation (Gate A):** five documents, reproducible CI, planner/backups/storage/failure journeys, 404 recovery, core cross-browser evidence. Current automation is strong; manual/device gaps remain explicit.
2. **Security / trust (Gate B):** complete L01–L04 and accessibility blockers. Treat unavailable checks as pending; do not interpret silence as risk acceptance.
3. **UX / SEO / content / performance (Gate C):** incremental design system, useful journeys, current sources/human review, technical metadata/structured-data checks and representative lab/device evidence. Safe independent work can continue while owner decisions wait.
4. **Operations / controlled launch (Gate D):** eligibility, settings/access, rollback/monitoring, explicit release approval, exact deployed commit and live smoke. CI or preview success alone cannot pass this gate.

Each implementation uses a small branch/PR, scoped tests and a diff review. Record exact head/run links in PROGRESS.md. Do not merge or deploy automatically under this directive; earlier approvals apply only to their identified releases. Preserve unrelated working changes. Production auto-deploy normally follows main, so a future merge approval must explicitly cover that deployment or it must remain pending.

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
