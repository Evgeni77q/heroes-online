import { Injectable } from '@nestjs/common';

@Injectable()
export class ArmyProcessor {
  async process() {
    console.log('[TICK] army upkeep processing');
  }
}
