import { Body, Controller, Get, Post } from '@nestjs/common';
import { MetricsService } from '../metrics/metrics.service';
import { GameLoopMetricsService } from '../metrics/game-loop-metrics.service';
import { EconomyMonitor } from '../monitoring/economy.monitor';
import { WorldMonitor } from '../monitoring/world.monitor';
import { AdminService } from './admin.service';

@Controller({
  path: 'admin',
  version: '1',
})
export class AdminController {
  constructor(
    private service: AdminService,
    private metrics: MetricsService,
    private gameLoopMetrics: GameLoopMetricsService,
    private economy: EconomyMonitor,
    private world: WorldMonitor,
  ) {}

  @Get('metrics')
  getMetrics() {
    return {
      metrics: this.metrics.snapshot(),
      gameLoop: this.gameLoopMetrics.snapshot(),
      economy: {
        inflationDanger: this.economy.isInflationDanger(),
      },
      world: this.world.snapshot(),
    };
  }

  @Post('ban')
  ban(@Body() dto: { userId: string }) {
    return this.service.banUser(dto.userId);
  }

  @Post('resources')
  resources(@Body() dto: { cityId: string; type: string; amount: number }) {
    return this.service.giveResources(dto.cityId, dto.type, dto.amount);
  }

  @Post('event')
  event(@Body() dto: { event: string }) {
    return this.service.forceEvent(dto.event);
  }
}
