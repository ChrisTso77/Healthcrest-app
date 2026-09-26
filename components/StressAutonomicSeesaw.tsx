type StressAutonomicSeesawProps = {
  seesawTilt: number;
};

export function StressAutonomicSeesaw({
  seesawTilt,
}: StressAutonomicSeesawProps) {
  return (
    <group rotation={[0, 0, seesawTilt * 0.5]}>
      <mesh position={[0, -2.2, 0]}>
        <boxGeometry args={[4, 0.15, 0.5]} />
        <meshStandardMaterial color="#6B7280" />
      </mesh>

      <mesh position={[-1.8, -1.8, 0]}>
        <sphereGeometry args={[0.3]} />
        <meshStandardMaterial color="#EF4444" />
      </mesh>

      <mesh position={[1.8, -1.8, 0]}>
        <sphereGeometry args={[0.3]} />
        <meshStandardMaterial color="#10B981" />
      </mesh>
    </group>
  );
}
