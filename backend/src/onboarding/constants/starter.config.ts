import { ResourceType } from '@prisma/client';

export const STARTER_WORLD_NAME = 'Europe-1';

export const STARTER_CITY_NAME = 'New Haven';

export const STARTER_MAP_SIZE = 32;

export const STARTER_RESOURCES: Record<
  'wood' | 'stone' | 'gold' | 'food',
  { type: ResourceType; amount: number }
> = {
  wood: { type: ResourceType.WOOD, amount: 500 },
  stone: { type: ResourceType.STONE, amount: 500 },
  gold: { type: ResourceType.GOLD, amount: 500 },
  food: { type: ResourceType.FOOD, amount: 250 },
};
