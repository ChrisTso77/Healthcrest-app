# Body scan release review — 15 November 2026

Scope: the illustrated four-habit Body scan introduced by PR #141 and revised in draft PR #142. This is a focused engineering/source check and owner content decision, **not** independent clinical sign-off, accessibility conformance or launch acceptance.

## Owner content decision — 15 November 2026

Chris explicitly stated in this conversation: “I approve the new health advice.” Record this as **owner approval of the Body scan advice** described in the claim-by-region handoff below, at PR #142 head `51885194b0d15b5176d036459a6bbc489f1b7869` (tree `a6ca66b04d50de82ccd8c708eea1791cfb161663`; `components/BodyScanExplorer.tsx` blob `d6a6c5c1b10d31e2e0b935f1866d0a7daffcf093`). The reviewed scope includes all four habits' captions, shared dose caveats and female-context wording; narration uses those same strings. No corrections were requested with the approval. This records the owner's decision, not a separately observed line-by-line review, independent professional assessment, credential verification, approval of future changes, merge permission or launch acceptance. Next content review due **22 November 2026**, or earlier after material wording/source changes or a safety concern.

## Observed live behavior

- The public `/engine?view=scan` page rendered the female image and four habit choices. Sleep selection, keyboard movement to the abdomen, captions, guided start and pause responded in connected desktop Chrome. The illustration loaded.
- At a temporary 390 × 844 viewport, the floating view switch covered part of the anatomy. The follow-up candidate moves **Original view** into the scan controls.
- The connected browser cannot establish the exact served commit from DOM content; a deployment identity/header check remains open. Live audio quality and a real screen reader were not tested.

## Evidence and wording

| Habit | Reviewed general sources | Scope of source check |
| --- | --- | --- |
| Movement | NHS adult activity guidance; WHO activity guidance; 2023 PCOS guideline; ACOG premenstrual and female athlete guidance; NIAMS bone health | Supports general activity and life-stage context. The minute slider, region order and image do not estimate organ-level effects or personal risk. |
| Food | NHS Eatwell Guide and fibre guidance | Supports balanced patterns, five varied portions and fibre for regularity. Removed an unsupported gut-microbiome claim. Portion count is not a diet-quality score. |
| Sleep | NHS insomnia guidance; NIH/NHLBI sleep and health | Supports typical adult duration and general brain, cardiovascular, metabolic and immune mechanisms. Hours alone do not diagnose sleep deficiency or predict disease. |
| Stress | NHS stress symptoms and breathing exercise guidance | Supports coping strategies and common symptoms. Calming-practice minutes are an illustrative setting with no established therapeutic dose. |

The source list is linked beside the candidate explanations. A broken ASRM PCOS link was replaced with the stable 2023 guideline record at PubMed. Sources were checked on 15 November 2026. The owner approval above does not establish independent clinical validation.

### Claim-by-region editorial handoff

| Habit | Head | Chest | Abdomen | Legs |
| --- | --- | --- | --- | --- |
| Movement | Short-term anxiety/sleep and longer-term wellbeing: WHO general activity guidance. Premenstrual wording: ACOG. | Fitness, blood pressure and cardiovascular association: WHO; menopause context remains general, not estrogen restoration. | Muscle glucose use and diabetes association: WHO; PCOS lifestyle advice: 2023 guideline. | Endurance, resistance, bone and falls: WHO/NIAMS; inadequate energy and menstrual disruption: ACOG. |
| Food | Energy and nutrients, without a cognition claim: NHS Eatwell. | Overall pattern, salt, saturated fat and cardiovascular risk: NHS Eatwell and balanced diet guidance. | Fibre and bowel regularity: NHS fibre guidance. | Protein and calcium sources alongside activity: NHS Eatwell. |
| Sleep | Attention and mood: NIH/NHLBI sleep deficiency guidance. | Cardiovascular association: NIH/NHLBI; no personal estimate. | Appetite/insulin response: NIH/NHLBI; no diabetes prevention prediction. | Recovery and immune support: NIH/NHLBI. |
| Stress | Coping and attention: WHO stress skills guidance; no treatment claim. | Faster heartbeat and calming breathing: NHS stress/breathing. | Appetite and digestive symptoms: NHS stress; no disease-prevention claim. | Muscle tension and rest: NHS stress; persistent symptoms need appropriate support. |

The scanner's four-stop order is an editorial teaching choice. The selected minute or portion value does not scale any claimed effect. The activity slider represents **example moderate minutes** for guideline comparisons; the app does not convert vigorous activity. A prospective high-volume activity cohort and AHA scientific statement are linked for the additional-benefit and risk caveats; neither establishes a universal harmful minute threshold. This mapping is a source check for reviewer use, not an endorsement of every sentence or voice delivery.

## Remaining checks before acceptance

### Accessibility and device check — owner report, 15 November 2026

- Connected Chrome preview exposed semantic labels, live captions, keyboard region controls and the four guided stops. This is a DOM and interaction check, not a screen-reader listening result.
- With browser speech enabled, the preview completed all four stops in under 20 seconds. That is implausibly short for the full explanations; audible output is **unverified**. The follow-up candidate treats premature speech completion as a voice failure, restores live captions, and enforces a minimum dwell time for plausible completion. Automated regression covers an immediately firing `onend` event. The approved advice strings and source links were not edited.
- Chris reported testing the linked review preview on a **Pixel 11 Pro XL**, **Chrome 157.0.8103.51**, using **Android TalkBack**. He stated “All steps passed” in response to the four-step checklist: understandable TalkBack control announcements; complete spoken explanations and scanner pacing; finger dragging and TalkBack slider adjustment matching the region; and reachable controls and captions after device rotation. This is owner-reported physical-device evidence, not an independently observed recording or an exhaustive accessibility audit. The exact served deployment commit was not independently verified during his session.
- CI for review commit `5a8939bf19011a7ae76665287caca60621a4304f` passed the Playwright end-to-end suite (including premature speech-completion fallback), Firefox/WebKit compatibility, lint, types and unit tests. Automated tests do not verify actual audible sound or TalkBack behavior.

- Independent clinical review, if required for launch, remains separate from the recorded owner approval. Any material edits to the approved advice require renewed owner review.
- The reported Android TalkBack, audible narration, finger drag, slider adjustment and rotation checklist is complete for the device above. Browser back/forward, a 320 CSS px viewport, other devices and screen readers, and audio-permission denial were outside this reported pass.
- Deployment: record served commit identity and source-bound smoke after any follow-up merge. Existing security, privacy and recovery gates remain open.
