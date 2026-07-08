import {
  BuildingComposition,
  castlePartAssetPath,
  CompositionPartDef,
} from "./types";
import { cityBuildingAsset, castleSharedPartSrc, CASTLE_REQUIRED_PART_IDS } from "../config/city-assets.config";

/**
 * Castle Level 1 — frontier fortress kit.
 * Parts are hand-placed once; higher levels add/replace parts, not new scenes.
 */
const CASTLE_LV1_PARTS: CompositionPartDef[] = [
  {
    id: "main_keep",
    label: "Main Keep",
    x: 228,
    y: 200,
    width: 280,
    height: 320,
    zIndex: 30,
  },
  {
    id: "watch_tower",
    label: "Watch Tower",
    x: 300,
    y: 48,
    width: 88,
    height: 168,
    zIndex: 28,
  },
  {
    id: "gate",
    label: "Gate",
    x: 36,
    y: 268,
    width: 104,
    height: 128,
    zIndex: 40,
  },
  {
    id: "wall_straight",
    label: "Wall Straight",
    x: 18,
    y: 168,
    width: 72,
    height: 108,
    zIndex: 20,
  },
  {
    id: "wall_corner",
    label: "Wall Corner",
    x: 338,
    y: 288,
    width: 78,
    height: 78,
    zIndex: 22,
  },
  {
    id: "bridge",
    label: "Bridge",
    x: 228,
    y: 360,
    width: 260,
    height: 110,
    zIndex: 12,
  },
  {
    id: "inner_courtyard",
    label: "Inner Courtyard",
    x: 228,
    y: 285,
    width: 250,
    height: 160,
    zIndex: 18,
  },
  {
    id: "fountain",
    label: "Castle Fountain",
    x: 228,
    y: 268,
    width: 130,
    height: 150,
    zIndex: 24,
  },
  {
    id: "main_stairs",
    label: "Main Stairs",
    x: 172,
    y: 208,
    width: 168,
    height: 152,
    zIndex: 26,
  },
  {
    id: "banner",
    label: "Banner",
    x: 168,
    y: 252,
    width: 72,
    height: 118,
    zIndex: 52,
  },
  {
    id: "flagpole",
    label: "Flagpole",
    x: 208,
    y: 0,
    width: 48,
    height: 128,
    zIndex: 56,
  },
  {
    id: "torch_gate",
    label: "Torch · Gate",
    x: 118,
    y: 278,
    width: 44,
    height: 96,
    zIndex: 54,
  },
  {
    id: "torch_tower",
    label: "Torch · Tower",
    x: 328,
    y: 118,
    width: 44,
    height: 96,
    zIndex: 54,
  },
  {
    id: "torch_keep",
    label: "Torch · Keep",
    x: 248,
    y: 188,
    width: 44,
    height: 96,
    zIndex: 54,
  },
];

export const CASTLE_LV1_COMPOSITION: BuildingComposition = {
  id: "castle_lv1",
  level: 1,
  footprint: { width: 456, height: 455 },
  anchor: "center-bottom",
  compositeFallbackSrc: cityBuildingAsset("castle", 1),
  requiredPartIds: CASTLE_REQUIRED_PART_IDS,
  renderMode: "parts",
  parts: CASTLE_LV1_PARTS.map((part) => ({
    ...part,
    assetSrc: castleSharedPartSrc(part.id),
  })),
};

export function getCastleComposition(townHallLevel: number): BuildingComposition {
  const level = Math.max(1, Math.min(townHallLevel, 10));

  if (level === 1) {
    return CASTLE_LV1_COMPOSITION;
  }

  return {
    ...CASTLE_LV1_COMPOSITION,
    id: `castle_lv${level}`,
    level,
    compositeFallbackSrc: cityBuildingAsset("castle", level),
    parts: CASTLE_LV1_PARTS.map((part) => ({
      ...part,
      assetSrc: castlePartAssetPath(part.id),
    })),
  };
}
