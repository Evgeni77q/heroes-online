import { Injectable } from '@nestjs/common';

@Injectable()
export class WorldMonitor {
  private stats = {
    activePlayers: 0,
    totalCities: 0,
    activeWars: 0,
  };

  setActivePlayers(n: number) {
    this.stats.activePlayers = n;
  }

  setCities(n: number) {
    this.stats.totalCities = n;
  }

  setWars(n: number) {
    this.stats.activeWars = n;
  }

  snapshot() {
    return this.stats;
  }
}
