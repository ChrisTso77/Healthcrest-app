import Link from 'next/link';
import { MovementOptions } from '@/components/MovementOptions';
import { learningGuideHref } from '@/lib/education/learningGuides';
import { pageMetadata } from '@/lib/siteMetadata';
import { PILLAR_GUIDES } from '@/lib/education/healthGuide';
import { JOURNEY_TOPICS, JOURNEY_CONSTRAINTS, parseJourneyTopic, parseJourneyConstraint, journeyAction, journeyPlannerHref, journeyLearnHref, journeyExplorerHref } from '@/lib/education/startJourney';
import { SiteHeader, SiteFooter } from '@/components/SiteChrome';
import { UrgentSupport } from '@/components/UrgentSupport';
import '../landing.css';
import './start.css';

export const metadata = pageMetadata(
  'Find a starting point | Healthcrest',
  'Choose a health topic and a practical starting point, then learn, explore and adapt one manageable habit.',
  '/start',
);

export default async function StartPage({ searchParams }: {
  searchParams: Promise<{ pillar?: string | string[]; idea?: string | string[] }>;
}) {
  const params = await searchParams;
  const topic = parseJourneyTopic(params.pillar);
  const constraint = parseJourneyConstraint(params.idea) ?? 'none';
  const context = JOURNEY_CONSTRAINTS.find(item => item.key === constraint)!;
  const guide = topic ? PILLAR_GUIDES[topic.key] : undefined;

  return (
    <div className="hc-landing">
      <a className="hc-skip-link" href="#main-content">Skip to content</a>
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="hc-section hc-info-main hc-journey-main">
        <span className="hc-eyebrow">Health through everyday habits</span>
        <h1>Find your<br /><em>starting point.</em></h1>
        <p className="hc-journey-intro">Choose what you want to understand and one way to make a first step fit your day. This selects educational content and an editable idea. No account needed.</p>
        <form action="/start#your-starting-point" method="get" className="hc-journey-form">
          <fieldset>
            <legend>1. What would you like to explore?</legend>
            <div className="hc-journey-options">
              {JOURNEY_TOPICS.map(item => (
                <label key={item.key}>
                  <input type="radio" name="pillar" value={item.slug} required defaultChecked={topic?.key === item.key} />
                  <span><strong>{item.label}</strong><span>{item.question}</span></span>
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>2. What would make a first step easier?</legend>
            <p>Choose one starting point. You can adapt the idea later.</p>
            <div className="hc-journey-options">
              {JOURNEY_CONSTRAINTS.map(item => (
                <label key={item.key}>
                  <input type="radio" name="idea" value={item.key} defaultChecked={constraint === item.key} />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <button type="submit" className="hc-button hc-button-primary">Show my starting point</button>
          <p className="hc-journey-small">Your choices appear in the page address, so you can revisit the link. No symptom details are requested.</p>
        </form>

        {topic && guide && (
          <section id="your-starting-point" aria-labelledby="journey-result-title" className="hc-journey-result">
            <span className="hc-eyebrow">{topic.label} · {context.label}</span>
            <h2 id="journey-result-title">Your {topic.label.toLowerCase()} starting point</h2>
            <p className="hc-journey-goal">{guide.goal}</p>
            <p>{context.note}</p>
            <p><strong>One idea to adapt:</strong> {journeyAction(topic.key, constraint)}</p>
            <p className="hc-journey-small">This starting idea is selected by topic and practical preference, not calculated from your body or the Explorer’s settings.</p>
            {topic.key === 'Fitness' && constraint === 'access' && <MovementOptions guideHref={learningGuideHref('Fitness', constraint)!} />}
            <ol className="hc-journey-steps">
              <li>
                <span>01 · Understand</span><h3>Read the guidance</h3>
                <p>{guide.guidance}</p>
                <Link href={journeyLearnHref(topic.key, constraint)} prefetch={false} className="hc-text-link">Read the {topic.label.toLowerCase()} topic</Link>
              </li>
              <li>
                <span>02 · Explore</span><h3>See what a setting means</h3>
                <p>Start with the labelled 2D diagram. Change one example setting, read its value and connect it to the guidance. You can also try the 3D view and its visual key.</p>
                <Link href={journeyExplorerHref(topic.key, constraint)} prefetch={false} className="hc-text-link">Explore {topic.label.toLowerCase()} with labels</Link>
              </li>
              <li>
                <span>03 · Make it practical</span><h3>Adapt one manageable action</h3>
                <p>Open your starting idea in the planner. Edit it, choose a cue and decide what could help. Saving on your device is optional and manual.</p>
                <Link href={journeyPlannerHref(topic.key, constraint)} prefetch={false} className="hc-text-link">Adapt my {topic.label.toLowerCase()} idea</Link>
              </li>
            </ol>
            <p><a href={guide.sourceUrl} className="hc-text-link">{guide.sourceLabel}</a>. Source checked <time dateTime="2026-10-28">28 October 2026</time>.</p>
            {topic.key === 'Sleep' && constraint === 'routine' && <p>For shift work, also read <a href="https://www.hse.gov.uk/humanfactors/topics/shift-workers.htm" className="hc-text-link">HSE guidance for shift workers</a>. Plan around your main sleep period and seek support for persistent sleep problems or fatigue.</p>}
            {topic.key === 'Stress' && <UrgentSupport />}
          </section>
        )}
        <aside className="hc-model-note">General education for adults. Choose ideas that fit your health, ability and circumstances, alongside appropriate clinical care. The Explorer does not predict a personal health outcome.</aside>
      </main>
      <SiteFooter />
    </div>
  );
}
