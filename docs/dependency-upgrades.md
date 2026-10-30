# Dependency upgrade checkpoint

Checked 29 October 2026 against production source `eb921b994e291df027ded8024f45eaedaa068e3f`. Runtime dependency and lint/compiler compatibility probes ran independently in isolated workspaces; the selected set was then installed and tested together.

| Package | Previous locked version | Selected version |
| --- | --- | --- |
| React / React DOM | 19.3.0 | 19.3.1 |
| @react-three/drei | 10.7.8 | 10.7.9 |
| @react-three/fiber | 9.8.0 | 9.8.2 |
| @playwright/test, playwright, playwright-core | 1.63.0 | 1.64.1 |

Fiber also updates its `its-fine` dependency from 2.0.0 to 2.1.1. The lockfile includes npm's optional-dependency metadata normalisation. There are no peer overrides, forced installs, rule removals, application changes or workflow changes. Next 16.4.3, Three 0.186.1, the Vercel SDKs, Vitest, Tailwind and PostCSS already matched their registry stable versions at this check. Sanity/lucide minor upgrades remain separate candidates.

Normal strict resolution and a clean `npm ci --strict-peer-deps` passed for the combined set; the production dependency audit reported zero vulnerabilities. Lint/types, 302 unit tests, 35 performance-budget, 35 structured-data and 29 release-identity cases passed. Production build and all 24 local release checks passed, including 22 typed assets. Local browser checks use installed system Chromium; Sanity DNS failures used existing fallback data. Hosted CI must validate the final PR revision with Playwright's matching browser builds, including Chromium/WebGL, Firefox/WebKit, preview measurement-off, release smoke and performance budgets. Results at a source checkout do not establish deployment or real-device behaviour.

## Separate migrations

ESLint 10.13.0 still fails strict resolution: latest eslint-plugin-react 7.37.5, eslint-plugin-jsx-a11y 6.10.2 and eslint-plugin-import 2.32.0 exclude v10. L14 remains open; ESLint 9 remains unsupported. Do not bypass peers or reduce rules.

TypeScript 7.0.2 fails strict resolution because typescript-eslint 8.72.1 requires TypeScript `>=4.8.4 <6.1.0`. TypeScript 6.0.3 passed isolated strict resolution and a compiler check on the existing source/configuration, but needs a deliberate migration review with lint, build and hosted evidence. It is not included in this batch.

Registry versions and peer ranges are dated observations. Reassess before a future migration. Merging this batch requires approval; it does not enable measurement or complete security, provider, editorial, recovery or device launch requirements.

## TypeScript 6 migration — 30 October 2026

Following approved #127 (`efb96aff21741cb9243930d088c50457e559a6ac`), the separate compiler migration selects TypeScript 6.0.3 from 5.9.3. Use `~6.0.3` to keep future normal resolution within the reviewed 6.0 line and typescript-eslint's current `<6.1.0` peer range. The exact compiler is retained in the lockfile. TypeScript 7 remains outside that range.

Independent isolated review and integrated strict resolution support this candidate. The existing `strict`, target/module/lib/path settings, Next plugin, lint rules and application source remain unchanged. No deprecation suppression, peer override or weakening of checking is needed. This updates the development compiler, not the React/Next runtime packages.

The integrated source passed lint, type checking, 302 unit tests, 35 structured-data cases, 35 performance-budget cases and 29 release-identity cases. The clean-install production build and all 24 commit-bound local browser smoke checks passed (22 typed assets). Existing hosted browser/measurement/performance jobs still need to pass at the final PR revision. A successful compiler invocation alone does not establish runtime or deployment compatibility. Microsoft’s official TypeScript 6 release notes were reviewed through their GitHub source after the documentation hostname was blocked. Changed defaults for global types, rootDir and side-effect import checks were considered; the existing Next references/configuration and application passed without compatibility flags. Local smoke used system Chromium and existing CMS fallback after Sanity DNS failures; it does not establish live CMS availability.

Sanity and lucide upgrades were reviewed independently as separate runtime candidates and are not included in this compiler change. ESLint 10's incompatible plugin peers remain unresolved. Merge/deployment still requires approval for this PR.

## Runtime SDK and icons — 30 October 2026

After approved #128 (`a5c6f016d65dff0ae0565f84732a59334247e057`), the separate runtime batch selects `@sanity/client ~8.14.1` (from 8.7.0) and `lucide-react ~1.65.0` (from 1.48.0). Exact versions are locked. Sanity also updates get-it 9.5.7→9.6.2, eventsource 5.1.2→5.1.4 and eventsource-parser 4.1.1→4.1.3. Node >=22.12 remains the SDK requirement, already present in 8.7.0 and met by CI's current Node22.

Parallel review checked Sanity's plain GROQ/explicit-generic fetch compatibility, Next cache options and unchanged static configuration against the application's usages. No CMS imports, writes or configuration changes are authorised by this dependency update. The SDK's changed request plumbing requires real transport coverage in addition to the API unit tests that mock createClient.

All 27 named Lucide imports remain exported. Rendered comparison found 26 unchanged icons; Brain's upper-lobe geometry changes slightly. The before/after icon was inspected at the actual 16px/17px stroke2 and 28px stroke1.4 sizes on representative light/dark surfaces. ViewBox, currentColor, aria-hidden semantics, recognisability and stroke clearance remain intact. This isolated icon comparison supports, but does not replace, hosted full-application/browser evidence.

The integrated strict install, clean npm ci, lint/types, original 302 unit tests, production build and all 24 local release checks passed (22 typed assets); production dependency audit reported zero vulnerabilities. Local release smoke used system Chromium and existing fallback data after Sanity DNS failures. Hosted checks at the final PR revision and approved deployment's live smoke remain required. Keep every existing workflow and release assertion, including nosniff, MIME types, default-off measurement and commit identity. Merge requires a new approval; earlier approvals stop at #128.

The added Sanity contract tests use the real SDK/get-it pipeline with an injected final HTTP-response fixture (resolveFetch), not a mock createClient. Three cases cover encoded query parameters plus forwarded Next cache options/reviewed normalization, HTTP500 error mapping with retries disabled, and cancellation reaching the in-flight transport. These assert cache-option forwarding, not execution of Next's cache. A separate token-free, read-only SDK query through the inherited proxy returned eight public scenario presets; it does not verify every document/provider setting or write operation. The existing fallback-normalization contract remains unchanged.
