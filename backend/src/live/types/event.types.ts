export interface WorldEvent {
  type: string;
  payload: Record<string, unknown>;
  createdAt: number;
}
