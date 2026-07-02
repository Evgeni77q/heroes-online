import { UnitType } from '@prisma/client';

export enum UnitTypeEnum {
  INFANTRY = 'INFANTRY',
  ARCHER = 'ARCHER',
  CAVALRY = 'CAVALRY',
}

export interface Unit {
  id: string;
  armyId: string;
  type: UnitType;
  quantity: number;
}
