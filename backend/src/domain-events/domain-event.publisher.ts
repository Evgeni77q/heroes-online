import { Injectable, Logger } from '@nestjs/common';
import { DomainEvent } from './events/building-upgraded.event';

@Injectable()
export class DomainEventPublisher {
  private readonly logger = new Logger(DomainEventPublisher.name);

  publish(event: DomainEvent): void {
    this.logger.log(`[DOMAIN] ${event.event} v${event.version}`, event.payload);
  }
}
