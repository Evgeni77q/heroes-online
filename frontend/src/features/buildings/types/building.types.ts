export enum BuildingStatus {
  Idle = "IDLE",
  Upgrading = "UPGRADING",
  Locked = "LOCKED",
}

export enum BuildingType {
  TownHall = "TOWN_HALL",
  Barracks = "BARRACKS",
  Farm = "FARM",
  Sawmill = "SAWMILL",
  Quarry = "QUARRY",
}

export interface UpgradeCost {
  wood: number;
  stone: number;
  gold: number;
}

export interface BuildingView {
  id: string;
  type: BuildingType;
  level: number;
  status: BuildingStatus;
  upgradeCost: UpgradeCost;
  finishAt?: string | null;
}

export interface UpgradeBuildingAccepted {
  buildingId: string;
  status: BuildingStatus.Upgrading;
  finishAt: string;
}

export interface BuildingUpdatedEventV1 {
  event: "building.updated";
  version: 1;
  payload: {
    buildingId: string;
    level: number;
    status: BuildingStatus;
    upgradeCost?: UpgradeCost;
  };
}

/** @deprecated Use BuildingUpdatedEventV1 */
export type BuildingUpdatedEvent = BuildingUpdatedEventV1;

export const BUILDING_LABELS: Record<BuildingType, string> = {
  [BuildingType.TownHall]: "Town Hall",
  [BuildingType.Barracks]: "Barracks",
  [BuildingType.Farm]: "Farm",
  [BuildingType.Sawmill]: "Sawmill",
  [BuildingType.Quarry]: "Quarry",
};

export const BUILDING_ICONS: Record<BuildingType, string> = {
  [BuildingType.TownHall]: "🏛",
  [BuildingType.Barracks]: "⚔️",
  [BuildingType.Farm]: "🌾",
  [BuildingType.Sawmill]: "🌲",
  [BuildingType.Quarry]: "🪨",
};
