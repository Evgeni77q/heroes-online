import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { BuildingType, ResourceType } from '@prisma/client';
import { BalanceService } from '../balance/balance.service';
import { CityService } from '../city/city.service';
import { PlayerService } from '../player/player.service';
import { PrismaService } from '../prisma/prisma.service';
import { ResourceRepository } from '../resource/resource.repository';
import { BuildingUpgradeQueueRepository } from './building-upgrade-queue.repository';
import { BuildingRepository } from './building.repository';
import { BuildingService } from './building.service';

describe('BuildingService', () => {
  let service: BuildingService;

  const repo = {
    findById: jest.fn(),
    findByCity: jest.fn(),
    setCurrentUpgrade: jest.fn(),
    createStarter: jest.fn(),
    create: jest.fn(),
  };
  const upgradeQueue = {
    findActiveByBuildingId: jest.fn(),
    findActiveByCityId: jest.fn(),
    create: jest.fn(),
  };
  const resourceRepo = {
    getCityResources: jest.fn(),
  };
  const balance = {
    getUpgradeCost: jest.fn().mockReturnValue({ wood: 100, stone: 80, gold: 50 }),
    getBuildTime: jest.fn().mockReturnValue(120),
  };
  const playerService = {
    getMyPlayers: jest.fn(),
  };
  const cityService = {
    getCityForPlayer: jest.fn(),
  };
  const prisma = {
    $transaction: jest.fn(),
    resourceBalance: {
      findMany: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      providers: [
        BuildingService,
        { provide: BuildingRepository, useValue: repo },
        { provide: BuildingUpgradeQueueRepository, useValue: upgradeQueue },
        { provide: ResourceRepository, useValue: resourceRepo },
        { provide: BalanceService, useValue: balance },
        { provide: PlayerService, useValue: playerService },
        { provide: CityService, useValue: cityService },
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = moduleRef.get(BuildingService);

    playerService.getMyPlayers.mockResolvedValue([{ id: 'player-1' }]);
    cityService.getCityForPlayer.mockResolvedValue({ id: 'city-1', playerId: 'player-1' });
    repo.findById.mockResolvedValue({
      id: 'building-1',
      cityId: 'city-1',
      level: 1,
      type: BuildingType.FARM,
    });
    upgradeQueue.findActiveByBuildingId.mockResolvedValue(null);
    resourceRepo.getCityResources.mockResolvedValue([
      { type: ResourceType.WOOD, amount: 500 },
      { type: ResourceType.STONE, amount: 500 },
      { type: ResourceType.GOLD, amount: 500 },
    ]);
    prisma.$transaction.mockImplementation(async (callback) =>
      callback({
        resourceBalance: prisma.resourceBalance,
      }),
    );
    prisma.resourceBalance.findMany.mockResolvedValue([
      { id: 'wood-1', type: ResourceType.WOOD, amount: 500 },
      { id: 'stone-1', type: ResourceType.STONE, amount: 500 },
      { id: 'gold-1', type: ResourceType.GOLD, amount: 500 },
    ]);
    upgradeQueue.create.mockResolvedValue({
      id: 'job-1',
      finishAt: new Date('2026-07-03T18:42:10.000Z'),
    });
  });

  it('accepts upgrade request and returns minimal response', async () => {
    const result = await service.requestUpgrade(
      'account-1',
      'building-1',
      'city-1',
    );

    expect(result).toEqual({
      buildingId: 'building-1',
      status: 'UPGRADING',
      finishAt: '2026-07-03T18:42:10.000Z',
    });
    expect(upgradeQueue.create).toHaveBeenCalled();
    expect(repo.setCurrentUpgrade).toHaveBeenCalledWith(
      'building-1',
      'job-1',
      expect.anything(),
    );
  });

  it('rejects when building is already upgrading', async () => {
    upgradeQueue.findActiveByBuildingId.mockResolvedValue({ id: 'job-active' });

    await expect(
      service.requestUpgrade('account-1', 'building-1', 'city-1'),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('rejects when resources are insufficient', async () => {
    resourceRepo.getCityResources.mockResolvedValue([
      { type: ResourceType.WOOD, amount: 10 },
      { type: ResourceType.STONE, amount: 10 },
      { type: ResourceType.GOLD, amount: 10 },
    ]);

    await expect(
      service.requestUpgrade('account-1', 'building-1', 'city-1'),
    ).rejects.toBeInstanceOf(UnprocessableEntityException);
  });

  it('rejects when city access is denied', async () => {
    cityService.getCityForPlayer.mockResolvedValue(null);

    await expect(
      service.requestUpgrade('account-1', 'building-1', 'city-1'),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('rejects when building is not found', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(
      service.requestUpgrade('account-1', 'building-1', 'city-1'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
