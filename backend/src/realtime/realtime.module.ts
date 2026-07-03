import { Module } from '@nestjs/common';
import { BalanceModule } from '../balance/balance.module';
import { DomainEventsModule } from '../domain-events/domain-events.module';
import { GameGateway } from './gateway/game.gateway';
import { EventBusService } from './services/event-bus.service';
import { RealtimeService } from './services/realtime.service';
import { BuildingUpdatedRealtimeSubscriber } from './subscribers/building-updated-realtime.subscriber';

@Module({
  imports: [DomainEventsModule, BalanceModule],
  providers: [
    GameGateway,
    RealtimeService,
    EventBusService,
    BuildingUpdatedRealtimeSubscriber,
  ],
  exports: [RealtimeService, EventBusService],
})
export class RealtimeModule {}
