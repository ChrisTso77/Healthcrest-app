import { pageMetadata } from '@/lib/siteMetadata';
import Link from 'next/link';
import { SiteHeader, SiteFooter } from '@/components/SiteChrome';
import '../landing.css';

export const metadata = pageMetadata(
  "About Healthcrest | Healthcrest",
  "Meet Healthcrest creator Chris Tsoto and learn how our evidence-informed education and practical habit tools work.",
  '/about',
);

export default function Page() {
  return (
    <div className="hc-landing">
      <a className="hc-skip-link" href="#main-content">Skip to content</a>
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="hc-section hc-info-main">
        <span className="hc-eyebrow">Health through everyday habits</span>
        <h1>About Healthcrest</h1>
        <section aria-labelledby="creator-title">
          <h2 id="creator-title">Who is behind Healthcrest?</h2>
          <p><strong>Chris Tsoto</strong> is the creator of Healthcrest: Clinical Pharmacist, GPhC registration <strong>2055329</strong>, MBA.</p>
          <p>Healthcrest exists to help people understand evidence-based ways to care for their health through everyday habits. Prevention is central to our purpose. Our tools focus on movement, food, sleep and stress support, alongside appropriate clinical care.</p>
          <p>For questions about the site or to flag a correction, <Link href="/contact" className="hc-text-link">contact Chris</Link>.</p>
        </section>
        <section aria-labelledby="approach-title">
          <h2 id="approach-title">How to read our content</h2>
          <p>We link general adult habit guidance to named NHS resources. Scenario descriptions distinguish everyday guidance from research examples and explain what each cited source supports and where its findings stop.</p>
          <p>The Habit Explorer uses illustrations and example settings. Its colours, shapes and labels do not measure your body, predict your health or provide a diagnosis. A reference supporting a habit does not validate the visual model.</p>
          <p><strong>NHS habit references last checked:</strong> <time dateTime="2026-10-28">28 October 2026</time>. This date records a source check; it is not a claim of independent clinical review or clinical validation.</p>
          <p>Start with <Link href="/learn" prefetch={false} className="hc-text-link">the guidance and references</Link>, or <Link href="/engine" prefetch={false} className="hc-text-link">try the Habit Explorer</Link>.</p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
