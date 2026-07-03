import { Module } from '@nestjs/common';
import { MapModule } from '../map/map.module';
import { WorldBootstrapService } from './world-bootstrap.service';
import { WorldService } from './world.service';
import { WorldController } from './world.controller';
import { WorldRepository } from './world.repository';

@Module({
  imports: [MapModule],
  controllers: [WorldController],
  providers: [WorldService, WorldRepository, WorldBootstrapService],
  exports: [WorldService, WorldBootstrapService],
})
export class WorldModule {}
