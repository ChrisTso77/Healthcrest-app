import { pageMetadata } from '@/lib/siteMetadata';
import Link from 'next/link';
import { SiteHeader, SiteFooter } from '@/components/SiteChrome';
import '../landing.css';

export const metadata = pageMetadata(
  "Browser storage | Healthcrest",
  "Understand how Healthcrest habit drafts are saved, restored and removed in your browser.",
  '/storage',
);

export default function Page() {
  return (
    <div className="hc-landing">
      <a className="hc-skip-link" href="#main-content">Skip to content</a>
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="hc-section hc-info-main">
        <span className="hc-eyebrow">Health through everyday habits</span>
        <h1>Browser storage</h1>
        <section aria-labelledby="draft-storage-title">
          <h2 id="draft-storage-title">Your habit drafts</h2>
          <p>The next-step planner keeps your edits in the current page. Choosing <strong>Save on this device</strong> stores all four pillar drafts and reflection notes in this browser using local storage. The planner does not send those drafts to Healthcrest or sync them between devices.</p>
          <p>Saving and restoring are manual. A saved copy remains until you remove it or clear the browser’s site data. Other people using this browser profile may be able to restore it. A shared or public device may not be a suitable place to save personal notes.</p>
          <p>Choose <strong>Remove saved draft</strong> to delete the planner’s saved copy while keeping your current page edits. This does not delete a downloaded text file; you manage downloaded files separately.</p>
          <p><Link href="/next-step#saved-draft-controls" prefetch={false} className="hc-text-link">Open the save, restore and remove controls</Link>.</p>
        </section>
        <section aria-labelledby="storage-scope-title">
          <h2 id="storage-scope-title">What this explanation covers</h2>
          <p>This page describes the planner’s browser storage. It is not a complete privacy notice covering hosting or email handling. For questions about your information, <Link href="/contact" prefetch={false} className="hc-text-link">contact Chris</Link>.</p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
