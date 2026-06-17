"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { RoomArtifactLabel } from "./RoomArtifactLabel";

interface CarModelDisplayProps {
  position: [number, number, number];
  primaryColor: string;
  accentColor: string;
  label?: string;
  rotate?: boolean;
}

/** Abstract low-poly single-seater car centerpiece. */
export function CarModelDisplay({
  position,
  primaryColor,
  accentColor,
  label,
  rotate = true,
}: CarModelDisplayProps) {
  const ref = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    if (rotate && ref.current) ref.current.rotation.y += delta * 0.25;
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
      {/* Rotating platform */}
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <cylinderGeometry args={[1.5, 1.6, 0.08, 32]} />
        <meshStandardMaterial color="#101013" metalness={0.6} roughness={0.4} />
      </mesh>
      <group ref={ref} position={[0, 0.18, 0]}>
        {/* Monocoque body */}
        <mesh castShadow position={[0, 0.12, 0]}>
          <boxGeometry args={[2.2, 0.18, 0.5]} />
          <meshStandardMaterial color={primaryColor} metalness={0.5} roughness={0.35} />
        </mesh>
        {/* Nose */}
        <mesh position={[1.3, 0.12, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.18, 0.7, 4]} />
          <meshStandardMaterial color={primaryColor} metalness={0.5} roughness={0.35} />
        </mesh>
        {/* Cockpit */}
        <mesh position={[-0.1, 0.26, 0]}>
          <sphereGeometry args={[0.2, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#0a0a0b" metalness={0.7} roughness={0.2} />
        </mesh>
        {/* Front wing */}
        <mesh position={[1.5, 0.04, 0]}>
          <boxGeometry args={[0.1, 0.04, 0.9]} />
          <meshStandardMaterial color={accentColor} metalness={0.4} roughness={0.5} />
        </mesh>
        {/* Rear wing */}
        <mesh position={[-1.1, 0.42, 0]}>
          <boxGeometry args={[0.1, 0.28, 0.7]} />
          <meshStandardMaterial color={accentColor} metalness={0.4} roughness={0.5} />
        </mesh>
        {/* Wheels */}
        {([
          [0.9, 0.4],
          [0.9, -0.4],
          [-0.9, 0.4],
          [-0.9, -0.4],
        ] as const).map(([x, z], i) => (
          <mesh key={i} position={[x, 0.05, z]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.16, 18]} />
            <meshStandardMaterial color="#1a1a1d" roughness={0.9} />
          </mesh>
        ))}
      </group>
      {hovered && label && (
        <RoomArtifactLabel position={[0, 1.1, 0]} title={label} />
      )}
    </group>
  );
}
