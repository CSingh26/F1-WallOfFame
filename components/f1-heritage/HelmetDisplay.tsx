"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { RoomArtifactLabel } from "./RoomArtifactLabel";

interface HelmetDisplayProps {
  position: [number, number, number];
  primaryColor: string;
  accentColor: string;
  label?: string;
}

/** Low-poly stylized helmet on a small stand. */
export function HelmetDisplay({
  position,
  primaryColor,
  accentColor,
  label,
}: HelmetDisplayProps) {
  const ref = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.3;
  });

  return (
    <group
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      {/* Stand */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.18, 0.22, 0.2, 12]} />
        <meshStandardMaterial color="#16161a" metalness={0.3} roughness={0.7} />
      </mesh>
      <group ref={ref} position={[0, 0.42, 0]}>
        {/* Shell */}
        <mesh castShadow>
          <sphereGeometry args={[0.24, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.62]} />
          <meshStandardMaterial color={primaryColor} metalness={0.5} roughness={0.35} />
        </mesh>
        {/* Lower band */}
        <mesh position={[0, -0.05, 0]}>
          <cylinderGeometry args={[0.24, 0.2, 0.14, 20]} />
          <meshStandardMaterial color={primaryColor} metalness={0.5} roughness={0.35} />
        </mesh>
        {/* Visor */}
        <mesh position={[0, -0.02, 0.12]}>
          <boxGeometry args={[0.34, 0.1, 0.22]} />
          <meshStandardMaterial color={accentColor} metalness={0.8} roughness={0.15} />
        </mesh>
      </group>
      {hovered && label && (
        <RoomArtifactLabel position={[0, 0.95, 0]} title={label} />
      )}
    </group>
  );
}
