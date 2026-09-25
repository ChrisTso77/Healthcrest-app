import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshWobbleMaterial, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import type {
  CanonicalScenarioPreset,
  EvidenceLevel,
  PillarType as CanonicalPillarType,
  RenderMode,
  OverlayStatus,
} from '@/lib/presets/types';
import { FALLBACK_PRESETS } from '@/lib/presets/fallback';

// ============================================================================
// 1. TYPES & CLINICAL PARAMETER DEFINITIONS
// ============================================================================

export type SceneId = 'fitness' | 'nutrition' | 'sleep' | 'stress' | 'system';

export type PillarType = CanonicalPillarType;

export type HealthParameters = PillarParameters;

export interface PillarParameters {
  // Fitness
  aerobicVolume: number; // 0 to 300+ mins/wk (UK CMO target: 150)
  resistanceDays: number; // 0 to 4+ days/wk (UK CMO target: >=2)
  sedentaryHours: number; // 2 to 14 hrs/day
  // Nutrition
  wholeFoodRatio: number; // 0 to 100%
  fruitVegPortions: number; // 0 to 10 portions/day (NHS Eatwell: >=5)
  upfFrequency: number; // 0 to 5 times/day
  // Sleep
  sleepDuration: number; // 4 to 10 hrs/night (AASM consensus: 7-9)
  regularityScore: number; // 0 to 100%
  // Stress
  downRegPracticeMins: number; // 0 to 30 mins/day
  perceivedStress: number; // 1 to 10
  // Substance exposure
  alcoholUnits: number;
}

export interface VisualState {
  coreColor: string;
  pulseSpeed: number;
  meshDistortion: number;
  particleDensity: number;
  seesawTilt: number; // -1 (sympathetic) to +1 (parasympathetic)
  glowIntensity: number;
}

export interface ClinicalOverlayData {
  title: string;
  status: OverlayStatus;
  keyOutcomes: string[];
  evidenceLevel: EvidenceLevel | null;
}

// ============================================================================
// 2. PRESET MAPPINGS & CLINICAL STATE MACHINE REDUCER
// ============================================================================

const DEFAULT_PARAMS: PillarParameters = {
  aerobicVolume: 150,
  resistanceDays: 2,
  sedentaryHours: 6,
  wholeFoodRatio: 80,
  fruitVegPortions: 5,
  upfFrequency: 1,
  sleepDuration: 8,
  regularityScore: 85,
  downRegPracticeMins: 15,
  perceivedStress: 4,
  alcoholUnits: 0,
};

// State Machine Reducer logic
export interface State {
  activeScene: SceneId;
  activePreset: string | null;
  activePillar: PillarType;
  renderMode: RenderMode;
  parameters: PillarParameters;
  overlay: ClinicalOverlayData;
}

export type Action =
  | { type: 'SET_SCENE'; payload: SceneId }
  | { type: 'APPLY_CANONICAL_PRESET'; payload: CanonicalScenarioPreset }
  | { type: 'UPDATE_PARAM'; payload: { key: keyof PillarParameters; value: number } }
  | { type: 'SET_RENDER_MODE'; payload: State['renderMode'] };

function pillarToScene(pillar: CanonicalScenarioPreset['pillar']): SceneId {
  switch (pillar) {
    case 'Fitness':
      return 'fitness';
    case 'Nutrition':
      return 'nutrition';
    case 'Sleep':
      return 'sleep';
    case 'Stress':
      return 'stress';
    case 'Systems':
    default:
      return 'system';
  }
}

function canonicalStatusToOverlayStatus(
  status: CanonicalScenarioPreset['status']
): ClinicalOverlayData['status'] {
  switch (status) {
    case 'warning':
      return 'Warning';
    case 'critical':
      return 'Critical';
    case 'optimal':
    default:
      return 'Optimal';
  }
}

function sceneToPillar(scene: SceneId): PillarType {
  switch (scene) {
    case 'fitness':
      return 'Fitness';
    case 'nutrition':
      return 'Nutrition';
    case 'sleep':
      return 'Sleep';
    case 'stress':
      return 'Stress';
    case 'system':
    default:
      return 'Systems';
  }
}

export function stateMachineReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_SCENE':
      return {
        ...state,
        activeScene: action.payload,
        activePillar: sceneToPillar(action.payload),
        activePreset: null,
        overlay: {
          title: 'Manual configuration',
          status: 'Manual',
          keyOutcomes: [],
          evidenceLevel: null,
        },
      };
    case 'APPLY_CANONICAL_PRESET': {
      const preset = action.payload;
      const scene = pillarToScene(preset.pillar);

      return {
        ...state,
        activeScene: scene,
        activePillar: preset.pillar,
        activePreset: preset.slug || preset.id,
        parameters: {
          ...state.parameters,
          aerobicVolume: preset.parameters.aerobicMins,
          resistanceDays: preset.parameters.strengthDays,
          sleepDuration: preset.parameters.sleepDuration,
          wholeFoodRatio: preset.parameters.wholeFoodRatio,
          perceivedStress: preset.parameters.stressLevel,
          alcoholUnits: preset.parameters.alcoholUnits,
        },
        overlay: {
          title: preset.headline,
          status: canonicalStatusToOverlayStatus(preset.status),
          keyOutcomes: preset.outcomes,
          evidenceLevel: preset.evidenceLevel,
        },
      };
    }

    case 'SET_RENDER_MODE':
      return { ...state, renderMode: action.payload };

    case 'UPDATE_PARAM': {
      const newParams = { ...state.parameters, [action.payload.key]: action.payload.value };
      return {
        ...state,
        parameters: newParams,
        activePreset: null,
        overlay: {
          title: 'Manual configuration',
          status: 'Manual',
          keyOutcomes: [],
          evidenceLevel: null,
        },
      };
    }
    default:
      return state;
  }
}

// Compute derived 3D visual properties based on clinical parameters
export function deriveVisualState(params: PillarParameters, scene: SceneId): VisualState {
  const isOptimalAerobic = params.aerobicVolume >= 150 && params.aerobicVolume <= 300;
  const isRestorativeSleep = params.sleepDuration >= 7;
  const isLowStress = params.perceivedStress <= 4 || params.downRegPracticeMins >= 15;

  let coreColor = '#10B981'; // Emerald Green
  let pulseSpeed = 1.0;
  let meshDistortion = 0.1;
  const particleDensity = 40;
  let seesawTilt = 0;
  let glowIntensity = 1.5;

  if (scene === 'fitness') {
    if (params.aerobicVolume < 60) {
      coreColor = '#EF4444'; // Red
      pulseSpeed = 0.4;
      meshDistortion = 0.5;
    } else if (params.aerobicVolume > 350) {
      coreColor = '#F59E0B'; // Amber
      pulseSpeed = 2.5;
      meshDistortion = 0.8;
    }
  } else if (scene === 'nutrition') {
    if (params.wholeFoodRatio < 40 || params.upfFrequency > 3) {
      coreColor = '#EF4444';
      meshDistortion = 0.7;
    } else {
      coreColor = '#06B6D4'; // Cyan
    }
  } else if (scene === 'sleep') {
    if (params.sleepDuration < 6) {
      coreColor = '#8B5CF6'; // Purple / Dull Dark
      pulseSpeed = 0.3;
      glowIntensity = 0.3;
    } else {
      coreColor = '#6366F1'; // Indigo
      glowIntensity = 2.0;
    }
  } else if (scene === 'stress') {
    seesawTilt = params.perceivedStress > 6 ? -0.8 : 0.8;
    coreColor = params.perceivedStress > 6 ? '#EF4444' : '#10B981';
  } else if (scene === 'system') {
    const overallScore = (isOptimalAerobic ? 1 : 0) + (isRestorativeSleep ? 1 : 0) + (isLowStress ? 1 : 0);
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

  return { coreColor, pulseSpeed, meshDistortion, particleDensity, seesawTilt, glowIntensity };
}

// ============================================================================
// 3. THREE.JS REACT-THREE-FIBER ANIMATED MESH COMPONENT
// ============================================================================

export function InteractiveBodyEngineMesh({ params, scene }: { params: PillarParameters; scene: SceneId }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const visual = deriveVisualState(params, scene);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5 * visual.pulseSpeed;
      meshRef.current.rotation.x += delta * 0.2;
    }
    if (coreRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2 * visual.pulseSpeed) * 0.08;
      coreRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        {/* Central Core Metaphor */}
        <mesh ref={coreRef} position={[0, 0, 0]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color={visual.coreColor} emissive={visual.coreColor} emissiveIntensity={visual.glowIntensity} roughness={0.2} />
        </mesh>

        {/* Outer Dynamic Biological Lattice */}
        <mesh ref={meshRef} position={[0, 0, 0]}>
          <icosahedronGeometry args={[1.8, 2]} />
          <MeshWobbleMaterial
            wireframe
            color={visual.coreColor}
            factor={visual.meshDistortion}
            speed={visual.pulseSpeed * 2}
          />
        </mesh>

        {/* Autonomic Seesaw Component for Stress Scene */}
        {scene === 'stress' && (
          <group rotation={[0, 0, visual.seesawTilt * 0.5]}>
            <mesh position={[0, -2.2, 0]}>
              <boxGeometry args={[4, 0.15, 0.5]} />
              <meshStandardMaterial color="#6B7280" />
            </mesh>
            <mesh position={[-1.8, -1.8, 0]}>
              <sphereGeometry args={[0.3]} />
              <meshStandardMaterial color="#EF4444" /> {/* Sympathetic */}
            </mesh>
            <mesh position={[1.8, -1.8, 0]}>
              <sphereGeometry args={[0.3]} />
              <meshStandardMaterial color="#10B981" /> {/* Parasympathetic */}
            </mesh>
          </group>
        )}

        {/* Micro-particle effects (Mitochondrial / Glymphatic / Cytokine emission) */}
        <Sparkles count={visual.particleDensity} scale={4} size={2} speed={visual.pulseSpeed} color={visual.coreColor} />
      </Float>
    </group>
  );
}

// ============================================================================
// 4. MAIN REACT STATE MACHINE PROVIDER & CONTAINER COMPONENT
// ============================================================================

const INITIAL_PRESET = FALLBACK_PRESETS[0];

export const initialPillarsState: State = {
  activeScene: 'system',
  activePreset: INITIAL_PRESET.slug,
  activePillar: INITIAL_PRESET.pillar,
  renderMode: 'high-3d',
  parameters: {
    ...DEFAULT_PARAMS,
    aerobicVolume: INITIAL_PRESET.parameters.aerobicMins,
    resistanceDays: INITIAL_PRESET.parameters.strengthDays,
    sleepDuration: INITIAL_PRESET.parameters.sleepDuration,
    wholeFoodRatio: INITIAL_PRESET.parameters.wholeFoodRatio,
    perceivedStress: INITIAL_PRESET.parameters.stressLevel,
    alcoholUnits: INITIAL_PRESET.parameters.alcoholUnits,
  },
  overlay: {
    title: INITIAL_PRESET.headline,
    status: 'Optimal',
    keyOutcomes: INITIAL_PRESET.outcomes,
    evidenceLevel: INITIAL_PRESET.evidenceLevel,
  },
};

export { stateMachineReducer as pillarsReducer };
