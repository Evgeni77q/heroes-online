import { create } from "zustand";
import { BuildingView } from "../types/building.types";

interface BuildingsState {
  buildings: BuildingView[];
  setBuildings: (buildings: BuildingView[]) => void;
  updateBuilding: (buildingId: string, patch: Partial<BuildingView>) => void;
}

export const useBuildingsStore = create<BuildingsState>((set) => ({
  buildings: [],

  setBuildings: (buildings) => {
    set({ buildings });
  },

  updateBuilding: (buildingId, patch) => {
    set((state) => ({
      buildings: state.buildings.map((building) =>
        building.id === buildingId ? { ...building, ...patch } : building,
      ),
    }));
  },
}));
