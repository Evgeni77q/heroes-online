import { Injectable } from '@nestjs/common';
import { QueueItem } from './types/tick.types';

@Injectable()
export class QueueService {
  private queue: QueueItem[] = [];

  add(item: QueueItem) {
    this.queue.push(item);
  }

  async processQueues() {
    const now = Date.now();

    const ready = this.queue.filter((q) => q.executeAt <= now);
    this.queue = this.queue.filter((q) => q.executeAt > now);

    for (const item of ready) {
      await this.execute(item);
    }
  }

  private async execute(item: QueueItem) {
    switch (item.type) {
      case 'BUILDING':
        console.log('Building finished', item.payload);
        break;

      case 'UNIT':
        console.log('Unit training finished', item.payload);
        break;
    }
  }
}
