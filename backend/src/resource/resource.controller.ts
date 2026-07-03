import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { ConsumeResourceDto, ResourceBalanceDto } from './dto/resource-balance.dto';
import { ResourceService } from './resource.service';

@Controller({
  path: 'resource',
  version: '1',
})
export class ResourceController {
  constructor(private service: ResourceService) {}

  @UseGuards(JwtAuthGuard)
  @Get('city')
  getCity(@Query('cityId') cityId: string) {
    return this.service.getCityResources(cityId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('add')
  add(@Body() dto: ResourceBalanceDto) {
    return this.service.addResource(dto.cityId, dto.type, dto.amount);
  }

  @UseGuards(JwtAuthGuard)
  @Post('consume')
  consume(@Body() dto: ConsumeResourceDto) {
    return this.service.consumeResource(dto.cityId, dto.type, dto.amount);
  }
}
