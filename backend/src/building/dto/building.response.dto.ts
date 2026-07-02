import { BuildingType } from '@prisma/client';

export class BuildingResponseDto {
  id: string;
  cityId: string;
  type: BuildingType;
  level: number;
  isUnderConstruction: boolean;
  finishAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
