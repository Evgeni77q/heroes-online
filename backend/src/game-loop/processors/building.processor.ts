import { Injectable } from '@nestjs/common';

@Injectable()
export class BuildingProcessor {
  async process() {
    console.log('[TICK] checking buildings completion');
  }
}
