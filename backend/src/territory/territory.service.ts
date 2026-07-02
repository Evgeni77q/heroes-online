import { BadRequestException, Injectable } from '@nestjs/common';
import { BalanceService } from '../balance/balance.service';
import { ArmyService } from '../army/army.service';
import { TerritoryRepository } from './territory.repository';

@Injectable()
export class TerritoryService {
  constructor(
    private repo: TerritoryRepository,
    private armyService: ArmyService,
    private balance: BalanceService,
  ) {}

  async captureTile(
    attackerCityId: string,
    mapId: string,
    x: number,
    y: number,
  ) {
    const tile = await this.repo.getTile(mapId, x, y);

    if (!tile) {
      throw new BadRequestException('TILE_NOT_FOUND');
    }

    const attackerArmy = await this.armyService.getArmy(attackerCityId);

    if (!attackerArmy) {
      throw new BadRequestException('NO_ARMY');
    }

    const attackPower = this.balance.getCombatPower(attackerArmy.units);
    const defensePower = this.balance.getTileDefense(!!tile.ownerCityId);

    if (attackPower <= defensePower) {
      return {
        success: false,
        reason: 'DEFENSE_TOO_STRONG',
        x,
        y,
      };
    }

    const previousOwner = tile.ownerCityId;

    await this.repo.updateOwner(tile.id, attackerCityId);

    return {
      success: true,
      previousOwnerId: previousOwner,
      newOwnerId: attackerCityId,
      x,
      y,
    };
  }
}
