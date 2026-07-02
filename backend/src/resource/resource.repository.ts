import { Injectable } from '@nestjs/common';
import { ResourceType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ResourceRepository {
  constructor(private prisma: PrismaService) {}

  getCityResources(cityId: string) {
    return this.prisma.resourceBalance.findMany({
      where: { cityId },
    });
  }

  upsert(cityId: string, type: ResourceType, amount: number) {
    return this.prisma.resourceBalance.upsert({
      where: {
        cityId_type: {
          cityId,
          type,
        },
      },
      update: {
        amount,
      },
      create: {
        cityId,
        type,
        amount,
      },
    });
  }

  add(cityId: string, type: ResourceType, delta: number) {
    return this.prisma.resourceBalance.upsert({
      where: {
        cityId_type: {
          cityId,
          type,
        },
      },
      update: {
        amount: {
          increment: delta,
        },
      },
      create: {
        cityId,
        type,
        amount: Math.max(0, delta),
      },
    });
  }
}
