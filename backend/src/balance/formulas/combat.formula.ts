import { UnitType } from '@prisma/client';
import { GameConfig } from '../config/game.config';

export interface CombatUnit {
  type: UnitType | string;
  quantity: number;
}

export class CombatFormula {
  static calculatePower(units: CombatUnit[]): number {
    return units.reduce((sum, u) => {
      const base =
        u.type === 'INFANTRY' || u.type === UnitType.INFANTRY
          ? 10
          : u.type === 'ARCHER' || u.type === UnitType.ARCHER
            ? 15
            : 25;

      return sum + u.quantity * base * GameConfig.combat.powerMultiplier;
    }, 0);
  }

  static casualties(lossRatio: number, units: CombatUnit[]) {
    return units.map((u) => ({
      type: u.type,
      lost: Math.floor(u.quantity * lossRatio * GameConfig.combat.casualtyRate),
    }));
  }

  static tileDefense(hasOwner: boolean): number {
    const base = hasOwner
      ? GameConfig.combat.occupiedTileDefense
      : GameConfig.combat.emptyTileDefense;

    return base * GameConfig.combat.defenseBonus;
  }
}
