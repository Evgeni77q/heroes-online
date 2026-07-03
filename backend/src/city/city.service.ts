import { BadRequestException, Injectable } from '@nestjs/common';
import { MapService } from '../map/map.service';
import { CityRepository } from './city.repository';

@Injectable()
export class CityService {
  constructor(
    private repo: CityRepository,
    private mapService: MapService,
  ) {}

  async createCity(data: {
    playerId: string;
    mapId: string;
    tileId: string;
    name: string;
  }) {
    const map = await this.mapService.getMapById(data.mapId);

    if (!map) {
      throw new BadRequestException('INVALID_MAP');
    }

    const tile = await this.mapService.getTileById(data.tileId);

    if (!tile || tile.mapId !== data.mapId) {
      throw new BadRequestException('INVALID_TILE');
    }

    if (tile.hasCity) {
      throw new BadRequestException('TILE_ALREADY_OCCUPIED');
    }

    const city = await this.repo.create({
      playerId: data.playerId,
      worldId: map.worldId,
      mapId: data.mapId,
      tileId: data.tileId,
      name: data.name,
    });

    await this.mapService.setTileHasCity(data.tileId, true);

    return city;
  }

  getPlayerCities(playerId: string) {
    return this.repo.findByPlayer(playerId);
  }

  async getCityForPlayer(cityId: string, playerId: string) {
    const city = await this.repo.findById(cityId);

    if (!city || city.playerId !== playerId) {
      return null;
    }

    return city;
  }
}
