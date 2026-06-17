"use client";

import { Html } from "@react-three/drei";

interface RoomArtifactLabelProps {
  position: [number, number, number];
  title: string;
  subtitle?: string;
}

/** Floating HTML label for a 3D artifact (hover/legendary). */
export function RoomArtifactLabel({
  position,
  title,
  subtitle,
}: RoomArtifactLabelProps) {
  return (
    <Html position={position} center distanceFactor={8} occlude={false}>
      <div className="pointer-events-none w-max max-w-[160px] -translate-y-1/2 rounded-lg border border-heritage-border bg-black/80 px-2 py-1 text-center backdrop-blur">
        <p className="text-[11px] font-medium leading-tight text-heritage-ivory">
          {title}
        </p>
        {subtitle ? (
          <p className="text-[10px] text-heritage-gold">{subtitle}</p>
        ) : null}
      </div>
    </Html>
  );
}
