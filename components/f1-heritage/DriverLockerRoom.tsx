"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import type { Group } from "three";
import { FramedMoment } from "./FramedMoment";
import { HelmetDisplay } from "./HelmetDisplay";
import { SuitDisplay } from "./SuitDisplay";
import { TrophyPedestal } from "./TrophyPedestal";
import type { F1DriverEntity, HydratedF1Entity, HeritageArtifact } from "@/lib/f1/types";
import { entityTitle } from "@/lib/f1/utils";

function RoomScene({
  entity,
  reducedMotion,
}: {
  entity: HydratedF1Entity<F1DriverEntity>;
  reducedMotion: boolean;
}) {
  const group = useRef<Group>(null);
  const trophies = useMemo(
    () =>
      entity.championshipYears.slice(0, 7).map<HeritageArtifact>((year, index) => ({
        ...entity.artifacts.find((artifact) => artifact.type === "trophy")!,
        id: `${entity.id}-trophy-${year}`,
        title: String(year),
        year,
        displayPosition: [index, 0, 0],
      })),
    [entity],
  );
  const helmet = entity.artifacts.find((artifact) => artifact.type === "helmet") ?? entity.artifacts[0];
  const suit = entity.artifacts.find((artifact) => artifact.type === "suit") ?? entity.artifacts[1];
  const moment = entity.artifacts.find((artifact) => artifact.type === "framed_moment") ?? entity.artifacts[2];

  useFrame(({ clock }) => {
    if (!reducedMotion && group.current) {
      group.current.rotation.y = Math.sin(clock.elapsedTime * 0.16) * 0.05;
    }
  });

  return (
    <>
      <color attach="background" args={["#050505"]} />
      <ambientLight intensity={0.55} />
      <spotLight position={[0, 5.5, 3.5]} angle={0.38} penumbra={0.8} intensity={4.2} />
      <pointLight position={[-3, 2, 2]} intensity={1.8} color={entity.primaryColor} />
      <pointLight position={[3, 2, 2]} intensity={1.5} color={entity.secondaryColor} />

      <group ref={group}>
        <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[9, 7]} />
          <meshStandardMaterial color="#090909" metalness={0.65} roughness={0.18} />
        </mesh>
        <mesh position={[0, 1.9, -2.25]}>
          <boxGeometry args={[8.8, 3.9, 0.18]} />
          <meshStandardMaterial color="#111111" metalness={0.18} roughness={0.34} />
        </mesh>
        <mesh position={[0, 0.96, -2.12]}>
          <boxGeometry args={[7.4, 0.08, 0.08]} />
          <meshStandardMaterial color={entity.primaryColor} emissive={entity.primaryColor} emissiveIntensity={0.3} />
        </mesh>

        <Text
          position={[0, 2.95, -2.02]}
          fontSize={0.34}
          maxWidth={6.6}
          textAlign="center"
          color="#f4ead8"
          anchorX="center"
          anchorY="middle"
        >
          {entityTitle(entity).toUpperCase()}
        </Text>
        <Text
          position={[0, 2.54, -2.01]}
          fontSize={0.13}
          maxWidth={6}
          textAlign="center"
          color="#cfae5f"
          anchorX="center"
          anchorY="middle"
        >
          {entity.primaryEra.toUpperCase()}
        </Text>

        <HelmetDisplay artifact={helmet} color={entity.helmetColor} position={[-2.5, 0.08, -1.1]} />
        <SuitDisplay artifact={suit} color={entity.primaryColor} position={[2.55, 0.05, -1.1]} />
        <FramedMoment artifact={moment} color={entity.secondaryColor} position={[0, 1.9, -2.04]} />

        {trophies.length ? (
          trophies.map((artifact, index) => (
            <TrophyPedestal
              key={artifact.id}
              artifact={artifact}
              position={[-2.25 + index * 0.75, 0, 0.75]}
            />
          ))
        ) : (
          <TrophyPedestal
            artifact={{
              ...entity.artifacts[2],
              title: "Career Archive",
              color: entity.secondaryColor,
            }}
            position={[0, 0, 0.75]}
          />
        )}
      </group>
      <OrbitControls
        enablePan={false}
        minDistance={3.8}
        maxDistance={8}
        autoRotate={!reducedMotion}
        autoRotateSpeed={0.45}
      />
    </>
  );
}

export function DriverLockerRoom({
  entity,
  reducedMotion,
}: {
  entity: HydratedF1Entity<F1DriverEntity>;
  reducedMotion: boolean;
}) {
  return (
    <Canvas camera={{ position: [0, 2.1, 5.7], fov: 45 }} gl={{ preserveDrawingBuffer: true }} shadows>
      <Suspense fallback={null}>
        <RoomScene entity={entity} reducedMotion={reducedMotion} />
      </Suspense>
    </Canvas>
  );
}
