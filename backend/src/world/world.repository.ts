import { Injectable } from '@nestjs/common';
import { WorldStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WorldRepository {
  constructor(private prisma: PrismaService) {}

  create(name: string, description?: string) {
    return this.prisma.world.create({
      data: { name, description },
    });
  }

  findAllActive() {
    return this.prisma.world.findMany({
      where: { status: WorldStatus.ACTIVE },
    });
  }

  findById(id: string) {
    return this.prisma.world.findUnique({
      where: { id },
    });
  }
}
