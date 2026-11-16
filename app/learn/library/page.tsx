import Link from 'next/link';
import { notFound } from 'next/navigation';
import { editorialPreviewEnabled } from '@/lib/education/library/visibility';
import { LESSONS } from '@/lib/education/library/lessons';
import { EVIDENCE, INTERACTIONS } from '@/lib/education/library/catalogue';
import { EducationPathways } from '@/components/EducationPathways';
import { ClaimLinks, EducationEvidence } from '@/components/EducationEvidence';

export default function EducationLibraryPage() {
  if (!editorialPreviewEnabled()) notFound();
  return <>
    <h1>Four habits. Four levels of learning.</h1>
    <p>Start with a short explanation, choose practical examples, understand the science, or inspect the evidence. Movement, food, sleep and stress support are an educational framework, not a complete model or score for health.</p>
    <EducationPathways />
    <nav aria-label="Four-habit lessons" className="hc-education-cards">{LESSONS.map(lesson => <article key={lesson.id}>
      <h2><Link href={'/learn/library/' + lesson.id} prefetch={false}>{lesson.title}</Link></h2>
      <p>{lesson.subtitle}</p><p>{lesson.summary.text}</p><ClaimLinks ids={lesson.summary.claimIds} />
    </article>)}</nav>
    <section aria-labelledby="connected-title">
      <h2 id="connected-title">How the habits connect</h2>
      <p>Evidence for a relationship is specific to an outcome and population. A combined programme outperforming usual care does not prove that its components have a special reinforcing effect, or synergy.</p>
      {INTERACTIONS.map(item => <article key={item.claimId}><h3>{item.from} → {item.to}</h3><p>{item.text}</p><p>{item.strength}</p><ClaimLinks ids={[item.claimId]} /></article>)}
      <p>One gradual pathway is to choose a manageable action, arrange the opportunity or support it needs, then reflect on whether it fitted everyday life. This is a planning example, not a clinically evaluated Healthcrest programme.</p><ClaimLinks ids={['BEH-001', 'MODEL-001']} />
    </section>
    <section aria-labelledby="evidence-title" id="evidence">
      <h2 id="evidence-title">Explore the evidence register</h2>
      <p>Certainty is an editorial appraisal unless the original review’s grading is explicitly named. An original abstract check is not full-text appraisal. Clinical reviewer: none recorded. Draft prepared with Codex; not independently clinically reviewed. Created {EVIDENCE.createdOn}; proposed next source review {EVIDENCE.reviewDue}. No publication date is assigned.</p>
      <EducationEvidence ids={EVIDENCE.claims.map(claim => claim.id)} />
      <h3>Sources not verified</h3>
      {EVIDENCE.sources.filter(source => source.verificationStatus === 'NOT VERIFIED').map(source => <p key={source.id}><a href={source.url}>{source.title}</a>: {source.limitations}</p>)}
      <p>For corrections, use <Link href="/contact" prefetch={false}>Healthcrest’s contact route</Link>. Affected draft claims should be held for reassessment before release.</p>
    </section>
  </>;
}
