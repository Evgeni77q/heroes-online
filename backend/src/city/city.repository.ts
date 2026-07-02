import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CityRepository {
  constructor(private prisma: PrismaService) {}

  create(data: {
    playerId: string;
    worldId: string;
    mapId: string;
    tileId: string;
    name: string;
  }) {
    return this.prisma.city.create({ data });
  }

  findByPlayer(playerId: string) {
    return this.prisma.city.findMany({
      where: { playerId },
    });
  }

  findById(id: string) {
    return this.prisma.city.findUnique({
      where: { id },
    });
  }
}
