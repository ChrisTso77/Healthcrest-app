import { describe, test, expect, vi } from 'vitest';
import { recoverLegacyHabit } from './legacyHabitRecovery';
import { HABIT_DRAFT_KEY } from './habitDraft';
const drafts = () => Object.fromEntries(['Fitness', 'Nutrition', 'Sleep', 'Stress'].map(p => [p,
  { action: '  Synthetic — ゆっくり  ', cue: '', support: '', reflection: '<script>literal</script>', week: null }]));
describe('explicit read-only legacy recovery preparation', () => {
  test.each([1, 2, 3])('recovers supported version %s without touching storage', version => {
    const raw = JSON.stringify({ version, selected: 'Sleep', drafts: drafts() });
    const getItem = vi.fn(() => raw), setItem = vi.fn(), removeItem = vi.fn(), clear = vi.fn();
    const storage = { getItem, setItem, removeItem, clear };
    const result = recoverLegacyHabit(storage);
    expect(result.status).toBe('available');
    if (result.status === 'available') {
      expect(result.saved.drafts.Sleep.action).toBe('  Synthetic — ゆっくり  ');
      expect(result.saved.drafts.Sleep.reflection).toBe(version === 1 ? '' : '<script>literal</script>');
      result.saved.drafts.Sleep.action = 'Edited memory';
    }
    expect(getItem).toHaveBeenCalledExactlyOnceWith(HABIT_DRAFT_KEY);
    expect(raw).toContain('Synthetic');
    for (const write of [setItem, removeItem, clear]) expect(write).not.toHaveBeenCalled();
  });
  test('distinguishes missing and malformed copies without deletion', () => {
    expect(recoverLegacyHabit({ getItem: () => null })).toEqual({ status: 'missing' });
    for (const raw of ['{bad', '[]', 'x'.repeat(120001)])
      expect(recoverLegacyHabit({ getItem: () => raw })).toEqual({ status: 'invalid' });
  });
  test('storage denial fails safely without echoing sensitive exception data', () => {
    expect(recoverLegacyHabit({ getItem: () => { throw new Error('PRIVATE-NOTE'); } }))
      .toEqual({ status: 'unavailable' });
  });
});
