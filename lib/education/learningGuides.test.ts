import { describe, expect, test } from 'vitest';
import { GUIDE_SOURCE_CHECKED_ON, LEARNING_GUIDES, getLearningGuide, guideForPillar, learningGuideHref, learningGuideSearchText } from './learningGuides';
import { learningGuideMetadata, learningGuideSchema } from './learningGuideMetadata';
import sitemap from '@/app/sitemap';
import { SITE_URL } from '@/lib/siteMetadata';

describe('practical guide catalogue and safe routes', () => {
  test('provides one distinct guide per supported habit pillar', () => {
    expect(LEARNING_GUIDES.map(guide => guide.pillar).sort()).toEqual(['Fitness', 'Nutrition', 'Sleep', 'Stress']);
    expect(new Set(LEARNING_GUIDES.map(guide => guide.slug)).size).toBe(4);
    expect(guideForPillar('Systems')).toBeUndefined();
    expect(learningGuideHref('Systems')).toBeUndefined();
  });
  test.each([undefined, null, ['sleep-routines'], '__proto__', 'constructor', '<script>', 'SLEEP-ROUTINES', 'sleep-routines/other'])('rejects unknown or non-scalar guide names: %j', slug => {
    expect(getLearningGuide(slug)).toBeUndefined();
  });
  test('preserves practical preference in guide links without adding personal plan text', () => {
    expect(learningGuideHref('Sleep', 'routine')).toBe('/learn/sleep-routines?idea=routine');
    expect(learningGuideHref('Nutrition')).toBe('/learn/balanced-meals');
  });
  test('includes the practical article text in topic search', () => {
    expect(learningGuideSearchText(guideForPillar('Fitness')).toLowerCase()).toContain('talk but not sing');
    expect(learningGuideSearchText(guideForPillar('Nutrition')).toLowerCase()).toContain('wholegrain');
    expect(learningGuideSearchText(guideForPillar('Sleep')).toLowerCase()).toContain('caffeine');
    expect(learningGuideSearchText(undefined)).toBe('');
  });
});

describe('source and discovery contracts', () => {
  for (const guide of LEARNING_GUIDES) {
    test(guide.slug + ' has valid source references and unique jump targets', () => {
      const ids = guide.sources.map(source => source.id);
      expect(new Set(ids).size).toBe(ids.length);
      const targets = [...guide.sections.map(section => section.id), 'try-this-week', 'guide-sources', 'urgent-support'];
      expect(new Set(targets).size).toBe(targets.length);
      const allowedHosts = ['www.nhs.uk', 'www.hse.gov.uk', 'www.samaritans.org', 'www.who.int', 'www.cdc.gov', 'nutritionsource.hsph.harvard.edu'];
      for (const source of guide.sources) {
        const url = new URL(source.url);
        expect(url.protocol).toBe('https:');
        expect(allowedHosts).toContain(url.hostname);
        expect(source.supports.length).toBeGreaterThan(0);
        expect(source.scope.length).toBeGreaterThan(0);
        expect(source.publisher.length).toBeGreaterThan(0);
        expect(source.kind.length).toBeGreaterThan(0);
      }
      for (const id of [...guide.sections.flatMap(section => section.sourceIds), ...guide.ideaSourceIds]) {
        expect(ids).toContain(id);
      }
    });
    test(guide.slug + ' shares one canonical URL across metadata, schema and sitemap', () => {
      const url = SITE_URL + '/learn/' + guide.slug;
      const metadata = learningGuideMetadata(guide);
      expect(metadata.alternates?.canonical).toBe(url);
      expect(metadata.openGraph).toMatchObject({ type: 'article', url, modifiedTime: GUIDE_SOURCE_CHECKED_ON });
      const article = learningGuideSchema(guide)['@graph'][0];
      expect(article).toMatchObject({
        '@type': 'Article', url, mainEntityOfPage: url, dateModified: GUIDE_SOURCE_CHECKED_ON,
        author: { '@type': 'Organization', name: 'Healthcrest' },
        publisher: { name: 'Healthcrest Ltd' },
      });
      expect(sitemap().filter(entry => entry.url === url)).toHaveLength(1);
      const breadcrumbs = learningGuideSchema(guide)['@graph'][1];
      expect(breadcrumbs).toMatchObject({ itemListElement: [
        { position: 1, item: SITE_URL + '/' }, { position: 2, item: SITE_URL + '/learn' }, { position: 3, item: url },
      ] });
    });
  }
});

describe('international perspectives', () => {
  test.each([
    ['movement-and-strength', 'who-activity', 'World Health Organization'],
    ['balanced-meals', 'harvard-plate', 'Harvard The Nutrition Source'],
    ['sleep-routines', 'cdc-sleep', 'Centers for Disease Control and Prevention'],
    ['stress-and-support', 'who-stress', 'World Health Organization'],
  ])('%s connects its perspective to an identified source', (slug, sourceId, publisher) => {
    const guide = getLearningGuide(slug)!;
    const perspective = guide.sections.find(section => section.id === 'international-perspective')!;
    expect(perspective.sourceIds).toContain(sourceId);
    expect(guide.sources.find(source => source.id === sourceId)?.publisher).toBe(publisher);
  });
});
