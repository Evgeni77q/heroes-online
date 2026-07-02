export const GameConfig = {
  worldSpeed: 1,

  resource: {
    baseProductionPerHour: 100,
    storageMultiplier: 1.5,
  },

  building: {
    baseBuildTimeSec: 60,
    growthFactor: 1.18,
  },

  combat: {
    powerMultiplier: 1.0,
    defenseBonus: 1.2,
    casualtyRate: 0.3,
    emptyTileDefense: 10,
    occupiedTileDefense: 50,
  },

  unit: {
    foodCostPerUnit: {
      INFANTRY: 10,
      ARCHER: 15,
      CAVALRY: 25,
    },
  },

  progression: {
    xpPerAction: 10,
    levelCurve: 1.25,
  },
};
