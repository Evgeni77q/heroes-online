import { Injectable } from '@nestjs/common';
import { Account, AccountStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AccountRepository {
  constructor(private prisma: PrismaService) {}

  findByEmail(email: string): Promise<Account | null> {
    return this.prisma.account.findFirst({
      where: { email: email.toLowerCase() },
    });
  }

  findById(id: string): Promise<Account | null> {
    return this.prisma.account.findUnique({
      where: { id },
    });
  }

  create(data: Prisma.AccountCreateInput): Promise<Account> {
    return this.prisma.account.create({ data });
  }

  update(id: string, data: Prisma.AccountUpdateInput): Promise<Account> {
    return this.prisma.account.update({
      where: { id },
      data,
    });
  }
}
