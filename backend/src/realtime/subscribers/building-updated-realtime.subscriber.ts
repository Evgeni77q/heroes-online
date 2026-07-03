import { Injectable, OnModuleInit } from '@nestjs/common';
import { BalanceService } from '../../balance/balance.service';
import { BuildingUpgradedEventV1 } from '../../domain-events/events/building-upgraded.event';
import { DomainEventBus } from '../../domain-events/domain-event.bus';
import { EventBusService } from '../services/event-bus.service';
import { BuildingUpdatedEventV1 } from '../types/building-updated.event';

const MAX_BUILDING_LEVEL = 10;

@Injectable()
export class BuildingUpdatedRealtimeSubscriber implements OnModuleInit {
  constructor(
    private domainEvents: DomainEventBus,
    private eventBus: EventBusService,
    private balance: BalanceService,
  ) {}

  onModuleInit() {
    this.domainEvents.subscribe('building.upgraded', (event) =>
      this.handle(event as BuildingUpgradedEventV1),
    );
  }

  handle(event: BuildingUpgradedEventV1): void {
    const { playerId, buildingId, toLevel } = event.payload;
    const nextLevel = toLevel + 1;
    const upgradeCost =
      nextLevel > MAX_BUILDING_LEVEL
        ? { wood: 0, stone: 0, gold: 0 }
        : this.balance.getUpgradeCost(nextLevel);

    const realtimeEvent: BuildingUpdatedEventV1 = {
      event: 'building.updated',
      version: 1,
      payload: {
        buildingId,
        level: toLevel,
        status: 'IDLE',
        upgradeCost,
      },
    };

    this.eventBus.emitBuildingUpdated(playerId, realtimeEvent);
  }
}
