import { BadRequestException, Injectable } from '@nestjs/common';
import { AccountStatus } from '@prisma/client';
import * as argon2 from 'argon2';
import { AccountRepository } from './account.repository';

@Injectable()
export class AccountService {
  constructor(private repo: AccountRepository) {}

  async register(email: string, username: string, password: string) {
    const existing = await this.repo.findByEmail(email);
    if (existing) throw new BadRequestException('EMAIL_ALREADY_EXISTS');

    const passwordHash = await argon2.hash(password);

    return this.repo.create({
      email: email.toLowerCase(),
      username,
      passwordHash,
      status: AccountStatus.pending_verification,
      emailVerified: false,
      failedLoginAttempts: 0,
      twoFactorEnabled: false,
    });
  }

  findByEmail(email: string) {
    return this.repo.findByEmail(email);
  }
}
