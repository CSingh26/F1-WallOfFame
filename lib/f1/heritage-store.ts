"use client";

import { create } from "zustand";
import type { F1EntityMode } from "./types";

type HeritageUiState = {
  mode: F1EntityMode;
  setMode: (mode: F1EntityMode) => void;
};

export const useHeritageUiStore = create<HeritageUiState>((set) => ({
  mode: "driver",
  setMode: (mode) => set({ mode }),
}));
