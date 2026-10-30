# Owner launch actions

Prepared 29 October 2026 for one consolidated launch-readiness handoff. This worksheet collects remaining owner/operator facts; it requests no credentials and certifies no legal, clinical, security or accessibility compliance. Existing answers are retained below. Engineering continues independently while these items are resolved.

Owner update during batch review: a professional registered-office arrangement is **not yet in place**. Actual-device access is confirmed for **iPhone/Safari, Android/Chrome, Windows and Mac**. These are available test platforms, not completed tests. Screen-reader access remains unconfirmed; do not mark the manual matrix complete.

Owner update after #125: intended use is **non-commercial education**; the **professional registered address remains outstanding**. The current plan was subsequently confirmed as Hobby below. These answers do not establish provider eligibility or complete company disclosure arrangements.

Owner update, 30 October 2026: current Vercel plan is **Hobby** and the owner will operate recovery in Vercel and Sanity. This confirms the plan and intended operator, not plan eligibility, promotion permissions, backup availability or an exercised recovery. Screen-reader availability remains unconfirmed; NVDA was explained as a free Windows screen reader, with VoiceOver as the macOS alternative.

Owner recovery follow-up, 30 October 2026: confirms visibility of deployment `a0ad203` and rollback controls, plus manual export through `sanity dataset export`. Accepted targets: website recovery within 4 hours of detection; CMS recovery within 1 working day; no more than 24 hours of CMS edits lost; private daily and pre-bulk-change exports retained for 30 days. The runbook records implementation/rehearsal steps; no scheduled backup or successful recovery is claimed.

## Five grouped actions

| Action | Already known | Minimum outcome needed | Decisions |
| --- | --- | --- | --- |
| **1. Hosting and company disclosures** | Current Vercel Hobby plan and non-commercial educational intent confirmed. Owner supplied Healthcrest Ltd, 15318363, England, canonical https://www.healthcrest.uk and a wish to protect their home address. | Verify eligibility for the confirmed plan and intended use with evidence or provider clarification. Verify company details and confirm whether a suitable professional registered-office arrangement exists. Approve concrete disclosure wording after verification. Do not paste a home address here. | D01/D02 |
| **2. Actual processing settings** | Vercel, Sanity, GoDaddy email; exact email product and current dashboard/switch states unverified. App-level optional measurement is independently gated/default-off. | Confirm exact email product, Analytics/Speed Insights dashboard state and whether the production switch is set, without sharing values/credentials. Record existing log/enquiry-retention rules, rights handling and provider facts needed for the privacy draft. | D03 |
| **3. Current educational content** | Chris Tsoto approves content and committed to at least weekly review/correction. Credentials are owner-supplied; relevant NHS/WHO/Harvard/CDC sources retained. | Use the [content approval packet](CONTENT-APPROVAL-PACKET.md) to review the four guides, eight scenarios and shared copy at the identified revision; record actual decisions/dates and limitations. Verify credentials before changing claims; set next review after completion. General merge approval is not editorial sign-off. | D04 |
| **4. Manual device checks** | Chromium/Firefox/Linux WebKit automation, compact layouts and lab profiles exist. Actual device/screen-reader evidence pending. | Identify available iOS/Safari, Android/Chrome and desktop/AT combinations and agree representative coverage. Record real keyboard, screen-reader, zoom/reflow, touch/orientation, motion/error and native file/print tasks, defects/retests. Mark unavailable coverage pending. | D09 |
| **5. Operator and recovery rehearsal** | Main triggers Vercel; GitHub CI/manual live smoke exists. #134 canonical live smoke passed all 24 checks at the approved merged SHA (RELEASE-EVIDENCE.md); owner-reported deployment controls and manual export availability are recorded above; actual recovery remains unverified. | Owner will operate recovery; verify recovery-point settings and restore capability; implement the agreed backup schedule/retention and monitor completion. Define working-day coverage and record existing alert/log cadence. Complete safe preview/paper rehearsal. Separately approve any live rollback/dataset exercise; after approved release run canonical smoke against its immutable deployed revision and retain report. | D07/D08 |

No paid plan/address service, processor, telemetry activation or production recovery action is authorised by completing this worksheet. Review concrete cost/production changes separately. Do not publish provider screenshots containing credentials, personal addresses or visitor details.

## Record completion once

For each action record **responsible person; actual date; exact content/source/deployment where relevant; observed result/decision; evidence location; remaining gap and next step**. Sensitive source documents stay in an existing operator-controlled location. Link minimum non-sensitive outcomes in [DECISION-REGISTER.md](DECISION-REGISTER.md), content decisions in [EDITORIAL-REVIEW.md](EDITORIAL-REVIEW.md), device evidence from the launch checklist and recovery/live results in [OPERATIONS-RUNBOOK.md](OPERATIONS-RUNBOOK.md).

A worksheet, possible report or CI pass does not complete an owner action. If facts/access are unavailable, record the specific gap. Engineering remains responsible for supported security assessment, tooling resolution, integrated CI, diff review and honest coverage; the owner is not asked to certify checks the tools could not run.

## Release handoff and deferred scope

Present one combined PR with completed work, final CI/artifact evidence and remaining rows above. Explicit approval may cover that identified merge and resulting deployment; deployed identity/canonical smoke still require verification afterwards. Launch acceptance is a separate decision against the gates.

Preserve the approved brand and educational scope. Brand redesign, commercial services, newsletters, paid programmes, campaigns and Search Console submissions remain deferred or separately authorised under D05/D06. They are not reasons to keep adding cosmetic/feature PRs before resolving launch blockers.
