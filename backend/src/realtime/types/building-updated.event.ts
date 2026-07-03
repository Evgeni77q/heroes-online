export interface BuildingUpdatedEventV1 {
  event: 'building.updated';
  version: 1;
  payload: {
    buildingId: string;
    level: number;
    status: 'IDLE' | 'UPGRADING' | 'LOCKED';
    upgradeCost: {
      wood: number;
      stone: number;
      gold: number;
    };
  };
}
