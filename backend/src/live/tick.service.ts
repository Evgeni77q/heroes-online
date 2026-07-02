import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { WorkerService } from './worker.service';

@Injectable()
export class TickService implements OnModuleInit, OnModuleDestroy {
  private interval?: NodeJS.Timeout;
  private tickId = 0;

  constructor(private worker: WorkerService) {}

  onModuleInit() {
    const tickMs = Number(process.env.TICK_INTERVAL_MS ?? 10_000);
    this.interval = setInterval(() => this.tick(), tickMs);
  }

  onModuleDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  async tick() {
    this.tickId += 1;
    await this.worker.processTick();
  }
}
