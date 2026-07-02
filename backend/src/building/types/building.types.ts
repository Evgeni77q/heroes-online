import { BuildingType } from '@prisma/client';

export enum BuildingTypeEnum {
  LUMBER_MILL = 'LUMBER_MILL',
  QUARRY = 'QUARRY',
  MINE = 'MINE',
  FARM = 'FARM',
  MARKET = 'MARKET',
}

export interface Building {
  id: string;
  cityId: string;
  type: BuildingType;
  level: number;
  isUnderConstruction: boolean;
  finishAt?: Date | null;
}
