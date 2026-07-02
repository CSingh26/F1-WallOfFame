"use client";

import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { useHeritageStore } from "./store";
import { useWebGLSupport, useReducedMotion, useIsSmallScreen } from "./hooks";
import { ThreeFallbackWall } from "./ThreeFallbackWall";
import { ROOM_TITLES } from "@/lib/f1/constants";

// The entire Three.js stack (three, fiber, drei) lives behind this dynamic
// import so it is only downloaded when a visitor actually enters a room.
const RoomScene = dynamic(() => import("./RoomScene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center">
      <p className="text-sm text-heritage-muted">Preparing the exhibit…</p>
    </div>
  ),
});

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
