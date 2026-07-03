import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CreatePlayerDto } from './dto/create-player.dto';
import { PlayerService } from './player.service';

interface AuthenticatedRequest extends Request {
  user: {
    accountId: string;
    email?: string;
  };
}

@Controller({
  path: 'player',
  version: '1',
})
export class PlayerController {
  constructor(private service: PlayerService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreatePlayerDto) {
    return this.service.createPlayer(req.user.accountId, dto.name, dto.worldId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: AuthenticatedRequest) {
    return this.service.getMyPlayers(req.user.accountId);
  }
}
