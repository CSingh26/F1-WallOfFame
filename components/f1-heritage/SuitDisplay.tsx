import type { HeritageArtifact } from "@/lib/f1/types";
import { RoomArtifactLabel } from "./RoomArtifactLabel";

export function SuitDisplay({
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
      <mesh position={[0, 0.9, 0]}>
        <capsuleGeometry args={[0.32, 0.95, 8, 16]} />
        <meshStandardMaterial color={color} metalness={0.08} roughness={0.7} />
      </mesh>
      <mesh position={[-0.42, 0.85, 0]} rotation={[0, 0, -0.28]}>
        <capsuleGeometry args={[0.1, 0.7, 6, 12]} />
        <meshStandardMaterial color={color} metalness={0.06} roughness={0.75} />
      </mesh>
      <mesh position={[0.42, 0.85, 0]} rotation={[0, 0, 0.28]}>
        <capsuleGeometry args={[0.1, 0.7, 6, 12]} />
        <meshStandardMaterial color={color} metalness={0.06} roughness={0.75} />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.5, 0.56, 0.22, 32]} />
        <meshStandardMaterial color="#171717" metalness={0.35} roughness={0.3} />
      </mesh>
      <RoomArtifactLabel title={artifact.title} position={[0, 1.65, 0]} />
    </group>
  );
}
