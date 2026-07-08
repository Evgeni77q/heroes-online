import { BuildingType } from "@/features/buildings/types/building.types";

/** Canonical public root — drop PNGs here; no code change required. */
export const CITY_ASSET_ROOT = "/assets/city";

/** Building sprites and Lego shared parts. */
export const CITY_BUILDINGS_ROOT = `${CITY_ASSET_ROOT}/buildings`;

export type CityGroundAsset = "grass" | "road" | "shadows";

export type CityBuildingAssetKey =
  | "castle"
  | "barracks"
  | "farm"
  | "lumber_mill"
  | "quarry"
  | "university"
  | "stable"
  | "hospital"
  | "mage_tower"
  | "archery_range"
  | "inn"
  | "warehouse"
  | "granary"
  | "blacksmith"
  | "rally_point"
  | "military_academy"
  | "wall";

export const BUILDING_ASSET_KEY: Record<BuildingType, CityBuildingAssetKey> = {
  [BuildingType.TownHall]: "castle",
  [BuildingType.Barracks]: "barracks",
  [BuildingType.Farm]: "farm",
  [BuildingType.LumberMill]: "lumber_mill",
  [BuildingType.Quarry]: "quarry",
  [BuildingType.University]: "university",
  [BuildingType.Stable]: "stable",
  [BuildingType.Hospital]: "hospital",
  [BuildingType.MageTower]: "mage_tower",
  [BuildingType.ArcheryRange]: "archery_range",
  [BuildingType.Inn]: "inn",
  [BuildingType.Warehouse]: "warehouse",
  [BuildingType.Granary]: "granary",
  [BuildingType.Blacksmith]: "blacksmith",
  [BuildingType.RallyPoint]: "rally_point",
  [BuildingType.MilitaryAcademy]: "military_academy",
  [BuildingType.Wall]: "wall",
};

/** Aligned with backend MAX_BUILDING_LEVEL / MAX_TOWN_HALL_LEVEL. */
export const MAX_BUILDING_ASSET_LEVEL = 10;

export function formatAssetLevel(level: number): string {
  const clamped = Math.max(1, Math.min(level, MAX_BUILDING_ASSET_LEVEL));
  return String(clamped).padStart(2, "0");
}

/** `/assets/city/ground/grass.png` — use grass.svg fallback until PNG ships. */
export function cityGroundAsset(name: CityGroundAsset): string {
  return `${CITY_ASSET_ROOT}/ground/${name}.png`;
}

/**
 * Full building level sprite — `/assets/city/buildings/castle/lvl01.png`
 */
export function cityBuildingAsset(
  buildingKey: CityBuildingAssetKey,
  level: number,
): string {
  return `${CITY_BUILDINGS_ROOT}/${buildingKey}/lvl${formatAssetLevel(level)}.png`;
}

export function cityBuildingAssetForType(
  type: BuildingType | string,
  level: number,
): string {
  const key = BUILDING_ASSET_KEY[type as BuildingType];

  if (!key) {
    return cityBuildingAsset("castle", level);
  }

  return cityBuildingAsset(key, level);
}

/**
 * Level-tier building part — `/assets/city/buildings/barracks/lvl10/barracks_lvl10_main.png`
 */
export function cityBuildingLevelPartAsset(
  buildingKey: CityBuildingAssetKey,
  level: number,
  fileName: string,
): string {
  return `${CITY_BUILDINGS_ROOT}/${buildingKey}/lvl${formatAssetLevel(level)}/${fileName}.png`;
}

/**
 * Shared Lego-kit piece — `/assets/city/buildings/castle/shared/castle_keep.png`
 */
export function cityBuildingSharedAsset(
  buildingKey: CityBuildingAssetKey,
  assetName: string,
): string {
  return `${CITY_BUILDINGS_ROOT}/${buildingKey}/shared/${assetName}.png`;
}

/** @deprecated Use cityBuildingSharedAsset('castle', partFileName) */
export function cityCastlePartAsset(partId: string): string {
  return cityBuildingSharedAsset("castle", partId);
}

/** Until `grass.png` ships, scene uses this SVG. */
export const CITY_GROUND_GRASS_FALLBACK = `${CITY_ASSET_ROOT}/ground/grass.svg`;

export const CASTLE_MAX_LEVEL = MAX_BUILDING_ASSET_LEVEL;

/** Castle shared module — Main Keep (Lego kit). */
export const CASTLE_KEEP_SHARED_SRC = cityBuildingSharedAsset(
  "castle",
  "castle_keep",
);

/** Castle shared module — Bridge (Lego kit). */
export const CASTLE_BRIDGE_SHARED_SRC = cityBuildingSharedAsset(
  "castle",
  "castle_bridge",
);

/** Castle shared module — Inner Courtyard (Lego kit). */
export const CASTLE_INNER_COURTYARD_SHARED_SRC = cityBuildingSharedAsset(
  "castle",
  "castle_inner_courtyard",
);

/** Castle shared module — Fountain (courtyard centerpiece). */
export const CASTLE_FOUNTAIN_SHARED_SRC = cityBuildingSharedAsset(
  "castle",
  "castle_fountain",
);

/** Castle shared module — Blue banner (courtyard flags). */
export const CASTLE_BANNER_BLUE_SHARED_SRC = cityBuildingSharedAsset(
  "castle",
  "castle_banner_blue",
);

/** Castle shared module — Wall torch (reusable on gates, towers, keep). */
export const CASTLE_TORCH_SHARED_SRC = cityBuildingSharedAsset(
  "castle",
  "castle_torch",
);

/** Castle shared module — Flagpole (cloth flags attach separately). */
export const CASTLE_FLAGPOLE_SHARED_SRC = cityBuildingSharedAsset(
  "castle",
  "castle_flagpole",
);

/** Castle shared module — Main stairs (courtyard → keep entrance). */
export const CASTLE_MAIN_STAIRS_SHARED_SRC = cityBuildingSharedAsset(
  "castle",
  "castle_main_stairs",
);

/** Shipped castle shared parts — add filename here when art is ready. */
export const CASTLE_SHARED_PART_FILES: Partial<Record<string, string>> = {
  main_keep: "castle_keep",
  bridge: "castle_bridge",
  inner_courtyard: "castle_inner_courtyard",
  fountain: "castle_fountain",
  banner: "castle_banner_blue",
  flagpole: "castle_flagpole",
  main_stairs: "castle_main_stairs",
  torch_gate: "castle_torch",
  torch_tower: "castle_torch",
  torch_keep: "castle_torch",
};

/**
 * Structural castle parts — composite fallback stays until all of these ship.
 * Decorative props (banner, torches, flagpole…) can layer after the core kit.
 */
export const CASTLE_REQUIRED_PART_IDS = [
  "main_keep",
  "gate",
  "watch_tower",
  "wall_straight",
  "wall_corner",
  "bridge",
  "inner_courtyard",
] as const;

export function castleSharedPartSrc(partId: string): string | undefined {
  const fileName = CASTLE_SHARED_PART_FILES[partId];

  if (!fileName) {
    return undefined;
  }

  return cityBuildingSharedAsset("castle", fileName);
}

/** Barracks level-10 main building (architecture only — no soldiers/UI). */
export const BARRACKS_LVL10_MAIN_SRC = cityBuildingLevelPartAsset(
  "barracks",
  10,
  "barracks_lvl10_main",
);

/** Barracks shared module — Fortified entrance gate (wire when main has no gate). */
export const BARRACKS_GATE_SHARED_SRC = cityBuildingSharedAsset(
  "barracks",
  "barracks_gate",
);

/**
 * Barracks Lego kit (shared props) — wire when art ships.
 * gate → barracks_gate.png (after main_building is gate-less)
 */
export const BARRACKS_SHARED_PART_FILES: Partial<Record<string, string>> = {
  gate: "barracks_gate",
};

export function barracksSharedPartSrc(partId: string): string | undefined {
  const fileName = BARRACKS_SHARED_PART_FILES[partId];

  if (!fileName) {
    return undefined;
  }

  return cityBuildingSharedAsset("barracks", fileName);
}

export function barracksMainBuildingSrc(_level: number): string {
  return cityBuildingLevelPartAsset("barracks", 10, "barracks_lvl10_main");
}
