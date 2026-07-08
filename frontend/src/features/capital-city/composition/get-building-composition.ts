import { BuildingType } from "@/features/buildings/types/building.types";
import { cityBuildingAssetForType } from "../config/city-assets.config";
import { getBuildingVisualSize } from "../config/building-visual.config";
import { getBarracksComposition } from "./barracks-lv10.composition";
import { BuildingComposition } from "./types";

export function getBuildingComposition(
  type: string,
  level: number,
): BuildingComposition | null {
  switch (type) {
    case BuildingType.Barracks:
      return getBarracksComposition(level);
    default:
      if (type === BuildingType.TownHall) {
        return null;
      }

      const size = getBuildingVisualSize(type);

      return {
        id: `${type.toLowerCase()}_lv${level}`,
        level,
        footprint: size,
        anchor: "center-bottom",
        compositeFallbackSrc: cityBuildingAssetForType(type, level),
        renderMode: "composite",
        parts: [],
      };
  }
}
