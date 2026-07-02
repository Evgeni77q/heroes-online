import { Injectable } from '@nestjs/common';
import { MapRepository } from './map.repository';

@Injectable()
export class MapService {
  constructor(private repo: MapRepository) {}

  createMap(worldId: string, width: number, height: number) {
    return this.repo.create(worldId, width, height);
  }

  getWorldMap(worldId: string) {
    return this.repo.getByWorld(worldId);
  }

  getTile(mapId: string, x: number, y: number) {
    return this.repo.getTile(mapId, x, y);
  }

  getTileById(tileId: string) {
    return this.repo.getTileById(tileId);
  }

  getMapById(mapId: string) {
    return this.repo.getById(mapId);
  }

  setTileHasCity(tileId: string, hasCity: boolean) {
    return this.repo.setTileHasCity(tileId, hasCity);
  }
}
