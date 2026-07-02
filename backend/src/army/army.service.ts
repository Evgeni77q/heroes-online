import { BadRequestException, Injectable } from '@nestjs/common';
import { ResourceType, UnitType } from '@prisma/client';
import { BalanceService } from '../balance/balance.service';
import { ResourceService } from '../resource/resource.service';
import { ArmyRepository } from './army.repository';

@Injectable()
export class ArmyService {
  constructor(
    private repo: ArmyRepository,
    private resources: ResourceService,
    private balance: BalanceService,
  ) {}

  async train(cityId: string, type: UnitType, amount: number) {
    const cost = this.balance.getUnitCost(type, amount);

    await this.resources.consumeResource(cityId, ResourceType.FOOD, cost);

    const army = await this.repo.getArmy(cityId);

    if (!army) {
      const newArmy = await this.repo.createArmy(cityId);
      return this.repo.addUnits(newArmy.id, type, amount);
    }

    return this.repo.addUnits(army.id, type, amount);
  }

  getArmy(cityId: string) {
    return this.repo.getArmy(cityId);
  }

  async attack(attackerCityId: string, targetCityId: string) {
    const attackerArmy = await this.repo.getArmy(attackerCityId);
    const targetArmy = await this.repo.getArmy(targetCityId);

    if (!attackerArmy || !targetArmy) {
      throw new BadRequestException('ARMY_NOT_FOUND');
    }

    const attackerPower = this.balance.getCombatPower(attackerArmy.units);
    const defenderPower = this.balance.getCombatPower(targetArmy.units);

    if (attackerPower > defenderPower) {
      return {
        winner: attackerCityId,
        loser: targetCityId,
      };
    }

    return {
      winner: targetCityId,
      loser: attackerCityId,
    };
  }
}
