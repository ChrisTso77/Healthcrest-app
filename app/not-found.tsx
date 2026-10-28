import Link from 'next/link';
import { SiteHeader, SiteFooter } from '@/components/SiteChrome';
import './landing.css';
import './not-found.css';

export default function NotFound() {
  return (
    <div className="hc-landing">
      <a className="hc-skip-link" href="#main-content">Skip to content</a>
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="hc-section hc-not-found">
        <span className="hc-eyebrow">Healthcrest · 404</span>
        <h1>Page not found</h1>
        <p>The link may have changed or the address may be incomplete. Choose where you would like to go next.</p>
        <nav aria-label="Find a Healthcrest page" className="hc-not-found-links">
          <Link href="/engine?view=2d" prefetch={false} className="hc-button hc-button-primary">Explore everyday habits</Link>
          <Link href="/learn" prefetch={false} className="hc-text-link">Read the practical guides</Link>
          <Link href="/next-step#return-to-plan" prefetch={false} className="hc-text-link">Return to my habit plan</Link>
          <Link href="/" prefetch={false} className="hc-text-link">Go to the homepage</Link>
        </nav>
        <p>Saved a plan on this device? Open the planner and choose Restore my plan to bring back its saved copy.</p>
        <p>To report a broken link, <Link href="/contact" prefetch={false}>contact Healthcrest</Link>.</p>
      </main>
      <SiteFooter />
    </div>
  );
}
