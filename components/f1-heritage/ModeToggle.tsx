"use client";

import { Car, UserRound } from "lucide-react";
import type { F1EntityMode } from "@/lib/f1/types";
import { cn } from "@/lib/f1/utils";

export function ModeToggle({
  mode,
  onModeChange,
}: {
  mode: F1EntityMode;
  onModeChange: (mode: F1EntityMode) => void;
}) {
  const options: Array<{ value: F1EntityMode; label: string; icon: typeof UserRound }> = [
    { value: "driver", label: "Driver View", icon: UserRound },
    { value: "team", label: "Team View", icon: Car },
  ];

  return (
    <div
      role="radiogroup"
      aria-label="Heritage archive mode"
      className="inline-grid grid-cols-2 rounded-lg border border-heritage-border bg-black/45 p-1 shadow-glow"
    >
      {options.map((option) => {
        const Icon = option.icon;
        const active = option.value === mode;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onModeChange(option.value)}
            className={cn(
              "flex min-h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-heritage-gold",
              active
                ? "bg-heritage-gold text-black shadow-glow"
                : "text-heritage-muted hover:bg-white/[0.06] hover:text-heritage-ivory",
            )}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
