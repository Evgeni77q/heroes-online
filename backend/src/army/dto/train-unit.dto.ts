import { IsEnum, IsInt, IsString, Min } from 'class-validator';
import { UnitType } from '@prisma/client';

export class TrainUnitDto {
  @IsString()
  cityId: string;

  @IsEnum(UnitType)
  type: UnitType;

  @IsInt()
  @Min(1)
  amount: number;
}
