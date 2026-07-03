import { Injectable, NotFoundException } from '@nestjs/common';
import { Account, City, Player, ResourceType, World } from '@prisma/client';
import { AccountService } from '../account/account.service';
import { BalanceService } from '../balance/balance.service';
import { CityService } from '../city/city.service';
import { PlayerInitializationService } from '../onboarding/player-initialization.service';
import { PlayerService } from '../player/player.service';
import { ResourceService } from '../resource/resource.service';
import { WorldService } from '../world/world.service';
import {
  DashboardAccount,
  DashboardCity,
  DashboardPlayer,
  DashboardResourceAmounts,
  DashboardResponse,
} from './types/dashboard.types';

@Injectable()
export class DashboardService {
  constructor(
    private accountService: AccountService,
    private playerService: PlayerService,
    private worldService: WorldService,
    private cityService: CityService,
    private resourceService: ResourceService,
    private onboarding: PlayerInitializationService,
    private balance: BalanceService,
  ) {}

  async getDashboard(accountId: string): Promise<DashboardResponse> {
    const account = await this.buildAccount(accountId);
    const player = await this.buildPlayer(accountId, account);
    const world = await this.worldService.getWorld(player.worldId);
    const cityEntity = await this.ensureCity(accountId, account.username, player);
    const city = this.buildCity(cityEntity);
    const resources = await this.buildResources(cityEntity.id);

    return {
      account: {
        id: account.id,
        username: account.username,
      },
      player: this.buildPlayerView(player, world, cityEntity.id),
      resources,
      city,
    };
  }

  private async buildAccount(accountId: string): Promise<Account> {
    const account = await this.accountService.findById(accountId);

    if (!account) {
      throw new NotFoundException('ACCOUNT_NOT_FOUND');
    }

    return account;
  }

  private async buildPlayer(
    accountId: string,
    account: Account,
  ): Promise<Player> {
    let players = await this.playerService.getMyPlayers(accountId);

    if (!players.length) {
      await this.onboarding.initialize(accountId, account.username);
      players = await this.playerService.getMyPlayers(accountId);
    }

    if (!players.length) {
      throw new NotFoundException('NO_PLAYER');
    }

    return players[0];
  }

  private async ensureCity(
    accountId: string,
    username: string,
    player: Player,
  ): Promise<City> {
    let cities = await this.cityService.getPlayerCities(player.id);

    if (!cities.length) {
      await this.onboarding.initialize(accountId, username);
      cities = await this.cityService.getPlayerCities(player.id);
    }

    if (!cities.length) {
      throw new NotFoundException('NO_CITY');
    }

    return cities[0];
  }

  private buildPlayerView(
    player: Player,
    world: World,
    cityId: string,
  ): DashboardPlayer {
    return {
      id: player.id,
      worldId: player.worldId,
      cityId,
      world: world.name,
    };
  }

  private buildCity(city: City): DashboardCity {
    return {
      id: city.id,
      name: city.name,
      level: city.level,
      population: this.balance.getCityPopulation(city.level),
      storage: this.balance.getCityStorage(city.level),
      production: this.balance.getCityProduction(city.level),
    };
  }

  private async buildResources(cityId: string): Promise<DashboardResourceAmounts> {
    const balances = await this.resourceService.getCityResources(cityId);

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
