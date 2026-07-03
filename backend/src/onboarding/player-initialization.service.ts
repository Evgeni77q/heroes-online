import {
  BadRequestException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Player } from '@prisma/client';
import { BuildingService } from '../building/building.service';
import { CityService } from '../city/city.service';
import { MapService } from '../map/map.service';
import { PlayerService } from '../player/player.service';
import { ResourceService } from '../resource/resource.service';
import { WorldBootstrapService } from '../world/world-bootstrap.service';
import {
  STARTER_CITY_NAME,
  STARTER_RESOURCES,
} from './constants/starter.config';

@Injectable()
export class PlayerInitializationService {
  private readonly logger = new Logger(PlayerInitializationService.name);

  constructor(
    private playerService: PlayerService,
    private mapService: MapService,
    private cityService: CityService,
    private resourceService: ResourceService,
    private buildingService: BuildingService,
    private worldBootstrap: WorldBootstrapService,
  ) {}

  async initialize(accountId: string, displayName: string) {
    const existingPlayers = await this.playerService.getMyPlayers(accountId);

    if (existingPlayers.length > 0) {
      const cities = await this.cityService.getPlayerCities(
        existingPlayers[0].id,
      );

      if (cities.length > 0) {
        return;
      }

      await this.createStarterCity(existingPlayers[0]);
      return;
    }

    const { world } = await this.worldBootstrap.ensureStarterWorld();
    const player = await this.playerService.createPlayer(
      accountId,
      displayName,
      world.id,
    );

    await this.createStarterCity(player);

    this.logger.log(
      `Initialized player ${player.id} in world ${world.name}`,
    );
  }

  private async createStarterCity(player: Player) {
    const { map } = await this.worldBootstrap.ensureStarterWorld();

    const tile = await this.mapService.findFreeStarterTile(map.id);

    if (!tile) {
      throw new BadRequestException('NO_STARTER_TILE_AVAILABLE');
    }

    const city = await this.cityService.createCity({
      playerId: player.id,
      mapId: map.id,
      tileId: tile.id,
      name: STARTER_CITY_NAME,
    });

    for (const resource of Object.values(STARTER_RESOURCES)) {
      await this.resourceService.addResource(
        city.id,
        resource.type,
        resource.amount,
      );
    }

    await this.buildingService.ensureStarterBuildings(city.id);

    this.logger.log(`Created starter city ${city.id} for player ${player.id}`);
  }
}
