# Optional calendar check-ins

A started seven-day plan offers an optional calendar-file download after the weekly review. Choose a local time, download healthcrest-check-ins.ics and manually import it into a calendar app. No reminders are activated by downloading, no account is connected and Healthcrest sends no calendar invitation or background notification.

The RFC 5545 file contains exactly seven finite VEVENTs, one per week date, with a generic Habit check-in title, fixed return-to-plan URL, transparent availability and a display alarm at the start. There is no recurrence rule, attendee, organiser or end-date calculation. The timestamps are floating local times without TZID or UTC suffix; calendar applications interpret them using their local settings and may handle daylight-saving gaps or alert permissions differently. The UI asks visitors to review dates, time zone and alerts on import.

Generation accepts only a validated start date, HH:mm time and UTC generation timestamp. The helper does not accept a draft, pillar or note. All content is ASCII with CRLF line endings and folding at 75 octets. UIDs are deterministic for a week/time/day; repeat-import handling remains calendar-app dependent. Existing calendar entries do not synchronise with Healthcrest, and users manage changed or duplicate entries in the calendar themselves.

Neither the file nor its URL contains habit actions, pillar, daily choices, notes, review or future action. If imported, the chosen calendar provider may store/sync the generic entries. This transfer is a visitor choice, not a new Healthcrest data-processing endpoint. Returning uses the existing explicit restore panel; it does not silently open stored records.

The control receives only the selected week's start date. Changing that date resets the time and feedback; clearing a week removes the control. Existing pillar/restore/import remount behavior resets it too. Time and feedback stay in memory and are not added to JSON backups, browser storage or the saved-plan schema. Printing the worksheet excludes interactive calendar controls as before.

No health claims, clinical citations, dependencies, account connection, collector or storage key is added. Existing NHS/WHO/Harvard/CDC educational guidance remains independent of reminders. Validation covers the emitted file structure, line folding, date rollover/leap days, local times across time zones, finite events and private-field exclusion. Browser coverage exercises explicit downloads, reset/replacement flows, storage and download failure, keyboard/mobile use and unchanged personal records.

Calendar-app imports and device notification delivery cannot be established by browser CI; actual import previews and alert settings remain under the visitor's control.
