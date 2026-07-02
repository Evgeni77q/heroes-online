export type QueueItemType = 'BUILDING' | 'UNIT';

export interface QueueItem {
  type: QueueItemType;
  executeAt: number;
  payload: Record<string, unknown>;
}

export interface TickContext {
  tickId: number;
  executedAt: number;
}
