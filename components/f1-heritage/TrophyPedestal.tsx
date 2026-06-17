import type { HeritageArtifact } from "@/lib/f1/types";
import { RoomArtifactLabel } from "./RoomArtifactLabel";

export function TrophyPedestal({
  artifact,
  position,
}: {
  artifact: HeritageArtifact;
  position: [number, number, number];
}) {
  return (
    <group position={position}>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.42, 0.52, 0.3, 32]} />
        <meshStandardMaterial color="#151515" metalness={0.35} roughness={0.28} />
      </mesh>
      <mesh position={[0, 0.62, 0]}>
        <cylinderGeometry args={[0.12, 0.18, 0.55, 24]} />
        <meshStandardMaterial color="#cfae5f" metalness={0.8} roughness={0.18} />
      </mesh>
      <mesh position={[0, 0.96, 0]}>
        <sphereGeometry args={[0.24, 32, 16]} />
        <meshStandardMaterial color="#f1d58b" metalness={0.85} roughness={0.12} />
      </mesh>
      <RoomArtifactLabel title={artifact.title} position={[0, 1.45, 0]} />
    </group>
  );
}
