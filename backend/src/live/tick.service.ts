import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WorkerService } from './worker.service';

@Injectable()
export class TickService implements OnModuleInit, OnModuleDestroy {
  private interval?: NodeJS.Timeout;
  private tickId = 0;

  constructor(
    private worker: WorkerService,
    private config: ConfigService,
  ) {}

  onModuleInit() {
    const tickMs = this.config.getOrThrow<number>('tickIntervalMs');
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
