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
        <span className="hc-eyebrow">OPTIMISING HEALTH</span>
        <h1>Browser storage</h1>
        <section aria-labelledby="draft-storage-title">
          <h2 id="draft-storage-title">Your habit drafts</h2>
          <p>New drafts, notes and check-ins exist only in page memory. Export requests an unencrypted file managed by you; it does not store a new browser copy. Refreshing, closing or a crash can lose edits before export.</p>
          <p>Older saved plans remain unchanged. Restore reads that older copy only when requested. If page edits exist, confirmation protects them; Keep my edits cancels without reading the saved copy.</p>
          <p>Preparing or clearing a week changes page memory only. Export before replacing a week if you want a separate record. Check that your browser saved the file; starting a download is not proof of durable storage.</p>
          <p>Choose <strong>Remove saved plan</strong>, then confirm with <strong>Remove saved copy</strong>, to delete the saved copy for all four habits while keeping your current page edits. Choose <strong>Keep saved plan</strong> to cancel. Downloaded files and printed copies are not deleted; you manage those separately.</p>
          <p><Link href="/next-step#saved-draft-controls" prefetch={false} className="hc-text-link">Open export, legacy restore and remove controls</Link>.</p>
        </section>
        <section aria-labelledby="calendar-storage-title">
          <h2 id="calendar-storage-title">Calendar check-in files</h2>
          <p>A current seven-day plan can download seven generic calendar reminders after you choose a time. The file contains dates, the chosen time, a Habit check-in title and a public return link. It leaves out your pillar, action and notes. Downloading does not activate alerts or save your plan.</p>
          <p>If you import the file, your calendar provider may store or sync the entries. Changes or removal in Healthcrest do not update entries already imported. Review dates, time zone and alerts in your calendar, and manage old or duplicate entries there.</p>
        </section>
        <section aria-labelledby="backup-storage-title">
          <h2 id="backup-storage-title">Backups and moving between devices</h2>
          <p>Choose <strong>Download all-pillar backup</strong> in the planner to keep a JSON file of your current page drafts, notes and current weeks for all four pillars, including unsaved edits. This does not save or change the browser copy.</p>
          <p>On another device, choose that file in the planner, review its summary and explicitly replace the page drafts. The file is read locally in the browser and is not uploaded to Healthcrest. Importing changes page memory only. Export a backup if you want a separate user-managed file.</p>
          <p>A backup contains your notes and is not encrypted by Healthcrest. Manage it as a personal file, including any copies you make when transferring it. Removing a browser draft does not remove a backup, downloaded text file or PDF. Deleting a backup does not remove a saved browser draft. Plans do not sync automatically.</p>
          <p><Link href="/next-step#plan-backup-controls" prefetch={false} className="hc-text-link">Open the plan backup controls</Link>.</p>
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
