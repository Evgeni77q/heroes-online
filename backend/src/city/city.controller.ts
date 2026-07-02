import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CityService } from './city.service';
import { CreateCityDto } from './dto/create-city.dto';

@Controller('city')
export class CityController {
  constructor(private service: CityService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  create(@Body() dto: CreateCityDto) {
    return this.service.createCity({
      playerId: dto.playerId,
      mapId: dto.mapId,
      tileId: dto.tileId,
      name: dto.name,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  myCities(@Query('playerId') playerId: string) {
    return this.service.getPlayerCities(playerId);
  }
}
