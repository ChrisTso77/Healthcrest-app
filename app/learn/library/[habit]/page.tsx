import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { editorialPreviewEnabled } from '@/lib/education/library/visibility';
import { getLesson } from '@/lib/education/library/lessons';
import { EVIDENCE, lessonClaimIds } from '@/lib/education/library/catalogue';
import { videoPackage } from '@/lib/education/library/video';
import type { Block } from '@/lib/education/library/types';
import { ClaimLinks, EducationEvidence } from '@/components/EducationEvidence';
import { EducationDiagram } from '@/components/EducationDiagram';
import { EducationQuiz } from '@/components/EducationQuiz';
import { EducationPathways } from '@/components/EducationPathways';

function Paragraph({ block }: { block: Block }) {
  return <section id={'lesson-' + block.id} tabIndex={-1}><h3>{block.title}</h3><p>{block.text}</p><ClaimLinks ids={block.claimIds} /></section>;
}

export async function generateMetadata({ params }: { params: Promise<{ habit: string }> }): Promise<Metadata> {
  if (!editorialPreviewEnabled()) notFound();
  const lesson = getLesson((await params).habit);
  if (!lesson) notFound();
  return { title: lesson.title + ' | Healthcrest editorial draft', description: lesson.subtitle, authors: [{ name: 'Healthcrest editorial draft, prepared with Codex' }] };
}

export default async function LessonPage({ params }: { params: Promise<{ habit: string }> }) {
  if (!editorialPreviewEnabled()) notFound();
  const lesson = getLesson((await params).habit);
  if (!lesson) notFound();
  const media = videoPackage(lesson);
  return <article>
    <nav aria-label="Lesson breadcrumb"><Link href="/learn/library" prefetch={false}>Learning library</Link> / <span aria-current="page">{lesson.id}</span></nav>
    <h1>{lesson.title}</h1><p>{lesson.subtitle}</p>
    <p>Draft prepared with Codex. Created <time dateTime={EVIDENCE.createdOn}>{EVIDENCE.createdOn}</time>. Independent clinical reviewer: none recorded. Claim-specific source checks and publication dates appear in the evidence register.</p>
    <nav aria-label="Learning levels"><ul className="hc-education-level-links"><li><a href="#essentials">1. Essentials</a></li><li><a href="#practical">2. Put it into practice</a></li><li><a href="#science">3. Understand the science</a></li><li><a href="#research">4. Explore the evidence</a></li></ul></nav>
    <section className="hc-education-safety" aria-labelledby="safety-title"><h2 id="safety-title">{lesson.safety.title}</h2><p>{lesson.safety.text}</p><ClaimLinks ids={lesson.safety.claimIds} /></section>
    <section id="essentials" tabIndex={-1}>
      <h2>Level 1 — Essential knowledge</h2><p className="hc-education-summary">{lesson.summary.text}</p><ClaimLinks ids={lesson.summary.claimIds} />
      {lesson.takeaways.map(block => <Paragraph key={block.id} block={block} />)}
      <EducationDiagram diagram={lesson.diagram} /><ClaimLinks ids={lesson.diagram.claimIds} />
    </section>
    <EducationPathways habit={lesson.id} />
    <section id="practical" tabIndex={-1}><h2>Level 2 — Put it into practice</h2>
      <p>Examples to adapt, not personal prescriptions or actions calculated from Explorer settings.</p>
      {lesson.practical.map(block => <Paragraph key={block.id} block={block} />)}
      <h3>Questions people ask</h3>{lesson.faqs.map(block => <details key={block.id} id={'faq-' + block.id}><summary>{block.title}</summary><p>{block.text}</p><ClaimLinks ids={block.claimIds} /></details>)}
      <h3>Check your understanding</h3><EducationQuiz quiz={lesson.quiz} /><ClaimLinks ids={lesson.quiz.claimIds} />
    </section>
    <section id="science" tabIndex={-1}><h2>Level 3 — Understand the science</h2>
      <details><summary>Open mechanisms, research and uncertainty</summary>{lesson.science.map(block => <Paragraph key={block.id} block={block} />)}</details>
      <h3>Terms explained</h3><dl>{lesson.glossary.map(item => <div key={item.term}><dt>{item.term}</dt><dd>{item.meaning}</dd></div>)}</dl>
    </section>
    <section id="research" tabIndex={-1}><h2>Level 4 — Explore the evidence</h2><EducationEvidence ids={lessonClaimIds(lesson.id)} /></section>
    <section id="video-source" tabIndex={-1}><h2>Educational video source package</h2>
      <p><strong>{media.status}.</strong> Learning objective: {media.objective} Planned duration: {media.durationSeconds} seconds.</p>
      <p>{media.review}</p><p>{media.visualRequirements}</p>
      <details><summary>Read the storyboard and voiceover transcript</summary><ol>{media.scenes.map((scene, index) => <li key={index}><h3>Scene {index + 1} · {scene.seconds} seconds</h3><p><strong>Visual:</strong> {scene.visual}</p><p><strong>Voiceover and captions:</strong> {scene.narration}</p><ClaimLinks ids={scene.claimIds} /></li>)}</ol></details>
      <a href={'/learn/library/' + lesson.id + '/video'} download={lesson.id + '-video-source.json'}>Download script, storyboard, transcript, WebVTT and references (JSON)</a>
    </section>
    <p><Link href="/learn/library" prefetch={false}>Compare all four habits and their interactions</Link></p>
  </article>;
}
