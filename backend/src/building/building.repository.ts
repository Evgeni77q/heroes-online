import { Injectable } from '@nestjs/common';
import { BuildingType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BuildingRepository {
  constructor(private prisma: PrismaService) {}

  create(cityId: string, type: BuildingType) {
    return this.prisma.building.create({
      data: {
        cityId,
        type,
        isUnderConstruction: true,
        finishAt: new Date(Date.now() + 60 * 1000),
      },
    });
  }

  findByCity(cityId: string) {
    return this.prisma.building.findMany({
      where: { cityId },
    });
  }

  upgrade(buildingId: string, level: number) {
    return this.prisma.building.update({
      where: { id: buildingId },
      data: {
        level,
        isUnderConstruction: true,
        finishAt: new Date(Date.now() + 120 * 1000),
      },
    });
  }
}
