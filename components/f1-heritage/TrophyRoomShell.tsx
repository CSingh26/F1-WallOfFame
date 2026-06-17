"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, PerspectiveCamera } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import type { HeritageEntity } from "@/lib/f1/types";
import { useHeritageStore } from "./store";
import { useWebGLSupport, useReducedMotion, useIsSmallScreen } from "./hooks";
import { ThreeFallbackWall } from "./ThreeFallbackWall";
import { ROOM_TITLES } from "@/lib/f1/constants";

const DriverLockerRoom = dynamic(
  () => import("./DriverLockerRoom").then((m) => m.DriverLockerRoom),
  { ssr: false },
);
const TeamFactoryRoom = dynamic(
  () => import("./TeamFactoryRoom").then((m) => m.TeamFactoryRoom),
  { ssr: false },
);

function RoomScene({
  entity,
  autoRotate,
}: {
  entity: HeritageEntity;
  autoRotate: boolean;
}) {
  const accent =
    entity.mode === "driver" ? entity.primaryColor : entity.primaryColor;
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

/** Fullscreen modal that hosts the 3D trophy room (or 2D fallback). */
export function TrophyRoomShell() {
  const room = useHeritageStore((s) => s.room);
  const exitRoom = useHeritageStore((s) => s.exitRoom);
  const webgl = useWebGLSupport();
  const reducedMotion = useReducedMotion();
  const smallScreen = useIsSmallScreen();

  const entity = room.open ? room.entity : null;
  const use2D = webgl === false || smallScreen;
  const title = entity
    ? entity.mode === "driver"
      ? entity.name
      : entity.constructorName
    : "";

  return (
    <AnimatePresence>
      {room.open && entity ? (
        <motion.div
          key="room"
          className="fixed inset-0 z-50 bg-heritage-bg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label={`${ROOM_TITLES[entity.mode]}: ${title}`}
        >
          {/* Header bar */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between p-4 sm:p-6">
            <div className="pointer-events-auto rounded-xl border border-heritage-border bg-black/50 px-4 py-2 backdrop-blur">
              <p className="text-[11px] uppercase tracking-[0.3em] text-heritage-muted">
                {ROOM_TITLES[entity.mode]}
              </p>
              <p className="text-lg font-semibold text-heritage-ivory">
                {title}
              </p>
            </div>
            <button
              type="button"
              onClick={exitRoom}
              className="pointer-events-auto rounded-xl border border-heritage-border bg-black/50 px-4 py-2 text-sm font-medium text-heritage-ivory backdrop-blur transition hover:border-heritage-gold hover:text-heritage-gold"
            >
              Exit room ✕
            </button>
          </div>

          {/* Body */}
          <div className="h-full w-full">
            {webgl === null && !smallScreen ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm text-heritage-muted">
                  Preparing the exhibit…
                </p>
              </div>
            ) : use2D ? (
              <ThreeFallbackWall entity={entity} />
            ) : (
              <RoomScene entity={entity} autoRotate={!reducedMotion} />
            )}
          </div>

          {/* Hint */}
          {!use2D && webgl ? (
            <p className="pointer-events-none absolute inset-x-0 bottom-4 text-center text-xs text-heritage-muted">
              Drag to look around · scroll to zoom
            </p>
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
