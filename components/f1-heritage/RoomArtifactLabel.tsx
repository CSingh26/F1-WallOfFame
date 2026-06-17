import { Html } from "@react-three/drei";

export function RoomArtifactLabel({
  title,
  position,
}: {
  title: string;
  position: [number, number, number];
}) {
  return (
    <Html position={position} center distanceFactor={8}>
      <div className="rounded-full border border-heritage-border bg-black/75 px-3 py-1 text-[0.65rem] font-semibold text-heritage-ivory shadow-museum backdrop-blur">
        {title}
      </div>
    </Html>
  );
}
