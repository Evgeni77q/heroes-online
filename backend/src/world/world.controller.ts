import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateWorldDto } from './dto/create-world.dto';
import { WorldService } from './world.service';

@Controller({
  path: 'world',
  version: '1',
})
export class WorldController {
  constructor(private service: WorldService) {}

  @Post('create')
  create(@Body() dto: CreateWorldDto) {
    return this.service.createWorld(dto.name, dto.description);
  }

  @Get()
  getAll() {
    return this.service.getActiveWorlds();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.service.getWorld(id);
  }
}
