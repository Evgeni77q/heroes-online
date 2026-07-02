import { Body, Controller, Get, Post } from '@nestjs/common';
import { MetricsService } from '../metrics/metrics.service';
import { EconomyMonitor } from '../monitoring/economy.monitor';
import { WorldMonitor } from '../monitoring/world.monitor';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(
    private service: AdminService,
    private metrics: MetricsService,
    private economy: EconomyMonitor,
    private world: WorldMonitor,
  ) {}

  @Get('metrics')
  getMetrics() {
    return {
      metrics: this.metrics.snapshot(),
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
