import { Module } from '@nestjs/common';
import { AccountModule } from '../account/account.module';
import { AuthModule } from '../auth/auth.module';
import { CityModule } from '../city/city.module';
import { OnboardingModule } from '../onboarding/onboarding.module';
import { PlayerModule } from '../player/player.module';
import { ResourceModule } from '../resource/resource.module';
import { WorldModule } from '../world/world.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [
    AuthModule,
    AccountModule,
    OnboardingModule,
    PlayerModule,
    WorldModule,
    CityModule,
    ResourceModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
