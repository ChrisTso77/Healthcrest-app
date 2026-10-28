import { pageMetadata } from '@/lib/siteMetadata';
import Link from 'next/link';
import { SiteHeader, SiteFooter } from '@/components/SiteChrome';
import { UrgentSupport } from '@/components/UrgentSupport';
import '../landing.css';

export const metadata = pageMetadata(
  "Contact Healthcrest | Healthcrest",
  "Contact Chris Tsoto about Healthcrest, its educational content or a correction.",
  '/contact',
);

export default function Page() {
  return (
    <div className="hc-landing">
      <a className="hc-skip-link" href="#main-content">Skip to content</a>
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="hc-section hc-info-main">
        <span className="hc-eyebrow">Health through everyday habits</span>
        <h1>Contact Healthcrest</h1>
        <section aria-labelledby="contact-title">
          <h2 id="contact-title">Questions, feedback or a correction?</h2>
          <p>Email <a href="mailto:chris@healthcrest.uk" className="hc-text-link">chris@healthcrest.uk</a>. For a content correction, include the page address and the statement you would like us to check.</p>
          <p>Please avoid sending medical records or sensitive health details. This is a contact route for the website, rather than a personal clinical consultation or an urgent-help service.</p>
          <p><Link href="/about" prefetch={false} className="hc-text-link">Read about Chris and our content approach</Link>.</p>
        </section>
        <UrgentSupport />
      </main>
      <SiteFooter />
    </div>
  );
}
