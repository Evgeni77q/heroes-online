import { TimedJobStatus } from '@prisma/client';

export interface TimedGameJob {
  id: string;
  playerId: string;
  finishAt: Date;
  status: TimedJobStatus;
}

export interface BuildingUpgradeJob extends TimedGameJob {
  buildingId: string;
  fromLevel: number;
  toLevel: number;
  startedAt: Date;
}

export const ACTIVE_JOB_STATUSES: TimedJobStatus[] = [
  TimedJobStatus.PENDING,
  TimedJobStatus.RUNNING,
];
