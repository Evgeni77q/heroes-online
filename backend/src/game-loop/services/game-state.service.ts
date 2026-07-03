import { Injectable } from '@nestjs/common';

@Injectable()
export class GameStateService {
  private tickCount = 0;

  nextTick() {
    this.tickCount++;
    return this.tickCount;
  }

  getTick() {
    return this.tickCount;
  }
}
