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

export interface DashboardResources {
  wood: number;
  stone: number;
  gold: number;
  food: number;
}

export interface DashboardCity {
  name: string;
  townHallLevel: number;
}

export interface DashboardResponse {
  account: DashboardAccount;
  player: DashboardPlayer;
  resources: DashboardResources;
  city: DashboardCity;
}
