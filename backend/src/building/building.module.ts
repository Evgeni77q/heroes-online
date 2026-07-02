import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { BalanceModule } from '../balance/balance.module';
import { ResourceModule } from '../resource/resource.module';
import { BuildingService } from './building.service';
import { BuildingController } from './building.controller';
import { BuildingRepository } from './building.repository';

@Module({
  imports: [AuthModule, ResourceModule, BalanceModule],
  controllers: [BuildingController],
  providers: [BuildingService, BuildingRepository],
  exports: [BuildingService],
})
export class BuildingModule {}
