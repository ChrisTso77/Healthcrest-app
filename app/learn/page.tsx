import { pageMetadata } from '@/lib/siteMetadata';
import { SiteHeader, SiteFooter } from '@/components/SiteChrome';
import { LearningLibrary } from '@/components/LearningLibrary';
import '../landing.css';
import './learn.css';

export const metadata = pageMetadata(
  "Learn the basics | Healthcrest",
  "Explore everyday health habits, NHS references, evidence labels and plain-language explanations of terms used in the Healthcrest Habit Explorer.",
  '/learn',
);

export default function LearnPage() {
  return (
    <div className="hc-landing">
      <a className="hc-skip-link" href="#main-content">Skip to content</a>
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="hc-section hc-learn-main">
        <span className="hc-eyebrow">Health through everyday habits</span>
        <h1>Learn the basics.<br /><em>Find your next step.</em></h1>
        <p className="hc-learn-intro">Explore everyday habits, read the guidance behind them and make sense of words used in the Habit Explorer. Start with a topic or an unfamiliar term.</p>
        <LearningLibrary />
      </main>
      <SiteFooter />
    </div>
  );
}
