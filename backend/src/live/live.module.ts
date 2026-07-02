import { Module } from '@nestjs/common';
import { RealtimeModule } from '../realtime/realtime.module';
import { EventService } from './event.service';
import { QueueService } from './queue.service';
import { TickService } from './tick.service';
import { WorkerService } from './worker.service';

@Module({
  imports: [RealtimeModule],
  providers: [TickService, QueueService, EventService, WorkerService],
  exports: [QueueService, EventService],
})
export class LiveModule {}
