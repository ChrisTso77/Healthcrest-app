# Scenario content review — 2026-10-28

The eight built-in examples were checked against the sources listed in `lib/presets/reviewedContent.ts`. This is an editorial source check, not clinical certification or a systematic review.

## Changes and source scope

- Connected-habit examples: removed biological-shield, tissue-damage and disease-risk predictions. NHS wellbeing, sleep and stress pages support the general educational context, not the combined model.
- Movement: removed unsupported percentage risk reductions and “optimal zone” wording. NHS adult activity guidance applies to ages 19–64, with attention to intensity and individual circumstances; the unweighted minutes slider is not a risk calculator.
- Sleep foundations/routines/environment: replaced ranked rungs and claims about sleep stages, hormones and brain clearance with general sleep education. NHS insomnia guidance supports routines, comfort and seeking help; no preset reproduces CBT-I treatment.
- Stress: replaced nervous-system reset, blood-pressure and inflammatory-marker claims with coping and support ideas.
- Acoustic sleep research: kept as a separate research example with no routine recommendation. Papalambros et al. (2017; 13 healthy older adults) reported interval sleep-rhythm and recall findings, while Henin et al. (2019; 12 nap and 19 overnight participants) did not find improvement on the tested memory tasks. Laboratory protocols, populations and limitations are shown; the app delivers no stimulation and makes no memory, clearance or recovery prediction.

## Authoring and CMS behaviour

Stable IDs, slugs, parameters, status values and camera choices are retained for compatibility. Status values remain internal illustration data; the UI shows educational categories and a neutral 2D example badge.

The reviewed catalogue controls titles, notes, evidence labels and source metadata for known matching slugs/pillars. Both API normalization and UI selection apply this policy, so stale published CMS text cannot override reviewed wording. Unrecognised slugs or mismatched pillars keep their parameter controls but show neutral text, an Unreviewed label and no claimed sources. Embedded CMS review metadata is never accepted as proof of review.

Update the catalogue, sources, limits and source-check date together when adding or changing claims. Keep the seed synchronized; tests enforce its correspondence with the fallback catalogue. Research does not belong in the everyday group. Evidence tags support the stated general guidance or study description, not the scenario values, animation or a personal outcome.

The seed has been corrected for future imports. No live CMS documents were written in this change. Runtime list, slug, scene and narrative responses avoid old clinical claims even before a CMS re-import.

## Sources

- [NHS adult physical activity (19–64)](https://www.nhs.uk/live-well/exercise/physical-activity-guidelines-for-adults-aged-19-to-64/)
- [NHS insomnia](https://www.nhs.uk/conditions/insomnia/)
- [NHS stress support](https://www.nhs.uk/mental-health/feelings-symptoms-behaviours/feelings-and-symptoms/stress/)
- [NHS five steps to mental wellbeing](https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/five-steps-to-mental-wellbeing/)
- [Papalambros et al. 2017](https://pubmed.ncbi.nlm.nih.gov/28337134/)
- [Henin et al. 2019](https://pmc.ncbi.nlm.nih.gov/articles/PMC6831893/)

Sources were accessed on 2026-10-28. The global introduction now reuses the sourced pillar guidance rather than claiming clinical validation of the model.
