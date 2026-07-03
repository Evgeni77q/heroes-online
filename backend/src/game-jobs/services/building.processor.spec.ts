import { Test } from '@nestjs/testing';
import { TimedJobStatus } from '@prisma/client';
import { BuildingProcessor } from '../../game-loop/processors/building.processor';
import { GameJobKind } from '../types/game-job-kind';
import { GameJobRepository } from '../repositories/game-job.repository';
import { BuildingUpgradeCompletionService } from './building-upgrade-completion.service';

describe('BuildingProcessor', () => {
  let processor: BuildingProcessor;

  const gameJobs = {
    findExpired: jest.fn(),
    markRunning: jest.fn(),
  };
  const completion = {
    complete: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      providers: [
        BuildingProcessor,
        { provide: GameJobRepository, useValue: gameJobs },
        { provide: BuildingUpgradeCompletionService, useValue: completion },
      ],
    }).compile();

    processor = moduleRef.get(BuildingProcessor);
  });

  it('locks pending jobs and completes them', async () => {
    gameJobs.findExpired.mockResolvedValue([
      {
        id: 'job-1',
        kind: GameJobKind.BUILDING_UPGRADE,
        playerId: 'player-1',
        finishAt: new Date('2026-07-03T18:42:10.000Z'),
        status: TimedJobStatus.PENDING,
        buildingUpgrade: {
          buildingId: 'building-1',
          fromLevel: 1,
          toLevel: 2,
          cityId: 'city-1',
          type: 'FARM',
        },
      },
    ]);
    gameJobs.markRunning.mockResolvedValue(true);

    await processor.process();

    expect(gameJobs.markRunning).toHaveBeenCalledWith(
      'job-1',
      expect.any(Date),
    );
    expect(completion.complete).toHaveBeenCalledWith(
      'job-1',
      expect.any(Date),
    );
  });

  it('completes already running jobs without re-locking', async () => {
    gameJobs.findExpired.mockResolvedValue([
      {
        id: 'job-2',
        kind: GameJobKind.BUILDING_UPGRADE,
        playerId: 'player-1',
        finishAt: new Date('2026-07-03T18:42:10.000Z'),
        status: TimedJobStatus.RUNNING,
        buildingUpgrade: {
          buildingId: 'building-2',
          fromLevel: 2,
          toLevel: 3,
          cityId: 'city-1',
          type: 'FARM',
        },
      },
    ]);

    await processor.process();

    expect(gameJobs.markRunning).not.toHaveBeenCalled();
    expect(completion.complete).toHaveBeenCalledWith(
      'job-2',
      expect.any(Date),
    );
  });

  it('skips jobs that fail to lock', async () => {
    gameJobs.findExpired.mockResolvedValue([
      {
        id: 'job-3',
        kind: GameJobKind.BUILDING_UPGRADE,
        playerId: 'player-1',
        finishAt: new Date('2026-07-03T18:42:10.000Z'),
        status: TimedJobStatus.PENDING,
        buildingUpgrade: {
          buildingId: 'building-3',
          fromLevel: 1,
          toLevel: 2,
          cityId: 'city-1',
          type: 'FARM',
        },
      },
    ]);
    gameJobs.markRunning.mockResolvedValue(false);

    await processor.process();

    expect(completion.complete).not.toHaveBeenCalled();
  });
});
