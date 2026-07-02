import { Module } from '@nestjs/common';
import { AdminController } from './admin/admin.controller';
import { AdminService } from './admin/admin.service';
import { EventLogRepository } from './logging/event-log.repository';
import { GameLoggerService } from './logging/game-logger.service';
import { MetricsService } from './metrics/metrics.service';
import { EconomyMonitor } from './monitoring/economy.monitor';
import { WorldMonitor } from './monitoring/world.monitor';

@Module({
  controllers: [AdminController],
  providers: [
    GameLoggerService,
    EventLogRepository,
    MetricsService,
    EconomyMonitor,
    WorldMonitor,
    AdminService,
  ],
  exports: [
    GameLoggerService,
    EventLogRepository,
    MetricsService,
    EconomyMonitor,
    WorldMonitor,
  ],
})
export class OpsModule {}
