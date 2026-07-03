import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { DashboardService } from './dashboard.service';

interface AuthenticatedRequest extends Request {
  user: {
    accountId: string;
    email?: string;
  };
}

@Controller({
  path: 'dashboard',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private service: DashboardService) {}

  @Get()
  getDashboard(@Req() req: AuthenticatedRequest) {
    return this.service.getDashboard(req.user.accountId);
  }
}
