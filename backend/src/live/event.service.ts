import { Injectable } from '@nestjs/common';
import { EventBusService } from '../realtime/services/event-bus.service';
import { WorldEvent } from './types/event.types';

@Injectable()
export class EventService {
  private events: WorldEvent[] = [];

  constructor(private eventBus: EventBusService) {}

  emit(type: string, payload: Record<string, unknown>) {
    this.events.push({
      type,
      payload,
      createdAt: Date.now(),
    });
  }

  async processEvents() {
    for (const event of this.events) {
      console.log('[EVENT]', event.type, event.payload);
      this.forwardToRealtime(event);
    }

    this.events = [];
  }

  private forwardToRealtime(event: WorldEvent) {
    const { type, payload } = event;
    const worldId = payload.worldId as string | undefined;
    const playerId = payload.playerId as string | undefined;

    switch (type) {
      case 'BATTLE_RESULT':
        if (worldId) {
          this.eventBus.emitBattleResult(worldId, payload);
        }
        break;

      case 'CITY_UPDATE':
        if (worldId) {
          this.eventBus.emitCityUpdate(worldId, payload);
        }
        break;

      case 'RESOURCE_UPDATE':
        if (playerId) {
          this.eventBus.emitResourceUpdate(playerId, payload);
        }
        break;

      case 'TILE_CAPTURE':
        if (worldId) {
          this.eventBus.emitTileCapture(worldId, payload);
        }
        break;
    }
  }
}
