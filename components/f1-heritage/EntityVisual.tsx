import type { HydratedF1Entity } from "@/lib/f1/types";
import { entityTitle } from "@/lib/f1/utils";

export function EntityVisual({ entity }: { entity: HydratedF1Entity }) {
  const title = entityTitle(entity);
  const accent = entity.mode === "driver" ? entity.helmetColor : entity.liveryStripeColor;
  const label = entity.image.alt;

  return (
    <div
      role="img"
      aria-label={label}
      className="relative aspect-[4/3] overflow-hidden rounded-lg border border-heritage-border bg-black shadow-museum"
      style={{
        background:
          `radial-gradient(circle at 50% 18%, ${accent}55, transparent 25%), ` +
          `linear-gradient(135deg, ${entity.primaryColor}33, transparent 35%), ` +
          `linear-gradient(180deg, #151515, #050505)`,
      }}
    >
      <div className="absolute inset-0 bg-racing bg-[length:34px_34px] opacity-25" />
      <div className="absolute left-1/2 top-[16%] h-24 w-24 -translate-x-1/2 rounded-full border border-white/30 bg-white/[0.06] shadow-glow" />
      <div
        className="absolute left-1/2 top-[30%] h-28 w-44 -translate-x-1/2 rounded-t-full border border-white/20"
        style={{ background: `linear-gradient(135deg, ${accent}, ${entity.secondaryColor})` }}
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent p-5">
        <div className="text-xs uppercase tracking-[0.24em] text-heritage-gold">
          {entity.image.source.replace("-", " ")}
        </div>
        <div className="mt-2 text-2xl font-semibold">{title}</div>
      </div>
    </div>
  );
}
