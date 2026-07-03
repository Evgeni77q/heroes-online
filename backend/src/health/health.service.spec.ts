import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { TickScheduler } from '../game-loop/tick/tick.scheduler';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeService } from '../realtime/services/realtime.service';
import { HealthService } from './health.service';

describe('HealthService', () => {
  let service: HealthService;

  const prisma = {
    $queryRaw: jest.fn().mockResolvedValue([{ '?column?': 1 }]),
  };
  const tickScheduler = {
    isRunning: jest.fn().mockReturnValue(true),
  };
  const realtime = {
    isReady: jest.fn().mockReturnValue(true),
  };
  const config = {
    get: jest.fn().mockReturnValue('0.1.0-alpha'),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        HealthService,
        { provide: PrismaService, useValue: prisma },
        { provide: TickScheduler, useValue: tickScheduler },
        { provide: RealtimeService, useValue: realtime },
        { provide: ConfigService, useValue: config },
      ],
    }).compile();

    service = moduleRef.get(HealthService);
  });

  it('returns ok when all subsystems are healthy', async () => {
    const result = await service.check();

    expect(result).toEqual({
      status: 'ok',
      database: 'up',
      gameLoop: 'running',
      realtime: 'running',
      version: '0.1.0-alpha',
    });
  });

  it('returns degraded when database is down', async () => {
    prisma.$queryRaw.mockRejectedValueOnce(new Error('db down'));

    const result = await service.check();

    expect(result.status).toBe('degraded');
    expect(result.database).toBe('down');
  });
});
