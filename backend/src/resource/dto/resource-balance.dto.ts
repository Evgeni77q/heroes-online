import { IsEnum, IsInt, IsPositive, IsString, Min } from 'class-validator';
import { ResourceType } from '@prisma/client';

export class ResourceBalanceDto {
  @IsString()
  cityId: string;

  @IsEnum(ResourceType)
  type: ResourceType;

  @IsInt()
  @IsPositive()
  amount: number;
}

export class ConsumeResourceDto {
  @IsString()
  cityId: string;

  @IsEnum(ResourceType)
  type: ResourceType;

  @IsInt()
  @Min(1)
  amount: number;
}
