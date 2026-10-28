import { parseJourneyTopic, parseJourneyConstraint, journeyExplorerHref, journeyPlannerHref } from '@/lib/education/startJourney';
import Link from 'next/link';
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

export default async function LearnPage({ searchParams }: {
  searchParams: Promise<{ pillar?: string | string[]; idea?: string | string[] }>;
}) {
  const params = await searchParams;
  const topic = parseJourneyTopic(params.pillar);
  const constraint = parseJourneyConstraint(params.idea);
  return (
    <div className="hc-landing">
      <a className="hc-skip-link" href="#main-content">Skip to content</a>
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="hc-section hc-learn-main">
        <span className="hc-eyebrow">Health through everyday habits</span>
        <h1>Learn the basics.<br /><em>Find your next step.</em></h1>
        <p className="hc-learn-intro">Explore everyday habits, read the guidance behind them and make sense of words used in the Habit Explorer. Start with a topic or an unfamiliar term.</p>
        <p><Link href="/start" prefetch={false} className="hc-text-link">Not sure where to begin? Find a starting point</Link>.</p>
        {topic && constraint && <aside className="hc-model-note" aria-label="Your guided starting point">
          <p>Your {topic.label.toLowerCase()} journey continues here. <Link href={journeyExplorerHref(topic.key, constraint)} prefetch={false} className="hc-text-link">Open the labelled diagram</Link> or <Link href={journeyPlannerHref(topic.key, constraint)} prefetch={false} className="hc-text-link">adapt your starter idea</Link>.</p>
        </aside>}
        <LearningLibrary journeyConstraint={constraint} />
      </main>
      <SiteFooter />
    </div>
  );
}
