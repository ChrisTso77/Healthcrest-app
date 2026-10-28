# Release readiness

The release check exercises the production build before the full browser suite in CI. It discovers every route in the canonical sitemap, requires the core public pages and practical guides, and checks successful responses, deployment-local URLs, titles, descriptions, canonical/sharing addresses and the no-referrer response header. It checks discovered internal link pathnames, a decoded header logo, the social PNG signature/end marker, the hummingbird JPEG and the WebM prefix.

Unknown public and guide paths must return HTTP 404, show Healthcrest's recovery page and carry a noindex directive. The page offers accessible links to the Explorer, learning guides, the homepage and explicit saved-plan restoration. It does not read or restore drafts. Browser tests cover keyboard/small-screen navigation, JavaScript-free recovery and preservation of existing saved drafts.

The check uses a fresh browser without visitor measurement permission. It blocks third-party browser requests and rejects observed optional measurement requests and failed static application responses. This checks a basic fresh-visitor boundary; the separate full measurement tests remain required.

## Run against a built application

1. Install dependencies with npm ci.
2. Build with npm run build.
3. Install Chromium with npx playwright install chromium (or --with-deps on a new Linux runner).
4. Run npm run test:release.

Without an origin override the script starts the built server on 127.0.0.1:3002, checks it and stops it. Keep that port available. A JSON report is written to artifacts/release-readiness/summary.json even when a check fails. CI uploads it for 14 days. No new service, account or paid feature is required.

## Check the deployed site

Once this workflow is on main and the intended Vercel production deployment has succeeded, open GitHub Actions → Production release smoke check → Run workflow, using main. The manual workflow checks https://www.healthcrest.uk and uploads its report. It is read-only: it does not submit forms, save a plan or change Vercel settings.

To check an accessible deployment from a shell, set HEALTHCREST_RELEASE_ORIGIN to its HTTPS origin for that command and run npm run test:release. Supply only an origin, without credentials, a path, query or fragment. Canonical metadata must continue to point to https://www.healthcrest.uk on previews too. A password-protected or redirected preview will fail rather than falsely verify the intended build.

Passing CI proves the tested build's checks; it does not prove that the live domain serves that build. Use the production check after deployment and confirm the Vercel deployment is tied to the intended commit. These checks do not validate every fragment link, external source uptime, provider dashboard configuration or every clinical statement.

## Deployment review

- Keep optional measurement disabled until the existing operator checks in docs/measurement-rollout.md are complete. Neither this check nor a successful deploy enables it.
- Review the remaining company/provider/enquiry details in docs/privacy-notice-draft.md. Do not infer their completion from passing software tests.
- Continue to follow docs/editorial-sources.md for health-content work, including reputable UK and global references suited to the claim and audience. This release adds navigation and verification, not clinical advice.
- Run the full hosted unit/browser suite, production-build release check, preview measurement-off profile, dependency audit and mobile lab audit. Review the Vercel preview before approving a merge.
- After merging, confirm the production commit/deployment and run the live workflow. If a production-only regression appears, promote the previous known-good Vercel deployment while investigating; a code revert should go through a reviewed PR. Changing telemetry settings also requires redeployment as documented in the rollout guide.

Evidence belongs to the exact checked commit and origin in the CI/workflow report. No live-site or administrative checks are claimed merely by adding this workflow.
