import { describe, expect, test } from 'vitest';

import { createManualOverlay } from './createManualOverlay';

describe('createManualOverlay', () => {
  test('creates the canonical manual overlay', () => {
    expect(createManualOverlay()).toEqual({
      title: 'Manual configuration',
      status: 'Manual',
      keyOutcomes: [],
      evidenceLevel: null,
    });
  });

  test('creates independent outcome arrays', () => {
    const first = createManualOverlay();
    const second = createManualOverlay();

    expect(first).not.toBe(second);
    expect(first.keyOutcomes).not.toBe(second.keyOutcomes);
  });
});
