export enum TileType {
  PLAINS = 'PLAINS',
  FOREST = 'FOREST',
  MOUNTAIN = 'MOUNTAIN',
  WATER = 'WATER',
  DESERT = 'DESERT',
  SWAMP = 'SWAMP',
}

export interface Tile {
  id: string;
  mapId: string;
  x: number;
  y: number;
  type: TileType;
  ownerCityId?: string | null;
  hasCity: boolean;
}
