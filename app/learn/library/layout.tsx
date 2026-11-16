import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SiteHeader, SiteFooter } from '@/components/SiteChrome';
import { editorialPreviewEnabled } from '@/lib/education/library/visibility';
import '../../landing.css';
import '../learn.css';
import './library.css';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Editorial learning preview | Healthcrest',
  description: 'Unpublished four-habit learning material for independent review.',
  alternates: { canonical: null },
  robots: { index: false, follow: false, noarchive: true },
};

export default function LibraryLayout({ children }: { children: React.ReactNode }) {
  if (!editorialPreviewEnabled()) notFound();
  return <div className="hc-landing hc-education">
    <a className="hc-skip-link" href="#main-content">Skip to content</a><SiteHeader />
    <main id="main-content" tabIndex={-1} className="hc-section">
      <aside className="hc-model-note"><p><strong>Unpublished editorial preview.</strong> Independent clinical review is pending. These lessons are drafts for review, not approved public guidance. Source verification is distinct from clinical approval.</p></aside>
      {children}
    </main><SiteFooter />
  </div>;
}
