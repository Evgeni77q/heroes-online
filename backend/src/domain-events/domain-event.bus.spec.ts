import { DomainEventBus } from './domain-event.bus';
import { BuildingUpgradedEventV1 } from './events/building-upgraded.event';

describe('DomainEventBus', () => {
  it('notifies all subscribers for an event', async () => {
    const gameLoopMetrics = {
      recordDomainEvent: jest.fn(),
    };
    const bus = new DomainEventBus(gameLoopMetrics as never);
    const first = jest.fn();
    const second = jest.fn();

    bus.subscribe('building.upgraded', first);
    bus.subscribe('building.upgraded', second);

    const event: BuildingUpgradedEventV1 = {
      event: 'building.upgraded',
      version: 1,
      payload: {
        buildingId: 'building-1',
        playerId: 'player-1',
        cityId: 'city-1',
        fromLevel: 1,
        toLevel: 2,
        type: 'FARM',
      },
    };

    await bus.publish(event);

    expect(first).toHaveBeenCalledWith(event);
    expect(second).toHaveBeenCalledWith(event);
  });
});
