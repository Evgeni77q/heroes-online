import { ResourceFormula } from './resource.formula';

export class CityFormula {
  static population(cityLevel: number): number {
    return 10 + cityLevel * 15;
  }

  static productionPerMinute(cityLevel: number) {
    const basePerMinute = Math.max(
      1,
      Math.round(ResourceFormula.productionPerHour(cityLevel) / 60),
    );

    return {
      wood: Math.round(basePerMinute * 1.2),
      stone: basePerMinute,
      gold: Math.max(1, Math.round(basePerMinute * 0.33)),
      food: Math.round(basePerMinute * 1.25),
    };
  }

  static storageCapacity(cityLevel: number) {
    const capacity = ResourceFormula.storageCapacity(cityLevel);

    return {
      wood: capacity,
      stone: capacity,
      gold: capacity,
      food: capacity,
    };
  }
}
