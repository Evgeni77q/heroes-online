import { Injectable, OnModuleDestroy } from '@nestjs/common';

@Injectable()
export class TickScheduler {
  private interval?: NodeJS.Timeout;

  start(callback: () => void | Promise<void>, intervalMs: number) {
    this.stop();
    this.interval = setInterval(() => {
      void callback();
    }, intervalMs);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = undefined;
    }
  }

  onModuleDestroy() {
    this.stop();
  }
}
