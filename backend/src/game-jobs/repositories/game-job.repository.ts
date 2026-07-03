import { Injectable } from '@nestjs/common';
import { Prisma, TimedJobStatus } from '@prisma/client';
import { GameJobKind } from '../types/game-job-kind';
import {
  ACTIVE_JOB_STATUSES,
  GameJobRecord,
  ScheduleBuildingUpgradeInput,
} from '../types/timed-game-job.types';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class GameJobRepository {
  constructor(private prisma: PrismaService) {}

  scheduleBuildingUpgrade(
    data: ScheduleBuildingUpgradeInput,
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
        status: TimedJobStatus.PENDING,
      },
    });
  }

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

  async findExpired(now: Date): Promise<GameJobRecord[]> {
    const jobs = await this.prisma.buildingUpgradeQueue.findMany({
      where: {
        status: { in: ACTIVE_JOB_STATUSES },
        finishAt: { lte: now },
      },
      include: { building: true },
      orderBy: { finishAt: 'asc' },
    });

    return jobs.map((job) => ({
      id: job.id,
      kind: GameJobKind.BUILDING_UPGRADE,
      playerId: job.playerId,
      finishAt: job.finishAt,
      status: job.status,
      buildingUpgrade: {
        buildingId: job.buildingId,
        fromLevel: job.fromLevel,
        toLevel: job.toLevel,
        cityId: job.building.cityId,
        type: job.building.type,
      },
    }));
  }

  async markRunning(jobId: string, now: Date): Promise<boolean> {
    const result = await this.prisma.buildingUpgradeQueue.updateMany({
      where: {
        id: jobId,
        status: TimedJobStatus.PENDING,
        finishAt: { lte: now },
      },
      data: { status: TimedJobStatus.RUNNING },
    });

    return result.count === 1;
  }

  async claimCompletion(
    jobId: string,
    now: Date,
    client: Prisma.TransactionClient,
  ) {
    const result = await client.buildingUpgradeQueue.updateMany({
      where: {
        id: jobId,
        status: TimedJobStatus.RUNNING,
        finishAt: { lte: now },
      },
      data: { status: TimedJobStatus.COMPLETED },
    });

    if (result.count === 0) {
      return null;
    }

    return client.buildingUpgradeQueue.findUniqueOrThrow({
      where: { id: jobId },
      include: { building: true },
    });
  }

  async cancel(jobId: string): Promise<boolean> {
    const result = await this.prisma.buildingUpgradeQueue.updateMany({
      where: {
        id: jobId,
        status: { in: ACTIVE_JOB_STATUSES },
      },
      data: { status: TimedJobStatus.CANCELLED },
    });

    return result.count === 1;
  }
}
