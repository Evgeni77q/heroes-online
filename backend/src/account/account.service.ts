import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AccountStatus } from '@prisma/client';
import * as argon2 from 'argon2';
import { AccountRepository } from './account.repository';

@Injectable()
export class AccountService {
  constructor(
    private repo: AccountRepository,
    private config: ConfigService,
  ) {}

  async register(email: string, username: string, password: string) {
    const existing = await this.repo.findByEmail(email);
    if (existing) throw new BadRequestException('EMAIL_ALREADY_EXISTS');

    const passwordHash = await argon2.hash(password);
    const autoActivate = this.config.get<boolean>('accountAutoActivate', false);
    const status = autoActivate
      ? AccountStatus.active
      : AccountStatus.pending_verification;

    return this.repo.create({
      email: email.toLowerCase(),
      username,
      passwordHash,
      status,
      emailVerified: autoActivate,
      failedLoginAttempts: 0,
      twoFactorEnabled: false,
    });
  }

  findByEmail(email: string) {
    return this.repo.findByEmail(email);
  }

  findById(id: string) {
    return this.repo.findById(id);
  }
}
