import { Injectable } from '@nestjs/common';
import { BuildingUpgradedEventV1 } from '../../domain-events/events/building-upgraded.event';
import { DomainEventBus } from '../../domain-events/domain-event.bus';
import { GameLoopMetricsService } from '../../ops/metrics/game-loop-metrics.service';
import { PrismaService } from '../../prisma/prisma.service';
import { GameJobRepository } from '../repositories/game-job.repository';

@Injectable()
export class BuildingUpgradeCompletionService {
  constructor(
    private gameJobs: GameJobRepository,
    private prisma: PrismaService,
    private domainEvents: DomainEventBus,
    private gameLoopMetrics: GameLoopMetricsService,
  ) {}

  async complete(jobId: string, now: Date): Promise<BuildingUpgradedEventV1 | null> {
    let completedAt: Date | undefined;

    const event = await this.prisma.$transaction(async (tx) => {
      const job = await this.gameJobs.claimCompletion(jobId, now, tx);

      if (!job) {
        return null;
      }

      completedAt = job.finishAt;

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

    if (event && completedAt) {
      this.gameLoopMetrics.recordJobCompleted(
        Math.max(0, now.getTime() - completedAt.getTime()),
      );
      await this.domainEvents.publish(event);
    }

    return event;
  }
}
