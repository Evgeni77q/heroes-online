import { Module } from '@nestjs/common';
import { GameJobRepository } from './repositories/game-job.repository';
import { BuildingUpgradeCompletionService } from './services/building-upgrade-completion.service';

@Module({
  providers: [GameJobRepository, BuildingUpgradeCompletionService],
  exports: [GameJobRepository, BuildingUpgradeCompletionService],
})
export class GameJobsModule {}
