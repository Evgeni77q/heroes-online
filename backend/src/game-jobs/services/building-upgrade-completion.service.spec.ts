import { Test } from '@nestjs/testing';
import { BuildingType, TimedJobStatus } from '@prisma/client';
import { DomainEventPublisher } from '../../domain-events/domain-event.publisher';
import { PrismaService } from '../../prisma/prisma.service';
import { GameJobKind } from '../types/game-job-kind';
import { GameJobRepository } from '../repositories/game-job.repository';
import { BuildingUpgradeCompletionService } from './building-upgrade-completion.service';

describe('BuildingUpgradeCompletionService', () => {
  let service: BuildingUpgradeCompletionService;

  const gameJobs = {
    claimCompletion: jest.fn(),
  };
  const domainEvents = {
    publish: jest.fn(),
  };
  const prisma = {
    $transaction: jest.fn(),
  };
  const tx = {
    building: {
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      providers: [
        BuildingUpgradeCompletionService,
        { provide: GameJobRepository, useValue: gameJobs },
        { provide: PrismaService, useValue: prisma },
        { provide: DomainEventPublisher, useValue: domainEvents },
      ],
    }).compile();

    service = moduleRef.get(BuildingUpgradeCompletionService);

    prisma.$transaction.mockImplementation(async (callback) => callback(tx));
    gameJobs.claimCompletion.mockResolvedValue({
      id: 'job-1',
      buildingId: 'building-1',
      playerId: 'player-1',
      fromLevel: 1,
      toLevel: 2,
      building: {
        cityId: 'city-1',
        type: BuildingType.FARM,
      },
    });
  });

  it('completes upgrade in a transaction and publishes domain event', async () => {
    const now = new Date('2026-07-03T18:42:10.000Z');
    const result = await service.complete('job-1', now);

    expect(result).toEqual({
      event: 'building.upgraded',
      version: 1,
      payload: {
        buildingId: 'building-1',
        playerId: 'player-1',
        cityId: 'city-1',
        fromLevel: 1,
        toLevel: 2,
        type: BuildingType.FARM,
      },
    });
    expect(domainEvents.publish).toHaveBeenCalledWith(result);
    expect(tx.building.update).toHaveBeenCalledWith({
      where: { id: 'building-1' },
      data: { level: 2, currentUpgradeId: null },
    });
  });

  it('does not publish when completion claim fails', async () => {
    gameJobs.claimCompletion.mockResolvedValue(null);

    const result = await service.complete('job-1', new Date());

    expect(result).toBeNull();
    expect(domainEvents.publish).not.toHaveBeenCalled();
  });
});
