import { Injectable, Logger } from '@nestjs/common';
import { DomainEvent } from './events/building-upgraded.event';
import { DomainEventHandler } from './types/domain-event-handler';

@Injectable()
export class DomainEventBus {
  private readonly logger = new Logger(DomainEventBus.name);
  private readonly handlers = new Map<string, DomainEventHandler[]>();

  subscribe(eventName: DomainEvent['event'], handler: DomainEventHandler): void {
    const handlers = this.handlers.get(eventName) ?? [];
    handlers.push(handler);
    this.handlers.set(eventName, handlers);
  }

  async publish(event: DomainEvent): Promise<void> {
    this.logger.debug(`[DOMAIN BUS] ${event.event} v${event.version}`);

    const handlers = this.handlers.get(event.event) ?? [];

    await Promise.all(handlers.map((handler) => handler(event)));
  }
}
