"use client";

import { useMemo } from "react";
import { Text } from "@react-three/drei";
import type { TeamEntity } from "@/lib/f1/types";
import { TrophyPedestal } from "./TrophyPedestal";
import { CarModelDisplay } from "./CarModelDisplay";
import { FramedMoment } from "./FramedMoment";

/** The 3D contents of a constructor's factory floor / trophy cabinet. */
export function TeamFactoryRoom({ team }: { team: TeamEntity }) {
  const trophies = useMemo(
    () => team.artifacts.filter((a) => a.type === "trophy"),
    [team.artifacts],
  );
  const cars = useMemo(
    () => team.artifacts.filter((a) => a.type === "car"),
    [team.artifacts],
  );

  return (
    <group>
      {/* Factory floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[28, 28]} />
        <meshStandardMaterial color="#0b0b0d" metalness={0.6} roughness={0.35} />
      </mesh>

      {/* Team-color floor stripe */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[1.4, 28]} />
        <meshStandardMaterial
          color={team.liveryStripeColor}
          emissive={team.liveryStripeColor}
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 3.5, -7]} receiveShadow>
        <planeGeometry args={[24, 8]} />
        <meshStandardMaterial color="#101014" metalness={0.3} roughness={0.8} />
      </mesh>

      {/* Wall stripe */}
      <mesh position={[0, 1.6, -6.95]}>
        <planeGeometry args={[24, 0.4]} />
        <meshStandardMaterial
          color={team.primaryColor}
          emissive={team.primaryColor}
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Constructor name */}
      <Text
        position={[0, 5.2, -6.9]}
        fontSize={1.2}
        color="#f4efe6"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.04}
        maxWidth={22}
      >
        {team.constructorName.toUpperCase()}
      </Text>
      <Text
        position={[0, 4.1, -6.9]}
        fontSize={0.36}
        color={team.primaryColor}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.3}
      >
        {`${team.nationality.toUpperCase()} · SINCE ${team.debutYear}`}
      </Text>

      {/* Central title-winning car centerpiece */}
      <CarModelDisplay
        position={[0, 0, 0]}
        primaryColor={team.primaryColor}
        accentColor={team.secondaryColor}
        label={cars[0]?.title ?? "Title-winning car"}
      />

      {/* Trophy cabinet — a row of pedestals along the back */}
      {trophies.slice(0, 8).map((trophy, i) => {
        const count = Math.min(trophies.length, 8);
        const span = (count - 1) * 1.5;
        const x = count > 1 ? -span / 2 + i * 1.5 : 0;
        return (
          <TrophyPedestal
            key={trophy.id}
            position={[x, 0, -5]}
            color={team.secondaryColor}
            label={trophy.title}
            year={trophy.year}
            legendary={trophy.importance === "legendary"}
          />
        );
      })}

      {/* Glass cabinet box behind trophies */}
      <mesh position={[0, 1.2, -5.4]}>
        <boxGeometry args={[12, 2.4, 0.1]} />
        <meshStandardMaterial
          color="#9fd8ff"
          transparent
          opacity={0.06}
          metalness={0.2}
          roughness={0.05}
        />
      </mesh>

      {/* Championship year panels on the side wall */}
      {team.championshipYears.slice(0, 4).map((year, i) => (
        <FramedMoment
          key={year}
          position={[-8.4, 3 - i * 1.3, -3 + i * 0.6]}
          rotation={[0, Math.PI / 2, 0]}
          color={team.primaryColor}
          title={`${year} Constructors' Champion`}
          year={year}
        />
      ))}
    </group>
  );
}
