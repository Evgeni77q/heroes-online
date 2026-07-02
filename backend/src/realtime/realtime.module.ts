import { Module } from '@nestjs/common';
import { GameGateway } from './gateway/game.gateway';
import { EventBusService } from './services/event-bus.service';
import { RealtimeService } from './services/realtime.service';

@Module({
  providers: [GameGateway, RealtimeService, EventBusService],
  exports: [RealtimeService, EventBusService],
})
export class RealtimeModule {}
