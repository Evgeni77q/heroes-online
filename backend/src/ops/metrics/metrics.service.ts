import { Injectable } from '@nestjs/common';

@Injectable()
export class MetricsService {
  private metrics = new Map<string, number>();

  inc(key: string, value = 1) {
    const current = this.metrics.get(key) || 0;
    this.metrics.set(key, current + value);
  }

  get(key: string) {
    return this.metrics.get(key) || 0;
  }

  snapshot() {
    return Object.fromEntries(this.metrics);
  }
}
