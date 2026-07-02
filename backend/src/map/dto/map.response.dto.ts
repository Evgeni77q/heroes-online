import { Tile } from '../types/tile.types';

export class MapResponseDto {
  id: string;
  worldId: string;
  width: number;
  height: number;
  tiles?: Tile[];
  createdAt: Date;
}
