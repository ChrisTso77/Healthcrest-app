import Link from 'next/link';
import { MovementOptions } from '@/components/MovementOptions';
import { notFound } from 'next/navigation';
import { SiteHeader, SiteFooter } from '@/components/SiteChrome';
import { UrgentSupport } from '@/components/UrgentSupport';
import { getLearningGuide, LEARNING_GUIDES, GUIDE_SOURCE_CHECKED_ON, learningGuideHref, type LearningGuide } from '@/lib/education/learningGuides';
import { learningGuideMetadata, learningGuideSchema } from '@/lib/education/learningGuideMetadata';
import { parseJourneyConstraint, journeyPlannerHref, journeyExplorerHref, journeyLearnHref } from '@/lib/education/startJourney';
import '../../landing.css';
import '../learn.css';
import './guide.css';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ idea?: string | string[] }>;
};
export const dynamicParams = false;
export function generateStaticParams() {
  return LEARNING_GUIDES.map(guide => ({ slug: guide.slug }));
}
export async function generateMetadata({ params }: Pick<Props, 'params'>) {
  const guide = getLearningGuide((await params).slug);
  if (!guide) notFound();
  return learningGuideMetadata(guide);
}
function SourceLinks({ guide, ids }: { guide: LearningGuide; ids: readonly string[] }) {
  return ids.length > 0 ? (
    <p className="hc-guide-citations">References: {ids.map((id, index) => {
      const position = guide.sources.findIndex(source => source.id === id);
      const source = guide.sources[position];
      return <span key={id}>{index > 0 && ' · '}<a href={'#source-' + id} aria-label={'Source ' + (position + 1) + ': ' + source.title}>[{position + 1}]</a></span>;
    })}</p>
  ) : null;
}

export default async function LearningGuidePage({ params, searchParams }: Props) {
  const guide = getLearningGuide((await params).slug);
  if (!guide) notFound();
  const constraint = parseJourneyConstraint((await searchParams).idea);
  const planner = journeyPlannerHref(guide.pillar, constraint);
  const explorer = journeyExplorerHref(guide.pillar, constraint) + (constraint ? '' : '&view=2d');
  const schema = learningGuideSchema(guide);
  return (
    <div className="hc-landing">
      <a className="hc-skip-link" href="#main-content">Skip to content</a>
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="hc-section hc-guide-main">
        <nav aria-label="Breadcrumb" className="hc-guide-breadcrumb">
          <Link href="/" prefetch={false}>Home</Link><span aria-hidden="true">/</span>
          <Link href="/learn" prefetch={false}>Learn</Link><span aria-hidden="true">/</span>
          <span aria-current="page">{guide.topicLabel}</span>
        </nav>
        <article className="hc-guide" aria-labelledby="guide-title">
          <header className="hc-guide-header">
            <span className="hc-eyebrow">A practical guide · {guide.topicLabel}</span>
            <h1 id="guide-title">{guide.title}</h1>
            <p className="hc-guide-summary">{guide.summary}</p>
            <p className="hc-guide-byline">Published by Healthcrest · Sources checked <time dateTime={GUIDE_SOURCE_CHECKED_ON}>{new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(GUIDE_SOURCE_CHECKED_ON + 'T00:00:00.000Z'))}</time>. <Link href="/about" prefetch={false}>About the creator and our approach</Link>.</p>
            <p className="hc-guide-audience">{guide.audience}</p>
          </header>
          <section aria-labelledby="guide-takeaways" className="hc-guide-takeaways">
            <h2 id="guide-takeaways">At a glance</h2>
            <ul>{guide.takeaways.map(text => <li key={text}>{text}</li>)}</ul>
          </section>
          {guide.pillar === 'Fitness' && <MovementOptions />}
          {guide.pillar === 'Stress' && <div id="urgent-support" tabIndex={-1} className="hc-guide-urgent"><UrgentSupport headingLevel={2} /></div>}
          <nav aria-label="In this guide" className="hc-guide-contents">
            <p>In this guide</p>
            <ul>
              {guide.pillar === 'Stress' && <li><a href="#urgent-support">Urgent support</a></li>}
              {guide.sections.map(section => <li key={section.id}><a href={'#' + section.id}>{section.title}</a></li>)}
              <li><a href="#try-this-week">Choose a step for this week</a></li>
              <li><a href="#guide-sources">Sources and scope</a></li>
            </ul>
          </nav>
          <div className="hc-guide-grid">
            <div className="hc-guide-body">
              {guide.sections.map(section => (
                <section key={section.id} id={section.id} tabIndex={-1} aria-labelledby={section.id + '-heading'}>
                  <h2 id={section.id + '-heading'}>{section.title}</h2>
                  {section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
                  <SourceLinks guide={guide} ids={section.sourceIds} />
                </section>
              ))}
              <section id="try-this-week" tabIndex={-1} aria-labelledby="try-this-week-heading" className="hc-guide-practice">
                <h2 id="try-this-week-heading">Choose a step for this week</h2>
                <p>Here are ideas to adapt to your circumstances. Choose one, make it manageable and decide when to try it.</p>
                <ul>{guide.ideas.map(idea => <li key={idea}>{idea}</li>)}</ul>
                <SourceLinks guide={guide} ids={guide.ideaSourceIds} />
                <h3>Notice what helps, then adjust</h3>
                <p>{guide.reflection}</p>
                <p>The planner offers optional daily check-ins and a weekly review. Seven days is a planning window; the time needed to form a habit and changes in health vary.</p>
                <Link href={planner} prefetch={false} className="hc-button hc-button-primary">Make my {guide.topicLabel.toLowerCase()} plan</Link>
              </section>
            </div>
            <aside aria-label="Put this guide into practice" className="hc-guide-tools">
              <span className="hc-eyebrow">From understanding to action</span>
              <h2>Keep your next step manageable.</h2>
              <p>Adapt a starter idea in your own words. Saving and restoring your plan are choices you make on the device.</p>
              {constraint && <p>Your practical preference continues into the planner.</p>}
              <Link href={planner} prefetch={false} className="hc-text-link">Open the habit planner</Link>
              <Link href={explorer} prefetch={false} className="hc-text-link">Explore with labels</Link>
              <Link href={journeyLearnHref(guide.pillar, constraint)} prefetch={false} className="hc-text-link">Back to topics and terms</Link>
              <p className="hc-guide-tool-note">The Explorer illustrates chosen settings. Use these sources and appropriate clinical advice when making decisions about your health.</p>
            </aside>
          </div>
          <section id="guide-sources" tabIndex={-1} aria-labelledby="guide-sources-title" className="hc-guide-sources">
            <h2 id="guide-sources-title">Sources and scope</h2>
            <p>The date above records an editorial source check. Read the original pages for full context. The references support general guidance; our practical examples are ideas to adapt.</p>
            <ol>
              {guide.sources.map(source => (
                <li key={source.id} id={'source-' + source.id} tabIndex={-1}>
                  <a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}<span className="hc-visually-hidden"> (opens in a new tab)</span></a>
                  <p><strong>Source context:</strong> {source.publisher} · {source.kind}</p>
                  <p><strong>Supports:</strong> {source.supports}</p>
                  <p><strong>Scope:</strong> {source.scope}</p>
                </li>
              ))}
            </ol>
            <p>For a correction or a question about this content, <Link href="/contact" prefetch={false}>contact Healthcrest</Link>.</p>
          </section>
          <nav aria-label="More practical guides" className="hc-guide-related">
            <h2>Keep learning</h2>
            <ul>{LEARNING_GUIDES.filter(item => item.slug !== guide.slug).map(item => (
              <li key={item.slug}><Link href={learningGuideHref(item.pillar, constraint)!} prefetch={false}>{item.title}</Link></li>
            ))}</ul>
          </nav>
        </article>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
      </main>
      <SiteFooter />
    </div>
  );
}
