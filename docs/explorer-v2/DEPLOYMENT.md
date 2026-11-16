# Explorer V2 preview deployment

Owner explicitly approved a preview deployment on 16 November 2026 after being unable to use localhost. Approval applies to this UI review deployment, not production integration or a main-branch merge.

The existing Vercel GitHub integration deploys the dedicated PR #144 branch. `/prototype/explorer-v2` is enabled only for that exact branch in the provider's Preview environment; production remains 404 even with the same branch name and local editorial flag. All hosted draft clinical-library routes remain 404. No provider access settings, production environment values, CMS, Planner or measurement controls are changed.

Build/typecheck, lint, 330 unit tests and all 12 targeted Chromium cases PASS locally. Synthetic provider profiles verify the approved Preview opens the redesigned UI, slider/scenario and drawer interactions work, `/engine` is retained, and `/learn/library` remains 404. Unit tests reject production, other branches and missing provider identifiers. These do not establish live deployment identity or provider authentication behavior.

The immutable provider deployment URL, source SHA and observed Ready status are recorded in [PR #144](https://github.com/ChrisTso77/Healthcrest-app/pull/144) after deployment, without creating another deployment just to update this source record. Stable branch alias (latest Ready version):
https://healthcrest-app-git-codex-healthcrest-explorer-d05b27-tsotsoft.vercel.app/prototype/explorer-v2

Live browser verification from this workspace is BLOCKED: the environment's outbound proxy rejects CONNECT to the preview host with HTTP 403; direct networking cannot resolve it. This is not an observed HTTP response from the app and not evidence that the provider blocks the owner. Preserve Vercel protection; do not bypass it to complete an automated check. The owner may be asked to sign in with their normal Vercel account.
