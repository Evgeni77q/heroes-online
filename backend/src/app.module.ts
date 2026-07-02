import { Module } from '@nestjs/common';
import { AccountModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';
import { ArmyModule } from './army/army.module';
import { BalanceModule } from './balance/balance.module';
import { BuildingModule } from './building/building.module';
import { CityModule } from './city/city.module';
import { LiveModule } from './live/live.module';
import { MapModule } from './map/map.module';
import { OpsModule } from './ops/ops.module';
import { PlayerModule } from './player/player.module';
import { RealtimeModule } from './realtime/realtime.module';
import { PrismaModule } from './prisma/prisma.module';
import { ResourceModule } from './resource/resource.module';
import { TerritoryModule } from './territory/territory.module';
import { WorldModule } from './world/world.module';

@Module({
  imports: [
    PrismaModule,
    AccountModule,
    AuthModule,
    PlayerModule,
    WorldModule,
    MapModule,
    CityModule,
    ResourceModule,
    BuildingModule,
    ArmyModule,
    TerritoryModule,
    LiveModule,
    BalanceModule,
    OpsModule,
    RealtimeModule,
  ],
})
export class AppModule {}
