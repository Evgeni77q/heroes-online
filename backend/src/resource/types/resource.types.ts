import { ResourceType as PrismaResourceType } from '@prisma/client';

export enum ResourceType {
  WOOD = 'WOOD',
  STONE = 'STONE',
  IRON = 'IRON',
  FOOD = 'FOOD',
  GOLD = 'GOLD',
}

export interface ResourceBalance {
  id: string;
  cityId: string;
  type: PrismaResourceType;
  amount: number;
  updatedAt: Date;
}
