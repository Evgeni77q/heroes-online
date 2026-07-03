import { Test } from '@nestjs/testing';
import { BuildingType } from '@prisma/client';
import { BalanceService } from '../../balance/balance.service';
import { BuildingUpgradedEventV1 } from '../../domain-events/events/building-upgraded.event';
import { DomainEventBus } from '../../domain-events/domain-event.bus';
import { EventBusService } from '../services/event-bus.service';
import { BuildingUpdatedRealtimeSubscriber } from './building-updated-realtime.subscriber';

describe('BuildingUpdatedRealtimeSubscriber', () => {
  let subscriber: BuildingUpdatedRealtimeSubscriber;

  const domainEvents = {
    subscribe: jest.fn(),
  };
  const eventBus = {
    emitBuildingUpdated: jest.fn(),
  };
  const balance = {
    getUpgradeCost: jest.fn().mockReturnValue({
      wood: 120,
      stone: 80,
      gold: 40,
    }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      providers: [
        BuildingUpdatedRealtimeSubscriber,
        { provide: DomainEventBus, useValue: domainEvents },
        { provide: EventBusService, useValue: eventBus },
        { provide: BalanceService, useValue: balance },
      ],
    }).compile();

    subscriber = moduleRef.get(BuildingUpdatedRealtimeSubscriber);
    subscriber.onModuleInit();
  });

  it('registers on domain event bus', () => {
    expect(domainEvents.subscribe).toHaveBeenCalledWith(
      'building.upgraded',
      expect.any(Function),
    );
  });

  it('maps domain event to building.updated realtime payload', () => {
    const event: BuildingUpgradedEventV1 = {
      event: 'building.upgraded',
      version: 1,
      payload: {
        buildingId: 'building-1',
        playerId: 'player-1',
        cityId: 'city-1',
        fromLevel: 1,
        toLevel: 2,
        type: BuildingType.FARM,
      },
    };

    subscriber.handle(event);

    expect(balance.getUpgradeCost).toHaveBeenCalledWith(3);
    expect(eventBus.emitBuildingUpdated).toHaveBeenCalledWith('player-1', {
      event: 'building.updated',
      version: 1,
      payload: {
        buildingId: 'building-1',
        level: 2,
        status: 'IDLE',
        upgradeCost: {
          wood: 120,
          stone: 80,
          gold: 40,
        },
      },
    });
  });
});
