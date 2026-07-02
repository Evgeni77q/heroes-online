import { TileType } from '../types/tile.types';

export class TileResponseDto {
  id: string;
  mapId: string;
  x: number;
  y: number;
  type: TileType;
  ownerCityId?: string | null;
  hasCity: boolean;
}
