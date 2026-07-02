import { IsEnum, IsString } from 'class-validator';
import { BuildingType } from '@prisma/client';

export class BuildBuildingDto {
  @IsString()
  cityId: string;

  @IsEnum(BuildingType)
  type: BuildingType;
}
