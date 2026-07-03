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
}

export interface BuildingUpdatedEvent {
  event: "building.updated";
  payload: {
    buildingId: string;
    level: number;
    status: BuildingStatus;
  };
}

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
