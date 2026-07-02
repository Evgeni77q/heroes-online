import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';

const store = new Map<string, string>();

@Injectable()
export class RefreshTokenService {
  async create(accountId: string) {
    const token = crypto.randomBytes(40).toString('hex');
    store.set(accountId, token);
    return token;
  }

  async validate(token: string) {
    for (const [accountId, stored] of store.entries()) {
      if (stored === token) return accountId;
    }
    throw new UnauthorizedException('INVALID_REFRESH_TOKEN');
  }
}
