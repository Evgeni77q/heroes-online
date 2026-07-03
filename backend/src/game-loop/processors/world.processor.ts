import { Injectable } from '@nestjs/common';

@Injectable()
export class WorldProcessor {
  async process() {
    console.log('[TICK] world simulation');
  }
}
