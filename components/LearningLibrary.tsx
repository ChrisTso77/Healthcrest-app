'use client';

import { guideForPillar, learningGuideHref, learningGuideSearchText } from '@/lib/education/learningGuides';
import { journeyPlannerHref, journeyExplorerHref, type JourneyConstraint } from '@/lib/education/startJourney';
import { useId, useRef, useState } from 'react';
import Link from 'next/link';
import { UrgentSupport, URGENT_SUPPORT_SEARCH_TERMS } from '@/components/UrgentSupport';
import { ENGINE_GLOSSARY, EVIDENCE_GUIDES, PARAMETER_GUIDES, PILLAR_GUIDES } from '@/lib/education/healthGuide';

const topics = [
  { key: 'Fitness', label: 'Movement', slug: 'fitness' },
  { key: 'Nutrition', label: 'Food', slug: 'nutrition' },
  { key: 'Sleep', label: 'Sleep', slug: 'sleep' },
  { key: 'Stress', label: 'Stress & support', slug: 'stress' },
  { key: 'Systems', label: 'Connecting the habits', slug: 'systems' },
] as const;
const terms: ReadonlyArray<readonly [string, string]> = [
  ['Non-pharmacological', 'Actions that do not involve a medicine, such as everyday movement, food, sleep and ways to manage stress. These can complement appropriate clinical care.'],
  ['MVPA (weekly aerobic activity)', PARAMETER_GUIDES.aerobic.meaning],
  [PARAMETER_GUIDES.sleep.label, PARAMETER_GUIDES.sleep.meaning],
  [PARAMETER_GUIDES.nutrition.label, PARAMETER_GUIDES.nutrition.meaning],
  [PARAMETER_GUIDES.stress.label, PARAMETER_GUIDES.stress.meaning],
  ...ENGINE_GLOSSARY,
];

export function LearningLibrary({ journeyConstraint }: { journeyConstraint?: JourneyConstraint }) {
  const [query, setQuery] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const id = useId();
  const needle = query.trim().toLowerCase();
  const matches = (...text: string[]) => text.join(' ').toLowerCase().includes(needle);
  const shownTopics = topics.filter(topic => matches(topic.label, topic.key, learningGuideSearchText(guideForPillar(topic.key)), ...Object.values(PILLAR_GUIDES[topic.key]), topic.key === 'Stress' ? URGENT_SUPPORT_SEARCH_TERMS : ''));
  const shownTerms = terms.filter(([term, meaning]) => matches(term, meaning));
  const shownEvidence = Object.entries(EVIDENCE_GUIDES).filter(([label, meaning]) => matches(label, meaning));
  const countLabel = (count: number, label: string) => count + ' ' + label + (count === 1 ? '' : 's');
  const total = shownTopics.length + shownTerms.length + shownEvidence.length;

  return (
    <div className="hc-learning-library">
      <div className="hc-learn-search">
        <label htmlFor={id + '-search'}>Search health topics and terms</label>
        <p id={id + '-help'}>Try sleep, movement, MVPA, HRV or experimental.</p>
        <div className="hc-learn-search-controls">
          <input ref={input} id={id + '-search'} type="search" value={query} maxLength={120}
            aria-describedby={id + '-help'} onChange={event => setQuery(event.target.value)} />
          {query && <button type="button" onClick={() => { setQuery(''); input.current?.focus(); }}>Clear search</button>}
        </div>
      </div>
      <noscript className="hc-learn-no-script"><p className="hc-model-note">Search needs JavaScript. All topics, terms and references are available below without searching.</p></noscript>
      <p role="status" className="hc-learn-result-count">{countLabel(shownTopics.length, 'topic')}, {countLabel(shownTerms.length, 'term')} and {countLabel(shownEvidence.length, 'evidence label')} found.</p>
      {total === 0 && <p className="hc-model-note">No matching guidance. Try a broader word such as sleep or movement, or clear the search to browse everything.</p>}

      {shownTopics.length > 0 && (
        <section aria-labelledby={id + '-topics'} className="hc-learn-section">
          <h2 id={id + '-topics'}>Everyday habit guidance</h2>
          <p>The NHS references support general habit guidance. The Habit Explorer’s visual rules are illustrations created for Healthcrest.</p>
          <div className="hc-learn-topic-grid">
            {shownTopics.map(topic => {
              const guide = PILLAR_GUIDES[topic.key];
              const practicalGuide = learningGuideHref(topic.key, journeyConstraint);
              return (
                <article id={'topic-' + topic.slug} key={topic.key} aria-labelledby={id + '-' + topic.slug} className="hc-learn-topic">
                  <h3 id={id + '-' + topic.slug}>{topic.label}</h3>
                  <p className="hc-learn-goal">{guide.goal}</p>
                  <p>{guide.guidance}</p>
                  <p><strong>One possible first step: </strong>{guide.firstStep}</p>
                  {topic.key === 'Stress' && <UrgentSupport />}
                  <details>
                    <summary>How the Habit Explorer illustrates {topic.label.toLowerCase()}</summary>
                    <p>{guide.visual}</p>
                  </details>
                  <a href={guide.sourceUrl} target="_blank" rel="noopener noreferrer" className="hc-text-link">
                    {guide.sourceLabel}<span className="hc-visually-hidden"> (opens in a new tab)</span>
                  </a>
                  {practicalGuide && <Link prefetch={false} href={practicalGuide} className="hc-text-link">Read the practical guide</Link>}
                  <div className="hc-learn-topic-actions">
                    <Link prefetch={false} href={journeyExplorerHref(topic.key, journeyConstraint)} className="hc-text-link">Explore in the Habit Explorer</Link>
                    <Link prefetch={false} href={journeyPlannerHref(topic.key, journeyConstraint)} className="hc-text-link">Make a next step</Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {shownTerms.length > 0 && (
        <section aria-labelledby={id + '-terms'} className="hc-learn-section">
          <h2 id={id + '-terms'}>Words used in the Habit Explorer</h2>
          <dl className="hc-learn-definitions">
            {shownTerms.map(([term, meaning]) => (
              <div key={term}><dt>{term}</dt><dd>{meaning}</dd></div>
            ))}
          </dl>
        </section>
      )}

      {shownEvidence.length > 0 && (
        <section aria-labelledby={id + '-evidence'} className="hc-learn-section">
          <h2 id={id + '-evidence'}>What evidence labels mean</h2>
          <p>These labels describe how scenario content is tagged in the app. They do not validate every visual effect or outcome statement.</p>
          <dl className="hc-learn-definitions">
            {shownEvidence.map(([label, meaning]) => (
              <div key={label}><dt>{label}</dt><dd>{meaning}</dd></div>
            ))}
          </dl>
        </section>
      )}
    </div>
  );
}
