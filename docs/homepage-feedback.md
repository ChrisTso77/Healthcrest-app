# Homepage feedback decisions

Source: owner-supplied feedback, 28 October 2026. This is an implementation record, not a privacy notice.

| Suggestion | Decision |
| --- | --- |
| Visible authorship | Add Chris Tsoto, Clinical Pharmacist, GPhC 2055329, MBA, using the details supplied by the owner. Add About and a source-check date; do not imply independent clinical review or an externally verified credential check. |
| Name the main tool | Use Habit Explorer in public copy, with “Try the Habit Explorer” as the main action. Keep /engine and internal identifiers so existing links, state and API contracts continue working. Systems remains the name of one view inside the tool. |
| Consistent brand and tagline | Use Healthcrest and “Health through everyday habits” in site copy. Preserve the supplied logo artwork, including its embedded wordmark/tagline; use concise Healthcrest alt text. A future original vector asset can update embedded artwork. |
| Show a concrete example | Move the lightweight preview directly after the hero, start on Sleep and explain the action visitors can try. Do not suggest that changing sleep settings predicts stress or health outcomes. |
| Urgent help | Add geographically qualified NHS 111, Samaritans and emergency routes beside stress guidance on the homepage, preview, learning topic, planner and Explorer Guide. |
| Contact and privacy | Publish the supplied contact email and accurate browser-storage help. Defer a complete privacy/cookie notice until operator identity and hosting/email processing are confirmed. A footer link alone cannot establish compliance. |
| Discovery | Add canonical/Open Graph/Twitter metadata, a generated sharing image, WebSite/creator structured data, sitemap and robots. Use owner-confirmed https://www.healthcrest.uk. Link four start-here questions to existing source-backed learning topics rather than publish thin duplicate articles. |
| Navigation | Shared public navigation: Learn, Habit Explorer, About, Contact. Keep section anchors available for contextual links. |
| Return hook | Highlight the existing manually saved plan and reflection flow. Defer email subscriptions until a provider, consent/unsubscribe process and privacy information are ready. |
| Performance and accessibility | Deliver the original PNG responsively through Next Image with AVIF/WebP negotiation. Preserve the corrected animated WebM and small matching JPEG fallback. Retain pause/reduced-motion/no-JavaScript behaviour and keyboard checks. Do not wrap raster artwork in SVG and call it a vector conversion. |

## Source and data-flow inventory

At the homepage feedback phase (#86), the inspected application source had no active analytics integration. lib/health-engine-analytics.ts contains unused adapters; they are not imported or called by the current application. No analytics scripts, browser-cookie writes, session-storage writes or sendBeacon calls were found in the inspected runtime source.

The planner explicitly saves its four drafts and reflection notes to localStorage under healthcrest.habit-draft.v1. The payload is version 2 and supports version 1 migration on explicit restoration. Save/restore/remove are manual; there is no draft POST endpoint or background upload. A local file download is independent of the saved browser copy.

The Explorer fetches /api/presets; server content retrieval uses Sanity. Hosting requests can involve provider logs. Deployed hosting/dashboard analytics configuration and email processing have not been independently inspected. Source inspection is not evidence that the whole deployed service collects no data.

Before a complete privacy/cookie notice: confirm the legal operator/data controller, hosting and email providers, configured analytics and similar technologies, processing purposes, retention and applicable user-rights/contact arrangements. Do not add an unconnected cookie banner or a subscription form.

## Validation scope

Hosted CI should cover lint, type checking, unit tests, production build and Chromium end-to-end tests. New browser checks exercise public navigation, attribution, contact, topic deep links, manual storage controls, urgent-help telephone links, keyboard preview selection, modern logo delivery, canonical query deduplication, discovery files and sharing-image dimensions. Existing checks cover 320–1440px layouts, source links, no eager 3D/preset loading, keyboard access, reduced motion, playback fallback and JavaScript-disabled content.

A real mobile PageSpeed Insights benchmark has not been run in this phase. Do not report a performance score or measured speed improvement from source changes alone.

## Reference checks

- NHS urgent mental health guidance: https://www.nhs.uk/nhs-services/mental-health-services/where-to-get-urgent-help-for-mental-health/
- Samaritans phone support and geographic scope: https://www.samaritans.org/how-we-can-help/contact-samaritan/
- ICO storage/cookies guidance: https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guide-to-pecr/cookies-and-similar-technologies/
- Next Image: https://nextjs.org/docs/app/api-reference/components/image
- Next metadata: https://nextjs.org/docs/app/api-reference/functions/generate-metadata

## Optional measurement follow-up (#89)

The owner confirms the Hobby plan. Both Vercel SDKs are now guarded by a default-off production switch and independent visitor choices on /privacy. Planner/private routes and custom events are excluded; URL query/fragment data is stripped. The previous source/dashboard inventory describes its historical phase, not an inspection of today's deployed settings. See docs/measurement-rollout.md for testing limits, plan eligibility, remaining privacy facts and activation/disable instructions. Full provider/enquiry-processing details remain an operational review draft.
