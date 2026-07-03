import { Injectable } from '@nestjs/common';
import { TileType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MapRepository {
  constructor(private prisma: PrismaService) {}

  create(worldId: string, width: number, height: number) {
    return this.prisma.map.create({
      data: {
        worldId,
        width,
        height,
      },
    });
  }

  getByWorld(worldId: string) {
    return this.prisma.map.findFirst({
      where: { worldId },
      include: { tiles: true },
    });
  }

  getTile(mapId: string, x: number, y: number) {
    return this.prisma.tile.findUnique({
      where: {
        mapId_x_y: {
          mapId,
          x,
          y,
        },
      },
    });
  }

  getTileById(tileId: string) {
    return this.prisma.tile.findUnique({
      where: { id: tileId },
    });
  }

  getById(mapId: string) {
    return this.prisma.map.findUnique({
      where: { id: mapId },
    });
  }

  countTiles(mapId: string) {
    return this.prisma.tile.count({
      where: { mapId },
    });
  }

  setTileHasCity(tileId: string, hasCity: boolean) {
    return this.prisma.tile.update({
      where: { id: tileId },
      data: { hasCity },
    });
  }

  generateTiles(mapId: string, width: number, height: number) {
    const tiles = [];

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        tiles.push({
          mapId,
          x,
          y,
          type: TileType.PLAINS,
        });
      }
    }

    return this.prisma.tile.createMany({ data: tiles });
  }

  findFreeStarterTile(mapId: string) {
    return this.prisma.tile.findFirst({
      where: {
        mapId,
        hasCity: false,
        type: { not: TileType.WATER },
      },
      orderBy: [{ y: 'asc' }, { x: 'asc' }],
    });
  }
}
