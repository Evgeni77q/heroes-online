import { Injectable } from '@nestjs/common';

export interface EventLogEntry {
  type: string;
  payload: Record<string, unknown>;
  createdAt: number;
}

@Injectable()
export class EventLogRepository {
  private logs: EventLogEntry[] = [];

  append(type: string, payload: Record<string, unknown>) {
    const entry: EventLogEntry = {
      type,
      payload,
      createdAt: Date.now(),
    };
    this.logs.push(entry);
    return entry;
  }

  findRecent(limit = 100) {
    return this.logs.slice(-limit);
  }
}
