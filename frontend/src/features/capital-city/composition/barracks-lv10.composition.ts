import {
  barracksMainBuildingSrc,
  barracksSharedPartSrc,
} from "../config/city-assets.config";
import { BuildingComposition, CompositionPartDef } from "./types";

/** Footprint matches 1024×682 source scaled to scene (~0.39×). */
const BARRACKS_LV10_FOOTPRINT = { width: 400, height: 268 } as const;

function barracksPartAssetSrc(
  partId: string,
  level: number,
): string | undefined {
  if (partId === "main_building") {
    return barracksMainBuildingSrc(level);
  }

  return barracksSharedPartSrc(partId);
}

/**
 * Barracks level 10 — modular scene.
 * Gate/fence/dummies attach as separate parts once main_building is gate-less.
 */
const BARRACKS_LV10_PARTS: CompositionPartDef[] = [
  {
    id: "main_building",
    label: "Main Building",
    x: 0,
    y: 0,
    width: BARRACKS_LV10_FOOTPRINT.width,
    height: BARRACKS_LV10_FOOTPRINT.height,
    zIndex: 10,
  },
];

export const BARRACKS_LV10_COMPOSITION: BuildingComposition = {
  id: "barracks_lv10",
  level: 10,
  footprint: BARRACKS_LV10_FOOTPRINT,
  anchor: "center-bottom",
  compositeFallbackSrc: undefined,
  requiredPartIds: ["main_building"],
  renderMode: "parts",
  parts: BARRACKS_LV10_PARTS.map((part) => ({
    ...part,
    assetSrc: barracksPartAssetSrc(part.id, 10),
  })),
};

export function getBarracksComposition(level: number): BuildingComposition | null {
  const clamped = Math.max(1, Math.min(level, 10));

  return {
    ...BARRACKS_LV10_COMPOSITION,
    level: clamped,
    parts: BARRACKS_LV10_PARTS.map((part) => ({
      ...part,
      assetSrc: barracksPartAssetSrc(part.id, clamped),
    })),
  };
}
