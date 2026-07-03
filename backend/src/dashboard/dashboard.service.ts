import { Injectable, NotFoundException } from '@nestjs/common';
import { ResourceType } from '@prisma/client';
import { AccountService } from '../account/account.service';
import { CityService } from '../city/city.service';
import { PlayerInitializationService } from '../onboarding/player-initialization.service';
import { PlayerService } from '../player/player.service';
import { ResourceService } from '../resource/resource.service';
import { WorldService } from '../world/world.service';
import { DashboardResponse } from './types/dashboard.types';

@Injectable()
export class DashboardService {
  constructor(
    private accountService: AccountService,
    private playerService: PlayerService,
    private worldService: WorldService,
    private cityService: CityService,
    private resourceService: ResourceService,
    private onboarding: PlayerInitializationService,
  ) {}

  async getDashboard(accountId: string): Promise<DashboardResponse> {
    const account = await this.accountService.findById(accountId);

    if (!account) {
      throw new NotFoundException('ACCOUNT_NOT_FOUND');
    }

    let players = await this.playerService.getMyPlayers(accountId);

    if (!players.length) {
      await this.onboarding.initialize(accountId, account.username);
      players = await this.playerService.getMyPlayers(accountId);
    }

    if (!players.length) {
      throw new NotFoundException('NO_PLAYER');
    }

    const player = players[0];
    const world = await this.worldService.getWorld(player.worldId);
    let cities = await this.cityService.getPlayerCities(player.id);

    if (!cities.length) {
      await this.onboarding.initialize(accountId, account.username);
      cities = await this.cityService.getPlayerCities(player.id);
    }

    if (!cities.length) {
      throw new NotFoundException('NO_CITY');
    }

    const city = cities[0];
    const balances = await this.resourceService.getCityResources(city.id);

    return {
      account: {
        id: account.id,
        username: account.username,
      },
      player: {
        id: player.id,
        worldId: player.worldId,
        cityId: city.id,
        world: world.name,
      },
      resources: this.mapResources(balances),
      city: {
        name: city.name,
        townHallLevel: city.level,
      },
    };
  }

  private mapResources(
    balances: Awaited<ReturnType<ResourceService['getCityResources']>>,
  ) {
    const amount = (type: ResourceType) =>
      balances.find((balance) => balance.type === type)?.amount ?? 0;

    return {
      wood: amount(ResourceType.WOOD),
      stone: amount(ResourceType.STONE),
      gold: amount(ResourceType.GOLD),
      food: amount(ResourceType.FOOD),
    };
  }
}
