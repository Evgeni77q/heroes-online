import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware';
import { appConfig, validationSchema } from './config';
import { AccountModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';
import { ArmyModule } from './army/army.module';
import { BalanceModule } from './balance/balance.module';
import { BuildingModule } from './building/building.module';
import { CityModule } from './city/city.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { GameLoopModule } from './game-loop/game-loop.module';
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
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      validationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    PrismaModule,
    AccountModule,
    AuthModule,
    PlayerModule,
    WorldModule,
    MapModule,
    CityModule,
    DashboardModule,
    ResourceModule,
    BuildingModule,
    ArmyModule,
    TerritoryModule,
    LiveModule,
    GameLoopModule,
    BalanceModule,
    OpsModule,
    RealtimeModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
