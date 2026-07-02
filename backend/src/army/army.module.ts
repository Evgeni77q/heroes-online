import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { BalanceModule } from '../balance/balance.module';
import { ResourceModule } from '../resource/resource.module';
import { ArmyService } from './army.service';
import { ArmyController } from './army.controller';
import { ArmyRepository } from './army.repository';

@Module({
  imports: [AuthModule, ResourceModule, BalanceModule],
  controllers: [ArmyController],
  providers: [ArmyService, ArmyRepository],
  exports: [ArmyService],
})
export class ArmyModule {}
