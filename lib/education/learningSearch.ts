import type { LearningGuide } from './learningGuides';

export const LEARNING_SEARCH_LIMIT = 120;

function normalize(text: string): string {
  return text.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase()
    .replace(/['’]/g, '').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
}

function learningQueryWords(query: string): string[] {
  return [...new Set(normalize(query.slice(0, LEARNING_SEARCH_LIMIT)).split(' ').filter(Boolean))];
}

export function matchesLearningQuery(query: string, ...text: string[]): boolean {
  if (!query.trim()) return true;
  const words = learningQueryWords(query);
  if (words.length === 0) return false;
  const haystack = normalize(text.join(' '));
  return words.every(word => haystack.includes(word));
}

export function findGuideSearchMatch(guide: LearningGuide | undefined, query: string): {
  title: string; fragment: string; kind: 'section' | 'source';
} | undefined {
  if (!guide || learningQueryWords(query).length === 0) return undefined;
  const section = guide.sections.find(item => matchesLearningQuery(query, item.title, ...item.paragraphs));
  if (section) return { title: section.title, fragment: section.id, kind: 'section' };
  const source = guide.sources.find(item => matchesLearningQuery(query, item.title, item.publisher, item.kind, item.supports, item.scope));
  return source ? { title: source.title, fragment: 'source-' + source.id, kind: 'source' } : undefined;
}
