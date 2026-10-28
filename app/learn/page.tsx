import type { Metadata } from 'next';
import Link from 'next/link';
import { LearningLibrary } from '@/components/LearningLibrary';
import '../landing.css';
import './learn.css';

export const metadata: Metadata = {
  title: 'Learn the basics | Healthcrest',
  description: 'Explore everyday health habits, NHS references, evidence labels and plain-language explanations of terms used in the Healthcrest engine.',
};

export default function LearnPage() {
  return (
    <div className="hc-landing">
      <a className="hc-skip-link" href="#main-content">Skip to content</a>
      <header className="hc-header">
        <Link href="/" className="hc-brand" aria-label="Healthcrest home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/media/healthcrest-logo.png" alt="HealthCrest — Optimising health" width={1664} height={940} />
        </Link>
        <Link href="/engine" prefetch={false} className="hc-header-cta">Explore the engine</Link>
      </header>
      <main id="main-content" tabIndex={-1} className="hc-section hc-learn-main">
        <span className="hc-eyebrow">Health through understanding</span>
        <h1>Learn the basics.<br /><em>Find your next step.</em></h1>
        <p className="hc-learn-intro">Explore everyday habits, read the guidance behind them and make sense of words used in the engine. Start with a topic or an unfamiliar term.</p>
        <LearningLibrary />
      </main>
      <footer className="hc-footer">
        <p>Healthcrest · Evidence-informed understanding. Practical everyday care.</p>
        <p className="hc-footer-note">General educational information for adults. Adapt ideas to your health, ability and circumstances, alongside appropriate clinical advice.</p>
      </footer>
    </div>
  );
}
