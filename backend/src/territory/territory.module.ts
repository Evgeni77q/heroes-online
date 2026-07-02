import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ArmyModule } from '../army/army.module';
import { BalanceModule } from '../balance/balance.module';
import { TerritoryService } from './territory.service';
import { TerritoryController } from './territory.controller';
import { TerritoryRepository } from './territory.repository';

@Module({
  imports: [AuthModule, ArmyModule, BalanceModule],
  controllers: [TerritoryController],
  providers: [TerritoryService, TerritoryRepository],
  exports: [TerritoryService],
})
export class TerritoryModule {}
