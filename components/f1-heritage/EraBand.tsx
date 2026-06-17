import type { EraBand as EraBandType } from "@/lib/f1/types";
import { FIRST_F1_SEASON } from "@/lib/f1/constants";

export function EraBand({
  band,
  currentYear,
}: {
  band: EraBandType;
  currentYear: number;
}) {
  const left = ((band.startYear - FIRST_F1_SEASON) / (currentYear - FIRST_F1_SEASON)) * 100;
  const width = ((band.endYear - band.startYear) / (currentYear - FIRST_F1_SEASON)) * 100;

  return (
    <div
      className="absolute top-0 h-full border-r border-white/[0.08] px-3 py-4"
      style={{
        left: `${left}%`,
        width: `${Math.max(width, 7)}%`,
        background: `linear-gradient(180deg, ${band.colorHint}22, transparent)`,
      }}
    >
      <div className="max-w-[12rem] text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-heritage-gold">
        {band.startYear}-{band.endYear}
      </div>
      <div className="mt-1 max-w-[12rem] text-xs leading-4 text-heritage-muted">{band.label}</div>
    </div>
  );
}
