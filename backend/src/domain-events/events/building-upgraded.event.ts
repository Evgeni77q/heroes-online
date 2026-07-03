import { BuildingType } from '@prisma/client';

export interface BuildingUpgradedEventV1 {
  event: 'building.upgraded';
  version: 1;
  payload: {
    buildingId: string;
    playerId: string;
    cityId: string;
    fromLevel: number;
    toLevel: number;
    type: BuildingType;
  };
}

export type DomainEvent = BuildingUpgradedEventV1;
