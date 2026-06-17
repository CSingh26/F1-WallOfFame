import type { HeritageArtifact } from "@/lib/f1/types";
import { RoomArtifactLabel } from "./RoomArtifactLabel";

export function FramedMoment({
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
      <mesh>
        <boxGeometry args={[1.55, 0.9, 0.08]} />
        <meshStandardMaterial color="#050505" metalness={0.2} roughness={0.28} />
      </mesh>
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[1.28, 0.62, 0.04]} />
        <meshStandardMaterial color={color} metalness={0.18} roughness={0.35} />
      </mesh>
      <mesh position={[0, -0.58, 0.02]}>
        <boxGeometry args={[1.1, 0.08, 0.05]} />
        <meshStandardMaterial color="#cfae5f" metalness={0.6} roughness={0.22} />
      </mesh>
      <RoomArtifactLabel title={artifact.title} position={[0, 0.78, 0.1]} />
    </group>
  );
}
