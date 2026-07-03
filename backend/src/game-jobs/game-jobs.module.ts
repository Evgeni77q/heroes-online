import { Module } from '@nestjs/common';
import { OpsModule } from '../ops/ops.module';
import { GameJobRepository } from './repositories/game-job.repository';
import { BuildingUpgradeCompletionService } from './services/building-upgrade-completion.service';

@Module({
  imports: [OpsModule],
  providers: [GameJobRepository, BuildingUpgradeCompletionService],
  exports: [GameJobRepository, BuildingUpgradeCompletionService],
})
export class GameJobsModule {}
