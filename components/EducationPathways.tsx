'use client';

import { useId, useState } from 'react';
import Link from 'next/link';
import { AUDIENCES, REGIONS } from '@/lib/education/library/pathways';
import type { Audience, Region } from '@/lib/education/library/types';

export function EducationPathways({ habit }: { habit?: string }) {
  const id = useId();
  const [audience, setAudience] = useState<Audience>('beginner');
  const [region, setRegion] = useState<Region>('global');
  const selectedAudience = AUDIENCES.find(item => item.id === audience)!;
  const selectedRegion = REGIONS.find(item => item.id === region)!;
  const regionalText = audience === 'older' && region === 'uk'
    ? 'For UK readers aged 65+, NHS guidance includes daily activity, with strength, balance and flexibility on at least two days alongside suitable aerobic activity. Adapt choices to fitness, health and support; a personal dose is not calculated here.'
    : selectedRegion.text;
  const regionalClaims = audience === 'older' && region === 'uk' ? ['MOV-006'] : selectedRegion.claimIds;
  return <section className="hc-education-pathways" aria-labelledby={id + '-title'}>
    <h2 id={id + '-title'}>Choose a reading pathway</h2>
    <p>These choices change reading context only. They are not a health profile, are not saved, and do not infer your age or location.</p>
    <div className="hc-education-selects">
      <label htmlFor={id + '-audience'}>Reading context<select id={id + '-audience'} value={audience} onChange={event => setAudience(event.target.value as Audience)}>{AUDIENCES.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
      <label htmlFor={id + '-region'}>Guidance context<select id={id + '-region'} value={region} onChange={event => setRegion(event.target.value as Region)}>{REGIONS.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
    </div>
    <div aria-live="polite" aria-atomic="true">
      <h3>{selectedAudience.label}</h3><p>{selectedAudience.text}</p>
      <h3>{selectedRegion.label}</h3><p>{audience === 'teens' ? 'Adult numerical recommendations are not shown in this teen pathway. Use the age-specific context above and appropriate local guidance.' : regionalText}</p>
    </div>
    <p>Pathway references: {[...new Set([...selectedAudience.claimIds, ...(audience === 'teens' ? [] : regionalClaims)])].map(claim => <a key={claim} href={'/learn/library#claim-' + claim}>{claim} </a>)}</p>
    {audience !== 'teens' ? <p className="hc-education-actions"><Link href="/next-step" prefetch={false}>Adapt an adult next step</Link> <Link href={'/engine?view=2d' + (habit ? '&pillar=' + ({ movement: 'fitness', food: 'nutrition', sleep: 'sleep', stress: 'stress' }[habit] ?? 'systems') : '')} prefetch={false}>Explore the labelled adult illustration</Link></p> : <p>Contextual adult Planner and Explorer actions are omitted from this reading panel. Site navigation remains available; this is not an age or access restriction. Adult research examples elsewhere remain labelled and are not recommendations for teenagers.</p>}
    <noscript><p>Pathway switching needs JavaScript. The default is a beginner/global reading context. Teenagers should use age-specific guidance and trusted support; adult numerical examples do not apply automatically.</p></noscript>
  </section>;
}
