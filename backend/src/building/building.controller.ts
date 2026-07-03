import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { BuildingService } from './building.service';
import { BuildBuildingDto } from './dto/build-building.dto';
import { UpgradeBuildingDto } from './dto/upgrade-building.dto';

@Controller({
  path: 'building',
  version: '1',
})
export class BuildingController {
  constructor(private service: BuildingService) {}

  @UseGuards(JwtAuthGuard)
  @Post('build')
  build(@Body() dto: BuildBuildingDto) {
    return this.service.build(dto.cityId, dto.type);
  }

  @UseGuards(JwtAuthGuard)
  @Post('upgrade')
  upgrade(@Body() dto: UpgradeBuildingDto) {
    return this.service.upgrade(dto.buildingId, dto.cityId, dto.level);
  }

  @UseGuards(JwtAuthGuard)
  @Get('city')
  getCity(@Query('cityId') cityId: string) {
    return this.service.getCityBuildings(cityId);
  }
}
