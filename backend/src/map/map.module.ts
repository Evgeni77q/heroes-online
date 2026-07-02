import { Module } from '@nestjs/common';
import { MapService } from './map.service';
import { MapController } from './map.controller';
import { MapRepository } from './map.repository';

@Module({
  controllers: [MapController],
  providers: [MapService, MapRepository],
  exports: [MapService],
})
export class MapModule {}
