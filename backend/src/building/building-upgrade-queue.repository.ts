import { Injectable } from '@nestjs/common';
import { Prisma, TimedJobStatus } from '@prisma/client';
import { ACTIVE_JOB_STATUSES } from '../game-jobs/types/timed-game-job.types';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateUpgradeJobInput {
  buildingId: string;
  playerId: string;
  fromLevel: number;
  toLevel: number;
  startedAt: Date;
  finishAt: Date;
}

@Injectable()
export class BuildingUpgradeQueueRepository {
  constructor(private prisma: PrismaService) {}

  findActiveByBuildingId(buildingId: string) {
    return this.prisma.buildingUpgradeQueue.findFirst({
      where: {
        buildingId,
        status: { in: ACTIVE_JOB_STATUSES },
      },
    });
  }

  findActiveByCityId(cityId: string) {
    return this.prisma.buildingUpgradeQueue.findMany({
      where: {
        status: { in: ACTIVE_JOB_STATUSES },
        building: { cityId },
      },
    });
  }

  create(
    data: CreateUpgradeJobInput,
    client: Prisma.TransactionClient = this.prisma,
  ) {
    return client.buildingUpgradeQueue.create({
      data: {
        buildingId: data.buildingId,
        playerId: data.playerId,
        fromLevel: data.fromLevel,
        toLevel: data.toLevel,
        startedAt: data.startedAt,
        finishAt: data.finishAt,
        status: TimedJobStatus.RUNNING,
      },
    });
  }
}
