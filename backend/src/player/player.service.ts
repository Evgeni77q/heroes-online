import { Injectable, BadRequestException } from '@nestjs/common';
import { PlayerRepository } from './player.repository';

@Injectable()
export class PlayerService {
  constructor(private repo: PlayerRepository) {}

  async createPlayer(accountId: string, name: string, worldId: string) {
    const existing = await this.repo.findByAccount(accountId);

    if (existing.length >= 5) {
      throw new BadRequestException('MAX_PLAYERS_REACHED');
    }

    return this.repo.create(accountId, name, worldId);
  }

  async getMyPlayers(accountId: string) {
    return this.repo.findByAccount(accountId);
  }
}
