const record = value => value !== null && typeof value === 'object' && !Array.isArray(value);
function ensure(condition, message) { if (!condition) throw new Error(message); }
const text = value => typeof value === 'string' && value.trim().length > 0;

// Application-specific consistency checks, not a general JSON-LD processor or rich-results certification.
export function assertStructuredData(snapshot, canonicalOrigin) {
  ensure(record(snapshot) && Array.isArray(snapshot.scripts) && snapshot.scripts.length > 0, 'Structured data is missing.');
  const nodes = [];
  for (const raw of snapshot.scripts) {
    let parsed;
    try { parsed = JSON.parse(raw); } catch { throw new Error('Structured data is invalid JSON.'); }
    for (const root of Array.isArray(parsed) ? parsed : [parsed]) {
      ensure(record(root) && root['@context'] === 'https://schema.org', 'Unexpected structured-data context.');
      const graph = root['@graph'] ?? [root];
      ensure(Array.isArray(graph) && graph.length > 0 && graph.every(record), 'Invalid structured-data graph.');
      nodes.push(...graph);
    }
  }
  ensure(nodes.every(node => ['WebSite', 'Article', 'BreadcrumbList'].includes(node['@type'])), 'Unexpected top-level structured-data type requires review.');
  const sites = nodes.filter(node => node['@type'] === 'WebSite');
  ensure(sites.length === 1 && sites[0].name === 'Healthcrest' && sites[0].url === canonicalOrigin && snapshot.siteName === sites[0].name, 'Website identity is inconsistent.');
  let canonical;
  try { canonical = new URL(snapshot.canonical); } catch { throw new Error('Canonical address is missing or invalid.'); }
  ensure(canonical.origin === canonicalOrigin && !canonical.search && !canonical.hash && !canonical.username && !canonical.password, 'Canonical address is not a public canonical URL.');
  const articles = nodes.filter(node => node['@type'] === 'Article');
  const trails = nodes.filter(node => node['@type'] === 'BreadcrumbList');
  if (!snapshot.guide) {
    ensure(articles.length === 0 && trails.length === 0, 'Unexpected guide markup on a non-guide page.');
    return { pages: 1, guides: 0, citations: 0 };
  }
  ensure(articles.length === 1 && trails.length === 1, 'A guide needs one Article and one breadcrumb trail.');
  const article = articles[0], visible = snapshot.guide;
  ensure(article.url === canonical.href && article.mainEntityOfPage === canonical.href, 'Article URL differs from its canonical page.');
  ensure(text(visible.headline) && text(snapshot.description) && article.headline === visible.headline && article.description === snapshot.description, 'Article title or description is inconsistent.');
  ensure(article.inLanguage === 'en-GB' && snapshot.openGraphType === 'article', 'Guide language or sharing type is inconsistent.');
  ensure(text(visible.author) && article.author?.['@type'] === 'Organization' && article.author.name === visible.author && article.author.url === canonicalOrigin + '/about' && Array.isArray(snapshot.authors) && snapshot.authors.length === 1 && snapshot.authors[0] === visible.author, 'Guide author differs from its visible byline or metadata.');
  ensure(article.publisher?.['@type'] === 'Organization' && article.publisher.name === 'Healthcrest Ltd' && article.publisher.url === canonicalOrigin, 'Guide publisher is inconsistent.');
  const date = article.dateModified;
  ensure(typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date) && Number.isFinite(Date.parse(date + 'T00:00:00Z')) && new Date(date + 'T00:00:00Z').toISOString().slice(0, 10) === date && date === visible.checkedOn && date === snapshot.modifiedTime, 'Source-check date differs between the page, metadata and Article.');
  ensure(article.datePublished === undefined && article.reviewedBy === undefined && article.lastReviewed === undefined, 'New publication or clinical-review claims require explicit editorial review.');
  ensure(Array.isArray(visible.sources) && visible.sources.length > 0 && Array.isArray(article.citation) && article.citation.length === visible.sources.length, 'Guide citations are missing or incomplete.');
  for (let index = 0; index < visible.sources.length; index += 1) {
    const source = visible.sources[index], citation = article.citation[index];
    ensure(record(source) && record(citation) && text(source.name) && citation['@type'] === 'CreativeWork' && citation.name === source.name && citation.url === source.url, 'Structured citation differs from the displayed source.');
    let url;
    try { url = new URL(source.url); } catch { throw new Error('Source address is invalid.'); }
    ensure(url.protocol === 'https:' && !url.username && !url.password, 'Source address is not a public HTTPS URL.');
  }
  const items = trails[0].itemListElement;
  ensure(Array.isArray(visible.breadcrumbs) && visible.breadcrumbs.length >= 2 && Array.isArray(items) && items.length === visible.breadcrumbs.length, 'Breadcrumb trail is missing or incomplete.');
  for (let index = 0; index < items.length; index += 1) {
    const item = items[index], shown = visible.breadcrumbs[index];
    ensure(record(item) && record(shown) && item['@type'] === 'ListItem' && item.position === index + 1 && text(shown.name) && item.name === shown.name && item.item === shown.url, 'Structured breadcrumb differs from the visible trail.');
  }
  ensure(items[0].item === canonicalOrigin + '/' && items.at(-1).item === canonical.href, 'Breadcrumb endpoints do not identify this page.');
  return { pages: 1, guides: 1, citations: article.citation.length };
}
