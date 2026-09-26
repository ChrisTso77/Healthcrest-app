import { describe, expect, test } from 'vitest';

import { calculateCameraPosition } from './calculateCameraPosition';

describe('calculateCameraPosition', () => {
  test('places zero azimuth and elevation on positive z axis', () => {
    const result = calculateCameraPosition({
      orbitAzimuth: 0,
      orbitElevation: 0,
      zoomDistance: 1,
    });

    expect(result.x).toBeCloseTo(0);
    expect(result.y).toBeCloseTo(0);
    expect(result.z).toBeCloseTo(5);
  });

  test('rotates 90 degrees azimuth onto positive x axis', () => {
    const result = calculateCameraPosition({
      orbitAzimuth: 90,
      orbitElevation: 0,
      zoomDistance: 1,
    });

    expect(result.x).toBeCloseTo(5);
    expect(result.y).toBeCloseTo(0);
    expect(result.z).toBeCloseTo(0);
  });

  test('applies elevation', () => {
    const result = calculateCameraPosition({
      orbitAzimuth: 0,
      orbitElevation: 90,
      zoomDistance: 1,
    });

    expect(result.x).toBeCloseTo(0);
    expect(result.y).toBeCloseTo(5);
    expect(result.z).toBeCloseTo(0);
  });

  test('clamps camera radius to minimum 2.5', () => {
    const result = calculateCameraPosition({
      orbitAzimuth: 0,
      orbitElevation: 0,
      zoomDistance: 100,
    });

    expect(result.z).toBeCloseTo(2.5);
  });

  test('clamps camera radius to maximum 10', () => {
    const result = calculateCameraPosition({
      orbitAzimuth: 0,
      orbitElevation: 0,
      zoomDistance: 0.1,
    });

    expect(result.z).toBeCloseTo(10);
  });
});
