import { Controller, Get, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private health: HealthService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getHealth(@Res() response: Response) {
    const result = await this.health.check();
    const statusCode =
      result.status === 'ok' ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE;

    return response.status(statusCode).json(result);
  }
}
