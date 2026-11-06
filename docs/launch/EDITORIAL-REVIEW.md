# Editorial review and corrections

Owner-confirmed process, 29 October 2026: Chris Tsoto will approve health content and review/correct it at least once a week. Actual item-specific decisions are recorded below; the process commitment alone does not approve unreviewed content, independently verify credentials or certify the illustrative model.

## Before publishing or materially changing advice

1. Identify the audience, question and exact content revision. Keep general adult education separate from clinical services, diagnosis, personal predictions and research examples.
2. Read and map each material claim to suitable sources, population, purpose and limitations using ../editorial-sources.md. Retain relevant UK/NHS/NICE service context and use authoritative WHO, Harvard or CDC material where it adds useful context; do not imply endorsement.
3. Confirm byline/responsible organisation, source-check dates and any real substantive review date. Do not substitute a build date for editorial review. Keep visible text, structured citations, planner links and scenario catalogue consistent.
4. Chris reviews the exact revision and records approve/request changes, date, scope, limitations and corrections below or in a linked PR review. Automated checks cannot provide this sign-off.
5. Only an explicitly approved release may publish the change. Sanity scenario imports need their own scoped approval; repository catalogue safeguards do not establish CMS permissions or editorial workflow.

## Weekly review

At least once a week, review correction emails received through the existing contact route, changed/broken sources, safety signposting, source-population differences and outstanding article/scenario issues. Record actual completion and next due date. Treat potentially harmful errors promptly rather than waiting for the weekly review. Do not copy medical records or a correspondent's personal information into public GitHub issues, this log or test fixtures.

For each correction: identify affected public content and revision, assess scope/urgency, draft the smallest correction, verify the source, obtain Chris's approval, test links/content contracts and record the release revision/date. Any production rollback or emergency release still follows the explicit operational approval boundary. Do not silently change historical review records.

## Content register — item-specific decisions

Use the [content approval packet](CONTENT-APPROVAL-PACKET.md) for direct review links, source/population/limitation mappings, all eight scenario identities and blank per-item decision records. Its current baseline is immutable release `4309697dbdc0ffb4eeacc214102f051491c4bbf8` (#122); compare the content scope with the intended launch revision before carrying an approval forward. Packet preparation alone does not establish a review outcome; use only the completed item-specific decisions below.

| Content | Packet items / source revision | Approver / actual reviewed date / decision | Next review |
| --- | --- | --- | --- |
| Movement and strength guide | G1 / learningGuides.ts at `14bce2cf31dc45e35ddb9e3ba28e818fb7aa12a4`; same catalogue blob as packet baseline | Chris Tsoto / 2 November 2026 / Approved; explicit owner message “G1 approved”. See packet decision record for scope/limits. | 9 November 2026; earlier for material changes or safety concerns |
| Balanced meals guide | G2 / learningGuides.ts at `14bce2cf31dc45e35ddb9e3ba28e818fb7aa12a4`; same catalogue blob as packet baseline | Chris Tsoto / 2 November 2026 / Approved; explicit owner message “G2 approved”. See packet decision record for scope/limits. | 9 November 2026; earlier for material changes or safety concerns |
| Sleep routines guide | G3 / learningGuides.ts at `14bce2cf31dc45e35ddb9e3ba28e818fb7aa12a4`; same catalogue blob as packet baseline | Chris Tsoto / 2 November 2026 / Approved; explicit owner message “g3 approved”. See packet decision record for scope/limits. | 9 November 2026; earlier for material changes or safety concerns |
| Stress and support guide | G4 / learningGuides.ts at `14bce2cf31dc45e35ddb9e3ba28e818fb7aa12a4`; same catalogue blob as packet baseline | Chris Tsoto / 2 November 2026 / Approved; explicit owner message “g4 approved”. See packet decision record for scope/limits. | 9 November 2026; earlier for material changes or safety concerns |
| Connected habits example | S1 / `integrated-harmony`, reviewedContent.ts at `14bce2cf31dc45e35ddb9e3ba28e818fb7aa12a4`; same catalogue blob as baseline | Chris Tsoto / 2 November 2026 / Approved; explicit owner message “s1 approved”. See packet for scope/limits. | 9 November 2026; earlier for material changes or safety concerns |
| Short sleep and higher stress example | S2 / `single-pillar-failure`, reviewedContent.ts at `14bce2cf31dc45e35ddb9e3ba28e818fb7aa12a4`; same catalogue blob as baseline | Chris Tsoto / 2 November 2026 / Approved; explicit owner message “s2 approved”. See packet for scope/limits. | 9 November 2026; earlier for material changes or safety concerns |
| Movement example: weekly activity | S3 / `uk-cmo-optimal`, reviewedContent.ts at `14bce2cf31dc45e35ddb9e3ba28e818fb7aa12a4`; same catalogue blob as baseline | Chris Tsoto / 2 November 2026 / Approved; explicit owner message “s3 approved”. See packet for scope/limits. | 9 November 2026; earlier for material changes or safety concerns |
| Sleep example: everyday foundations | S4 / `sleep-rung1-foundations`, reviewedContent.ts at `14bce2cf31dc45e35ddb9e3ba28e818fb7aa12a4`; same catalogue blob as baseline | Chris Tsoto / 6 November 2026 / Approved; explicit owner message “S4 approved”. See packet for scope/limits. | 13 November 2026; earlier for material changes or safety concerns |
| Sleep example: routines and support | S5 / `sleep-rung2-behavioral`, reviewedContent.ts at `14bce2cf31dc45e35ddb9e3ba28e818fb7aa12a4`; same catalogue blob as baseline | Chris Tsoto / 6 November 2026 / Approved; explicit owner message “s5 approved”. See packet for scope/limits. | 13 November 2026; earlier for material changes or safety concerns |
| Sleep example: bedroom environment | S6 / `sleep-rung3-circadian`, reviewedContent.ts at `14bce2cf31dc45e35ddb9e3ba28e818fb7aa12a4`; same catalogue blob as baseline | Chris Tsoto / 6 November 2026 / Approved; explicit owner message “s6 approved”. See packet for scope/limits. | 13 November 2026; earlier for material changes or safety concerns |
| Research example: timed sound during sleep | S7 / `sleep-rung4-experimental`, reviewedContent.ts at `14bce2cf31dc45e35ddb9e3ba28e818fb7aa12a4`; same catalogue blob as baseline | Chris Tsoto / 6 November 2026 / Approved; explicit owner message “S7 approved”. See packet for scope/limits. | 13 November 2026; earlier for material changes or safety concerns |
| Stress example: coping and support | S8 / `active-vagal-reset`, reviewedContent.ts and packet scope at 4309697d | Pending; existing source-check record is ../scenario-evidence-review.md | Set after actual review |
| Homepage / About / learning definitions / planner guidance | C1 / listed shared-copy scope at 4309697d | Pending | Set after actual review |

Source references were previously checked on 28 October; this register does not change the public dates. Keep completed review records bound to immutable commits or CMS document revisions. A source update, changed audience, material claim or safety concern triggers another review even within the weekly interval.
