export enum DashboardBuildingStatus {
  IDLE = 'IDLE',
  UPGRADING = 'UPGRADING',
  LOCKED = 'LOCKED',
}

export enum DashboardBuildingType {
  TOWN_HALL = 'TOWN_HALL',
  BARRACKS = 'BARRACKS',
  FARM = 'FARM',
  SAWMILL = 'SAWMILL',
  QUARRY = 'QUARRY',
}

export interface DashboardUpgradeCost {
  wood: number;
  stone: number;
  gold: number;
}

export interface DashboardBuilding {
  id: string;
  type: DashboardBuildingType;
  level: number;
  status: DashboardBuildingStatus;
  upgradeCost: DashboardUpgradeCost;
}
