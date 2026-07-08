import { BuildingType } from "@/features/buildings/types/building.types";

export type BuildingOverlayTabId =
  | "INFO"
  | "RECRUIT"
  | "UPGRADE"
  | "PRODUCTION"
  | "STORAGE"
  | "ECONOMY"
  | "HEAL"
  | "MARCHES"
  | "DEFENSE"
  | "CRAFT"
  | "RESEARCH"
  | "TRAIN";

export interface BuildingOverlayTabDef {
  id: BuildingOverlayTabId;
  label: string;
}

const RECRUIT_BUILDINGS = new Set<BuildingType>([
  BuildingType.Barracks,
  BuildingType.Stable,
  BuildingType.ArcheryRange,
  BuildingType.MageTower,
]);

const FUNCTION_TAB_BY_TYPE: Partial<
  Record<BuildingType, { id: BuildingOverlayTabId; label: string }>
> = {
  [BuildingType.Farm]: { id: "PRODUCTION", label: "PRODUCTION" },
  [BuildingType.LumberMill]: { id: "PRODUCTION", label: "PRODUCTION" },
  [BuildingType.Quarry]: { id: "PRODUCTION", label: "PRODUCTION" },
  [BuildingType.Inn]: { id: "ECONOMY", label: "ECONOMY" },
  [BuildingType.Warehouse]: { id: "STORAGE", label: "STORAGE" },
  [BuildingType.Granary]: { id: "STORAGE", label: "STORAGE" },
  [BuildingType.Hospital]: { id: "HEAL", label: "HEAL" },
  [BuildingType.RallyPoint]: { id: "MARCHES", label: "MARCHES" },
  [BuildingType.Wall]: { id: "DEFENSE", label: "DEFENSE" },
  [BuildingType.Blacksmith]: { id: "CRAFT", label: "CRAFT" },
  [BuildingType.University]: { id: "RESEARCH", label: "RESEARCH" },
  [BuildingType.MilitaryAcademy]: { id: "TRAIN", label: "TRAIN" },
};

export function getBuildingOverlayTabs(
  type: BuildingType,
): BuildingOverlayTabDef[] {
  const tabs: BuildingOverlayTabDef[] = [{ id: "INFO", label: "INFO" }];

  if (RECRUIT_BUILDINGS.has(type)) {
    tabs.push({ id: "RECRUIT", label: "RECRUIT" });
  } else {
    const functionTab = FUNCTION_TAB_BY_TYPE[type];

    if (functionTab) {
      tabs.push(functionTab);
    }
  }

  tabs.push({ id: "UPGRADE", label: "UPGRADE" });
  return tabs;
}

export function toBuildingType(type: string): BuildingType {
  return type as BuildingType;
}
