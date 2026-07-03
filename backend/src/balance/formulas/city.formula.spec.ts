import { CityFormula } from './city.formula';

describe('CityFormula', () => {
  it('calculates population from city level', () => {
    expect(CityFormula.population(1)).toBe(25);
    expect(CityFormula.population(2)).toBe(40);
  });

  it('returns production rates per resource', () => {
    const production = CityFormula.productionPerMinute(1);

    expect(production.wood).toBeGreaterThan(0);
    expect(production.stone).toBeGreaterThan(0);
    expect(production.gold).toBeGreaterThan(0);
    expect(production.food).toBeGreaterThan(0);
  });

  it('returns storage capacity for each resource', () => {
    const storage = CityFormula.storageCapacity(1);

    expect(storage.wood).toBe(storage.stone);
    expect(storage.gold).toBe(storage.food);
    expect(storage.wood).toBeGreaterThan(0);
  });
});
