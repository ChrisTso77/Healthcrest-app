import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshWobbleMaterial, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

import type {
  PillarParameters,
  SceneId,
} from '@/state/PillarsStateTypes';

interface VisualState {
  coreColor: string;
  pulseSpeed: number;
  meshDistortion: number;
  particleDensity: number;
  seesawTilt: number;
  glowIntensity: number;
}

// Compute derived 3D visual properties based on clinical parameters
function deriveVisualState(params: PillarParameters, scene: SceneId): VisualState {
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
