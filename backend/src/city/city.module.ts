import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { MapModule } from '../map/map.module';
import { CityService } from './city.service';
import { CityController } from './city.controller';
import { CityRepository } from './city.repository';

@Module({
  imports: [AuthModule, MapModule],
  controllers: [CityController],
  providers: [CityService, CityRepository],
  exports: [CityService],
})
export class CityModule {}
