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

  createStarter(cityId: string, type: BuildingType, level = 1) {
    return this.prisma.building.create({
      data: {
        cityId,
        type,
        level,
        isUnderConstruction: false,
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
