import { Injectable } from '@nestjs/common';
import { BuildingUpgradedEventV1 } from '../../domain-events/events/building-upgraded.event';
import { DomainEventBus } from '../../domain-events/domain-event.bus';
import { PrismaService } from '../../prisma/prisma.service';
import { GameJobRepository } from '../repositories/game-job.repository';

@Injectable()
export class BuildingUpgradeCompletionService {
  constructor(
    private gameJobs: GameJobRepository,
    private prisma: PrismaService,
    private domainEvents: DomainEventBus,
  ) {}

  async complete(jobId: string, now: Date): Promise<BuildingUpgradedEventV1 | null> {
    const event = await this.prisma.$transaction(async (tx) => {
      const job = await this.gameJobs.claimCompletion(jobId, now, tx);

      if (!job) {
        return null;
      }

      await tx.building.update({
        where: { id: job.buildingId },
        data: {
          level: job.toLevel,
          currentUpgradeId: null,
        },
      });

      return {
        event: 'building.upgraded' as const,
        version: 1 as const,
        payload: {
          buildingId: job.buildingId,
          playerId: job.playerId,
          cityId: job.building.cityId,
          fromLevel: job.fromLevel,
          toLevel: job.toLevel,
          type: job.building.type,
        },
      };
    });

    if (event) {
      await this.domainEvents.publish(event);
    }

    return event;
  }
}
