import { UnitType } from '@prisma/client';
import { GameConfig } from '../config/game.config';

export class UnitFormula {
  static trainingCost(type: UnitType, amount: number): number {
    const perUnit = GameConfig.unit.foodCostPerUnit[type];
    return perUnit * amount;
  }
}
