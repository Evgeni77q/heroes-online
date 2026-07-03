import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { BuildingType, Prisma, ResourceType } from '@prisma/client';
import { BalanceService } from '../balance/balance.service';
import { CityService } from '../city/city.service';
import { PlayerService } from '../player/player.service';
import { PrismaService } from '../prisma/prisma.service';
import { ResourceRepository } from '../resource/resource.repository';
import { GameJobRepository } from '../game-jobs/repositories/game-job.repository';
import { BuildingRepository } from './building.repository';
import { UpgradeBuildingAcceptedDto } from './dto/upgrade-building-response.dto';

const MAX_BUILDING_LEVEL = 10;

@Injectable()
export class BuildingService {
  constructor(
    private repo: BuildingRepository,
    private gameJobs: GameJobRepository,
    private resourceRepo: ResourceRepository,
    private balance: BalanceService,
    private playerService: PlayerService,
    private cityService: CityService,
    private prisma: PrismaService,
  ) {}

  async build(cityId: string, type: BuildingType) {
    const cost = this.balance.getUpgradeCost(1);

    await this.consumeResources(cityId, cost);

    return this.repo.create(cityId, type);
  }

  async requestUpgrade(
    accountId: string,
    buildingId: string,
    cityId: string,
  ): Promise<UpgradeBuildingAcceptedDto> {
    const player = await this.resolvePlayer(accountId);
    const city = await this.cityService.getCityForPlayer(cityId, player.id);

    if (!city) {
      throw new ForbiddenException({
        error: 'FORBIDDEN',
        message: 'City access denied',
      });
    }

    const building = await this.repo.findById(buildingId);

    if (!building || building.cityId !== cityId) {
      throw new NotFoundException({
        error: 'BUILDING_NOT_FOUND',
        message: 'Building not found',
      });
    }

    if (building.level >= MAX_BUILDING_LEVEL) {
      throw new UnprocessableEntityException({
        error: 'MAX_LEVEL_REACHED',
        message: 'Building has reached maximum level',
      });
    }

    const activeJob = await this.gameJobs.findActiveByBuildingId(buildingId);

    if (activeJob) {
      throw new ConflictException({
        error: 'ALREADY_UPGRADING',
        message: 'Building is already upgrading',
      });
    }

    const toLevel = building.level + 1;
    const cost = this.balance.getUpgradeCost(toLevel);
    await this.assertResources(cityId, cost);

    const startedAt = new Date();
    const finishAt = new Date(
      startedAt.getTime() + this.balance.getBuildTime(toLevel) * 1000,
    );

    const job = await this.prisma.$transaction(async (tx) => {
      await this.consumeResources(cityId, cost, tx);

      const createdJob = await this.gameJobs.scheduleBuildingUpgrade(
        {
          buildingId,
          playerId: player.id,
          fromLevel: building.level,
          toLevel,
          startedAt,
          finishAt,
        },
        tx,
      );

      await this.repo.setCurrentUpgrade(buildingId, createdJob.id, tx);

      return createdJob;
    });

    return {
      buildingId,
      status: 'UPGRADING',
      finishAt: job.finishAt.toISOString(),
    };
  }

  getCityBuildings(cityId: string) {
    return this.repo.findByCity(cityId);
  }

  getActiveUpgradesByCity(cityId: string) {
    return this.gameJobs.findActiveByCityId(cityId);
  }

  async ensureStarterBuildings(cityId: string) {
    const existing = await this.repo.findByCity(cityId);
    const starterTypes = [
      BuildingType.FARM,
      BuildingType.LUMBER_MILL,
      BuildingType.QUARRY,
    ];

    for (const type of starterTypes) {
      if (!existing.some((building) => building.type === type)) {
        await this.repo.createStarter(cityId, type);
      }
    }
  }

  private async resolvePlayer(accountId: string) {
    const players = await this.playerService.getMyPlayers(accountId);

    if (!players.length) {
      throw new ForbiddenException({
        error: 'FORBIDDEN',
        message: 'Player not found',
      });
    }

    return players[0];
  }

  private async assertResources(
    cityId: string,
    cost: { wood: number; stone: number; gold: number },
  ) {
    const resources = await this.resourceRepo.getCityResources(cityId);
    const amount = (type: ResourceType) =>
      resources.find((resource) => resource.type === type)?.amount ?? 0;

    if (
      amount(ResourceType.WOOD) < cost.wood ||
      amount(ResourceType.STONE) < cost.stone ||
      amount(ResourceType.GOLD) < cost.gold
    ) {
      throw new UnprocessableEntityException({
        error: 'INSUFFICIENT_RESOURCES',
        message: 'Not enough resources',
      });
    }
  }

  private async consumeResources(
    cityId: string,
    cost: { wood: number; stone: number; gold: number },
    client: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    await this.consumeResource(client, cityId, ResourceType.WOOD, cost.wood);
    await this.consumeResource(client, cityId, ResourceType.STONE, cost.stone);
    await this.consumeResource(client, cityId, ResourceType.GOLD, cost.gold);
  }

  private async consumeResource(
    client: Prisma.TransactionClient | PrismaService,
    cityId: string,
    type: ResourceType,
    amount: number,
  ) {
    const resources = await client.resourceBalance.findMany({
      where: { cityId },
    });
    const resource = resources.find((item) => item.type === type);

    if (!resource || resource.amount < amount) {
      throw new UnprocessableEntityException({
        error: 'INSUFFICIENT_RESOURCES',
        message: 'Not enough resources',
      });
    }

    await client.resourceBalance.update({
      where: { id: resource.id },
      data: { amount: { decrement: amount } },
    });
  }
}
