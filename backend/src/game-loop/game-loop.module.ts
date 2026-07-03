import { Module } from '@nestjs/common';
import { BalanceModule } from '../balance/balance.module';
import { ArmyProcessor } from './processors/army.processor';
import { BuildingProcessor } from './processors/building.processor';
import { ResourceProcessor } from './processors/resource.processor';
import { WorldProcessor } from './processors/world.processor';
import { GameStateService } from './services/game-state.service';
import { TickEngine } from './tick/tick.engine';
import { TickScheduler } from './tick/tick.scheduler';

@Module({
  imports: [BalanceModule],
  providers: [
    TickScheduler,
    TickEngine,
    GameStateService,
    ResourceProcessor,
    BuildingProcessor,
    ArmyProcessor,
    WorldProcessor,
  ],
  exports: [GameStateService, TickEngine],
})
export class GameLoopModule {}
