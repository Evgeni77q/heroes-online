import { Injectable, OnModuleInit } from '@nestjs/common';
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
  ) {}

  onModuleInit() {
    const tickMs = Number(process.env.GAME_LOOP_TICK_MS ?? 10_000);
    this.scheduler.start(() => this.tick(), tickMs);
  }

  async tick() {
    const tickId = this.gameState.nextTick();
    console.log(`[GAME LOOP] tick #${tickId}`);

    await this.resource.process();
    await this.building.process();
    await this.army.process();
    await this.world.process();
  }
}
