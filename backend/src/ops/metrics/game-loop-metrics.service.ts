import { Injectable } from '@nestjs/common';
import { MetricsService } from './metrics.service';

@Injectable()
export class GameLoopMetricsService {
  private tickCount = 0;
  private totalTickDurationMs = 0;
  private jobsCompleted = 0;
  private totalJobCompletionLagMs = 0;
  private domainEventsPublished = 0;

  constructor(private metrics: MetricsService) {}

  recordTick(durationMs: number) {
    this.tickCount += 1;
    this.totalTickDurationMs += durationMs;
    this.metrics.inc('game_loop.ticks');
    this.metrics.inc('game_loop.tick_duration_ms', durationMs);
  }

  recordJobCompleted(lagMs: number) {
    this.jobsCompleted += 1;
    this.totalJobCompletionLagMs += lagMs;
    this.metrics.inc('game_loop.jobs.completed');
    this.metrics.inc('game_loop.job_completion_lag_ms', lagMs);
  }

  recordDomainEvent(eventName: string) {
    this.domainEventsPublished += 1;
    this.metrics.inc('domain.events.published');
    this.metrics.inc(`domain.events.${eventName}`);
  }

  snapshot() {
    return {
      ticks: this.tickCount,
      avgTickDurationMs:
        this.tickCount > 0
          ? Math.round(this.totalTickDurationMs / this.tickCount)
          : 0,
      jobsCompleted: this.jobsCompleted,
      avgJobCompletionLagMs:
        this.jobsCompleted > 0
          ? Math.round(this.totalJobCompletionLagMs / this.jobsCompleted)
          : 0,
      domainEventsPublished: this.domainEventsPublished,
    };
  }
}
