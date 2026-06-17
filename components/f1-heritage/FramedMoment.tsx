"use client";

import { useState } from "react";
import { Text } from "@react-three/drei";
import { RoomArtifactLabel } from "./RoomArtifactLabel";

interface FramedMomentProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  color: string;
  title: string;
  year?: number | null;
}

/** A framed picture on the wall representing an iconic moment (stylized). */
export function FramedMoment({
  position,
  rotation = [0, 0, 0],
  color,
  title,
  year,
}: FramedMomentProps) {
  const [hovered, setHovered] = useState(false);
  return (
    <group
      position={position}
      rotation={rotation}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      {/* Frame */}
      <mesh>
        <boxGeometry args={[1.1, 0.8, 0.06]} />
        <meshStandardMaterial color="#d4af37" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Canvas */}
      <mesh position={[0, 0, 0.04]}>
        <planeGeometry args={[0.95, 0.65]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      <Text
        position={[0, -0.18, 0.05]}
        fontSize={0.08}
        color="#f4efe6"
        anchorX="center"
        anchorY="middle"
        maxWidth={0.85}
      >
        {year ? `${year}` : ""}
      </Text>
      {hovered && (
        <RoomArtifactLabel
          position={[0, 0.6, 0.1]}
          title={title}
          subtitle={year ? String(year) : undefined}
        />
      )}
    </group>
  );
}
