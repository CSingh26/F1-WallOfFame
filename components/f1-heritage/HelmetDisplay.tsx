import type { HeritageArtifact } from "@/lib/f1/types";
import { RoomArtifactLabel } from "./RoomArtifactLabel";

export function HelmetDisplay({
  artifact,
  color,
  position,
}: {
  artifact: HeritageArtifact;
  color: string;
  position: [number, number, number];
}) {
  return (
    <group position={position}>
      <mesh position={[0, 0.52, 0]}>
        <sphereGeometry args={[0.42, 32, 18, 0, Math.PI * 2, 0, Math.PI * 0.78]} />
        <meshStandardMaterial color={color} metalness={0.25} roughness={0.18} />
      </mesh>
      <mesh position={[0.08, 0.48, -0.34]} rotation={[0.08, 0, 0]}>
        <boxGeometry args={[0.58, 0.16, 0.04]} />
        <meshStandardMaterial color="#050505" metalness={0.1} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0.16, 0]}>
        <cylinderGeometry args={[0.5, 0.55, 0.18, 32]} />
        <meshStandardMaterial color="#171717" metalness={0.35} roughness={0.3} />
      </mesh>
      <RoomArtifactLabel title={artifact.title} position={[0, 1.18, 0]} />
    </group>
  );
}
