import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TerritoryRepository {
  constructor(private prisma: PrismaService) {}

  getTile(mapId: string, x: number, y: number) {
    return this.prisma.tile.findUnique({
      where: {
        mapId_x_y: { mapId, x, y },
      },
    });
  }

  updateOwner(tileId: string, ownerCityId: string | null) {
    return this.prisma.tile.update({
      where: { id: tileId },
      data: {
        ownerCityId,
      },
    });
  }
}
