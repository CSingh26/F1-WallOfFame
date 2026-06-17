"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, DoorOpen, GitCompareArrows } from "lucide-react";
import type { HeritageEntity } from "@/lib/f1/types";
import { ROOM_LABELS } from "@/lib/f1/constants";
import { cn } from "@/lib/f1/utils";
import { DriverPlacard } from "./DriverPlacard";
import { TeamPlacard } from "./TeamPlacard";

interface PlacardDrawerProps {
  entity: HeritageEntity | null;
  open: boolean;
  onClose: () => void;
  onEnterRoom: (entity: HeritageEntity) => void;
  onToggleCompare: (entity: HeritageEntity) => void;
  inCompare: boolean;
}

/**
 * Right-side slide drawer on desktop, bottom sheet on mobile. Traps nothing
 * heavy but supports Escape-to-close and a labelled dialog for accessibility.
 */
export function PlacardDrawer({
  entity,
  open,
  onClose,
  onEnterRoom,
  onToggleCompare,
  inCompare,
}: PlacardDrawerProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && entity && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={`${entity.mode === "driver" ? entity.name : entity.constructorName} details`}
            className={cn(
              "heritage-glass fixed z-50 flex flex-col shadow-heritage-panel",
              // mobile bottom sheet
              "inset-x-0 bottom-0 max-h-[88vh] rounded-t-3xl",
              // desktop right drawer
              "sm:inset-y-0 sm:left-auto sm:right-0 sm:max-h-none sm:w-[420px] sm:rounded-none sm:rounded-l-3xl",
            )}
            initial={{ y: "100%", x: 0 }}
            animate={{ y: 0, x: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 32 }}
          >
            <div className="flex items-center justify-between border-b border-heritage-border p-4">
              <span className="text-xs uppercase tracking-widest text-heritage-muted">
                {entity.mode === "driver" ? "Driver placard" : "Team placard"}
              </span>
              <button
                onClick={onClose}
                aria-label="Close details"
                className="rounded-full p-1.5 text-heritage-muted transition hover:bg-heritage-panel hover:text-heritage-ivory"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="heritage-scroll flex-1 overflow-y-auto p-5">
              {entity.mode === "driver" ? (
                <DriverPlacard driver={entity} />
              ) : (
                <TeamPlacard team={entity} />
              )}
            </div>

            <div className="grid grid-cols-1 gap-2 border-t border-heritage-border p-4 sm:grid-cols-2">
              <button
                onClick={() => onEnterRoom(entity)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-heritage-gold px-4 py-2.5 text-sm font-semibold text-heritage-bg transition hover:brightness-110"
              >
                <DoorOpen className="h-4 w-4" />
                {ROOM_LABELS[entity.mode]}
              </button>
              <button
                onClick={() => onToggleCompare(entity)}
                aria-pressed={inCompare}
                className={cn(
                  "inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition",
                  inCompare
                    ? "border-heritage-gold/60 bg-heritage-gold/10 text-heritage-gold"
                    : "border-heritage-border text-heritage-ivory hover:bg-heritage-panel",
                )}
              >
                <GitCompareArrows className="h-4 w-4" />
                {inCompare ? "In compare" : "Add to compare"}
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
