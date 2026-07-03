import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Account, AccountStatus } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { AccountService } from '../account/account.service';
import { RefreshTokenService } from './refresh-token.service';

@Injectable()
export class AuthService {
  constructor(
    private accountService: AccountService,
    private jwt: JwtService,
    private refreshService: RefreshTokenService,
  ) {}

  async login(email: string, password: string) {
    const account = await this.accountService.findByEmail(email);

    if (!account) {
      throw new UnauthorizedException('INVALID_CREDENTIALS');
    }

    if (account.status !== AccountStatus.active) {
      throw new UnauthorizedException('ACCOUNT_NOT_ACTIVE');
    }

    const valid = await argon2.verify(account.passwordHash, password);

    if (!valid) {
      throw new UnauthorizedException('INVALID_CREDENTIALS');
    }

    return this.createSessionForAccount(account);
  }

  async createSessionForAccount(account: Account) {
    const payload = {
      sub: account.id,
      email: account.email,
    };

    const accessToken = this.jwt.sign(payload, { expiresIn: '15m' });
    const refreshToken = await this.refreshService.create(account.id);

    return {
      account: {
        id: account.id,
        username: account.username,
        email: account.email,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  async refresh(token: string) {
    const accountId = await this.refreshService.validate(token);

    const payload = {
      sub: accountId,
    };

    return {
      accessToken: this.jwt.sign(payload, { expiresIn: '15m' }),
    };
  }
}
