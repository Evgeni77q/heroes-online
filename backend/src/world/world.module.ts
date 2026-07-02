import { Module } from '@nestjs/common';
import { WorldService } from './world.service';
import { WorldController } from './world.controller';
import { WorldRepository } from './world.repository';

@Module({
  controllers: [WorldController],
  providers: [WorldService, WorldRepository],
  exports: [WorldService],
})
export class WorldModule {}
