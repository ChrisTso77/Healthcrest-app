import type { PillarParameters } from '@/state/PillarsStateTypes';

export function updatePillarParameter(
  current: PillarParameters,
  key: keyof PillarParameters,
  value: number
): PillarParameters {
  return {
    ...current,
    [key]: value,
  };
}
