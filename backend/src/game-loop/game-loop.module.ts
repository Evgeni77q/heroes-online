import { Module } from '@nestjs/common';
import { BalanceModule } from '../balance/balance.module';
import { DomainEventsModule } from '../domain-events/domain-events.module';
import { GameJobsModule } from '../game-jobs/game-jobs.module';
import { OpsModule } from '../ops/ops.module';
import { ArmyProcessor } from './processors/army.processor';
import { BuildingProcessor } from './processors/building.processor';
import { ResourceProcessor } from './processors/resource.processor';
import { WorldProcessor } from './processors/world.processor';
import { GameStateService } from './services/game-state.service';
import { TickEngine } from './tick/tick.engine';
import { TickScheduler } from './tick/tick.scheduler';

@Module({
  imports: [BalanceModule, GameJobsModule, DomainEventsModule, OpsModule],
  providers: [
    TickScheduler,
    TickEngine,
    GameStateService,
    ResourceProcessor,
    BuildingProcessor,
    ArmyProcessor,
    WorldProcessor,
  ],
  exports: [GameStateService, TickEngine, TickScheduler],
})
export class GameLoopModule {}
