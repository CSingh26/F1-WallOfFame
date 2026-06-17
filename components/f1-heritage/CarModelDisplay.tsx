import type { HeritageArtifact } from "@/lib/f1/types";
import { RoomArtifactLabel } from "./RoomArtifactLabel";

export function CarModelDisplay({
  artifact,
  color,
  stripe,
  position,
}: {
  artifact: HeritageArtifact;
  color: string;
  stripe: string;
  position: [number, number, number];
}) {
  return (
    <group position={position}>
      <mesh position={[0, 0.42, 0]}>
        <boxGeometry args={[2.6, 0.28, 0.82]} />
        <meshStandardMaterial color={color} metalness={0.45} roughness={0.22} />
      </mesh>
      <mesh position={[0.36, 0.68, 0]}>
        <boxGeometry args={[0.72, 0.34, 0.58]} />
        <meshStandardMaterial color={stripe} metalness={0.35} roughness={0.2} />
      </mesh>
      <mesh position={[1.58, 0.34, 0]}>
        <boxGeometry args={[0.95, 0.08, 1.35]} />
        <meshStandardMaterial color="#111111" metalness={0.4} roughness={0.28} />
      </mesh>
      <mesh position={[-1.48, 0.38, 0]}>
        <boxGeometry args={[0.38, 0.06, 1.12]} />
        <meshStandardMaterial color="#111111" metalness={0.4} roughness={0.28} />
      </mesh>
      {[
        [-0.9, 0.2, -0.52],
        [-0.9, 0.2, 0.52],
        [0.95, 0.2, -0.52],
        [0.95, 0.2, 0.52],
      ].map((wheel) => (
        <mesh key={wheel.join(":")} position={wheel as [number, number, number]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.16, 24]} />
          <meshStandardMaterial color="#030303" metalness={0.2} roughness={0.5} />
        </mesh>
      ))}
      <RoomArtifactLabel title={artifact.title} position={[0, 1.18, 0]} />
    </group>
  );
}
