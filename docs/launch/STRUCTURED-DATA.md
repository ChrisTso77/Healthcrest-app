# Structured data and visible-content consistency

29 October 2026. This cycle addresses L07/L16 without adding health advice, clinical-review claims, business disclosures or external account submissions.

The four guide pages now share one breadcrumb definition with their BreadcrumbList JSON-LD. The visible Home → Learn → topic trail stays the same; its structured last label now uses that same topic label instead of a separate article-title label. The guide's responsible organisation is also shared between the visible byline, author metadata and Article author. Existing Healthcrest/Healthcrest Ltd roles and source-check dates are retained; this does not independently verify company details or credentials.

## Release checks

The read-only production-build release check parses application/ld+json as data and validates Healthcrest's current curated shapes. It never evaluates scripts or fetches remote schema contexts. It requires one WebSite identity on each public page and one Article/BreadcrumbList on each practical guide. It compares:
- Canonical identity and guide headline/description, sharing type and language.
- Responsible organisation in the displayed byline, author metadata and Article.
- The displayed source-check date, Article modification date and sharing date.
- Every structured citation's title/HTTPS URL with the displayed Sources and scope list, in order.
- Breadcrumb names, consecutive positions and destinations with the visible trail.

New publication dates, clinical-review fields or top-level schema types require an explicit editorial/contract review; those properties are not generally invalid Schema.org. The current application has no verified publication/reviewer record to add. A date consistency pass establishes agreement between fields, not that a human review happened.

The check covers all 13 sitemap pages and all four guides, then revisits the guides with a public practical preference and an ignored parameter. Canonical, sharing and structured page identity must remain query-free. These synthetic parameters contain no visitor notes, and the check neither saves a plan nor grants measurement permission. Existing noindex/404, source/fragment, privacy and performance checks remain required.

Run npm run test:seo for 34 deterministic parser/mismatch cases, including malformed/missing markup, wrong identity/byline/date, source omissions/inventions, wrong trail positions/destinations, query contamination and unrecorded review/publication claims. Existing guide catalogue unit tests also check shared trail labels. The five hosted CI jobs remain; the existing lint/unit job runs the new cases and the release job exercises rendered pages. No dependencies or lockfile change.

## Scope and launch decisions

This is an application-specific consistency contract, not a general JSON-LD validator, external Rich Results Test, crawl/indexing verification, clinical assessment or search-ranking guarantee. Broader Google validation, Search Console ownership/submission and indexing monitoring remain owner-controlled under D06. Manual accessibility, security, company/provider and actual human editorial sign-offs remain open.

Primary guidance read 29 October 2026:
- https://developers.google.com/search/docs/appearance/structured-data/sd-policies — accurate, representative markup and no guaranteed rich-result appearance.
- https://developers.google.com/search/docs/appearance/structured-data/article — Article/author/date representation; do not invent missing facts to fill recommended properties.
- https://developers.google.com/search/docs/appearance/structured-data/breadcrumb — useful navigation hierarchy and consecutive list positions.

Final-head results belong to the current PR's checks and release-readiness report. No live-domain pass or external submission is inferred from local/CI success.
