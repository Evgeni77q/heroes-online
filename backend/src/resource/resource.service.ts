import { BadRequestException, Injectable } from '@nestjs/common';
import { ResourceType } from '@prisma/client';
import { ResourceRepository } from './resource.repository';

@Injectable()
export class ResourceService {
  constructor(private repo: ResourceRepository) {}

  getCityResources(cityId: string) {
    return this.repo.getCityResources(cityId);
  }

  addResource(cityId: string, type: ResourceType, amount: number) {
    if (amount <= 0) {
      throw new BadRequestException('INVALID_AMOUNT');
    }

    return this.repo.add(cityId, type, amount);
  }

  async consumeResource(cityId: string, type: ResourceType, amount: number) {
    const resources = await this.repo.getCityResources(cityId);
    const resource = resources.find((r) => r.type === type);

    if (!resource || resource.amount < amount) {
      throw new BadRequestException('NOT_ENOUGH_RESOURCES');
    }

    return this.repo.add(cityId, type, -amount);
  }
}
