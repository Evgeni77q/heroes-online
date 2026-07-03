import { DomainEvent } from '../events/building-upgraded.event';

export type DomainEventHandler = (event: DomainEvent) => void | Promise<void>;
