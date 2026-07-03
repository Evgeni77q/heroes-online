import { Injectable } from '@nestjs/common';
import { MapService } from '../map/map.service';
import {
  STARTER_MAP_SIZE,
  STARTER_WORLD_NAME,
} from '../onboarding/constants/starter.config';
import { WorldService } from './world.service';

@Injectable()
export class WorldBootstrapService {
  constructor(
    private worldService: WorldService,
    private mapService: MapService,
  ) {}

  async ensureStarterWorld() {
    const worlds = await this.worldService.getActiveWorlds();
    let world = worlds.find((item) => item.name === STARTER_WORLD_NAME);

    if (!world) {
      world =
        worlds.length > 0
          ? worlds[0]
          : await this.worldService.createWorld(
              STARTER_WORLD_NAME,
              'Starter world for new players',
            );
    }

    const map = await this.mapService.ensureWorldMap(
      world.id,
      STARTER_MAP_SIZE,
      STARTER_MAP_SIZE,
    );

    return { world, map };
  }
}
