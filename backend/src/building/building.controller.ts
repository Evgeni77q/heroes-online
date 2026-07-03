import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { BuildingService } from './building.service';
import { BuildBuildingDto } from './dto/build-building.dto';
import { UpgradeBuildingDto } from './dto/upgrade-building.dto';

interface AuthenticatedRequest extends Request {
  user: {
    accountId: string;
    email?: string;
  };
}

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
  upgrade(@Req() req: AuthenticatedRequest, @Body() dto: UpgradeBuildingDto) {
    return this.service.requestUpgrade(
      req.user.accountId,
      dto.buildingId,
      dto.cityId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('city')
  getCity(@Query('cityId') cityId: string) {
    return this.service.getCityBuildings(cityId);
  }
}
