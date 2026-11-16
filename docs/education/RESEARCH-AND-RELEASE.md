# Evidence library — research, implementation and release record

## Verified baseline — 16 November 2026

- Local checkout initially 076a853 (#138); upstream main fetched and verified at
  a08e1ca682f4c2e9c306c53481e5b7e924392e33 (#142). Development branch:
  codex/healthcrest-evidence-library. The historical PROJECT_STATE does not describe
  the newer Body scan baseline. Preserve #142's reviewed narration/mobile work.
- Four habits: Movement (Fitness), Food (Nutrition), Sleep, Stress & support.
  Connected habits is an explanatory view, not a fifth habit.
- Home app/page.tsx; Learn app/learn/page.tsx; four existing guides derive from
  lib/education/learningGuides.ts; Explorer app/engine/page.tsx; Planner
  app/next-step/page.tsx. Existing source dates and approved copy remain intact.
- Sanity presets are read by app/api/presets/route.ts, normalized and subject to
  repository-reviewed content with local fallbacks. No CMS writes are in scope.
- Upstream open PRs #139 (launch programme) and #140 (Planner confidentiality)
  remain separate; neither is merged into this initiative. Do not claim their
  controls or verification for this branch.
- Original checkout baseline: 314 unit tests PASS; lint/types PASS. Recheck the
  newer baseline before implementation. Required CI includes unit/lint/types,
  dependency audit, SEO/release/performance boundaries, Chromium, compatibility,
  measurement-off and synthetic backup checks.
- Existing security/privacy/manual-device/independent-review gates remain open.
  No deployment, CMS change, telemetry change or gate waiver is authorised.

## Plan and acceptance

MEDIUM functional/content change with mandatory clinical publication gate.
A: verify baseline and source inventory; B: structured claims and lesson model;
C: Movement reference implementation; D: remaining habits, pathways, diagrams,
quizzes and video source packages; E: traceability, browser/a11y, regression,
security/performance/SEO checks; F: isolated draft PR and verification evidence.
No new dependencies. Preserve Planner storage and editing and all Explorer views.

New lessons are editorial drafts. HEALTHCREST_EDITORIAL_PREVIEW=1 enables only
local review, including a local production-mode server. Any VERCEL_ENV, VERCEL
or CI environment fails closed. Hosted/public requests return 404; drafts are
excluded from sitemap and marked noindex. The flag is not publication approval.
No clinician attribution or publication date is invented. Production publication
requires actual independent review of an immutable content revision and a separate
authorised implementation to release approved material. Do not just remove the gate.

## Progress ledger

- Completed: upstream discovery; 314-test refreshed baseline; structured register;
  Movement reference pattern; all four lessons, pathways, diagrams, quizzes,
  downloadable source packages and captions; local publication gate.
- Current: isolated draft PR for independent review; local verification complete.
- Remaining: observe hosted checks and complete independent/manual/launch reviews.
- Blockers: independent clinical review; existing launch gates; physical-device/AT
  checks. NICE PH49 original retrieval 403; ICO original retrieval 403.
- Decisions requiring approval now: none within authorised development scope.

## Research method and scope

Reuse the 16 November source assessment rather than repeating completed searches.
Record original guidance or original article abstracts actually read; metadata-only
and blocked sources cannot support lessons. Certainty is an editorial appraisal,
not formal independent GRADE, unless explicitly attributed to the original review.
No diagnosis, disease-specific treatment programme, personal risk prediction or
whole-person score. Domain coverage: physiology, function, wellbeing, ageing,
capability/opportunity/motivation, access, age, regions, interactions and uncertainty.
Claims and source metadata live in one evidence-register.json; lesson blocks,
diagrams, quizzes, captions and storyboards reference stable claim IDs.

## Governance and legal scope

All new substantive claims require named independent clinical/editorial sign-off
before publication. Reviewer remains null until a real decision is recorded. An
editorial source check is neither clinical approval nor institutional endorsement.
Proposed review interval: six months; earlier on guideline changes, retractions,
credible corrections, broken sources, population changes or new contrary evidence.
For corrections: quarantine affected claim and dependent blocks, record issue,
source/revision and reason, independently reassess, version correction, then obtain
publication approval. Retractions remain in the audit record; never silently relabel.

ASA CAP section 12 was accessed on 16 November:
https://www.asa.org.uk/type/non_broadcast/code_section/12.html . Medical/health
marketing claims require substantiation; applicability depends on the actual
communication. No disease-prevention advertising, endorsements or certification
claim is introduced. Legal compliance is NOT VERIFIED by this engineering review.
ICO special-category guidance retrieval was blocked; no legal assurance is claimed.
ASA CAP section 15 (food/nutrition/health marketing claims) and the FTC Health
Products Compliance Guidance were also accessed on 16 November:
https://www.asa.org.uk/type/non_broadcast/code_section/15.html and
https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance .
These require context-specific assessment of express and implied marketing claims;
general habit research must not be used as substantiation that this app prevents
disease. The FTC guidance is business guidance, not a safe harbour. No branded food,
supplement, personalised treatment, affiliate recommendation or new promotional
efficacy claim is introduced. EU/member-state and US legal applicability, child
privacy requirements and complete UK GDPR assessment remain NOT VERIFIED; a
reading-context selector does not establish consent, age assurance or compliance.
No health profile, IP location inference, persistent audience setting, cookies,
third-party media, tracking or extra personal-data collection is introduced.
Teen pathway omits contextual adult Planner/Explorer actions. Existing site-wide
navigation remains available: this is a reading context, not an age/access gate.

Google people-first guidance accessed 16 November:
https://developers.google.com/search/docs/fundamentals/creating-helpful-content .
Search intents derive from existing site questions (activity amount, balanced food,
sleep routines, coping/support), not measured search volume. Preserve existing
canonical URLs and public metadata; do not publish duplicate regional doorway
pages, FAQ rich-result promises or fabricated review dates. Drafts carry no Article
publication schema. Actual public indexing and external schema validation remain
outside this unpublished candidate.
The draft lesson pages have distinct descriptive titles, draft author attribution,
creation dates and no inherited homepage canonical. Publication dates and clinical
reviewer metadata are intentionally absent until real decisions exist.

## Scientific synthesis and remaining research limits

The machine register is authoritative for exact claims, citations, dates, inference,
populations and certainty. New content is a scoped editorial synthesis, not an
exhaustive systematic review, and the original abstract is the verification ceiling
for research records marked original-abstract. Do not describe these as fully
appraised full texts. The earlier conversation's broad assessment is not a current
release attestation. No clinician or legal reviewer has signed this expansion.
The same register includes an inventory of existing guide sections and source-URL
mappings. Unmapped legacy references are explicitly repository-only/NOT VERIFIED
for this assessment; preserved historical approval is not invented source access.

| Habit | Supported teaching | Important uncertainty / editorial response |
| --- | --- | --- |
| Movement | Activity type, intensity and suitability; cardiovascular adaptation; balance/function in ageing. | Mortality evidence is largely observational (Garcia 2023, Yu 2025). Do not turn association into an individual effect size. Cochrane falls evidence concerns particular programmes, not all exercise. |
| Food | Variety, adequacy, food functions, fibre and practical access. | Reynolds combines cohort disease outcomes and trial intermediate outcomes; keep these distinct. Rees 2019 is older and heterogeneous, not a complete current diet ranking. Newer CORDIOPREV source retrieval was unsuccessful and its findings are not reproduced. |
| Sleep | Age bands, pressure/body-clock interaction, sleep opportunity and help-seeking. | CBT-I reviews support structured treatment, not the site's general planner. Furukawa component models involve assumptions; do not prescribe isolated treatment components. Scott 2025 extends evidence to studied chronic-disease populations without creating a treatment programme. |
| Stress & support | Short-term responses, practical pressures, connection and optional coping. | Fincham small-trial synthesis and active-comparator trial are shown together. Rajan 2026 concerns perceived stress in non-clinical adults, not hormonal or disease outcomes. |

All four include everyday functioning, barriers, age/context adaptations, glossary,
mechanisms, measurement limitations, misconceptions and FAQs. Cognitive/wellbeing
outcomes are discussed conservatively through sleep functioning and stress responses;
the library makes no cognition, longevity or healthy-ageing guarantee. Food mechanism
coverage stays at nutrient/function and fibre level; unverified microbiome, detox,
inflammation and hormonal narratives are deliberately excluded.

Interactions: exercise-to-sleep has trial synthesis; sleep-to-intake has a short
selected-population trial; stress-to-sleep/appetite is a broad recognised response.
Combined diet/activity diabetes prevention is a research example in a high-risk
population, not an offered treatment pathway. No evidence here validates synergy,
equal habit weights, combined predicted benefits, or any Explorer colour rule.

Regional scope: WHO foundation by default, explicit NHS UK context, CDC US sleep
bands, and EFSA reference-value context with member-state fallback for EU readers.
This is not comprehensive national guidance for every topic in every region. The
fallback is visible and never silently substitutes UK rules. Reading contexts are
chosen locally and are not inferred, saved, sent as health events or used to diagnose.
Teen mode supplies age-specific sleep context and trusted-support information; it
does not offer the adult Planner/Explorer as a teen programme. Specialist pregnancy,
rehabilitation, eating-disorder, medication and disease-specific advice remains out
of scope rather than being invented from general adult guidance.

## Content and media provenance

New clinical content is stored as draft structured blocks in lessons.ts. Each block,
diagram, quiz answer, pathway statement and video scene maps to evidence claims.
The existing reviewed catalogue, Sanity normalization, animation rules, Body scan
narration and Planner persistence code were not changed. Only a gated navigation
entry is added to existing journeys. Review the renderer separately from approval
of the medical wording.

Four planned 48-second videos have scene visuals, voiceover, transcript, claim IDs,
source citations and generated WebVTT (maximum two lines, 42 characters per line).
No produced video/audio exists. Final timing, narration pronunciation, caption
readability, visuals and clinical sign-off remain production review tasks. SVGs are
static labelled conceptual diagrams, with full descriptions and no personal data.
No media dependency, third-party embed, synthetic anatomy or physiological prediction
is introduced. Regenerate source artifacts with npm run prepare:education-media.

## Verification record (in progress)

- Refreshed baseline: npm run test:unit — 314 PASS.
- First expansion pass: 326 unit tests, lint/types/build, 109 existing boundary
  tests and npm audit --omit=dev --audit-level=high PASS (zero vulnerabilities).
- Initial browser pass: five tests PASS, six FAIL. Five failures were an overly
  broad diagram selector counting the two existing site logos; selector scoped to
  main. One failure found real duplicate food/stress block fragments; renderer and
  generated locations now use distinct lesson/FAQ prefixes. Failure traces retained
  locally under work/healthcrest-research/education-initial-browser-failures.
- First browser harness failed before tests because import.meta was used in this
  repository's CommonJS test mode; switched createRequire to the project path.
- Final rerun, compatibility, performance and hosted outcomes recorded below when
  executed. No incomplete manual check is PASS.
- Final new-library Chromium run: 11/11 PASS, including five expanded-content axe
  scans, 320px reflow, keyboard/focus, no-JavaScript reading, media downloads,
  all citation fragments, no persisted/transmitted pathway choices and production
  flag rejection. System Chromium 154.0.8037.57; pinned 156 download BLOCKED (403).
- Separate broad regression harness initially could not start from a scratch cwd;
  corrected local server cwd. Its next attempt lacked the Playwright ffmpeg binary
  and was interrupted before meaningful assertions. Local override disables video
  recording only; CI config, assertions and failure screenshots/traces remain intact.
- Readability check: essentials are 38–46 words, 9.5–13 words/sentence, about 16–19
  seconds at an assumed 150 words/minute. This is a descriptive check, not proof of
  comprehension or a validated reading-grade claim. Actual reader testing pending.

## Review and reproduction

From the repository: `HEALTHCREST_EDITORIAL_PREVIEW=1 npm run dev`, then open
`http://localhost:3000/learn/library`. The new server flag must not be configured
on hosting; Vercel and CI contexts reject it even if accidentally supplied. Home
is statically built, so its optional local link requires dev mode or a local build
with the flag. Dynamic Learn/Planner/Explorer links follow the local runtime flag.
Direct local library URLs remain the reliable review entry point.

`npm run build && npm run test:education` runs two loopback-only servers: local
editorial and simulated production. Tests cover the positive reader experience
and negative publication boundary. `HEALTHCREST_CHROMIUM_PATH=/usr/bin/chromium`
is an optional local browser override; hosted CI uses its normal pinned browser.
The source-package generator is deterministic and unit-tested against narration,
captions and references. No actual video creation, deployment or source approval
occurs when generating these artifacts.

Review each lesson, referenced claim, diagram, quiz and storyboard at the same
immutable source revision. Record actual reviewer, date, decision, affected claim
IDs and revision in the established content-approval process; null reviewers must
remain null until that happens. Reconcile source-only/abstract-only verification
limits and blocked original guidance before approving affected medical wording.
Then complete applicable existing launch gates and seek separate publication
approval. Keep the draft PR unmerged until those mandatory gates are resolved.

New library release smoke: PASS, 23 existing production-build checks, 13 public
pages, no failed assets or optional measurement requests, 23 valid typed assets.
This was a local build using system Chromium; compiled/source identity was not
supplied and remains NOT VERIFIED. No production or hosted-preview attestation.
Existing journey regression: 185/185 PASS with system Chromium and local video
recording disabled because ffmpeg was unavailable. Sanity DNS errors occurred in
some requests; fallback/fixture paths remained usable. This does not attest to
production CMS health. Final library rerun after mobile-label/caption/context fixes:
11/11 PASS, including five axe scans. Existing CI assertions and video settings
were not weakened.

Eight established Lighthouse 13.6.0 profiles PASS all existing budgets (five mobile,
three desktop). Actual execution was local system Chromium, despite the unchanged
runner script's generic GitHub-runner scope label. Maximum observed public-profile
LCP 938 ms, TBT 83 ms, CLS 0.0018; no analytics requests. Scores are local lab
snapshots, not field Core Web Vitals, INP, physical-device or 3D/GPU evidence.
Representative unpublished Movement lesson: first mobile sample TBT 262.5 ms while
types/lint ran concurrently; retained as confounded evidence, not silently discarded.
An isolated rerun measured LCP 1066 ms, TBT 65.5 ms and CLS 0, performance 100,
accessibility 100, best-practices 100. Draft SEO score 69 is expected from noindex;
the publication safeguard must not be removed to improve a score. No budgets were
raised. These measurements precede the final draft-only metadata/byline addition;
the final build and 11-case browser/a11y suite passed after that addition.

CI adds the new suite to the existing Chromium job and a Firefox/WebKit variant
to compatibility, retaining existing assertions, pinned browsers, failure video
settings and performance budgets. New screenshots/traces are included with the
existing 14-day CI artifacts. Hosted results remain pending for this draft until
observed. Do not substitute the system-browser run for pinned/cross-browser CI.

The four existing Body scan browser cases also PASS: view switching, keyboard
regions, mobile controls, speech-error fallback and premature-speech fallback.
Final distinct local browser cases: 201 (185 existing journeys, four Body scan,
12 new library). The additional new case verifies that opening learning from Planner
retains unsaved edits in the original tab. Planner and Explorer preview links open
a visibly labelled new tab so reading does not reset the working page. This does
not extend the prior owner content approval to new text.

## Milestones and release recommendation

- Research/content-design milestone: initial scoped synthesis and all-habit draft
  coverage complete; full-text gaps and unavailable sources remain explicit.
- Technical implementation milestone: complete local candidate with source,
  evidence register, media packages and automated verification. Publication gate
  remains active. Compact machine-readable results: verification-summary.json.
- Current stage: isolated draft PR for independent review; no merge or deployment.
- Remaining: observe required hosted checks, independent clinical/editorial and
  applicable legal review, new-content physical-device/AT checks, and existing
  launch gates. The proposed research review due date is not approval.
- Recommendation: accept for independent review, not production publication or
  launch. Do not seek final deployment approval while mandatory gates remain open.
