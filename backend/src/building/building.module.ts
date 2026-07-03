import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { BalanceModule } from '../balance/balance.module';
import { CityModule } from '../city/city.module';
import { PlayerModule } from '../player/player.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ResourceModule } from '../resource/resource.module';
import { BuildingUpgradeQueueRepository } from './building-upgrade-queue.repository';
import { BuildingService } from './building.service';
import { BuildingController } from './building.controller';
import { BuildingRepository } from './building.repository';

@Module({
  imports: [
    AuthModule,
    ResourceModule,
    BalanceModule,
    PlayerModule,
    CityModule,
    PrismaModule,
  ],
  controllers: [BuildingController],
  providers: [
    BuildingService,
    BuildingRepository,
    BuildingUpgradeQueueRepository,
  ],
  exports: [BuildingService],
})
export class BuildingModule {}
