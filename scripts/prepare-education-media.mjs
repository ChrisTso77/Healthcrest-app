import { readFile, writeFile, mkdir } from 'node:fs/promises';
import ts from 'typescript';

// Generate review artifacts from the authoritative typed lesson content. No
// network, CMS write, publication or actual media production is performed.
const raw = await readFile('lib/education/library/lessons.ts', 'utf8');
const compiled = ts.transpileModule(raw, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { LESSONS } = await import('data:text/javascript;base64,' + Buffer.from(compiled).toString('base64'));
const registerPath = 'lib/education/library/evidence-register.json';
const register = JSON.parse(await readFile(registerPath, 'utf8'));
const legacyCode = ts.transpileModule(await readFile('lib/education/learningGuides.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { LEARNING_GUIDES } = await import('data:text/javascript;base64,' + Buffer.from(legacyCode).toString('base64'));
register.existingContentInventory = LEARNING_GUIDES.map(guide => ({
  slug: guide.slug, title: guide.title, route: '/learn/' + guide.slug,
  status: 'Existing reviewed catalogue preserved; inclusion is not new clinical approval',
  sections: guide.sections.map(section => ({ id: section.id, title: section.title, sourceIds: section.sourceIds })),
  sourceMappings: guide.sources.map(source => ({ legacyId: source.id, registerSourceId: register.sources.find(item => item.url === source.url)?.id ?? null, url: source.url,
    status: register.sources.some(item => item.url === source.url && item.verificationStatus === 'VERIFIED') ? 'Source accessed in this assessment; scope still claim-specific' : 'Repository reference only; NOT VERIFIED in this assessment' })),
}));
const { AUDIENCES, REGIONS } = await import('data:text/javascript;base64,' + Buffer.from(ts.transpileModule(await readFile('lib/education/library/pathways.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText).toString('base64'));
const { buildCaptions } = await import('data:text/javascript;base64,' + Buffer.from(ts.transpileModule(await readFile('lib/education/library/captions.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText).toString('base64'));
const locations = new Map(register.claims.map(claim => [claim.id, new Set(['/learn/library#claim-' + claim.id])]));
for (const lesson of LESSONS) {
  const path = '/learn/library/' + lesson.id;
  for (const block of [lesson.summary, ...lesson.takeaways, ...lesson.practical, ...lesson.science, ...lesson.faqs, lesson.safety]) {
    for (const id of block.claimIds) locations.get(id).add(path + '#' + (block.id === 'summary' ? 'essentials' : block.id === 'safety' ? 'safety-title' : (lesson.faqs.includes(block) ? 'faq-' : 'lesson-') + block.id));
  }
  for (const id of [...lesson.diagram.claimIds, ...lesson.quiz.claimIds]) locations.get(id).add(path);
  const elapsed = lesson.video.scenes.reduce((sum, scene) => sum + scene.seconds, 0);
  const captions = buildCaptions(lesson.video.scenes);
  for (const scene of lesson.video.scenes) scene.claimIds.forEach(id => locations.get(id).add(path + '#video-source'));
  const claims = [...new Set(lesson.video.scenes.flatMap(scene => scene.claimIds))];
  const references = [...new Set(claims.flatMap(id => register.claims.find(claim => claim.id === id).supportingReferences))].map(id => register.sources.find(source => source.id === id));
  await mkdir('docs/education/media', { recursive: true });
  await writeFile('docs/education/media/' + lesson.id + '.json', JSON.stringify({
    status: 'Draft source package; no produced video or audio exists',
    title: lesson.title, objective: lesson.video.objective, durationSeconds: elapsed,
    review: 'Independent clinical review of narration, labels, captions and final visuals required before publication. No reviewer or approval recorded.',
    visualRequirements: 'Use static labelled diagrams; no flashing, forced motion, body measurements or outcome predictions. Supply meaningful audio description through narration and a text alternative. Keep captions readable at mobile sizes. Do not use third-party embeds or tracking.',
    scenes: lesson.video.scenes, transcript: lesson.video.scenes.map(scene => scene.narration).join('\n\n'), captions, claims, references,
  }, null, 2) + '\n');
  await writeFile('docs/education/media/' + lesson.id + '.vtt', captions);
}
for (const context of [...AUDIENCES, ...REGIONS]) for (const id of context.claimIds) locations.get(id).add('/learn/library#pathway-' + context.id);
for (const claim of register.claims) claim.websiteContentLocations = [...locations.get(claim.id)].sort();
// Pathway IDs correspond to options, rather than hidden/invented fragment targets.
for (const claim of register.claims) claim.websiteContentLocations = claim.websiteContentLocations.map(path => path.includes('#pathway-') ? path.split('#')[0] : path).filter((path, index, all) => all.indexOf(path) === index);
await writeFile(registerPath, JSON.stringify(register, null, 2) + '\n');
console.log('Prepared four draft video packages and captions; updated claim locations.');
