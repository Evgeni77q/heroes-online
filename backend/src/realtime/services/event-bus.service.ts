import { Injectable } from '@nestjs/common';
import { RealtimeService } from './realtime.service';

@Injectable()
export class EventBusService {
  constructor(private realtime: RealtimeService) {}

  emitBattleResult(worldId: string, payload: Record<string, unknown>) {
    this.realtime.emitToWorld(worldId, 'battle_result', payload);
  }

  emitCityUpdate(worldId: string, payload: Record<string, unknown>) {
    this.realtime.emitToWorld(worldId, 'city_update', payload);
  }

  emitResourceUpdate(playerId: string, payload: Record<string, unknown>) {
    this.realtime.emitToPlayer(playerId, 'resource_update', payload);
  }

  emitTileCapture(worldId: string, payload: Record<string, unknown>) {
    this.realtime.emitToWorld(worldId, 'tile_capture', payload);
  }
}
