import { GameConfig } from '../config/game.config';

export class ProgressionFormula {
  static levelUpXp(level: number): number {
    return 100 * Math.pow(GameConfig.progression.levelCurve, level);
  }

  static xpGain(action: string): number {
    switch (action) {
      case 'BUILD':
        return 10;
      case 'BATTLE':
        return 25;
      case 'TRAIN':
        return 15;
      default:
        return 5;
    }
  }
}
