import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ResourceService } from './resource.service';
import { ResourceController } from './resource.controller';
import { ResourceRepository } from './resource.repository';

@Module({
  imports: [AuthModule],
  controllers: [ResourceController],
  providers: [ResourceService, ResourceRepository],
  exports: [ResourceService],
})
export class ResourceModule {}
