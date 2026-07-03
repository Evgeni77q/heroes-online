import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { MapService } from './map.service';

@Controller({
  path: 'map',
  version: '1',
})
export class MapController {
  constructor(private service: MapService) {}

  @Post('create')
  create(@Body() dto: { worldId: string; width: number; height: number }) {
    return this.service.createMap(dto.worldId, dto.width, dto.height);
  }

  @Get('tile')
  getTile(
    @Query('mapId') mapId: string,
    @Query('x') x: number,
    @Query('y') y: number,
  ) {
    return this.service.getTile(mapId, Number(x), Number(y));
  }

  @Get(':worldId')
  getMap(@Param('worldId') worldId: string) {
    return this.service.getWorldMap(worldId);
  }
}
