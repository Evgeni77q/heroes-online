import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UnitType } from '@prisma/client';
import { CombatUnit } from './formulas/combat.formula';
import { BuildingFormula } from './formulas/building.formula';
import { CityFormula } from './formulas/city.formula';
import { CombatFormula } from './formulas/combat.formula';
import { ProgressionFormula } from './formulas/progression.formula';
import { ResourceFormula } from './formulas/resource.formula';
import { UnitFormula } from './formulas/unit.formula';

@Injectable()
export class BalanceService {
  constructor(private config: ConfigService) {}

  getResourceProduction(level: number) {
    return ResourceFormula.productionPerHour(level);
  }

  getStorageCapacity(level: number) {
    return ResourceFormula.storageCapacity(level);
  }

  getCityPopulation(cityLevel: number) {
    return CityFormula.population(cityLevel);
  }

  getCityProduction(cityLevel: number) {
    return CityFormula.productionPerMinute(cityLevel);
  }

  getCityStorage(cityLevel: number) {
    return CityFormula.storageCapacity(cityLevel);
  }

  getBuildTime(level: number) {
    if (this.config.get<boolean>('gameSmokeFastBuild')) {
      return 2;
    }

    return BuildingFormula.buildTime(level);
  }

  getUpgradeCost(level: number) {
    return BuildingFormula.upgradeCost(level);
  }

  getCombatPower(units: CombatUnit[]) {
    return CombatFormula.calculatePower(units);
  }

  getUnitCost(type: UnitType, amount: number) {
    return UnitFormula.trainingCost(type, amount);
  }

  getTileDefense(hasOwner: boolean) {
    return CombatFormula.tileDefense(hasOwner);
  }

  getCasualties(lossRatio: number, units: CombatUnit[]) {
    return CombatFormula.casualties(lossRatio, units);
  }

  getXp(action: string) {
    return ProgressionFormula.xpGain(action);
  }

  getLevelUpXp(level: number) {
    return ProgressionFormula.levelUpXp(level);
  }
}
