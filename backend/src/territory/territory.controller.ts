import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CaptureTileDto } from './dto/capture-tile.dto';
import { TerritoryService } from './territory.service';

@Controller({
  path: 'territory',
  version: '1',
})
export class TerritoryController {
  constructor(private service: TerritoryService) {}

  @UseGuards(JwtAuthGuard)
  @Post('capture')
  capture(@Body() dto: CaptureTileDto) {
    return this.service.captureTile(
      dto.attackerCityId,
      dto.mapId,
      dto.x,
      dto.y,
    );
  }
}
