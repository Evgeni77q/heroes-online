import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PlayerRepository {
  constructor(private prisma: PrismaService) {}

  create(accountId: string, name: string, worldId: string) {
    return this.prisma.player.create({
      data: {
        accountId,
        name,
        worldId,
      },
    });
  }

  findByAccount(accountId: string) {
    return this.prisma.player.findMany({
      where: { accountId },
    });
  }

  findById(id: string) {
    return this.prisma.player.findUnique({
      where: { id },
    });
  }
}
