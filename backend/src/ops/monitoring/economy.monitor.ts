import { Injectable } from '@nestjs/common';
import { MetricsService } from '../metrics/metrics.service';

@Injectable()
export class EconomyMonitor {
  constructor(private metrics: MetricsService) {}

  trackResourceProduction(amount: number) {
    this.metrics.inc('resource.production', amount);
  }

  trackResourceConsumption(amount: number) {
    this.metrics.inc('resource.consumption', amount);
  }

  isInflationDanger(): boolean {
    const prod = this.metrics.get('resource.production');
    const cons = this.metrics.get('resource.consumption');

    return prod > cons * 5;
  }
}
