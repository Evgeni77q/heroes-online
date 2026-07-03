import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TickScheduler } from '../game-loop/tick/tick.scheduler';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeService } from '../realtime/services/realtime.service';

export interface HealthCheckResult {
  status: 'ok' | 'degraded';
  database: 'up' | 'down';
  gameLoop: 'running' | 'stopped';
  realtime: 'running' | 'stopped';
  version: string;
}

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(
    private prisma: PrismaService,
    private tickScheduler: TickScheduler,
    private realtime: RealtimeService,
    private config: ConfigService,
  ) {}

  async check(): Promise<HealthCheckResult> {
    const database = (await this.checkDatabase()) ? 'up' : 'down';
    const gameLoop = this.tickScheduler.isRunning() ? 'running' : 'stopped';
    const realtime = this.realtime.isReady() ? 'running' : 'stopped';
    const version = this.config.get<string>('appVersion', '0.1.0-alpha');

    const status =
      database === 'up' && gameLoop === 'running' && realtime === 'running'
        ? 'ok'
        : 'degraded';

    return { status, database, gameLoop, realtime, version };
  }

  private async checkDatabase(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      this.logger.warn('Database health check failed', error);
      return false;
    }
  }
}
