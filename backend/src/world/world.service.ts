import { BadRequestException, Injectable } from '@nestjs/common';
import { WorldRepository } from './world.repository';

@Injectable()
export class WorldService {
  constructor(private repo: WorldRepository) {}

  createWorld(name: string, description?: string) {
    return this.repo.create(name, description);
  }

  getActiveWorlds() {
    return this.repo.findAllActive();
  }

  async getWorld(id: string) {
    const world = await this.repo.findById(id);

    if (!world) {
      throw new BadRequestException('WORLD_NOT_FOUND');
    }

    return world;
  }
}
