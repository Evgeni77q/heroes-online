import { BuildingType, TimedJobStatus } from '@prisma/client';
import { GameJobKind } from './game-job-kind';

export interface TimedGameJob {
  id: string;
  kind: GameJobKind;
  playerId: string;
  finishAt: Date;
  status: TimedJobStatus;
}

export interface BuildingUpgradeJobPayload {
  buildingId: string;
  fromLevel: number;
  toLevel: number;
  cityId: string;
  type: BuildingType;
}

export interface GameJobRecord extends TimedGameJob {
  buildingUpgrade: BuildingUpgradeJobPayload;
}

export const ACTIVE_JOB_STATUSES: TimedJobStatus[] = [
  TimedJobStatus.PENDING,
  TimedJobStatus.RUNNING,
];

export interface ScheduleBuildingUpgradeInput {
  buildingId: string;
  playerId: string;
  fromLevel: number;
  toLevel: number;
  startedAt: Date;
  finishAt: Date;
}
