export interface CityResourceRates {
  wood: number;
  stone: number;
  gold: number;
  food: number;
}

export interface CityCardData {
  id: string;
  name: string;
  level: number;
  population: number;
  storage: CityResourceRates;
  production: CityResourceRates;
}
