# Healthcrest-app
The Four Pillars Health Optimisation Platform

Optional Vercel measurement is disabled by default and requires both a production-only operator setting and explicit visitor choices. Read [the rollout checklist](docs/measurement-rollout.md) before activating it.

Release verification: run `npm run build`, install Chromium with `npx playwright install chromium`, then run `npm run test:release`. See [deployment readiness and post-deployment checks](docs/release-readiness.md) for the live-site workflow and remaining operator checks.
