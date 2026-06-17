"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { ThreeFallbackWall } from "./ThreeFallbackWall";
import type { HydratedF1Entity } from "@/lib/f1/types";
import { entityTitle } from "@/lib/f1/utils";

const DynamicDriverLockerRoom = dynamic(
  () => import("./DriverLockerRoom").then((module) => module.DriverLockerRoom),
  {
    ssr: false,
    loading: () => <div className="h-full animate-pulse bg-black/50" />,
  },
);

const DynamicTeamFactoryRoom = dynamic(
  () => import("./TeamFactoryRoom").then((module) => module.TeamFactoryRoom),
  {
    ssr: false,
    loading: () => <div className="h-full animate-pulse bg-black/50" />,
  },
);

function canUseWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")),
    );
  } catch {
    return false;
  }
}

export function TrophyRoomShell({
  entity,
  onClose,
}: {
  entity: HydratedF1Entity | null;
  onClose: () => void;
}) {
  const [readyFor3d, setReadyFor3d] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (!entity) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia("(max-width: 767px)");
    function update() {
      setReducedMotion(media.matches);
      setReadyFor3d(canUseWebGL() && !mobile.matches);
    }

    const frame = window.requestAnimationFrame(update);
    media.addEventListener("change", update);
    mobile.addEventListener("change", update);
    return () => {
      window.cancelAnimationFrame(frame);
      media.removeEventListener("change", update);
      mobile.removeEventListener("change", update);
    };
  }, [entity]);

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    if (entity) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [entity, onClose]);

  if (!entity) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#050505] text-heritage-ivory" role="dialog" aria-modal="true">
      <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between border-b border-heritage-border bg-black/70 px-4 py-3 backdrop-blur">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-heritage-gold">
            {entity.mode === "driver" ? "Trophy room" : "Factory floor"}
          </div>
          <h2 className="text-xl font-semibold">{entityTitle(entity)}</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-heritage-border text-heritage-muted outline-none transition hover:bg-white/[0.06] hover:text-heritage-ivory focus-visible:ring-2 focus-visible:ring-heritage-gold"
          aria-label="Close 3D room"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <div className="h-full pt-[4.5rem]">
        {readyFor3d ? (
          entity.mode === "driver" ? (
            <DynamicDriverLockerRoom entity={entity} reducedMotion={reducedMotion} />
          ) : (
            <DynamicTeamFactoryRoom entity={entity} reducedMotion={reducedMotion} />
          )
        ) : (
          <ThreeFallbackWall entity={entity} />
        )}
      </div>
    </div>
  );
}
