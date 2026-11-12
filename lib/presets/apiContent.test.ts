import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { NextRequest } from 'next/server';
const { fetchMock } = vi.hoisted(() => ({ fetchMock: vi.fn() }));
vi.mock('@sanity/client', () => ({ createClient: () => ({ fetch: fetchMock }) }));
import { GET } from '../../app/api/presets/route';
import seed from '../../pillars-seed-data-v3.json';

beforeEach(() => { fetchMock.mockReset(); });
afterEach(() => vi.restoreAllMocks());
describe('reviewed content API paths', () => {
  const source = seed.scenarioPresets[0];
  const old = { ...source, slug: source.slug.current, title: 'Legacy clinical claim',
    pillar: { title: 'Systems' },
    narrativeOverlay: { headline: 'Oxytocin Shield Active', outcomes: ['Guaranteed recovery'] } };
  test('list and slug requests replace legacy CMS wording', async () => {
    fetchMock.mockResolvedValue([old]);
    for (const suffix of ['', '?slug=integrated-harmony']) {
      const response = await GET(new NextRequest('https://example.test/api/presets' + suffix));
      expect(response.status).toBe(200);
      const body = await response.json();
      const item = Array.isArray(body.data) ? body.data[0] : body.data;
      expect(item.title).toBe('Connected habits example');
      expect(JSON.stringify(body)).not.toMatch(/Oxytocin Shield|Guaranteed recovery|Legacy clinical claim/);
    }
  });
  test('scene responses curate nested presets and withhold unreviewed storyboard text', async () => {
    fetchMock.mockResolvedValue([{ _id: 'scene-five', sceneNumber: 5, title: 'Guaranteed recovery',
      visualMetaphor: 'Tissue damage', associatedPillar: { _id: 'pillar-systems', title: 'Systems', slug: 'systems' }, presets: [{ ...old, visualProps: { coreColor: '#abcdef', particleDensity: 40, claim: 'Guaranteed recovery' } }] }]);
    const body = await (await GET(new NextRequest('https://example.test/api/presets?scene=5'))).json();
    expect(body.data.presets[0].title).toBe('Connected habits example');
    expect(body.data.presets[0]).toMatchObject({ _id: old._id, healthStatus: old.healthStatus, visualProps: { coreColor: '#abcdef', particleDensity: 40 } });
    expect(body.data.presets[0].narrativeOverlay.headline).toBe(body.data.presets[0].headline);
    expect(body.data.associatedPillar).toEqual({ _id: 'pillar-systems', title: 'Systems', slug: 'systems' });
    expect(JSON.stringify(body)).not.toMatch(/Guaranteed recovery|Tissue damage|Oxytocin Shield/);
  });
  test.each(['5junk', '5.1', '0', '-1', 'Infinity', '9007199254740992', ' 5', '05'])(
    'rejects invalid scene %s before contacting the CMS', async scene => {
      const response = await GET(new NextRequest('https://example.test/api/presets?scene=' + encodeURIComponent(scene)));
      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({ error: 'Scene must be a positive integer' });
      expect(fetchMock).not.toHaveBeenCalled();
    });
  test('CMS failure preserves a generic response and logs no provider details', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    fetchMock.mockRejectedValue(new Error('synthetic-private-provider-detail'));
    const response = await GET(new NextRequest('https://example.test/api/presets'));
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'Internal Server Error fetching scenario presets' });
    expect(log).toHaveBeenCalledExactlyOnceWith('Failed to fetch scenario presets from Sanity');
  });
  test('narrative uses reviewed wording without publishing arbitrary CMS claims', async () => {
    const body = await (await GET(new NextRequest('https://example.test/api/presets?type=narrative'))).json();
    expect(body.data.clinicalAlignment).toContain('does not diagnose');
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
