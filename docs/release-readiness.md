# Release readiness

The release check exercises the production build before the full browser suite in CI. It discovers every route in the canonical sitemap, requires the core public pages and practical guides, and checks successful responses, deployment-local URLs, unique titles/descriptions, one primary heading, English document language, canonical/sharing addresses and the no-referrer response header. It checks discovered internal link pathnames and fragment IDs against default public page DOMs, a decoded header logo, the social PNG signature/end marker, the hummingbird JPEG and the WebM prefix.

Unknown public and guide paths must return HTTP 404, show Healthcrest's recovery page and carry a noindex directive. The page offers accessible links to the Explorer, learning guides, the homepage and explicit saved-plan restoration. It does not read or restore drafts. Browser tests cover keyboard/small-screen navigation, JavaScript-free recovery and preservation of existing saved drafts.

The check uses a fresh browser without visitor measurement permission. It blocks third-party browser requests and rejects observed optional measurement requests and failed static application responses. This checks a basic fresh-visitor boundary; the separate full measurement tests remain required.

Structured-data checks parse the current WebSite/Article/BreadcrumbList shapes and compare guide byline, source-check date, citations and trail with rendered content. The four guides are also revisited with public preferences; canonical/sharing/schema identity must remain query-free. Run npm run test:seo for 34 parser/mismatch cases. See docs/launch/STRUCTURED-DATA.md for exact scope: these are application consistency checks, not external rich-result certification, clinical review or an indexing guarantee.

## Run against a built application

1. Install dependencies with npm ci.
2. Build with npm run build.
3. Install Chromium with npx playwright install chromium (or --with-deps on a new Linux runner).
4. Run npm run test:release.

Without an origin override the script starts the built server on 127.0.0.1:3002, checks it and stops it. Keep that port available. A JSON report is written to artifacts/release-readiness/summary.json even when a check fails. CI uploads it for 14 days. No new service, account or paid feature is required.

## Check the deployed site

Once this workflow is on main and the intended Vercel production deployment has succeeded, open GitHub Actions → Production release smoke check → Run workflow, using main. The manual workflow checks https://www.healthcrest.uk and uploads its report. It is read-only: it does not submit forms, save a plan or change Vercel settings.

To check an accessible deployment from a shell, set HEALTHCREST_RELEASE_ORIGIN to its HTTPS origin for that command and run npm run test:release. Supply only an origin, without credentials, a path, query or fragment. Canonical metadata must continue to point to https://www.healthcrest.uk on previews too. A password-protected or redirected preview will fail rather than falsely verify the intended build.

Passing CI proves the tested build's checks; it does not prove that the live domain serves that build. Use the production check after deployment and confirm the Vercel deployment is tied to the intended commit. Fragment checks use default public DOMs, not every query-dependent or user-edited state. These checks do not validate external source uptime, provider dashboard configuration or every clinical statement.

The mobile/desktop lab job fails on raw category scores below 90 (performance, accessibility, best practices, SEO), LCP above 2500ms, CLS above 0.1, or total blocking time above 200ms. It also rejects incomplete/invalid reports, runtime errors, optional measurement requests without permission, and failed/missing color-contrast or heading-order audits even if the aggregate accessibility score is above 90. All completed profile summaries/reports remain available before a budget or execution failure; incomplete suites cannot pass. Run `npm run test:performance-budget` for its 32 boundary/configuration cases. Scope covers the homepage and Start on mobile plus a learning guide, planner and explicit 2D Explorer on mobile/desktop (eight profiles); TBT is a lab budget, not field INP. See docs/launch/PERFORMANCE-PROFILES.md for scope/configuration and AUDIT.md/ROADMAP.md for device, 3D, interaction, accessibility and field evidence still required.

## Deployment review

- Keep optional measurement disabled until the existing operator checks in docs/measurement-rollout.md are complete. Neither this check nor a successful deploy enables it.
- Review the remaining company/provider/enquiry details in docs/privacy-notice-draft.md. Do not infer their completion from passing software tests.
- Continue to follow docs/editorial-sources.md for health-content work, including reputable UK and global references suited to the claim and audience. This release adds navigation and verification, not clinical advice.
- Run the full hosted unit/Chromium suite, focused Firefox/WebKit compatibility job, production-build release check, preview measurement-off profile, dependency audit and representative mobile/desktop lab audit. Review the Vercel preview before approving a merge.
- After merging, confirm the production commit/deployment and run the live workflow. If a production-only regression appears, promote the previous known-good Vercel deployment while investigating; a code revert should go through a reviewed PR. Changing telemetry settings also requires redeployment as documented in the rollout guide.

Evidence belongs to the exact checked commit and origin in the CI/workflow report. No live-site or administrative checks are claimed merely by adding this workflow.
