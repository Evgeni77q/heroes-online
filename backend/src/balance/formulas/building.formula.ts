import { GameConfig } from '../config/game.config';

export class BuildingFormula {
  static buildTime(level: number): number {
    return (
      GameConfig.building.baseBuildTimeSec *
      Math.pow(GameConfig.building.growthFactor, level)
    );
  }

  static upgradeCost(level: number) {
    return {
      wood: Math.floor(100 * Math.pow(1.6, level)),
      stone: Math.floor(80 * Math.pow(1.6, level)),
      gold: Math.floor(50 * Math.pow(1.4, level)),
    };
  }
}
