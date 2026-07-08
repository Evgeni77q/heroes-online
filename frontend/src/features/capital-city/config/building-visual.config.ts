import { BuildingType } from "@/features/buildings/types/building.types";
import {
  CITY_GROUND_GRASS_FALLBACK,
  cityGroundAsset,
} from "./city-assets.config";

export interface BuildingVisualSize {
  width: number;
  height: number;
}

export const BUILDING_VISUAL_SIZE: Record<BuildingType, BuildingVisualSize> = {
  [BuildingType.TownHall]: { width: 456, height: 455 },
  [BuildingType.Farm]: { width: 90, height: 90 },
  [BuildingType.LumberMill]: { width: 130, height: 110 },
  [BuildingType.Quarry]: { width: 120, height: 100 },
  [BuildingType.Inn]: { width: 110, height: 95 },
  [BuildingType.Warehouse]: { width: 140, height: 110 },
  [BuildingType.Granary]: { width: 125, height: 100 },
  [BuildingType.Barracks]: { width: 400, height: 268 },
  [BuildingType.Stable]: { width: 145, height: 120 },
  [BuildingType.ArcheryRange]: { width: 150, height: 115 },
  [BuildingType.MageTower]: { width: 130, height: 180 },
  [BuildingType.RallyPoint]: { width: 170, height: 130 },
  [BuildingType.MilitaryAcademy]: { width: 155, height: 135 },
  [BuildingType.Hospital]: { width: 120, height: 100 },
  [BuildingType.Wall]: { width: 200, height: 80 },
  [BuildingType.University]: { width: 175, height: 145 },
  [BuildingType.Blacksmith]: { width: 135, height: 115 },
};

export function getBuildingVisualSize(type: string): BuildingVisualSize {
  const key = type as BuildingType;
  return BUILDING_VISUAL_SIZE[key] ?? { width: 110, height: 100 };
}

/** Primary ground layer — grass.png when art ships; SVG until then. */
export const CITY_SCENE_GROUND_SRC = cityGroundAsset("grass");

export const CITY_SCENE_GROUND_FALLBACK_SRC = CITY_GROUND_GRASS_FALLBACK;
