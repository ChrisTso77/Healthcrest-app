# Guided start and clearer illustrations

The Start here page uses a native GET form with four topics and five practical preferences. Values are accepted only from explicit allowlists, including on the Explorer and planner routes. It renders without JavaScript and carries choices in URLs rather than adding browser storage.

The result links to the source-backed learning topic, opens the labelled 2D diagram and transfers an editable starter action to the planner. Following either planner link in the Explorer preserves the practical preference. Saved drafts remain manual and are never automatically restored or replaced in storage by the journey.

The 2D diagram uses separate labelled input scales and non-colour diamond markers. All scales show control limits rather than clinical target bands, and there is no composite health score. Text values and an accessible full description remain available.

The optional 3D view has a live key derived from the same deriveVisualState function as the renderer, named colours, actual driver inputs, scene explanations and a user-controlled pause. Pause combines with the device preference, which always takes priority. The renderer’s numerical/biological assumptions are not expanded or presented as personalised health effects.

Sources checked 28 October 2026: the existing NHS movement, Eatwell, insomnia and stress references in healthGuide.ts; HSE shift-worker guidance at https://www.hse.gov.uk/humanfactors/topics/shift-workers.htm. Practical preferences select logistical starter ideas rather than new medical targets.

## Mobile performance evidence

Hosted CI runs Lighthouse 13.6.0 in mobile mode on the homepage and /start production build. It publishes HTML/JSON reports and a summary artifact under mobile-performance, retained for 14 days. These are single-run lab measurements on a GitHub runner, not PageSpeed Insights field data or a before/after improvement claim. No score threshold is added; metrics establish a baseline for future work.

The built-app network inventory cannot confirm deployed Vercel dashboard analytics settings. At the guided-start phase (#87), the owner reported Enable buttons in the Vercel analytics tabs, indicating those features were disabled. The privacy notice remains a review draft while retention and other provider-processing details are confirmed.

## Optional measurement follow-up (#89)

The owner confirms the Hobby plan. Both Vercel SDKs are now guarded by a default-off production switch and independent visitor choices on /privacy. Planner/private routes and custom events are excluded; URL query/fragment data is stripped. The previous source/dashboard inventory describes its historical phase, not an inspection of today's deployed settings. See docs/measurement-rollout.md for testing limits, plan eligibility, remaining privacy facts and activation/disable instructions. Full provider/enquiry-processing details remain an operational review draft.
