import { Global, Module } from '@nestjs/common';
import { OpsModule } from '../ops/ops.module';
import { DomainEventBus } from './domain-event.bus';

@Global()
@Module({
  imports: [OpsModule],
  providers: [DomainEventBus],
  exports: [DomainEventBus],
})
export class DomainEventsModule {}
