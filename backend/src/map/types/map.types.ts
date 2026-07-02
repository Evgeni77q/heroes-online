import { Tile } from './tile.types';

export interface Map {
  id: string;
  worldId: string;
  width: number;
  height: number;
  tiles?: Tile[];
}
