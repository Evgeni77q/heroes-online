import { GameConfig } from '../config/game.config';

export class ResourceFormula {
  static productionPerHour(level: number): number {
    return GameConfig.resource.baseProductionPerHour * Math.pow(1.15, level);
  }

  static storageCapacity(level: number): number {
    return 1000 * Math.pow(GameConfig.resource.storageMultiplier, level);
  }
}
