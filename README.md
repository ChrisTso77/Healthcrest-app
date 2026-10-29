# Healthcrest-app
The Four Pillars Health Optimisation Platform

Optional Vercel measurement is disabled by default and requires both a production-only operator setting and explicit visitor choices. Read [the rollout checklist](docs/measurement-rollout.md) before activating it.

Release verification: run `npm run build`, install Chromium with `npx playwright install chromium`, then run `npm run test:release`. See [deployment readiness and post-deployment checks](docs/release-readiness.md) for the live-site workflow and remaining operator checks.

Launch programme: begin with [progress and resumption instructions](docs/launch/PROGRESS.md), then read the [audit](docs/launch/AUDIT.md), [ranked roadmap](docs/launch/ROADMAP.md), [release gates](docs/launch/LAUNCH-CHECKLIST.md) and [owner decisions](docs/launch/DECISION-REGISTER.md). Passing CI is not a declaration of launch readiness or permission to deploy.
