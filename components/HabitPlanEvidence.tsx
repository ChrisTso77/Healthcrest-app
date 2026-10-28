import Link from 'next/link';
import { guideForPillar, GUIDE_SOURCE_CHECKED_ON } from '@/lib/education/learningGuides';
import type { HabitPillar } from '@/lib/education/habitDraft';

export function HabitPlanEvidence({ pillar, actionId }: { pillar: HabitPillar; actionId: string }) {
  const guide = guideForPillar(pillar);
  if (!guide) return null;
  const perspective = guide.sections.find(section => section.id === 'international-perspective');
  const sources = guide.sources.filter(source => perspective?.sourceIds.includes(source.id));
  return (
    <section id="habit-plan-evidence" tabIndex={-1} aria-labelledby="habit-plan-evidence-title" className="hc-plan-evidence">
      <h3 id="habit-plan-evidence-title">Evidence for your next step</h3>
      <p>{guide.audience}</p>
      <Link href={'/learn/' + guide.slug} prefetch={false} className="hc-text-link">Read the practical {guide.topicLabel.toLowerCase()} guide</Link>
      {perspective && sources.length > 0 && <details key={pillar}>
        <summary>Compare an international perspective</summary>
        <div className="hc-plan-evidence-content">
          <h4>{perspective.title}</h4>
          {perspective.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          {sources.map(source => <div key={source.id} className="hc-plan-evidence-source">
            <a href={source.url} target="_blank" rel="noopener noreferrer" className="hc-text-link">
              {source.title}<span className="hc-visually-hidden"> (opens in a new tab)</span>
            </a>
            <p>{source.publisher} · {source.kind}</p>
            <p><strong>What it supports:</strong> {source.supports}</p>
            <p><strong>Keep in mind:</strong> {source.scope}</p>
          </div>)}
        </div>
      </details>}
      <p className="hc-plan-evidence-check">Source context checked <time dateTime={GUIDE_SOURCE_CHECKED_ON}>{new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(GUIDE_SOURCE_CHECKED_ON + 'T00:00:00.000Z'))}</time>. Linking a source does not imply endorsement of Healthcrest or validate the Explorer’s animation.</p>
      <a href={'#' + actionId} className="hc-text-link">Return to my action</a>
    </section>
  );
}
