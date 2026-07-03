import { Injectable } from '@nestjs/common';
import { TimedJobStatus } from '@prisma/client';
import { GameJobKind } from '../../game-jobs/types/game-job-kind';
import { BuildingUpgradeCompletionService } from '../../game-jobs/services/building-upgrade-completion.service';
import { GameJobRepository } from '../../game-jobs/repositories/game-job.repository';

@Injectable()
export class BuildingProcessor {
  constructor(
    private gameJobs: GameJobRepository,
    private completion: BuildingUpgradeCompletionService,
  ) {}

  async process() {
    const now = new Date();
    const jobs = await this.gameJobs.findExpired(now);

    for (const job of jobs) {
      if (job.kind !== GameJobKind.BUILDING_UPGRADE) {
        continue;
      }

      if (job.status === TimedJobStatus.PENDING) {
        const claimed = await this.gameJobs.markRunning(job.id, now);

        if (!claimed) {
          continue;
        }
      } else if (job.status !== TimedJobStatus.RUNNING) {
        continue;
      }

      await this.completion.complete(job.id, now);
    }
  }
}
