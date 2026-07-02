import { Injectable } from '@nestjs/common';
import { UnitType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ArmyRepository {
  constructor(private prisma: PrismaService) {}

  getArmy(cityId: string) {
    return this.prisma.army.findFirst({
      where: { cityId },
      include: { units: true },
    });
  }

  createArmy(cityId: string) {
    return this.prisma.army.create({
      data: { cityId },
    });
  }

  addUnits(armyId: string, type: UnitType, amount: number) {
    return this.prisma.unit.upsert({
      where: {
        armyId_type: {
          armyId,
          type,
        },
      },
      update: {
        quantity: { increment: amount },
      },
      create: {
        armyId,
        type,
        quantity: amount,
      },
    });
  }
}
