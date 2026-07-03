import { Module } from '@nestjs/common';
import { CityModule } from '../city/city.module';
import { MapModule } from '../map/map.module';
import { PlayerModule } from '../player/player.module';
import { ResourceModule } from '../resource/resource.module';
import { WorldModule } from '../world/world.module';
import { PlayerInitializationService } from './player-initialization.service';

@Module({
  imports: [PlayerModule, WorldModule, MapModule, CityModule, ResourceModule],
  providers: [PlayerInitializationService],
  exports: [PlayerInitializationService],
})
export class OnboardingModule {}
