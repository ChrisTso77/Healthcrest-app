import { beforeEach, describe, expect, test, vi } from 'vitest';
import { NextRequest } from 'next/server';
const { fetchMock } = vi.hoisted(() => ({ fetchMock: vi.fn() }));
vi.mock('@sanity/client', () => ({ createClient: () => ({ fetch: fetchMock }) }));
import { GET } from '../../app/api/presets/route';
import seed from '../../pillars-seed-data-v3.json';

beforeEach(() => fetchMock.mockReset());
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
      visualMetaphor: 'Tissue damage', associatedPillar: { _id: 'pillar-systems', title: 'Systems', slug: 'systems' }, presets: [old] }]);
    const body = await (await GET(new NextRequest('https://example.test/api/presets?scene=5'))).json();
    expect(body.data.presets[0].title).toBe('Connected habits example');
    expect(body.data.associatedPillar).toEqual({ _id: 'pillar-systems', title: 'Systems', slug: 'systems' });
    expect(JSON.stringify(body)).not.toMatch(/Guaranteed recovery|Tissue damage|Oxytocin Shield/);
  });
  test('narrative uses reviewed wording without publishing arbitrary CMS claims', async () => {
    const body = await (await GET(new NextRequest('https://example.test/api/presets?type=narrative'))).json();
    expect(body.data.clinicalAlignment).toContain('does not diagnose');
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
