"use client";

import { motion } from "framer-motion";
import { Users, Building2 } from "lucide-react";
import type { F1EntityMode } from "@/lib/f1/types";
import { MODE_LABELS } from "@/lib/f1/constants";
import { cn } from "@/lib/f1/utils";

interface ModeToggleProps {
  mode: F1EntityMode;
  onChange: (mode: F1EntityMode) => void;
}

const MODES: Array<{ id: F1EntityMode; icon: typeof Users }> = [
  { id: "driver", icon: Users },
  { id: "team", icon: Building2 },
];

export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div
      role="tablist"
      aria-label="Choose view"
      className="inline-flex items-center gap-1 rounded-full border border-heritage-border bg-heritage-panel/70 p-1 backdrop-blur"
    >
      {MODES.map(({ id, icon: Icon }) => {
        const active = mode === id;
        return (
          <button
            key={id}
            role="tab"
            aria-selected={active}
            aria-label={MODE_LABELS[id]}
            onClick={() => onChange(id)}
            className={cn(
              "relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition",
              active ? "text-heritage-bg" : "text-heritage-muted hover:text-heritage-ivory",
            )}
          >
            {active && (
              <motion.span
                layoutId="mode-pill"
                className="absolute inset-0 rounded-full bg-heritage-gold"
                transition={{ type: "spring", stiffness: 360, damping: 30 }}
              />
            )}
            <Icon className="relative z-10 h-4 w-4" />
            <span className="relative z-10">{MODE_LABELS[id]}</span>
          </button>
        );
      })}
    </div>
  );
}
