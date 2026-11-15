# Body scan release review — 15 November 2026

Scope: the illustrated four-habit Body scan introduced by PR #141. This is a focused engineering/source check, **not** clinical sign-off, accessibility conformance or launch acceptance.

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

The source list is linked beside the live explanations in the candidate. A broken ASRM PCOS link was replaced with the stable 2023 guideline record at PubMed. Sources were checked on 15 November 2026; this is not a claim that a clinician approved the wording.

## Remaining checks before acceptance

- Clinical/editorial reviewer: verify every caption and spoken explanation, including PCOS, menopause, premenstrual symptoms and high-volume exercise; record reviewer, revisions and date.
- Actual screen reader and voice engine: check region announcements, manual keyboard narration and speech completion/error handling. Automated semantics are only partial evidence.
- Real devices: touch dragging, narrow portrait/landscape, browser back/forward and audio permissions. Inspect footer overlap and scrolling at 320 and 390 CSS px.
- Deployment: record served commit identity and source-bound smoke after any follow-up merge. Existing security, privacy and recovery gates remain open.
