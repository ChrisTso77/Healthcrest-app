import Link from 'next/link';
import { pageMetadata } from '@/lib/siteMetadata';
import { SiteHeader, SiteFooter } from '@/components/SiteChrome';
import { MeasurementChoices } from '@/components/MeasurementChoices';
import '../landing.css';

export const metadata = pageMetadata(
  'Privacy and measurement choices | Healthcrest',
  'Choose whether Healthcrest may use optional usage statistics and performance measurement. Understand what stays in your browser.',
  '/privacy',
);

export default function PrivacyPage() {
  return (
    <div className="hc-landing">
      <a className="hc-skip-link" href="#main-content">Skip to content</a>
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="hc-section hc-info-main">
        <span className="hc-eyebrow">Healthcrest Ltd</span>
        <h1>Privacy and<br /><em>your choices.</em></h1>
        <section aria-labelledby="privacy-contact">
          <h2 id="privacy-contact">Who to contact</h2>
          <p>Healthcrest is operated by Healthcrest Ltd. For privacy questions or requests about your information, email <a href="mailto:chris@healthcrest.uk" className="hc-text-link">chris@healthcrest.uk</a>. This page explains our optional measurement and browser-storage controls.</p>
        </section>
        <MeasurementChoices />
        <section aria-labelledby="optional-measurement">
          <h2 id="optional-measurement">What optional measurement does</h2>
          <p>If you agree and the feature is active, Vercel Web Analytics helps us understand visits to public pages. Vercel Speed Insights helps us understand page speed on real devices. We use your permission for these optional features; declining leaves all Healthcrest tools available.</p>
          <p>Vercel can receive a public page address, event time, referrer and technical information such as device, browser and approximate location. Performance measurement also includes browser timing data. Our integration removes query strings and fragments from measurement URLs, excludes the planner and privacy settings, rejects custom analytics events, and avoids sending from pages with potentially sensitive referrers.</p>
          <p>The integrations do not read your habit drafts, daily check-ins or review notes. Choosing a pillar or a practical preference is not sent as a custom event. The graphs are educational illustrations, not a health assessment or an automated clinical decision.</p>
          <p>Vercel describes its analytics as cookie-free. Our measurement preference is stored separately in this browser using local storage; this record contains only the two choices, their version and the time you saved them.</p>
          <p><a href="https://vercel.com/docs/analytics/privacy-policy" className="hc-text-link">Vercel Web Analytics data details</a> and <a href="https://vercel.com/docs/speed-insights/privacy-policy" className="hc-text-link">Vercel Speed Insights data details</a>.</p>
        </section>
        <section aria-labelledby="privacy-retention">
          <h2 id="privacy-retention">How long choices and reports last</h2>
          <p>Your permission expires after 180 days and can be withdrawn here at any time. The browser may keep the old preference record until you change it or clear site data, but an expired permission does not allow measurement.</p>
          <p>On our current Hobby plan, Vercel Web Analytics has a one-month reporting window. Basic Speed Insights provides 24-hour and seven-day views. Vercel says it may keep analytics data longer than the reporting window to support plan upgrades. These windows are not deletion deadlines for analytics data or operational logs. Vercel’s service terms and privacy information govern its processing and retention.</p>
          <p>Withdrawing stops future optional measurement from this browser. It does not automatically remove aggregate reports already received by Vercel. Because the reports are not linked to your saved habit draft, we may not be able to identify a particular anonymous event from that draft.</p>
          <p><a href="https://vercel.com/docs/analytics/limits-and-pricing" className="hc-text-link">Analytics reporting windows</a> · <a href="https://vercel.com/docs/speed-insights/limits-and-pricing" className="hc-text-link">Speed Insights reporting windows</a>.</p>
        </section>
        <section aria-labelledby="privacy-storage">
          <h2 id="privacy-storage">Your habit drafts stay separate</h2>
          <p>The planner keeps edits in the current page. Only choosing Save on this device stores drafts, reflection notes and current seven-day plans, including dates, check-ins and weekly reviews, in this browser. Restore and Remove are manual. Downloaded text files, JSON backups and printed/PDF copies are separate copies you manage. A backup includes all four pillar drafts and their current weeks. Importing reads your chosen file locally and replaces page edits only after confirmation; it does not upload the file or save it automatically.</p>
          <p><Link href="/storage" prefetch={false} className="hc-text-link">Read the browser-storage explanation</Link>. Changing measurement choices does not remove a saved habit plan.</p>
        </section>
        <section aria-labelledby="privacy-services">
          <h2 id="privacy-services">Other website services and your rights</h2>
          <p>The website is hosted on Vercel and retrieves educational content from Sanity. Technical requests needed to deliver or protect the site are separate from optional measurement. If you email us, the address and information you provide pass through our email provider, GoDaddy. Please avoid sending medical records through this contact route.</p>
          <p>For questions about access, correction, deletion, restriction or objection, contact Healthcrest Ltd using the email above. Available rights depend on the information and the reason it is processed. You can also <a href="https://ico.org.uk/make-a-complaint/" className="hc-text-link">raise a privacy concern with the ICO</a>.</p>
          <p>For provider processing and international-transfer terms, see <a href="https://vercel.com/legal/privacy-policy" className="hc-text-link">Vercel privacy information</a>, <a href="https://vercel.com/legal/dpa" className="hc-text-link">Vercel’s data processing addendum</a>, <a href="https://www.sanity.io/legal/privacy" className="hc-text-link">Sanity privacy information</a> and <a href="https://www.godaddy.com/legal/agreements/privacy-policy" className="hc-text-link">GoDaddy privacy information</a>. This page does not set a separate retention period for provider logs or email correspondence; contact us for those details.</p>
        </section>
        <p>Measurement information updated <time dateTime="2026-10-28">28 October 2026</time>.</p>
      </main>
      <SiteFooter />
    </div>
  );
}
