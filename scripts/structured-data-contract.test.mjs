import test from 'node:test';
import assert from 'node:assert/strict';
import { assertStructuredData } from './structured-data-contract.mjs';

const origin = 'https://www.healthcrest.uk';
function fixture() {
  const canonical = origin + '/learn/example';
  const website = { '@context': 'https://schema.org', '@type': 'WebSite', name: 'Healthcrest', url: origin };
  const article = {
    '@type': 'Article', headline: 'A practical guide', description: 'A description.',
    url: canonical, mainEntityOfPage: canonical, inLanguage: 'en-GB', dateModified: '2026-10-28',
    author: { '@type': 'Organization', name: 'Healthcrest', url: origin + '/about' },
    publisher: { '@type': 'Organization', name: 'Healthcrest Ltd', url: origin },
    citation: [{ '@type': 'CreativeWork', name: 'Example source', url: 'https://www.nhs.uk/example/' }],
  };
  const breadcrumbs = [
    { name: 'Home', url: origin + '/' }, { name: 'Learn', url: origin + '/learn' }, { name: 'Food', url: canonical },
  ];
  const trail = { '@type': 'BreadcrumbList', itemListElement: breadcrumbs.map((item, index) => ({
    '@type': 'ListItem', position: index + 1, name: item.name, item: item.url,
  })) };
  const snapshot = {
    siteName: 'Healthcrest', canonical, description: article.description, openGraphType: 'article',
    modifiedTime: '2026-10-28', authors: ['Healthcrest'],
    guide: { headline: article.headline, author: 'Healthcrest', checkedOn: '2026-10-28',
      sources: [{ name: 'Example source', url: 'https://www.nhs.uk/example/' }], breadcrumbs },
  };
  return { website, article, trail, snapshot };
}
function snapshot(data = fixture()) {
  return { ...data.snapshot, scripts: [JSON.stringify(data.website), JSON.stringify({ '@context': 'https://schema.org', '@graph': [data.article, data.trail] })] };
}
test('accepts matching visible article/byline/date/sources/breadcrumbs', () => {
  assert.deepEqual(assertStructuredData(snapshot(), origin), { pages: 1, guides: 1, citations: 1 });
});
test('accepts a public non-guide with only the shared website identity', () => {
  const data = fixture();
  assert.deepEqual(assertStructuredData({ ...data.snapshot, canonical: origin + '/about', guide: null, scripts: [JSON.stringify(data.website)] }, origin), { pages: 1, guides: 0, citations: 0 });
});
test('normalises the equivalent root canonical with no trailing slash', () => {
  const data = fixture();
  assert.equal(assertStructuredData({ ...data.snapshot, canonical: origin, guide: null, scripts: [JSON.stringify(data.website)] }, origin).pages, 1);
});
test('accepts equivalent top-level JSON-LD document arrays', () => {
  const data = fixture(), value = snapshot(data);
  value.scripts = [JSON.stringify([data.website, { '@context': 'https://schema.org', '@graph': [data.article, data.trail] }])];
  assert.equal(assertStructuredData(value, origin).guides, 1);
});
for (const [name, mutate] of [
  ['no markup', value => { value.scripts = []; }],
  ['malformed JSON', value => { value.scripts[1] = '{'; }],
  ['unexpected context', value => { value.scripts[0] = JSON.stringify({ '@context': 'https://other.test', '@type': 'WebSite' }); }],
  ['duplicate identity', value => { value.scripts.push(value.scripts[0]); }],
  ['wrong site name', value => { value.siteName = 'Other'; }],
  ['canonical query', value => { value.canonical += '?private=example'; }],
  ['canonical outside primary domain', value => { value.canonical = 'https://other.test/learn/example'; }],
  ['guide without article', value => { value.scripts.pop(); }],
  ['phantom guide markup', value => { value.guide = null; }],
  ['missing visible title', value => { value.guide.headline = ''; }],
  ['missing meta description', value => { delete value.description; }],
  ['different byline', value => { value.guide.author = 'An unapproved reviewer'; }],
  ['inherited wrong author metadata', value => { value.authors = ['Different author']; }],
  ['different source-check date', value => { value.guide.checkedOn = '2026-10-27'; }],
  ['different sharing date', value => { value.modifiedTime = '2026-10-27'; }],
  ['missing displayed sources', value => { value.guide.sources = []; }],
  ['different source URL', value => { value.guide.sources[0].url = 'https://www.who.int/example'; }],
  ['different source title', value => { value.guide.sources[0].name = 'Another claim'; }],
  ['different visible breadcrumb', value => { value.guide.breadcrumbs[2].name = 'Other'; }],
  ['missing visible breadcrumb', value => { value.guide.breadcrumbs.pop(); }],
]) {
  test('rejects ' + name, () => {
    const value = snapshot(); mutate(value);
    assert.throws(() => assertStructuredData(value, origin));
  });
}
for (const [name, mutate] of [
  ['article query contamination', data => { data.article.url += '?idea=routine'; }],
  ['false page identity', data => { data.article.mainEntityOfPage = origin; }],
  ['invalid calendar date', data => { data.article.dateModified = data.snapshot.modifiedTime = data.snapshot.guide.checkedOn = '2026-02-31'; }],
  ['unrecorded publication date', data => { data.article.datePublished = '2026-10-28'; }],
  ['unapproved clinical reviewer', data => { data.article.reviewedBy = { name: 'A reviewer' }; }],
  ['omitted citation', data => { data.article.citation = []; }],
  ['invented citation', data => { data.article.citation.push({ name: 'Invented source' }); }],
  ['non-HTTPS source', data => { data.article.citation[0].url = data.snapshot.guide.sources[0].url = 'http://www.nhs.uk/example/'; }],
  ['non-sequential positions', data => { data.trail.itemListElement[1].position = 5; }],
  ['wrong breadcrumb destination', data => { data.trail.itemListElement[2].item += '#other'; }],
  ['new medical-service type', data => { data.article['@type'] = 'MedicalOrganization'; }],
]) {
  test('rejects ' + name, () => {
    const data = fixture(); mutate(data);
    assert.throws(() => assertStructuredData(snapshot(data), origin));
  });
}
