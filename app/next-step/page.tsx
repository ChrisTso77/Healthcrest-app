import { parseJourneyTopic, parseJourneyConstraint, journeyAction } from '@/lib/education/startJourney';
import { findGuideStarter } from '@/lib/education/guideStarter';
import { learningGuideHref } from '@/lib/education/learningGuides';
import { pageMetadata } from '@/lib/siteMetadata';
import { SiteHeader, SiteFooter } from '@/components/SiteChrome';
import { HabitPlanner, type HabitPillar } from '@/components/HabitPlanner';
import '../landing.css';
import './next-step.css';

export const metadata = pageMetadata(
  "My next step | Healthcrest",
  "Turn an educational insight into one manageable everyday habit. Adapt a starter idea, try a seven-day plan and reflect on what helps.",
  '/next-step',
);

export default async function NextStepPage({ searchParams }: {
  searchParams: Promise<{ pillar?: string | string[]; idea?: string | string[]; starter?: string | string[] }>;
}) {
  const { pillar, idea, starter } = await searchParams;
  const constraint = parseJourneyConstraint(idea);
  const topic = parseJourneyTopic(pillar);
  const initialPillar: HabitPillar = topic?.key ?? 'Fitness';
  const chosenStarter = topic ? findGuideStarter(initialPillar, starter) : undefined;
  return (
    <div className="hc-landing hc-plan-page">
      <a className="hc-skip-link" href="#main-content">Skip to content</a>
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="hc-section hc-plan-main">
        <span className="hc-eyebrow">Health through everyday habits</span>
        <h1>One habit.<br /><em>Your next step.</em></h1>
        <p className="hc-plan-intro">Choose a pillar, adapt a starter idea and give it a place in your routine. Try a seven-day plan with optional daily check-ins and a weekly review. Start with something manageable; you can adjust it as you learn.</p>
        <HabitPlanner initialPillar={initialPillar}
          initialAction={chosenStarter?.idea.text ?? (constraint ? journeyAction(initialPillar, constraint) : undefined)}
          initialGuideSource={chosenStarter ? { title: chosenStarter.guide.title, href: learningGuideHref(initialPillar, constraint)! + '#try-this-week' } : undefined} />
      </main>
      <SiteFooter />
    </div>
  );
}
