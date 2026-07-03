import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Request, Response, NextFunction } from 'express';

export interface RequestWithId extends Request {
  requestId: string;
}

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: RequestWithId, res: Response, next: NextFunction) {
    const requestId =
      req.header('X-Request-ID') ??
      req.header('X-Correlation-ID') ??
      randomUUID();

    req.requestId = requestId;

    res.setHeader('X-Request-ID', requestId);

    next();
  }
}
