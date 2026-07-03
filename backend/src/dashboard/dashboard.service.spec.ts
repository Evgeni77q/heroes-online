import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AccountStatus } from '@prisma/client';
import { AccountService } from '../account/account.service';
import { BalanceService } from '../balance/balance.service';
import { CityService } from '../city/city.service';
import { PlayerInitializationService } from '../onboarding/player-initialization.service';
import { PlayerService } from '../player/player.service';
import { ResourceService } from '../resource/resource.service';
import { WorldService } from '../world/world.service';
import { DashboardService } from './dashboard.service';

describe('DashboardService', () => {
  let service: DashboardService;

  const accountService = {
    findById: jest.fn(),
  };
  const playerService = {
    getMyPlayers: jest.fn(),
  };
  const worldService = {
    getWorld: jest.fn(),
  };
  const cityService = {
    getPlayerCities: jest.fn(),
  };
  const resourceService = {
    getCityResources: jest.fn(),
  };
  const onboarding = {
    initialize: jest.fn(),
  };
  const balance = {
    getCityPopulation: jest.fn().mockReturnValue(25),
    getCityStorage: jest.fn().mockReturnValue({
      wood: 1500,
      stone: 1500,
      gold: 1500,
      food: 1500,
    }),
    getCityProduction: jest.fn().mockReturnValue({
      wood: 2,
      stone: 2,
      gold: 1,
      food: 2,
    }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      providers: [
        DashboardService,
        { provide: AccountService, useValue: accountService },
        { provide: PlayerService, useValue: playerService },
        { provide: WorldService, useValue: worldService },
        { provide: CityService, useValue: cityService },
        { provide: ResourceService, useValue: resourceService },
        { provide: PlayerInitializationService, useValue: onboarding },
        { provide: BalanceService, useValue: balance },
      ],
    }).compile();

    service = moduleRef.get(DashboardService);
  });

  it('builds dashboard response from backend services', async () => {
    accountService.findById.mockResolvedValue({
      id: 'account-1',
      username: 'Evgeniy',
      status: AccountStatus.active,
    });
    playerService.getMyPlayers.mockResolvedValue([
      { id: 'player-1', worldId: 'world-1', accountId: 'account-1', name: 'Evgeniy' },
    ]);
    worldService.getWorld.mockResolvedValue({
      id: 'world-1',
      name: 'Europe-1',
    });
    cityService.getPlayerCities.mockResolvedValue([
      {
        id: 'city-1',
        name: 'New Haven',
        level: 1,
        playerId: 'player-1',
        worldId: 'world-1',
      },
    ]);
    resourceService.getCityResources.mockResolvedValue([
      { type: 'WOOD', amount: 500 },
      { type: 'STONE', amount: 500 },
      { type: 'GOLD', amount: 500 },
      { type: 'FOOD', amount: 250 },
    ]);

    const result = await service.getDashboard('account-1');

    expect(result.account.username).toBe('Evgeniy');
    expect(result.player.world).toBe('Europe-1');
    expect(result.city).toEqual({
      id: 'city-1',
      name: 'New Haven',
      level: 1,
      population: 25,
      storage: {
        wood: 1500,
        stone: 1500,
        gold: 1500,
        food: 1500,
      },
      production: {
        wood: 2,
        stone: 2,
        gold: 1,
        food: 2,
      },
    });
    expect(balance.getCityProduction).toHaveBeenCalledWith(1);
    expect(balance.getCityStorage).toHaveBeenCalledWith(1);
    expect(balance.getCityPopulation).toHaveBeenCalledWith(1);
    expect(result.resources).toEqual({
      wood: 500,
      stone: 500,
      gold: 500,
      food: 250,
    });
  });

  it('throws when account is missing', async () => {
    accountService.findById.mockResolvedValue(null);

    await expect(service.getDashboard('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
