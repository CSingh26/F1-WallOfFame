"use client";

import { create } from "zustand";
import type { F1EntityMode, HeritageEntity } from "@/lib/f1/types";

type RoomState =
  | { open: false; entity: null }
  | { open: true; entity: HeritageEntity };

interface HeritageState {
  mode: F1EntityMode;
  setMode: (mode: F1EntityMode) => void;

  selected: HeritageEntity | null;
  placardOpen: boolean;
  openPlacard: (entity: HeritageEntity) => void;
  closePlacard: () => void;

  room: RoomState;
  enterRoom: (entity: HeritageEntity) => void;
  exitRoom: () => void;

  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;

  compare: HeritageEntity[];
  toggleCompare: (entity: HeritageEntity) => void;
  clearCompare: () => void;
}

export const useHeritageStore = create<HeritageState>((set, get) => ({
  mode: "driver",
  setMode: (mode) =>
    set({ mode, selected: null, placardOpen: false, compare: [] }),

  selected: null,
  placardOpen: false,
  openPlacard: (entity) => set({ selected: entity, placardOpen: true }),
  closePlacard: () => set({ placardOpen: false }),

  room: { open: false, entity: null },
  enterRoom: (entity) => set({ room: { open: true, entity } }),
  exitRoom: () => set({ room: { open: false, entity: null } }),

  searchOpen: false,
  setSearchOpen: (open) => set({ searchOpen: open }),

  compare: [],
  toggleCompare: (entity) => {
    const current = get().compare;
    const exists = current.some(
      (e) => e.id === entity.id && e.mode === entity.mode,
    );
    if (exists) {
      set({
        compare: current.filter(
          (e) => !(e.id === entity.id && e.mode === entity.mode),
        ),
      });
      return;
    }
    if (current.length >= 2) {
      // keep the most recent + the new one
      set({ compare: [current[current.length - 1], entity] });
      return;
    }
    set({ compare: [...current, entity] });
  },
  clearCompare: () => set({ compare: [] }),
}));
