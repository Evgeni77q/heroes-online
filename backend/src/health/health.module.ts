import { Module } from '@nestjs/common';
import { GameLoopModule } from '../game-loop/game-loop.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

@Module({
  imports: [GameLoopModule, RealtimeModule],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
