export type RealtimeEventType =
  | 'battle_result'
  | 'city_update'
  | 'resource_update'
  | 'tile_capture'
  | 'building_complete';

export interface RealtimePayload {
  worldId?: string;
  playerId?: string;
  [key: string]: unknown;
}

export interface JoinWorldPayload {
  worldId: string;
  playerId: string;
}
