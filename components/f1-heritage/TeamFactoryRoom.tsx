"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import type { Group } from "three";
import { CarModelDisplay } from "./CarModelDisplay";
import { FramedMoment } from "./FramedMoment";
import { TrophyPedestal } from "./TrophyPedestal";
import type { F1TeamEntity, HydratedF1Entity, HeritageArtifact } from "@/lib/f1/types";
import { entityTitle } from "@/lib/f1/utils";

function RoomScene({
  entity,
  reducedMotion,
}: {
  entity: HydratedF1Entity<F1TeamEntity>;
  reducedMotion: boolean;
}) {
  const group = useRef<Group>(null);
  const car = entity.artifacts.find((artifact) => artifact.type === "car") ?? entity.artifacts[0];
  const factory = entity.artifacts.find((artifact) => artifact.id.includes("factory")) ?? entity.artifacts[1];
  const cabinet = entity.artifacts.find((artifact) => artifact.type === "trophy") ?? entity.artifacts[2];
  const moment = entity.artifacts.find((artifact) => artifact.type === "framed_moment") ?? entity.artifacts[3];
  const trophies = useMemo(
    () =>
      entity.championshipYears.slice(0, 8).map<HeritageArtifact>((year, index) => ({
        ...cabinet,
        id: `${entity.id}-constructor-trophy-${year}`,
        title: String(year),
        year,
        displayPosition: [index, 0, 0],
      })),
    [cabinet, entity],
  );

  useFrame(({ clock }) => {
    if (!reducedMotion && group.current) {
      group.current.rotation.y = Math.sin(clock.elapsedTime * 0.12) * 0.04;
    }
  });

  return (
    <>
      <color attach="background" args={["#050505"]} />
      <ambientLight intensity={0.52} />
      <spotLight position={[0, 5.8, 3.2]} angle={0.4} penumbra={0.9} intensity={4.4} />
      <pointLight position={[-3, 2.2, 1.5]} intensity={1.5} color={entity.primaryColor} />
      <pointLight position={[3, 2.2, 1.5]} intensity={1.4} color={entity.liveryStripeColor} />

      <group ref={group}>
        <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[9.4, 7]} />
          <meshStandardMaterial color="#090909" metalness={0.72} roughness={0.16} />
        </mesh>
        <mesh position={[0, 1.9, -2.35]}>
          <boxGeometry args={[9.2, 3.9, 0.18]} />
          <meshStandardMaterial color="#111111" metalness={0.2} roughness={0.32} />
        </mesh>
        <mesh position={[0, 0.72, -2.15]}>
          <boxGeometry args={[8.2, 0.11, 0.08]} />
          <meshStandardMaterial
            color={entity.liveryStripeColor}
            emissive={entity.liveryStripeColor}
            emissiveIntensity={0.28}
          />
        </mesh>

        <Text
          position={[0, 2.95, -2.1]}
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
          position={[0, 2.54, -2.09]}
          fontSize={0.13}
          maxWidth={6}
          textAlign="center"
          color="#cfae5f"
          anchorX="center"
          anchorY="middle"
        >
          FACTORY FLOOR
        </Text>

        <CarModelDisplay
          artifact={car}
          color={entity.primaryColor}
          stripe={entity.liveryStripeColor}
          position={[0, 0.02, 0.55]}
        />
        <FramedMoment artifact={factory} color={entity.primaryColor} position={[-2.9, 1.62, -2.05]} />
        <FramedMoment artifact={moment} color={entity.secondaryColor} position={[2.9, 1.62, -2.05]} />

        {trophies.length ? (
          trophies.map((artifact, index) => (
            <TrophyPedestal
              key={artifact.id}
              artifact={artifact}
              position={[-2.8 + index * 0.8, 0, -1.15]}
            />
          ))
        ) : (
          <TrophyPedestal
            artifact={{
              ...cabinet,
              title: "Archive Cabinet",
              color: entity.secondaryColor,
            }}
            position={[0, 0, -1.15]}
          />
        )}
      </group>
      <OrbitControls
        enablePan={false}
        minDistance={3.8}
        maxDistance={8}
        autoRotate={!reducedMotion}
        autoRotateSpeed={0.42}
      />
    </>
  );
}

export function TeamFactoryRoom({
  entity,
  reducedMotion,
}: {
  entity: HydratedF1Entity<F1TeamEntity>;
  reducedMotion: boolean;
}) {
  return (
    <Canvas camera={{ position: [0, 2.1, 5.8], fov: 45 }} gl={{ preserveDrawingBuffer: true }} shadows>
      <Suspense fallback={null}>
        <RoomScene entity={entity} reducedMotion={reducedMotion} />
      </Suspense>
    </Canvas>
  );
}
