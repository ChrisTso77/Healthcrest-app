import Link from 'next/link';
import { editorialPreviewEnabled } from '@/lib/education/library/visibility';

export function EditorialLearningLink({ preservePage = false }: { preservePage?: boolean }) {
  if (!editorialPreviewEnabled()) return null;
  return <aside className="hc-model-note" aria-label="Local editorial preview">
    <p><strong>Local editorial preview:</strong> <Link href="/learn/library" prefetch={false} target={preservePage ? '_blank' : undefined} rel={preservePage ? 'noopener noreferrer' : undefined}>Explore the four-level learning library{preservePage ? ' (opens in a new tab)' : ''}</Link>. New material awaits independent clinical review and is unavailable on hosted builds.</p>
  </aside>;
}
