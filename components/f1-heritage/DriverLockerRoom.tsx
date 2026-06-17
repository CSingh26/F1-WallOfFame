"use client";

import { useMemo } from "react";
import { Text, Float } from "@react-three/drei";
import type { DriverEntity } from "@/lib/f1/types";
import { TrophyPedestal } from "./TrophyPedestal";
import { HelmetDisplay } from "./HelmetDisplay";
import { SuitDisplay } from "./SuitDisplay";
import { CarModelDisplay } from "./CarModelDisplay";
import { FramedMoment } from "./FramedMoment";

/** The 3D contents of a driver's locker / trophy room. */
export function DriverLockerRoom({ driver }: { driver: DriverEntity }) {
  const trophies = useMemo(
    () => driver.artifacts.filter((a) => a.type === "trophy"),
    [driver.artifacts],
  );
  const moments = useMemo(
    () => driver.artifacts.filter((a) => a.type === "framed_moment"),
    [driver.artifacts],
  );

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[24, 24]} />
        <meshStandardMaterial color="#0c0c0e" metalness={0.7} roughness={0.25} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 3, -6]} receiveShadow>
        <planeGeometry args={[20, 7]} />
        <meshStandardMaterial color="#121216" roughness={0.9} />
      </mesh>

      {/* Team-color accent stripe on the wall */}
      <mesh position={[0, 1.4, -5.95]}>
        <planeGeometry args={[20, 0.3]} />
        <meshStandardMaterial
          color={driver.primaryColor}
          emissive={driver.primaryColor}
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Driver name on back wall */}
      <Text
        position={[0, 4.4, -5.9]}
        fontSize={1}
        color="#f4efe6"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.05}
        maxWidth={18}
      >
        {driver.familyName.toUpperCase()}
      </Text>
      <Text
        position={[0, 3.5, -5.9]}
        fontSize={0.35}
        color={driver.primaryColor}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.3}
      >
        {`${driver.nationality.toUpperCase()} · ${driver.careerSpanLabel}`}
      </Text>

      {/* Championship trophies along the back */}
      {trophies.map((trophy, i) => {
        const span = (trophies.length - 1) * 1.4;
        const x = trophies.length > 1 ? -span / 2 + i * 1.4 : 0;
        return (
          <TrophyPedestal
            key={trophy.id}
            position={[x, 0, -4]}
            color={driver.secondaryColor}
            label={trophy.title}
            year={trophy.year}
            legendary={trophy.importance === "legendary"}
          />
        );
      })}

      {/* Helmet shelf */}
      <HelmetDisplay
        position={[-4, 1.2, -2]}
        primaryColor={driver.helmetColor}
        accentColor={driver.secondaryColor}
        label="Race helmet"
      />
      {/* Shelf under helmet */}
      <mesh position={[-4, 1.0, -2]}>
        <boxGeometry args={[1, 0.08, 0.8]} />
        <meshStandardMaterial color="#1a1a1d" metalness={0.4} roughness={0.6} />
      </mesh>

      {/* Race suit mannequin */}
      <SuitDisplay
        position={[4, 0, -2]}
        color={driver.primaryColor}
        accentColor={driver.secondaryColor}
        label="Race suit"
      />

      {/* Car model centerpiece */}
      <CarModelDisplay
        position={[0, 0, 1.5]}
        primaryColor={driver.primaryColor}
        accentColor={driver.secondaryColor}
        label="Title-era car"
      />

      {/* Framed moments on the side wall */}
      {moments.slice(0, 3).map((moment, i) => (
        <FramedMoment
          key={moment.id}
          position={[-6.9, 2.4 - i * 1.2, -2 + i * 0.5]}
          rotation={[0, Math.PI / 2, 0]}
          color={driver.secondaryColor}
          title={moment.title}
          year={moment.year}
        />
      ))}

      {/* Floating dust particles */}
      <Particles color={driver.primaryColor} />
    </group>
  );
}

function Particles({ color }: { color: string }) {
  const points = useMemo(
    () =>
      Array.from({ length: 24 }).map((_, i) => ({
        pos: [
          (Math.sin(i * 13.1) * 8),
          1 + Math.abs(Math.cos(i * 7.7)) * 4,
          (Math.cos(i * 5.3) * 6) - 2,
        ] as [number, number, number],
        key: i,
      })),
    [],
  );
  return (
    <group>
      {points.map(({ pos, key }) => (
        <Float key={key} speed={1} rotationIntensity={0} floatIntensity={1.5}>
          <mesh position={pos}>
            <sphereGeometry args={[0.015, 6, 6]} />
            <meshBasicMaterial color={color} transparent opacity={0.35} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}
