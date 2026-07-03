import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GameLoopMetricsService } from '../../ops/metrics/game-loop-metrics.service';
import { ArmyProcessor } from '../processors/army.processor';
import { BuildingProcessor } from '../processors/building.processor';
import { ResourceProcessor } from '../processors/resource.processor';
import { WorldProcessor } from '../processors/world.processor';
import { GameStateService } from '../services/game-state.service';
import { TickScheduler } from './tick.scheduler';

@Injectable()
export class TickEngine implements OnModuleInit {
  constructor(
    private scheduler: TickScheduler,
    private gameState: GameStateService,
    private resource: ResourceProcessor,
    private building: BuildingProcessor,
    private army: ArmyProcessor,
    private world: WorldProcessor,
    private config: ConfigService,
    private gameLoopMetrics: GameLoopMetricsService,
  ) {}

  onModuleInit() {
    const tickMs = this.config.getOrThrow<number>('gameLoopTickMs');
    this.scheduler.start(() => this.tick(), tickMs);
  }

  async tick() {
    const startedAt = Date.now();
    const tickId = this.gameState.nextTick();
    console.log(`[GAME LOOP] tick #${tickId}`);

    await this.resource.process();
    await this.building.process();
    await this.army.process();
    await this.world.process();

    this.gameLoopMetrics.recordTick(Date.now() - startedAt);
  }
}
