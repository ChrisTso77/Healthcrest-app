import type { Lesson } from './types';
import { claimById, sourceById } from './catalogue';
import { buildCaptions } from './captions';

export function videoPackage(lesson: Lesson) {
  const elapsed = lesson.video.scenes.reduce((sum, scene) => sum + scene.seconds, 0);
  const captions = buildCaptions(lesson.video.scenes);
  const claims = [...new Set(lesson.video.scenes.flatMap(scene => scene.claimIds))];
  const references = [...new Set(claims.flatMap(id => claimById(id)?.supportingReferences ?? []))].map(sourceById);
  return {
    status: 'Draft source package; no produced video or audio exists',
    title: lesson.title, objective: lesson.video.objective, durationSeconds: elapsed,
    review: 'Independent clinical review of narration, labels, captions and final visuals required before publication. No reviewer or approval recorded.',
    visualRequirements: 'Use static labelled diagrams; no flashing, forced motion, body measurements or outcome predictions. Supply meaningful audio description through narration and a text alternative. Keep captions readable at mobile sizes. Do not use third-party embeds or tracking.',
    scenes: lesson.video.scenes, transcript: lesson.video.scenes.map(scene => scene.narration).join('\n\n'),
    captions, claims, references,
  };
}
