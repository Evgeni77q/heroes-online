export interface DashboardAccount {
  id: string;
  username: string;
}

export interface DashboardPlayer {
  id: string;
  worldId: string;
  cityId: string;
  world: string;
}

export interface DashboardResourceAmounts {
  wood: number;
  stone: number;
  gold: number;
  food: number;
}

export interface DashboardCity {
  id: string;
  name: string;
  level: number;
  population: number;
  storage: DashboardResourceAmounts;
  production: DashboardResourceAmounts;
}

export interface DashboardResponse {
  account: DashboardAccount;
  player: DashboardPlayer;
  resources: DashboardResourceAmounts;
  city: DashboardCity;
}
