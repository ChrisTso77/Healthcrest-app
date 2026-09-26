import { Sparkles } from '@react-three/drei';

type HealthParticleFieldProps = {
  particleDensity: number;
  pulseSpeed: number;
  coreColor: string;
};

export function HealthParticleField({
  particleDensity,
  pulseSpeed,
  coreColor,
}: HealthParticleFieldProps) {
  return (
    <Sparkles
      count={particleDensity}
      scale={4}
      size={2}
      speed={pulseSpeed}
      color={coreColor}
    />
  );
}
