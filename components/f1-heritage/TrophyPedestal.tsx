"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh, Group } from "three";
import { RoomArtifactLabel } from "./RoomArtifactLabel";

interface TrophyPedestalProps {
  position: [number, number, number];
  color: string;
  label: string;
  year?: number | null;
  legendary?: boolean;
}

/** A stylized low-poly trophy on a pedestal. */
export function TrophyPedestal({
  position,
  color,
  label,
  year,
  legendary,
}: TrophyPedestalProps) {
  const cupRef = useRef<Mesh>(null);
  const groupRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    if (cupRef.current) cupRef.current.rotation.y += delta * 0.6;
  });

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      {/* Pedestal */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.32, 0.4, 0.5, 16]} />
        <meshStandardMaterial color="#16161a" metalness={0.4} roughness={0.6} />
      </mesh>
      {/* Cup bowl */}
      <mesh ref={cupRef} position={[0, 0.86, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.1, 0.3, 16]} />
        <meshStandardMaterial
          color={legendary ? "#d4af37" : color}
          metalness={0.9}
          roughness={0.2}
          emissive={legendary ? "#5a4410" : "#000000"}
          emissiveIntensity={legendary ? 0.4 : 0}
        />
      </mesh>
      {/* Handles */}
      <mesh position={[0.24, 0.86, 0]}>
        <torusGeometry args={[0.08, 0.02, 8, 16, Math.PI]} />
        <meshStandardMaterial color={legendary ? "#d4af37" : color} metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[-0.24, 0.86, 0]} rotation={[0, Math.PI, 0]}>
        <torusGeometry args={[0.08, 0.02, 8, 16, Math.PI]} />
        <meshStandardMaterial color={legendary ? "#d4af37" : color} metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Stem */}
      <mesh position={[0, 0.62, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.2, 12]} />
        <meshStandardMaterial color={legendary ? "#d4af37" : color} metalness={0.9} roughness={0.2} />
      </mesh>
      {(hovered || legendary) && (
        <RoomArtifactLabel
          position={[0, 1.4, 0]}
          title={label}
          subtitle={year ? String(year) : undefined}
        />
      )}
    </group>
  );
}
