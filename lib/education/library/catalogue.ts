import register from './evidence-register.json';
import { LESSONS } from './lessons';

export const EVIDENCE = register;
export const claimById = (id: string) => EVIDENCE.claims.find(claim => claim.id === id);
export const sourceById = (id: string) => EVIDENCE.sources.find(source => source.id === id);
export function lessonClaimIds(id: string): string[] {
  const lesson = LESSONS.find(item => item.id === id);
  if (!lesson) return [];
  return [...new Set([
    ...[lesson.summary, ...lesson.takeaways, ...lesson.practical, ...lesson.science, ...lesson.faqs, lesson.safety].flatMap(block => block.claimIds),
    ...lesson.diagram.claimIds, ...lesson.quiz.claimIds, ...lesson.video.scenes.flatMap(scene => scene.claimIds),
  ])];
}

// Joined metadata avoids duplicate citations and inconsistent verification dates.
export function evidenceForLesson(id: string) {
  return lessonClaimIds(id).map(claimById).filter(claim => claim !== undefined);
}

export const INTERACTIONS = [
  { from: 'Movement', to: 'Sleep', text: 'Exercise trials support improvements in some sleep outcomes. Different activities, people and measures limit a single recommendation.', claimId: 'LINK-001', strength: 'Trial evidence; editorial certainty low pending full-text appraisal' },
  { from: 'Sleep', to: 'Food', text: 'A short sleep-extension trial affected energy intake in selected habitual short sleepers. It is not a general weight-loss prescription.', claimId: 'LINK-002', strength: 'Trial evidence in a selected population; wider applicability limited' },
  { from: 'Stress', to: 'Sleep and food', text: 'Stress can disturb sleep or change appetite. This does not identify the cause of an individual symptom.', claimId: 'STRESS-001', strength: 'Established broad relationship; no individual effect size' },
  { from: 'Food and movement', to: 'Combined interventions', text: 'Supported programmes delayed diabetes in selected high-risk adults. Benefit versus usual care does not establish synergy or validate an app score.', claimId: 'LINK-003', strength: 'Moderate certainty for the studied outcome; disease-specific programme is not offered here' },
];
