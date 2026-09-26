import type {
  PillarParameters,
  SceneId,
} from '../../state/PillarsStateTypes';

export interface VisualState {
  coreColor: string;
  pulseSpeed: number;
  meshDistortion: number;
  particleDensity: number;
  seesawTilt: number;
  glowIntensity: number;
}

export function deriveVisualState(
  params: PillarParameters,
  scene: SceneId
): VisualState {
  const isOptimalAerobic =
    params.aerobicVolume >= 150 &&
    params.aerobicVolume <= 300;

  const isRestorativeSleep =
    params.sleepDuration >= 7;

  const isLowStress =
    params.perceivedStress <= 4 ||
    params.downRegPracticeMins >= 15;

  let coreColor = '#10B981';
  let pulseSpeed = 1.0;
  let meshDistortion = 0.1;
  const particleDensity = 40;
  let seesawTilt = 0;
  let glowIntensity = 1.5;

  if (scene === 'fitness') {
    if (params.aerobicVolume < 60) {
      coreColor = '#EF4444';
      pulseSpeed = 0.4;
      meshDistortion = 0.5;
    } else if (params.aerobicVolume > 350) {
      coreColor = '#F59E0B';
      pulseSpeed = 2.5;
      meshDistortion = 0.8;
    }
  } else if (scene === 'nutrition') {
    if (
      params.wholeFoodRatio < 40 ||
      params.upfFrequency > 3
    ) {
      coreColor = '#EF4444';
      meshDistortion = 0.7;
    } else {
      coreColor = '#06B6D4';
    }
  } else if (scene === 'sleep') {
    if (params.sleepDuration < 6) {
      coreColor = '#8B5CF6';
      pulseSpeed = 0.3;
      glowIntensity = 0.3;
    } else {
      coreColor = '#6366F1';
      glowIntensity = 2.0;
    }
  } else if (scene === 'stress') {
    seesawTilt =
      params.perceivedStress > 6 ? -0.8 : 0.8;

    coreColor =
      params.perceivedStress > 6
        ? '#EF4444'
        : '#10B981';
  } else if (scene === 'system') {
    const overallScore =
      (isOptimalAerobic ? 1 : 0) +
      (isRestorativeSleep ? 1 : 0) +
      (isLowStress ? 1 : 0);

    if (overallScore === 3) {
      coreColor = '#10B981';
      glowIntensity = 2.5;
    } else if (overallScore === 2) {
      coreColor = '#F59E0B';
      meshDistortion = 0.3;
    } else {
      coreColor = '#EF4444';
      meshDistortion = 0.9;
    }
  }

  return {
    coreColor,
    pulseSpeed,
    meshDistortion,
    particleDensity,
    seesawTilt,
    glowIntensity,
  };
}
