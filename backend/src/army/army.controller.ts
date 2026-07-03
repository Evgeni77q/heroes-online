import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { ArmyService } from './army.service';
import { AttackDto } from './dto/attack.dto';
import { TrainUnitDto } from './dto/train-unit.dto';

@Controller({
  path: 'army',
  version: '1',
})
export class ArmyController {
  constructor(private service: ArmyService) {}

  @UseGuards(JwtAuthGuard)
  @Post('train')
  train(@Body() dto: TrainUnitDto) {
    return this.service.train(dto.cityId, dto.type, dto.amount);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  get(@Query('cityId') cityId: string) {
    return this.service.getArmy(cityId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('attack')
  attack(@Body() dto: AttackDto) {
    return this.service.attack(dto.attackerCityId, dto.targetCityId);
  }
}
