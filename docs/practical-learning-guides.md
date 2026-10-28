# Practical learning guides

Four source-linked guides extend /learn: movement-and-strength, balanced-meals, sleep-routines and stress-and-support. The homepage's four learning questions now link directly to them. Existing topic anchors, glossary, evidence explanations and Explorer links remain available.

Each guide includes audience scope, takeaways, jump navigation, practical ideas, a reflection prompt, source references with what they support and where they stop, links to the planner and a labelled 2D example, and related guides. The guided practical preference carries through internal links; unknown/repeated preferences fall back to the general starter. Sliders and personal drafts never enter article URLs or metadata.

## Editorial source check — 28 October 2026

| Guide | Checked sources and use |
| --- | --- |
| Movement and strength | NHS adult activity (19–64) for weekly quantities/intensity and advice before starting; NHS strength exercises for gradual home activity and setup; older-adult activity guidance is linked separately for age-appropriate advice. |
| Balanced meals | NHS Eatwell Guide for food-group balance over time and dietary adaptation; NHS 8 tips for healthy eating for higher-fibre staples and fruit/vegetable options. No calorie target, weight-loss claim or whole-food percentage recommendation is introduced. |
| Sleep routines | NHS insomnia for sleep habits, persistent problems, professional help and driving safety; Every Mind Matters for daytime functioning and influences on sleep; HSE shift-worker advice for schedules/environment. The duration range comes from NHS, not the different HSE range. |
| Stress and support | NHS stress, breathing and stress-buster pages for coping ideas and support; NHS urgent-help and Samaritans references for geographically qualified urgent and listening routes. No symptom diagnosis or therapy programme is delivered. |

Exact URLs and per-section source IDs are in lib/education/learningGuides.ts. Source checks followed the actual links when old NHS paths returned 404; the stored strength, healthy-eating and stress-buster URLs use the resolved current paths.

This is an editorial check against the named public references, not independent clinical review or NHS endorsement. No new author/reviewer credential is asserted. Guides are published as Healthcrest content, with the creator/approach page linked. Structured data names Healthcrest as an organization author and Healthcrest Ltd as publisher; it does not invent a human reviewer or original publication date. The modification date records this content/source-check update.

## Delivery and privacy

Server-rendered routes work without JavaScript. Only four catalogue slugs are generated; unknown paths return 404. Canonical/social/article/breadcrumb metadata and the sitemap use fixed public article paths without query preferences.

The existing library search also finds article text without another search service. Topic cards link to the corresponding guide while retaining the current practical preference. The Systems card continues to use its existing overview.

New article routes are excluded by the existing explicit optional-measurement allowlist. No integration, custom event, request endpoint, account or stored preference is added. Planner saving/restoring remains manual and unchanged.

## Verification

Unit tests cover catalogue/source integrity, complete pillar coverage, safe route lookup, search text and matching metadata/schema/sitemap URLs. Browser tests exercise all four guides with and without JavaScript, actual section/reference anchors, article metadata, search-to-guide-to-planner continuity, saved-plan independence, urgent-help links, 404/input handling, keyboard layouts at 320–1440px and measurement exclusion.

The complete existing regression suite, production build, lint/types, dependency audit, disabled-preview measurement test and mobile lab audits remain release checks.
