"use client";

import { useState } from "react";
import { RoomArtifactLabel } from "./RoomArtifactLabel";

interface SuitDisplayProps {
  position: [number, number, number];
  color: string;
  accentColor: string;
  label?: string;
}

/** A stylized race-suit mannequin placeholder. */
export function SuitDisplay({
  position,
  color,
  accentColor,
  label,
}: SuitDisplayProps) {
  const [hovered, setHovered] = useState(false);
  return (
    <group
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      {/* Base */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.3, 0.34, 0.1, 16]} />
        <meshStandardMaterial color="#16161a" metalness={0.3} roughness={0.7} />
      </mesh>
      {/* Torso */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <capsuleGeometry args={[0.22, 0.5, 6, 12]} />
        <meshStandardMaterial color={color} roughness={0.6} metalness={0.2} />
      </mesh>
      {/* Shoulders accent */}
      <mesh position={[0, 1.05, 0]}>
        <boxGeometry args={[0.6, 0.12, 0.28]} />
        <meshStandardMaterial color={accentColor} roughness={0.5} />
      </mesh>
      {/* Head placeholder */}
      <mesh position={[0, 1.35, 0]}>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshStandardMaterial color="#2a2a30" roughness={0.8} />
      </mesh>
      {/* Legs */}
      <mesh position={[0.1, 0.3, 0]}>
        <capsuleGeometry args={[0.08, 0.3, 6, 10]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      <mesh position={[-0.1, 0.3, 0]}>
        <capsuleGeometry args={[0.08, 0.3, 6, 10]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      {hovered && label && (
        <RoomArtifactLabel position={[0, 1.7, 0]} title={label} />
      )}
    </group>
  );
}
