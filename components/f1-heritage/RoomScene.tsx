"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, PerspectiveCamera } from "@react-three/drei";
import type { HeritageEntity } from "@/lib/f1/types";

const DriverLockerRoom = dynamic(
  () => import("./DriverLockerRoom").then((m) => m.DriverLockerRoom),
  { ssr: false },
);
const TeamFactoryRoom = dynamic(
  () => import("./TeamFactoryRoom").then((m) => m.TeamFactoryRoom),
  { ssr: false },
);

export function RoomScene({
  entity,
  autoRotate,
}: {
  entity: HeritageEntity;
  autoRotate: boolean;
}) {
  const accent = entity.primaryColor;
  return (
    <Canvas shadows dpr={[1, 1.75]} gl={{ antialias: true }}>
      <color attach="background" args={["#070708"]} />
      <fog attach="fog" args={["#070708", 14, 30]} />
      <PerspectiveCamera makeDefault position={[0, 3, 11]} fov={50} />
      <ambientLight intensity={0.35} />
      <spotLight
        position={[0, 9, 4]}
        angle={0.5}
        penumbra={0.8}
        intensity={1.4}
        castShadow
        color="#ffffff"
      />
      <pointLight position={[-6, 4, 2]} intensity={0.6} color={accent} />
      <pointLight position={[6, 4, 2]} intensity={0.6} color={accent} />
      <Suspense fallback={null}>
        {entity.mode === "driver" ? (
          <DriverLockerRoom driver={entity} />
        ) : (
          <TeamFactoryRoom team={entity} />
        )}
        <Environment preset="city" />
      </Suspense>
      <OrbitControls
        autoRotate={autoRotate}
        autoRotateSpeed={0.6}
        enablePan={false}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.1}
        minDistance={6}
        maxDistance={16}
        target={[0, 1.5, -2]}
      />
    </Canvas>
  );
}

export default RoomScene;
