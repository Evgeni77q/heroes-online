import { Injectable } from '@nestjs/common';
import { BuildingType, Prisma } from '@prisma/client';
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

  findById(id: string) {
    return this.prisma.building.findUnique({
      where: { id },
    });
  }

  findByCity(cityId: string) {
    return this.prisma.building.findMany({
      where: { cityId },
    });
  }

  setCurrentUpgrade(
    buildingId: string,
    upgradeJobId: string,
    client: Prisma.TransactionClient = this.prisma,
  ) {
    return client.building.update({
      where: { id: buildingId },
      data: { currentUpgradeId: upgradeJobId },
    });
  }
}
