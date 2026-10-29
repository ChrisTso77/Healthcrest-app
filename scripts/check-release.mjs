import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { setTimeout as delay } from 'node:timers/promises';
import { chromium } from '@playwright/test';
import { assertStructuredData } from './structured-data-contract.mjs';

const canonicalOrigin = 'https://www.healthcrest.uk';
const suppliedOrigin = process.env.HEALTHCREST_RELEASE_ORIGIN;
const probe = new URL(suppliedOrigin || 'http://127.0.0.1:3002');
if (probe.username || probe.password || probe.search || probe.hash || probe.pathname !== '/' ||
    (probe.protocol !== 'https:' && !(probe.protocol === 'http:' && ['127.0.0.1', 'localhost'].includes(probe.hostname)))) {
  throw new Error('Release origin must be an HTTPS origin, or HTTP localhost, without credentials, a path, query or fragment.');
}
const origin = probe.origin;
const output = 'artifacts/release-readiness';
const requiredPaths = ['/', '/start', '/learn', '/engine', '/next-step', '/about', '/contact', '/storage', '/privacy',
  '/learn/movement-and-strength', '/learn/balanced-meals', '/learn/sleep-routines', '/learn/stress-and-support'];
const report = { origin, canonicalOrigin, passed: false, checks: [] };
let server;
let serverExited = false;
let browser;
const telemetryRequests = [];
const failedAssets = [];
const internalPaths = new Set();
const pageIds = new Map();
const internalFragments = new Map();
const pageMetadata = [];
const structuredPages = [];
const iconPaths = new Set();

async function checkPageStructuredData(page, path) {
  const snapshot = await page.evaluate(isGuide => {
    const content = selector => document.querySelector(selector)?.getAttribute('content') ?? null;
    const cleanText = element => {
      if (!element) return null;
      const copy = element.cloneNode(true);
      copy.querySelectorAll('.hc-visually-hidden, [aria-hidden="true"]').forEach(node => node.remove());
      return copy.textContent.trim();
    };
    return {
      scripts: Array.from(document.querySelectorAll('script[type="application/ld+json"]'), node => node.textContent),
      siteName: content('meta[property="og:site_name"]'),
      canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
      description: content('meta[name="description"]'), openGraphType: content('meta[property="og:type"]'),
      modifiedTime: content('meta[property="article:modified_time"]'),
      authors: Array.from(document.querySelectorAll('meta[name="author"]'), node => node.getAttribute('content')),
      guide: isGuide ? {
        headline: cleanText(document.querySelector('#guide-title')),
        author: cleanText(document.querySelector('.hc-guide-publisher')),
        checkedOn: document.querySelector('.hc-guide-byline time')?.getAttribute('datetime'),
        sources: Array.from(document.querySelectorAll('#guide-sources ol > li'), node => {
          const link = node.querySelector('a');
          return { name: cleanText(link), url: link?.getAttribute('href') };
        }),
        breadcrumbs: Array.from(document.querySelectorAll('nav[aria-label="Breadcrumb"] a, nav[aria-label="Breadcrumb"] [aria-current="page"]'), node => ({
          name: cleanText(node), href: node.getAttribute('href'),
        })),
      } : null,
    };
  }, path.startsWith('/learn/'));
  ensure(snapshot.canonical && new URL(snapshot.canonical).href === new URL(path, canonicalOrigin).href, 'Structured-data check found an unexpected canonical page: ' + path);
  if (snapshot.guide) snapshot.guide.breadcrumbs = snapshot.guide.breadcrumbs.map(item => ({
    name: item.name, url: item.href ? new URL(item.href, canonicalOrigin).href : snapshot.canonical,
  }));
  return assertStructuredData(snapshot, canonicalOrigin);
}

function ensure(condition, message) {
  if (!condition) throw new Error(message);
}
async function check(name, run) {
  try {
    const detail = await run();
    report.checks.push({ name, passed: true, ...detail });
    console.log('RELEASE_CHECK ' + JSON.stringify({ name, passed: true, ...detail }));
    return detail;
  } catch (error) {
    report.checks.push({ name, passed: false, message: error.message });
    throw error;
  }
}

await mkdir(output, { recursive: true });
try {
  if (!suppliedOrigin) {
    server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '3002'], { stdio: 'inherit', env: process.env });
    server.on('error', () => { serverExited = true; });
    server.on('exit', () => { serverExited = true; });
    let ready = false;
    for (let attempt = 0; attempt < 120; attempt += 1) {
      if (serverExited) throw new Error('Release-check production server could not start.');
      try {
        const response = await fetch(origin, { signal: AbortSignal.timeout(1000) });
        if (response.ok) { ready = true; break; }
      } catch { /* Wait for the built application to start. */ }
      await delay(250);
    }
    ensure(ready, 'Release-check production server did not become ready.');
  }

  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  context.setDefaultTimeout(10_000);
  context.setDefaultNavigationTimeout(20_000);
  // Audit a fresh visitor without contacting unrelated third-party services.
  await context.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
  const page = await context.newPage();
  page.on('request', request => {
    if (/\/_vercel\/(?:insights|speed-insights)\//.test(request.url())) telemetryRequests.push(new URL(request.url()).pathname);
  });
  page.on('response', response => {
    const url = new URL(response.url());
    if (url.origin === origin && url.pathname.startsWith('/_next/static/') && response.status() >= 400) failedAssets.push(url.pathname);
  });
  const paths = [];
  await check('canonical sitemap and robots', async () => {
    const sitemap = await context.request.get(origin + '/sitemap.xml', { maxRedirects: 0 });
    ensure(sitemap.status() === 200, 'Sitemap did not return HTTP 200.');
    const xml = await sitemap.text();
    const locations = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
    ensure(locations.length >= requiredPaths.length, 'Sitemap is missing the practical guides.');
    for (const location of locations) {
      const url = new URL(location);
      ensure(url.origin === canonicalOrigin && !url.search && !url.hash, 'Sitemap contains a noncanonical address.');
      ensure(!paths.includes(url.pathname), 'Sitemap contains a duplicate path.');
      paths.push(url.pathname);
    }
    ensure(requiredPaths.every(path => paths.includes(path)), 'Sitemap is missing a required public page or practical guide.');
    const robots = await context.request.get(origin + '/robots.txt', { maxRedirects: 0 });
    ensure(robots.status() === 200 && (await robots.text()).includes('Sitemap: ' + canonicalOrigin + '/sitemap.xml'), 'Robots discovery is missing its canonical sitemap.');
    return { pages: paths.length };
  });

  for (const path of paths) {
    await check('public page ' + path, async () => {
      const target = new URL(path, origin);
      if (path === '/engine') target.searchParams.set('view', '2d');
      const response = await page.goto(target.href, { waitUntil: 'domcontentloaded' });
      ensure(response?.status() === 200, 'Public page did not return HTTP 200: ' + path);
      const final = new URL(page.url());
      ensure(final.origin === origin && final.pathname === path, 'Public page redirected away from its expected deployment path: ' + path);
      ensure(response.headers()['referrer-policy'] === 'no-referrer', 'Missing no-referrer header: ' + path);
      const title = await page.title();
      ensure(title.includes('Healthcrest'), 'Missing Healthcrest title: ' + path);
      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      ensure(canonical && new URL(canonical).href === new URL(path, canonicalOrigin).href, 'Incorrect canonical: ' + path);
      const description = await page.locator('meta[name="description"]').getAttribute('content');
      ensure(description?.trim(), 'Missing description: ' + path);
      const icons = await page.locator('link[rel="icon"]').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')));
      ensure(icons.length > 0, 'Missing browser-tab icon metadata: ' + path);
      for (const href of icons) {
        const icon = new URL(href, page.url());
        ensure(icon.origin === origin && icon.pathname === '/icon', 'Unexpected browser-tab icon destination: ' + path);
        iconPaths.add(icon.pathname + icon.search);
      }
      pageMetadata.push({ path, title, description });
      // The planner also has a print-only h1; assess headings exposed in this screen view.
      ensure(await page.getByRole('heading', { level: 1 }).count() === 1, 'Expected one exposed primary heading: ' + path);
      ensure(/^en(?:-|$)/.test(await page.locator('html').getAttribute('lang') || ''), 'Missing English document language: ' + path);
      const sharingUrl = await page.locator('meta[property="og:url"]').getAttribute('content');
      ensure(sharingUrl && new URL(sharingUrl).href === new URL(path, canonicalOrigin).href, 'Incorrect sharing URL: ' + path);
      structuredPages.push(await checkPageStructuredData(page, path));
      const hrefs = await page.locator('a[href]').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')));
      pageIds.set(path, new Set(await page.locator('[id]').evaluateAll(nodes => nodes.map(node => node.id))));
      for (const href of hrefs) {
        const link = new URL(href, page.url());
        if ([origin, canonicalOrigin].includes(link.origin)) {
          internalPaths.add(link.pathname);
          if (link.hash) internalFragments.set(link.pathname + link.hash, { path: link.pathname, id: decodeURIComponent(link.hash.slice(1)) });
        }
      }
      if (path === '/') {
        const logo = page.locator('.hc-header img');
        await logo.waitFor({ state: 'visible' });
        await logo.evaluate(image => image.decode());
        ensure(await logo.evaluate(image => image.naturalWidth > 0), 'Header logo did not load.');
      }
      return { path, status: response.status() };
    });
  }

  await check('structured data and visible guide references', async () => ({
    pages: structuredPages.length,
    guides: structuredPages.reduce((count, value) => count + value.guides, 0),
    citations: structuredPages.reduce((count, value) => count + value.citations, 0),
  }));
  await check('guide discovery metadata with public preferences', async () => {
    const guides = paths.filter(path => path.startsWith('/learn/'));
    for (const path of guides) {
      const response = await page.goto(origin + path + '?idea=routine&unused=seo-check', { waitUntil: 'domcontentloaded' });
      ensure(response?.status() === 200, 'Guide preference variant did not return HTTP 200.');
      await checkPageStructuredData(page, path);
      const sharing = await page.locator('meta[property="og:url"]').getAttribute('content');
      ensure(sharing && new URL(sharing).href === new URL(path, canonicalOrigin).href, 'Guide sharing URL retained public preferences.');
    }
    return { guides: guides.length };
  });

  await check('unique public metadata', async () => {
    ensure(new Set(pageMetadata.map(item => item.title)).size === pageMetadata.length, 'Public pages share a title.');
    ensure(new Set(pageMetadata.map(item => item.description)).size === pageMetadata.length, 'Public pages share a description.');
    return { pages: pageMetadata.length };
  });
  await check('internal fragment destinations', async () => {
    for (const [link, target] of internalFragments) {
      ensure(pageIds.get(target.path)?.has(target.id), 'Missing fragment in the default public page: ' + link);
    }
    return { fragments: internalFragments.size };
  });

  await check('internal link destinations', async () => {
    for (const path of internalPaths) {
      if (paths.includes(path)) continue;
      const response = await context.request.get(new URL(path, origin).href, { maxRedirects: 0 });
      ensure(response.status() === 200, 'Broken or redirected internal link: ' + path);
    }
    return { destinations: internalPaths.size };
  });
  await check('social image and hummingbird media', async () => {
    const image = await context.request.get(origin + '/opengraph-image', { maxRedirects: 0 });
    const imageBytes = await image.body();
    ensure(image.status() === 200 && imageBytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) && imageBytes.subarray(-12).equals(Buffer.from([0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130])), 'Social image is not a complete PNG response.');
    const still = await context.request.get(origin + '/media/healthcrest-hummingbird-still.jpg', { maxRedirects: 0 });
    const stillBytes = await still.body();
    ensure(still.status() === 200 && stillBytes[0] === 255 && stillBytes[1] === 216, 'Hummingbird still did not load as JPEG.');
    const film = await context.request.get(origin + '/media/healthcrest-hummingbird-opaque.webm', { maxRedirects: 0, headers: { Range: 'bytes=0-31' } });
    const filmBytes = await film.body();
    ensure([200, 206].includes(film.status()) && filmBytes.subarray(0, 4).equals(Buffer.from([26, 69, 223, 163])), 'Hummingbird film did not load as WebM.');
    return { assets: 3 };
  });
  await check('browser-tab icon metadata and fallback', async () => {
    const assertIcon = async response => {
      const bytes = await response.body();
      ensure(response.status() === 200 && response.headers()['content-type']?.startsWith('image/png'), 'Browser-tab icon did not return a PNG.');
      ensure(bytes.length >= 32 && bytes.length <= 16384 &&
        bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) &&
        bytes.subarray(-12).equals(Buffer.from([0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130])), 'Browser-tab icon is incomplete or exceeds 16 KiB.');
      ensure(bytes.readUInt32BE(16) === 64 && bytes.readUInt32BE(20) === 64, 'Browser-tab icon dimensions changed.');
    };
    ensure(iconPaths.size > 0, 'No public icon metadata was checked.');
    for (const path of iconPaths) {
      await assertIcon(await context.request.get(origin + path, { maxRedirects: 0 }));
    }
    await assertIcon(await context.request.get(origin + '/favicon.ico', { maxRedirects: 0 }));
    const decoded = await page.evaluate(async href => {
      const image = new Image(); image.src = href; await image.decode();
      return { width: image.naturalWidth, height: image.naturalHeight };
    }, origin + '/favicon.ico');
    ensure(decoded.width === 64 && decoded.height === 64, 'Browser could not decode the fallback icon.');
    return { pages: paths.length, metadataIcons: iconPaths.size, fallbackRedirects: 0, maximumBytes: 16384 };
  });
  await check('missing page recovery and indexing', async () => {
    for (const path of ['/healthcrest-release-check-missing', '/learn/healthcrest-release-check-missing']) {
      const response = await page.goto(origin + path, { waitUntil: 'domcontentloaded' });
      ensure(response?.status() === 404, 'Missing page did not return HTTP 404: ' + path);
      ensure(await page.getByRole('heading', { level: 1 }).textContent() === 'Page not found', 'Missing branded recovery page.');
      const directives = await page.locator('meta[name="robots"]').evaluateAll(nodes => nodes.map(node => node.getAttribute('content')).join(','));
      ensure(directives.includes('noindex'), 'Missing page is not marked noindex.');
    }
    return { pages: 2 };
  });
  await check('fresh-visitor assets and measurement', async () => {
    ensure(failedAssets.length === 0, 'Static application assets failed to load.');
    ensure(telemetryRequests.length === 0, 'Optional measurement loaded for a fresh visitor.');
    return { failedAssets: failedAssets.length, telemetryRequests: telemetryRequests.length };
  });
  report.passed = true;
} finally {
  await writeFile(output + '/summary.json', JSON.stringify({
    ...report,
    scope: 'Read-only smoke checks of a fresh browser against the built application or explicitly supplied origin. Fragment targets use default public page DOMs; query-dependent states and external sources need separate tests. No claim about provider dashboards, legal review or every clinical statement.',
  }, null, 2));
  await browser?.close();
  server?.kill('SIGTERM');
}
