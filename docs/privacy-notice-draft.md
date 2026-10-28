# Healthcrest privacy notice — operational review draft

Updated 28 October 2026. This administrative draft is not the public notice. The site now publishes /privacy with the implemented optional-measurement choices and known processing information. The remaining operational details below still require review; publishing a page is not a claim of full compliance.

## Confirmed information

- Operator: Healthcrest Ltd, supplied by the owner.
- Public privacy/contact route: chris@healthcrest.uk.
- Email provider: GoDaddy, supplied by the owner. The exact email product, downstream processors and region still need checking.
- Website hosting/deployment: Vercel; content management: Sanity.
- Vercel plan: Hobby, confirmed by the owner. The owner previously saw Enable buttons; the current dashboard enablement state has not been independently verified.
- No account, newsletter signup, payment flow or user-health-data upload endpoint is implemented.
- The planner keeps current edits in page memory. Only an explicit Save writes the four drafts and reflection notes to localStorage. Restore and Remove are explicit; download creates a separate user-managed text file.
- Start here puts topic/preference choices in the URL. They can appear in browser history and hosting request logs. It asks for no symptoms or diagnoses and does not upload a habit draft.
- Both optional Vercel SDKs are now installed behind an operator switch, production-environment check and independent visitor permissions. With the switch unset, no optional SDK component mounts. Previews stay off even with the switch set and saved permission.
- Only the choice version, two booleans and saved timestamp are stored under healthcrest.measurement-choice.v1. Permission expires after 180 days; the old record may remain until changed or cleared.
- Public-page events are allowlisted; query strings/fragments are removed, custom analytics events rejected, planner/privacy/unknown routes excluded and unsafe incoming referrers blocked. Privacy signals, blocked storage and invalid/expired records fail closed.
- Vercel Web Analytics on Hobby has a one-month reporting window. Basic Speed Insights provides 24-hour/seven-day views. These are not deletion commitments: Vercel says analytics may be retained longer to support upgrades. Do not equate the session identifier lifetime with event retention.

## Known public wording and limits

Healthcrest is operated by Healthcrest Ltd. For questions about personal information, email chris@healthcrest.uk.

You can use the educational site without an account. Start here uses your topic and practical preference to display existing guidance and a starter idea. These choices appear in the page address and are not a clinical assessment.

Your planner notes are not sent by the planner or read by these measurement integrations. Saved notes remain in this browser profile until removed or site data is cleared. Other people using the same profile may restore them. Removing a saved draft does not delete a downloaded file.

Optional usage statistics and performance measurement require separate affirmative choices and can be withdrawn on /privacy. Withdrawal stops later browser sends, reloads the document after a successful save, and does not automatically erase existing aggregate reports.

If you email us, your address, message and any information you include pass through GoDaddy. Avoid sending medical records through this contact route.

Vercel and Sanity can process technical requests needed to deliver and protect their services, independently of optional measurement. Provider processing, operational-log retention and enquiry handling require the checks below.

## Decisions required before activating optional measurement

1. Follow docs/measurement-rollout.md: review deployed provider payloads and settings, then deliberately enable the production-only switch. Source/CI tests cannot inspect dashboard configuration or proprietary collector processing.
2. Confirm whether this Healthcrest Ltd site qualifies for Hobby's personal, non-commercial restriction. Change plan only with the owner's authorization if needed.
3. Confirm the exact GoDaddy email product/sub-processors, configured retention and deletion practices.
4. Record actual hosting/CMS log retention, recipient categories, international transfers and applicable safeguards. Provider links are not a substitute for this operational record.
5. Document lawful bases for enquiry handling and security logs; do not invent a legitimate-interests assessment or consent history. Optional measurement uses the explicit permissions implemented on /privacy.
6. Set an actual enquiry-retention period or criteria and a process for access, correction, deletion, restriction, objection and complaints. The public page supplies the contact and ICO route.
7. Review company identity and legally required business details. Do not invent a company number or registered address.
8. Keep public wording aligned with actual plans, data processing and deployment settings; distinguish dashboard visibility windows from provider deletion commitments.

References checked 28 October 2026:
- https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/individual-rights/individual-rights/right-to-be-informed/
- https://vercel.com/docs/analytics/privacy-policy
- https://vercel.com/docs/speed-insights/privacy-policy
- https://vercel.com/docs/analytics/limits-and-pricing
- https://vercel.com/docs/speed-insights/limits-and-pricing
- https://vercel.com/docs/plans/hobby
