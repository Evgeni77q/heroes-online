import { BadRequestException, Injectable } from '@nestjs/common';
import { BuildingType, ResourceType } from '@prisma/client';
import { BalanceService } from '../balance/balance.service';
import { ResourceService } from '../resource/resource.service';
import { BuildingRepository } from './building.repository';

@Injectable()
export class BuildingService {
  constructor(
    private repo: BuildingRepository,
    private resources: ResourceService,
    private balance: BalanceService,
  ) {}

  async build(cityId: string, type: BuildingType) {
    const cost = this.balance.getUpgradeCost(1);

    await this.resources.consumeResource(cityId, ResourceType.WOOD, cost.wood);
    await this.resources.consumeResource(cityId, ResourceType.STONE, cost.stone);
    await this.resources.consumeResource(cityId, ResourceType.GOLD, cost.gold);

    return this.repo.create(cityId, type);
  }

  async upgrade(buildingId: string, cityId: string, level: number) {
    if (level > 10) {
      throw new BadRequestException('MAX_LEVEL_REACHED');
    }

    const cost = this.balance.getUpgradeCost(level);

    await this.resources.consumeResource(cityId, ResourceType.WOOD, cost.wood);
    await this.resources.consumeResource(cityId, ResourceType.STONE, cost.stone);
    await this.resources.consumeResource(cityId, ResourceType.GOLD, cost.gold);

    return this.repo.upgrade(buildingId, level);
  }

  getCityBuildings(cityId: string) {
    return this.repo.findByCity(cityId);
  }
}
