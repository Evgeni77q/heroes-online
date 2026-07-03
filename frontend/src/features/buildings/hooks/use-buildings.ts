"use client";

import { useEffect } from "react";
import { useDashboard } from "@/features/dashboard/hooks/use-dashboard";
import { BuildingView } from "../types/building.types";
import { useBuildingsStore } from "../store/buildings.store";

export function useBuildings() {
  const query = useDashboard();
  const buildings = useBuildingsStore((state) => state.buildings);
  const setBuildings = useBuildingsStore((state) => state.setBuildings);

  useEffect(() => {
    if (query.data?.buildings) {
      setBuildings(query.data.buildings as BuildingView[]);
    }
  }, [query.data?.buildings, setBuildings]);

  return {
    ...query,
    buildings: (buildings.length > 0
      ? buildings
      : (query.data?.buildings ?? [])) as BuildingView[],
    cityId: query.data?.player.cityId,
  };
}
