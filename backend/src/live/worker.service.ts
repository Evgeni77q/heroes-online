import { Injectable } from '@nestjs/common';
import { EventService } from './event.service';
import { QueueService } from './queue.service';

@Injectable()
export class WorkerService {
  constructor(
    private queue: QueueService,
    private events: EventService,
  ) {}

  async processTick() {
    await this.queue.processQueues();
    await this.events.processEvents();
  }
}
