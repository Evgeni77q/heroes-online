import { Injectable } from '@nestjs/common';

type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

@Injectable()
export class GameLoggerService {
  log(level: LogLevel, message: string, meta?: Record<string, unknown>) {
    console.log(`[${level}] ${message}`, meta || '');
  }

  info(msg: string, meta?: Record<string, unknown>) {
    this.log('INFO', msg, meta);
  }

  warn(msg: string, meta?: Record<string, unknown>) {
    this.log('WARN', msg, meta);
  }

  error(msg: string, meta?: Record<string, unknown>) {
    this.log('ERROR', msg, meta);
  }

  debug(msg: string, meta?: Record<string, unknown>) {
    this.log('DEBUG', msg, meta);
  }
}
