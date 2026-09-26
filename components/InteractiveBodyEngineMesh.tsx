import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshWobbleMaterial, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

import type {
  PillarParameters,
  SceneId,
} from '@/state/PillarsStateTypes';
import { deriveVisualState } from '@/lib/visuals/deriveVisualState';

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
