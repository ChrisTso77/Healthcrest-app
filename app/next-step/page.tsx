import { parseJourneyConstraint, journeyAction } from '@/lib/education/startJourney';
import { pageMetadata } from '@/lib/siteMetadata';
import { SiteHeader, SiteFooter } from '@/components/SiteChrome';
import { HabitPlanner, type HabitPillar } from '@/components/HabitPlanner';
import '../landing.css';
import './next-step.css';

export const metadata = pageMetadata(
  "My next step | Healthcrest",
  "Turn an educational insight into one manageable everyday habit. Adapt a starter idea and download your next-step plan.",
  '/next-step',
);

export default async function NextStepPage({ searchParams }: {
  searchParams: Promise<{ pillar?: string | string[]; idea?: string | string[] }>;
}) {
  const { pillar, idea } = await searchParams;
  const constraint = parseJourneyConstraint(idea);
  let initialPillar: HabitPillar = 'Fitness';
  switch (pillar) {
    case 'nutrition': initialPillar = 'Nutrition'; break;
    case 'sleep': initialPillar = 'Sleep'; break;
    case 'stress': initialPillar = 'Stress'; break;
  }
  return (
    <div className="hc-landing hc-plan-page">
      <a className="hc-skip-link" href="#main-content">Skip to content</a>
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="hc-section hc-plan-main">
        <span className="hc-eyebrow">Health through everyday habits</span>
        <h1>One habit.<br /><em>Your next step.</em></h1>
        <p className="hc-plan-intro">Choose a pillar, adapt a starter idea and give it a place in your routine. Start with something manageable; you can adjust it as you learn.</p>
        <HabitPlanner initialPillar={initialPillar} initialAction={constraint ? journeyAction(initialPillar, constraint) : undefined} />
      </main>
      <SiteFooter />
    </div>
  );
}
