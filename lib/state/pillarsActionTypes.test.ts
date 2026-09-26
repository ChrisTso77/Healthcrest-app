import { describe, expectTypeOf, test } from 'vitest';

import type {
  PillarsAction,
  PillarParameters,
  SceneId,
} from '@/state/PillarsStateTypes';

describe('PillarsAction contract', () => {
  test('SET_SCENE payload is SceneId', () => {
    type Action = Extract<PillarsAction, { type: 'SET_SCENE' }>;

    expectTypeOf<Action['payload']>()
      .toEqualTypeOf<SceneId>();
  });

  test('UPDATE_PARAM key is constrained to PillarParameters', () => {
    type Action = Extract<PillarsAction, { type: 'UPDATE_PARAM' }>;

    expectTypeOf<Action['payload']['key']>()
      .toEqualTypeOf<keyof PillarParameters>();

    expectTypeOf<Action['payload']['value']>()
      .toEqualTypeOf<number>();
  });

  test('SET_RENDER_MODE uses the state render-mode contract', () => {
    type Action = Extract<PillarsAction, { type: 'SET_RENDER_MODE' }>;

    expectTypeOf<Action['payload']>()
      .toEqualTypeOf<'high-3d' | 'lite-3d' | '2d-canvas'>();
  });
});
