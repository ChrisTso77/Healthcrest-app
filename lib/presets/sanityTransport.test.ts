import { afterEach, describe, expect, test, vi } from 'vitest';
import { createClient } from '@sanity/client';
import { normalizeSanityPresets } from './normalize';
import seed from '../../pillars-seed-data-v3.json';

// Keep the real SDK, query encoding, response parsing, error mapping and
// cancellation pipeline. Only its final HTTP transport is a local fixture.
const client = () => createClient({
  projectId: 'fixture', dataset: 'production', apiVersion: '2024-01-01',
  useCdn: true, maxRetries: 0,
  // Select only the transport; retain the SDK/get-it middleware pipeline.
  resolveFetch: () => globalThis.fetch,
});
afterEach(() => vi.unstubAllGlobals());

describe('real Sanity SDK transport contract', () => {
  test('forwards Next cache options and keeps CMS text behind content review', async () => {
    const raw = { ...seed.scenarioPresets[0], slug: seed.scenarioPresets[0].slug.current,
      pillar: { title: 'Systems' }, title: 'Unreviewed fixture claim',
      narrativeOverlay: { headline: 'Unreviewed fixture claim', outcomes: ['Guaranteed recovery'] } };
    const transport = vi.fn(async () => Response.json({ result: [raw] }));
    vi.stubGlobal('fetch', transport);
    const query = '*[_type == "scenarioPreset" && slug.current == $slug]';
    const result = await client().fetch<unknown[]>(query, { slug: 'fixture-slug' }, {
      next: { revalidate: 300, tags: ['presets'] },
    });
    expect(transport).toHaveBeenCalledTimes(1);
    const [input, init] = transport.mock.calls[0] as unknown as [string, RequestInit & {next: unknown}];
    const url = new URL(input);
    expect(url.origin).toBe('https://fixture.apicdn.sanity.io');
    expect(url.pathname).toBe('/v2024-01-01/data/query/production');
    expect(url.searchParams.get('query')).toBe(query);
    expect(JSON.parse(url.searchParams.get('$slug')!)).toBe('fixture-slug');
    expect(init.method).toBe('GET');
    expect(init.next).toEqual({ revalidate: 300, tags: ['presets'] });
    const reviewed = normalizeSanityPresets(result);
    expect(reviewed).toHaveLength(1);
    expect(reviewed[0].title).toBe('Connected habits example');
    expect(JSON.stringify(reviewed)).not.toMatch(/Unreviewed fixture claim|Guaranteed recovery/);
  });

  test('maps an HTTP failure to a rejected request without returning CMS data', async () => {
    const transport = vi.fn(async () => Response.json({ error: { type: 'fixture', description: 'Fixture unavailable' } }, { status: 500 }));
    vi.stubGlobal('fetch', transport);
    await expect(client().fetch('*[]')).rejects.toMatchObject({ statusCode: 500 });
    expect(transport).toHaveBeenCalledTimes(1);
  });

  test('propagates cancellation to an in-flight transport', async () => {
    let started!: () => void;
    const ready = new Promise<void>(resolve => { started = resolve; });
    let transportSignal: AbortSignal | null | undefined;
    vi.stubGlobal('fetch', vi.fn((_input: unknown, init: RequestInit) => new Promise<Response>((_resolve, reject) => {
      transportSignal = init.signal;
      const abort = () => reject(new DOMException('Fixture cancelled', 'AbortError'));
      if (init.signal?.aborted) abort();
      else init.signal?.addEventListener('abort', abort, { once: true });
      started();
    })));
    const controller = new AbortController();
    const pending = client().fetch('*[]', {}, { signal: controller.signal });
    const rejected = expect(pending).rejects.toMatchObject({ name: 'AbortError' });
    await ready;
    controller.abort();
    await rejected;
    expect(transportSignal?.aborted).toBe(true);
  });
});
